import { Avatar, Stack, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';

export default function Enemy({ conqueredCountries, scoreLimit }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      // Scroll to the last child smoothly
      const lastChild = scrollRef.current.lastElementChild;
      if (lastChild) {
        lastChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  }, [conqueredCountries]);

  return (
    <Stack
      spacing={2}
      ref={scrollRef}
    >
      <Stack zIndex={1}>
        <Typography variant="h4" textAlign="center" color="error">
          {conqueredCountries.length}
          /
          {scoreLimit}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        {conqueredCountries.map((country, index) => (
          <Avatar
            variant="square"
            sx={{ width: 30, height: 30 }}
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
    </Stack>
  );
}
