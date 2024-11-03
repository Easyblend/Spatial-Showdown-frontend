import React, { useEffect, useState } from 'react';
import {
  Avatar, Box, Button, Container, Input, Stack, TextField, Typography,
} from '@mui/material';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { usePlayerContext } from '../Hooks/UsePlayerData';

function WebSocketComponent({ setPage }) {
  const [inputValue, setInputValue] = useState('');
  const [oppName, setOppName] = useState('');
  const [name, setName] = useState('');
  const [messages, setMessages] = useState([]);
  const {
    player, setPlayer, opponent, setOpponent, client, connected,
  } = usePlayerContext();

  const handleConnect = () => {
    setPlayer(name);
    setName('');
  };

  const connectToOpponent = () => {
    setOpponent(oppName);
  };

  return (
    <Stack sx={{
      position: 'relative',
      backgroundSize: 'cover',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    }}
    >
      <Typography
        variant="h4"
        color="primary"
        sx={{
          fontFamily: 'retrogamer',
          marginBottom: 3,
        }}
        zIndex={10}
      >
        Connect with a Player
      </Typography>
      <Stack
        sx={{
          boxShadow: '1px 1px 20px 7px rgba(256, 256, 256, 0.1)',
          zIndex: 1,
          width: 400,
          height: 400,
          alignContent: 'center',
          justifyContent: 'center',
          gap: 5,
          padding: 5,
          backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background
          backdropFilter: 'blur(10px)', // Blur effect
          borderRadius: 10,
          border: '1px solid rgba(255, 255, 255, 0.2)', // Optional: subtle border for better effect
        }}
      >
        <Stack>
          <Typography
            color="info"
            sx={{
              fontFamily: 'retrogamer',
              fontSize: 24,
            }}
          >
            {player ? `Connected as ${player}` : 'YOUR NAME'}
          </Typography>
          <TextField
            variant="outlined"
            type="text"
            fullWidth
            sx={{
              backgroundColor: '#A7E6FF',
              borderRadius: 5,
            }}
            value={name}
            placeholder="Enter your name"
            disabled={player.length > 0}
            onChange={(e) => setName(e.target.value)}
          />
          <Button onClick={handleConnect}>Connect</Button>
        </Stack>

        {opponent <= 0 ? (
          <Stack>
            <Typography
              color="error"
              sx={{
                fontFamily: 'retrogamer',
                fontSize: 24,
              }}
            >
              OPPONENT&apos;S NAME
            </Typography>
            <Box>
              <TextField
                variant="outlined"
                type="text"
                fullWidth
                value={oppName}
                placeholder="Enter opponent name"
                sx={{
                  backgroundColor: '#FF8A8A',
                  borderRadius: 5,
                }}
                onChange={(e) => setOppName(e.target.value)}
              />
              <Button onClick={connectToOpponent}>SEND REQUEST</Button>
            </Box>
          </Stack>
        ) : (
          <Stack marginTop={5}>
            <Typography
              textAlign="center"
              sx={{
                fontFamily: 'retrogamer',
                fontSize: 18,
                color: '#FF8A8A',
                marginBottom: 2,
              }}
            >
              Requested Opponent
            </Typography>
            {opponent && (
              <Stack direction="row" gap={1} alignContent="center" alignItems="center" justifyContent="center">
                <Avatar alt="User Avatar" src="https://img.freepik.com/premium-photo/round-circle-with-mans-head-circle-with-circle-middle_807814-680.jpg?semt=ais_hybrid" />
                <Typography color="primary">{opponent}</Typography>
              </Stack>
            )}
          </Stack>
        )}
      </Stack>
      <Box marginTop={4}>
        {player && opponent && (
          <Button
            variant="contained"
            onClick={() => setPage('map')}
            sx={{
              fontFamily: 'retrogamer',
              fontWeight: 700,
              letterSpacing: 2,
              fontSize: 20,
              zIndex: 10,
            }}
          >
            Start Game
          </Button>
        )}
      </Box>
    </Stack>
  );
}

export default WebSocketComponent;
