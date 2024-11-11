import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Stack } from '@mui/material';

export default function Navbar({ setPage }) {
  return (
    <Box
      zIndex={100}
      sx={{ flexGrow: 1, backgroundColor: 'white' }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h5"
            component="a"
            href="/"
            sx={{
              flexGrow: 1,
              fontFamily: 'retrogamer',
              fontWeight: 700,
              textDecoration: 'none',
              color: 'inherit',
              letterSpacing: 2,
              textShadow: '-1px 0px #b31, 1px 0px #f3b;',
            }}
          >
            Spatial War
          </Typography>
          <Stack direction="row">
            <Button
              component="a"
              href="https://github.com/Easyblend"
              color="inherit"
              target="_blank"
            >
              Creator
            </Button>
            <Button
              color="inherit"
              onClick={() => setPage('technology')}
            >
              Technology
            </Button>
          </Stack>
          <Button
            color="success"
            variant="contained"
            onClick={() => setPage('websocket')}
          >
            Play
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
