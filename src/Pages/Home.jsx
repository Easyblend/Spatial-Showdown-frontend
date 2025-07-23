import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { usePlayerContext } from '../Hooks/UsePlayerData';
import HelperDialogue from '../Component/Popovers/HelperDialogue';

function Home({ setPage, open, setOpen }) {
  const [oppName, setOppName] = useState('');
  const [name, setName] = useState('');

  const {
    player, setPlayer, opponent, setOpponent,
  } = usePlayerContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleConnect = () => {
    setPlayer(name);
    setName('');
  };

  const connectToOpponent = () => {
    setOpponent(oppName);
  };

  return (
    <Stack
      sx={{
        position: 'relative',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <HelperDialogue open={open} setOpen={setOpen} />
      <Typography
        variant={isMobile ? 'h5' : 'h4'}
        color="primary"
        sx={{
          fontFamily: 'retrogamer',
          marginBottom: 3,
          textAlign: 'center',
        }}
        zIndex={10}
      >
        Connect with a Player
      </Typography>

      <Stack
        sx={{
          boxShadow: '1px 1px 20px 7px rgba(256, 256, 256, 0.1)',
          zIndex: 1,
          width: isMobile ? '100%' : 400,
          maxWidth: 500,
          height: 'auto',
          gap: 5,
          padding: isMobile ? 3 : 5,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 4,
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Stack spacing={2}>
          <Typography
            color="info"
            sx={{ fontFamily: 'retrogamer', fontSize: 20 }}
          >
            {player ? `Connected as ${player}` : 'YOUR NAME'}
          </Typography>
          <TextField
            variant="outlined"
            type="text"
            fullWidth
            sx={{ backgroundColor: '#A7E6FF', borderRadius: 2 }}
            value={name}
            placeholder="Enter your name"
            disabled={player.length > 0}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            variant="contained"
            size="large"
            onClick={handleConnect}
            disabled={!name || player}
          >
            Connect
          </Button>
        </Stack>

        {opponent?.length === 0 ? (
          <Stack spacing={2}>
            <Typography
              color="error"
              sx={{ fontFamily: 'retrogamer', fontSize: 20 }}
            >
              OPPONENT&apos;S NAME
            </Typography>
            <TextField
              variant="outlined"
              type="text"
              fullWidth
              value={oppName}
              placeholder="Enter opponent name"
              sx={{ backgroundColor: '#FF8A8A', borderRadius: 2 }}
              onChange={(e) => setOppName(e.target.value)}
            />
            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={connectToOpponent}
              disabled={!oppName}
            >
              SEND REQUEST
            </Button>
          </Stack>
        ) : (
          <Stack alignItems="center" spacing={2}>
            <Typography
              sx={{
                fontFamily: 'retrogamer',
                fontSize: 16,
                color: '#FF8A8A',
              }}
            >
              Requested Opponent
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                alt="Opponent Avatar"
                src="https://img.freepik.com/premium-photo/round-circle-with-mans-head-circle-with-circle-middle_807814-680.jpg?semt=ais_hybrid"
              />
              <Typography color="primary">{opponent}</Typography>
            </Stack>
          </Stack>
        )}
      </Stack>

      {player && opponent && (
        <Box marginTop={4}>
          <Button
            variant="contained"
            onClick={() => setPage('map')}
            sx={{
              fontFamily: 'retrogamer',
              fontWeight: 700,
              letterSpacing: 2,
              fontSize: 18,
              zIndex: 10,
            }}
          >
            Start Game
          </Button>
        </Box>
      )}
    </Stack>
  );
}

export default Home;
