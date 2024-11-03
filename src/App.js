import React, { useEffect } from 'react';
import { Stack } from '@mui/material';
import Map from './Component/Map';
import WebSocketComponent from './Component/WebSocket';
import { PlayerProvider } from './Hooks/UsePlayerData';
import Navbar from './Component/Navbar';
import Background from './Component/Background';

function App() {
  const [page, setPage] = React.useState('websocket');

  return (
    <PlayerProvider>
      <Stack
        width="100vw"
        height="100vh"
      >
        <Background />
        <Navbar />
        {page === 'map' ? (
          <Map page={page} setPage={setPage} />
        ) : (
          <WebSocketComponent setPage={setPage} page={page} />
        )}
      </Stack>
    </ PlayerProvider>
  );
}

export default App;
