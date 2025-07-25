import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { toast } from 'react-toastify';
import {
  Avatar, Button, Divider, Stack, Typography,
} from '@mui/material';
import Confetti from 'react-confetti';
import QuestionDialog from '../Component/Popovers/QuestionDialog';
import { usePlayerContext } from '../Hooks/UsePlayerData';
import Enemy from '../Component/CapturedNations/Enemy';
import { Player } from '../Component/CapturedNations/Player';

function Map({ setPage }) {
  const mapContainerRef = useRef();
  const mapRef = useRef(null);
  const {
    player, opponent, client, setClient, setConnected,
  } = usePlayerContext();
  const [markers, setMarkers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [ownedCountries, setOwnedCountries] = useState([]);
  const [conqueredCountries, setConqueredCountries] = useState([]);
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [choosenCountry, setChoosenCountry] = useState([]);
  const [geoJsonData, setGeoJsonData] = useState(null);

  const [playerWins, setPlayerWins] = useState(false);
  const [opponentWins, setOpponentWins] = useState(false);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const markerRefs = useRef([]);

  const [scoreLimit] = useState(10);

  const handleClickOpen = useCallback(() => {
    setOpen(true);
  }, []);

  // Fetch trivia questions
  useEffect(() => {
    const cached = localStorage.getItem('triviaQuestions');
    if (cached) {
      setQuestions(JSON.parse(cached));
      return;
    }

    async function fetchTriviaQuestions() {
      const url = 'https://opentdb.com/api.php?amount=20';
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setQuestions(data.results);
        localStorage.setItem('triviaQuestions', JSON.stringify(data.results));
      } catch (error) {
        toast.error('Error fetching trivia questions');
      }
    }

    fetchTriviaQuestions();
  }, []);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,population,area');
        const data = await response.json();
        const countryObjects = data.map((country) => ({
          name: country.name.common,
          flags: country.flags.png,
          area: country.area,
        }));
        setCountries(countryObjects);
      } catch (error) {
        toast.error('Error fetching country data:', error);
        setPage('websocket');
      }
    };
    fetchCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch countries geojson data and boundaries
  useEffect(() => {
    const fetchGeoJsonData = async () => {
      try {
        const response = await fetch('https://r2.datahub.io/clvyjaryy0000la0cxieg4o8o/main/raw/data/countries.geojson');
        const data = await response.json();
        setGeoJsonData(data);
      } catch (error) {
        toast.error('Error fetching geojson data');
      }
    };

    fetchGeoJsonData();
  }, []);

  useEffect(() => {
    if (!geoJsonData || ownedCountries.length === 0) return;

    const lastOwnedCountry = ownedCountries[ownedCountries.length - 1];

    const countryData = geoJsonData.features.filter(
      (feature) => feature.properties.name === lastOwnedCountry?.name,
    );

    setChoosenCountry(countryData);
  }, [ownedCountries, geoJsonData]);

  useEffect(() => {
    const socket = new SockJS('https://spatial-showdown-production.up.railway.app/ws');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      setConnected(true);

      stompClient.subscribe(`/user/${player}/private`, (message) => {
        const messageData = JSON.parse(message.body);
        handleClickOpen();
        setMarkers((prev) => [...prev, messageData]);
      });

      stompClient.subscribe(`/user/${player}/conquered`, (message) => {
        const messageData = JSON.parse(message.body);
        if (messageData?.action === 'remove') {
          setConqueredCountries((prev) => prev.slice(0, prev.length - 1));
        } else {
          setConqueredCountries((prev) => [...prev, messageData]); // Append to existing list
        }
      });

      setClient(stompClient);
    }, (error) => {
      toast.warn('STOMP error: ', error);
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          toast.done('Disconnected');
        });
      }
    };
  }, [conqueredCountries, handleClickOpen, player, setClient, setConnected]);

  useEffect(() => {
    const updateConqueredCountriesOnServer = (updatedCountries) => {
      const uniqueCountries = updatedCountries.filter(
        (country, index, self) => index
        === self.findIndex((c) => c.countryObject === country.countryObject),
      );

      if (uniqueCountries.length > 0) {
        client.send('/app/countries', {}, JSON.stringify(uniqueCountries));
      }
    };
    if (conqueredCountries.length > 0) {
      updateConqueredCountriesOnServer(conqueredCountries);
    }
  }, [conqueredCountries, client]);

  const filterOwnedCountries = useCallback(() => ['any', ...ownedCountries.map((country) => ['==', ['get', 'name'], country.name])], [ownedCountries]);

  const updateFilters = useCallback(() => {
    if (ownedCountries.length > 0) {
      mapRef.current.setFilter('highlighted-country-fill', filterOwnedCountries());
    } else if (mapRef.current.getLayer('highlighted-country-fill')) {
      mapRef.current.setFilter('highlighted-country-fill', ['==', 'id', '']);
    }
  }, [ownedCountries, filterOwnedCountries]);

  // Add layers to the map
  const addMapLayers = useCallback(() => {
    if (!mapRef.current) return;

    // Layer for non-owned countries (orange)

    if (mapRef.current.getLayer('countries-fill')) {
      mapRef.current.removeLayer('countries-fill');
    }

    if (!mapRef.current.getLayer('countries-fill')) {
      mapRef.current.addLayer({
        id: 'countries-fill',
        type: 'fill',
        source: 'country-boundaries-1',
        filter: ['!in', 'name', ...ownedCountries],
        paint: {
          'fill-color': '#fff',
          'fill-opacity': 1,
        },
      });
    }

    updateFilters();
  }, [updateFilters, ownedCountries]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      mapboxgl.accessToken = 'pk.eyJ1IjoiZWt1bWFoIiwiYSI6ImNsc3gxdTl4dTB6eTQyanF0ZXQyZnFvNWgifQ.-Kl5xFcytSklzF7ASxfQkw';
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        center: [-74.5, 40],
        zoom: 3,
        style: 'mapbox://styles/mapbox/satellite-streets-v11',
      });

      mapRef.current.on('load', () => {
        // Add data source
        mapRef.current.addSource('country-boundaries-1', {
          type: 'geojson',
          data: 'https://r2.datahub.io/clvyjaryy0000la0cxieg4o8o/main/raw/data/countries.geojson',
        });

        // Call function to add layers only once when the map is loaded
        addMapLayers();
      });

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }

    // return cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!choosenCountry || choosenCountry.length < 1) return;

    const geometry = choosenCountry[0]?.geometry;
    if (!geometry) return;

    let firstPolygon;

    if (geometry.type === 'Polygon') {
      [firstPolygon] = geometry.coordinates;
    } else if (geometry.type === 'MultiPolygon') {
      const [firstMultiPolygon] = geometry.coordinates;
      [firstPolygon] = firstMultiPolygon;
    } else {
      toast.error('Unsupported geometry type');
      return;
    }

    if (!firstPolygon || !firstPolygon.length) {
      toast.info('No valid polygon coordinates found.');
      return;
    }
    const [lngSum, latSum] = firstPolygon.reduce(
      ([lngAcc, latAcc], [lng, lat]) => [lngAcc + lng, latAcc + lat],
      [0, 0],
    );

    const center = [
      lngSum / firstPolygon.length,
      latSum / firstPolygon.length,
    ];

    // Remove all existing markers
    markerRefs.current.forEach((marker) => marker.remove());
    markerRefs.current = []; // Clear the array

    // Ensure center is valid
    if (Number.isNaN(center[0]) || Number.isNaN(center[1])) return;

    // Create and add a new marker for the center of the country
    const newMarker = new mapboxgl.Marker()
      .setLngLat(center)
      .addTo(mapRef.current);

    // Store the new marker
    markerRefs.current.push(newMarker);

    if (mapRef.current) {
      mapRef.current.flyTo({
        center,
        zoom: 5,
        speed: 1.5,
        curve: 1,
      });
    }
  }, [choosenCountry, conqueredCountries]);

  // Add markers to the map
  useEffect(() => {
    if (!mapRef.current) return;
    if (
      !choosenCountry.length
    || !choosenCountry[0].geometry
    || !Array.isArray(choosenCountry[0].geometry.coordinates)
    ) return;
    markers.forEach((marker) => {
      if (marker.geometry) {
        if (marker.geometry.type === 'Polygon') {
          const polygonId = `polygon-${Math.random()}`;
          mapRef.current.addSource(polygonId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: choosenCountry[0]?.geometry?.coordinates,
              },
            },
          });

          const ownedcountryObjects = ownedCountries.map((country) => country?.name);
          if (mapRef.current.getLayer('countries-fill')) {
            mapRef.current.removeLayer('countries-fill');
          }

          if (mapRef.current.getLayer('highlighted-country-fill')) {
            mapRef.current.removeLayer('highlighted-country-fill');
          }
          if (!mapRef.current.getLayer('countries-fill')) {
            mapRef.current.addLayer({
              id: 'countries-fill',
              type: 'fill',
              source: 'country-boundaries-1',
              filter: ['!in', 'name', ...ownedcountryObjects], // Use the extracted names
              paint: {
                'fill-color': '#fff',
                'fill-opacity': 1,
              },
            });
          }

          // add a line around owned countries
          if (mapRef.current.getLayer('highlighted-country-line')) {
            mapRef.current.removeLayer('highlighted-country-line');
          }

          if (!mapRef.current.getLayer('highlighted-country-line')) {
            mapRef.current.addLayer({
              id: 'highlighted-country-line',
              type: 'line',
              source: 'country-boundaries-1',
              filter: ['in', 'name', ...ownedcountryObjects], // Use the extracted names
              paint: {
                'line-color': '#F3C623',
                'line-width': 4,
              },
            });
          }
        }
      }
    });
  }, [addMapLayers, choosenCountry, filterOwnedCountries, markers, ownedCountries]);

  const generateRandomBounds = () => {
    const minLng = (Math.random() * 360) - 180; // Random longitude between -180 and 180
    const minLat = (Math.random() * 180) - 90; // Random latitude between -90 and 90
    const maxLng = minLng + (Math.random() * 10); // Random width of up to 10 degrees
    const maxLat = minLat + (Math.random() * 10); // Random height of up to 10 degrees

    return [minLng, minLat, maxLng, maxLat];
  };

  const generateRandomPolygonCoordinates = (numVertices) => {
    const bounds = generateRandomBounds();
    const coordinates = [];
    const [minLng, minLat, maxLng, maxLat] = bounds;

    for (let i = 0; i < numVertices; i += 1) {
      const lng = (Math.random() * (maxLng - minLng)) + minLng;
      const lat = (Math.random() * (maxLat - minLat)) + minLat;
      coordinates.push([lng, lat]);
    }

    // Close the polygon by repeating the first coordinate at the end
    coordinates.push(coordinates[0]);

    return coordinates;
  };

  const AttckEnemy = () => {
    if (client && client.connected) {
      setIsButtonDisabled(true);

      // Re-enable the button after 2 seconds
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 2000);
      const features = [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [generateRandomPolygonCoordinates(4)],
          },
          properties: {
            prop0: opponent || 'defaultOpponent',
            prop1: 0.0,
          },
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[]],
          },
          properties: {
            prop0: 'value0',
            prop1: { this: 'that' },
          },
        },
      ];

      features.forEach((feature) => {
        const messageToSend = {
          type: feature.type,
          geometry: feature.geometry,
          properties: feature.properties,
        };

        client.send('/app/cordinate', {}, JSON.stringify(messageToSend));
      });
    } else {
      toast.error('Client is not connected');
    }
  };

  useEffect(() => {
    if (ownedCountries.length >= 10) {
      setPlayerWins(true);
    }

    if (conqueredCountries.length >= 10) {
      setOpponentWins(true);
    }
  }, [conqueredCountries, ownedCountries]);

  return (
    <Stack width="100vw" height="100vh" direction="row" zIndex={2}>
      <QuestionDialog
        open={open}
        setOpen={setOpen}
        client={client}
        questions={questions}
        opponent={opponent}
        countries={countries}
        setOwnedCountries={setOwnedCountries}
        OwnedCountries={ownedCountries}
        setConqueredCountries={setConqueredCountries}
        conqueredCountries={conqueredCountries}
      />
      <Stack
        padding={0}
        position="absolute"
        sx={{
          top: 80,
          left: 30,
        }}
        zIndex={10}
      >
        <Stack gap={1} sx={{ flexGrow: 1 }}>
          <Button onClick={() => setPage('websocket')} variant="contained">Back to Room</Button>
        </Stack>
      </Stack>
      <div style={{ height: '100%', width: '100%' }} ref={mapContainerRef} className="map-container" />
      <Stack height="100%" minWidth="20%" bgcolor="white">
        <Stack justifyContent="center" alignItems="center" gap={1} marginBottom={3}>
          <Avatar sx={{ width: 60, height: 60 }} src={player?.avatar} />
          {player && <Typography variant="h4">{player}</Typography>}
        </Stack>
        <Stack
          height="400px"
          sx={{
            overflowY: 'scroll',
            // stylish scroll bar

          }}
        >
          <Player
            scoreLimit={scoreLimit}
            conqueredCountries={conqueredCountries}
            ownedCountries={ownedCountries}
          />
        </Stack>
        <Stack alignItems="center" marginBottom={4}>
          <Button
            onClick={AttckEnemy}
            variant="contained"
            disabled={isButtonDisabled}
          >
            Attack the Enemy
          </Button>
        </Stack>
        <Divider>ENEMY OWNS</Divider>
        <Stack>
          <Enemy
            scoreLimit={scoreLimit}
            conqueredCountries={conqueredCountries}
            ownedCountries={ownedCountries}
          />
        </Stack>
      </Stack>
      <Stack
        height="100vh"
        width="100vw"
        position="absolute"
        zIndex={(playerWins || opponentWins) ? 1 : -2}
        top={0}
        left={0}
      >
        {playerWins && (
        <Confetti numberOfPieces={2000} />
        )}
        {(playerWins || opponentWins) && (
        <Stack
          height="100%"
          width="100%"
          justifyContent="center"
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            overflow: 'hidden',
            color: 'white', // Optional for better contrast
            textAlign: 'center', // Center align text
          }}
        >
          <div className="gameover">
            <h1>{playerWins ? 'VICTORY' : 'GAME OVER'}</h1>
            <span>
              {playerWins ? `You conquered all Nations! and outsmarted ${opponent}` : `${opponent} conquered all Nations, He's Smarter`}
            </span>
          </div>
          <Stack width="fit-content" marginX="auto">
            <Button
              variant="contained"
              onClick={() => setPage('websocket')}
              color={playerWins ? 'success' : 'error'}
            >
              {playerWins ? 'Gracefully ' : 'Shamefully ' }
              head back to Menu
            </Button>
          </Stack>
        </Stack>
        )}
      </Stack>
    </Stack>
  );
}

export default Map;
