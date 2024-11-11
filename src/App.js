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

  let content;

  if (page === 'map') {
    content = <Map page={page} setPage={setPage} />;
  } else if (page === 'websocket') {
    content = <WebSocketComponent setPage={setPage} page={page} />;
  } else if (page === 'technology') {
    content = <Technology page={page} setPage={setPage} />;
  } else {
    content = null; // Handle any other cases if needed
  }

  return (
    <PlayerProvider>
      <Stack width="100vw" height="100vh">
        <Background />
        <Navbar setPage={setPage} />
        {content}
      </Stack>
    </PlayerProvider>
  );
}

export default App;
