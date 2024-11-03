import React, { createContext, useContext, useState } from 'react';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [player, setPlayer] = useState('');
  const [opponent, setOpponent] = useState('');
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);

  return (
    <PlayerContext.Provider value={React.useMemo(() => ({
      player, connected, setConnected, setPlayer, opponent, setOpponent, client, setClient,
    }), [player, connected, setConnected, setPlayer, opponent, setOpponent, client, setClient])}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayerContext = () => useContext(PlayerContext);
