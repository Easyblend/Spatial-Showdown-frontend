import React, { useEffect } from 'react';
import { Stack } from '@mui/material';
import Map from './Pages/Map';
import WebSocketComponent from './Pages/Home';
import { PlayerProvider } from './Hooks/UsePlayerData';
import Navbar from './Component/Navbar';
import Background from './Component/Background';
import Technology from './Pages/Technology';

function App() {
  const [page, setPage] = React.useState('websocket');
  const [open, setOpen] = React.useState(false);

  let content;

  if (page === 'map') {
    content = <Map page={page} setPage={setPage} />;
  } else if (page === 'websocket') {
    content = <WebSocketComponent setPage={setPage} page={page} open={open} setOpen={setOpen} />;
  } else if (page === 'technology') {
    content = <Technology page={page} setPage={setPage} />;
  } else {
    content = null; // Handle any other cases if needed
  }

  return (
    <PlayerProvider>
      <Stack width="100vw" height="100vh" overflow="hidden" position="relative">
        <Background />
        <Navbar setPage={setPage} setOpen={setOpen} />
        {content}
      </Stack>
    </PlayerProvider>
  );
}

export default App;
