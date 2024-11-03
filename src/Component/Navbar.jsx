import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Stack } from '@mui/material';

export default function Navbar() {
  return (
    <Box
      zIndex={100}
      sx={{ flexGrow: 1, backgroundColor: 'white' }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              fontFamily: 'retrogamer',
              fontWeight: 700,
              letterSpacing: 2,
              textShadow: '-1px 0px #b31, 1px 0px #f3b;',
            }}
          >
            City Stealer
          </Typography>
          <Stack direction="row">
            <Button color="inherit">Creator</Button>
            <Button color="inherit">Technology</Button>
          </Stack>
          <Button color="success" variant="contained">Play</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
