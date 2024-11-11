import {
  Avatar, LinearProgress, Stack, Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { SiAlienware } from 'react-icons/si';

export default function Enemy({ conqueredCountries, scoreLimit }) {
  const scrollRef = useRef(null);

  const scorePercentage = (conqueredCountries.length / scoreLimit) * 100;

  useEffect(() => {
    if (scrollRef.current) {
      // Scroll to the last child smoothly
      const lastChild = scrollRef.current.lastElementChild;
      if (lastChild) {
        lastChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  }, [conqueredCountries]);

  const [alienSize, setAlienSize] = useState(24); // Initial size

  useEffect(() => {
    // Dynamically set alien size based on score percentage
    const newSize = 24 + (scorePercentage / 100) * 40; // Scale between 24 and 64
    setAlienSize(newSize);
  }, [scorePercentage]);

  return (
    <Stack
      spacing={2}
      ref={scrollRef}
      paddingX={2}
    >
      <Stack zIndex={1}>
        <Typography variant="h4" textAlign="center" color="error">
          {conqueredCountries.length}
          /
          {scoreLimit}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" flexWrap="wrap" gap={2}>
        {conqueredCountries.map((country, index) => (
          <Avatar
            variant="square"
            sx={{ width: 30, height: 30, border: '2px solid #555' }}
            onError={(e) => {
              e.target.onerror = null; // Prevent looping
              e.target.src = country.countryName; // Fallback image URL
            }}
          >
            <img
              src={country.flag}
              alt={country.countryName}
              style={{
                width: '100%', height: '100%', objectFit: 'cover', border: '1px solid #000',
              }}
            />
          </Avatar>
        ))}
      </Stack>
      <Stack spacing={2} paddingX={10}>
        <Stack direction="row" alignItems="center">
          <LinearProgress
            variant="determinate"
            value={scorePercentage}
            color="error"
            sx={{ borderRadius: 1, padding: 0.3, width: '100%' }}
          />
          <SiAlienware
            color="A0153E"
            style={{ transition: 'transform 0.3s ease-in-out', transform: `scale(${alienSize / 24})` }}
            size={alienSize + 4}
            className="alien-breath"
          />
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="center">
          <SiAlienware
            color="A0153E"
          />
          <Typography textAlign="center" color="black">
            Score:
            {' '}
            {conqueredCountries?.length}
            {' '}
            /
            {' '}
            {scoreLimit}
            {' '}
            countries conquered
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
