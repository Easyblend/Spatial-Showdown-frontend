import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Stack, Typography } from '@mui/material';
import image1 from '../Spatial War Tech Stack (2).png';
import image2 from '../Spatial War Tech Stack (4).png';

function Technology({ page, setPage }) {
  const maskRef = useRef(null);

  return (
    <Stack width="100vw" height="100vh" zIndex={2} bgcolor="white">
      <Typography variant="h3" textAlign="center" gutterBottom>
        Technology
      </Typography>
      <Stack
        height="100%"
        width="100%"
        direction="row"
        flexWrap="wrap"
      >
        {/* Corrected the image tag */}
        <img
          height="auto"
          width="800px"
          src={image1}
          alt="Technology"
        />
        <img
          height="auto"
          width="800px"
          src={image2}
          alt="Technology"
        />
      </Stack>
    </Stack>
  );
}

export default Technology;
