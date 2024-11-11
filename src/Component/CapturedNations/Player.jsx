import { ViewCozyTwoTone } from '@mui/icons-material';
import {
  Avatar, LinearProgress, Stack, Typography,
} from '@mui/material';
import React, { useEffect, useRef } from 'react';

export function Player({ ownedCountries, scoreLimit }) {
  const scorePercentage = (ownedCountries.length / scoreLimit) * 100;

  return (
    <Stack
      spacing={2}
      width="100%"
      marginY={3}
    >
      <Stack position="sticky" top={0} bgcolor="#F5F5F5" zIndex={1}>
        <Typography textAlign="center" variant="h6" marginX={2} marginBottom={2} borderBottom="2px solid #aaa">
          Conquered countries by Player
        </Typography>
        <Stack spacing={2} paddingX={10}>
          <Stack direction="row" alignItems="center" justifyContent="center">
            <TrophyIcon />
            <Typography textAlign="center" color="black">
              Score:
              {' '}
              {ownedCountries?.length}
              /
              {scoreLimit}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={scorePercentage}
            sx={{ borderRadius: 1, padding: 0.3 }}
          />
        </Stack>
      </Stack>
      {ownedCountries?.map((country) => (
        <Stack
          key={country?.name}
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{
            width: 'auto',
            backgroundColor: '#fff',
            boxShadow: 2,
            borderRadius: 1,
            padding: 2,
          }}
        >
          <Avatar
            variant="square"
            sx={{ width: 30, height: 30 }}
            onError={(e) => {
              e.target.onerror = null; // Prevent looping
              e.target.src = country?.name; // Fallback image URL
            }}
          >
            <img
              src={country?.flags}
              alt={country?.name}
              style={{
                width: '100%', height: '100%', objectFit: 'cover', border: '1px solid #000',
              }}
            />
          </Avatar>
          <Typography
            sx={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              maxWidth: 200,
            }}
            display="flex"
            gap={1}
          >
            {country?.name}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export function TrophyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ marginRight: 8 }}
    >
      <path d="M8 4V2h8v2M7 4h10M5 4v4h14V4M5 8h14v11H5V8z" />
      <path d="M10 22v-2a2 2 0 1 1 4 0v2" />
    </svg>
  );
}
