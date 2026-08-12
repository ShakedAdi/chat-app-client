import { Avatar, Box, Button, Divider, List, Typography } from '@mui/material';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRooms, type Room } from '../../api';
import { useCallback, useEffect, useState } from 'react';
import RoomRow from './components/RoomRow';
import EmptyRooms from './components/EmptyRooms';
import UsersSearch from './components/UsersSearch';
import CreateGroup from './components/CreateGroup';

export default function ChatsRoom() {
  const { user, signOut } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const { roomId: selectedRoomId } = useParams();
  const navigate = useNavigate();

  const refreshRooms = useCallback(async () => {
    setRooms(await getRooms());
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const next = await getRooms();
      if (!cancelled) setRooms(next);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  return (
    <Box
      sx={{
        height: '100dvh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '280px 1fr' },
        gridTemplateRows: 'auto 1fr',
        gridTemplateAreas: {
          xs: `"header" "main"`,
          md: `"header header" "sidebar main"`,
        },
        overflow: 'hidden',
      }}
    >
      <Box
        component="header"
        sx={{
          gridArea: 'header',
          borderBottom: 4,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 3,
          minHeight: 64,
        }}
      >
        <Typography variant="h6" component="h1" sx={{ fontWeight: 700 }}>
          ChatApp
        </Typography>
        <Divider orientation="vertical" flexItem sx={{ my: 1.5 }} />

        <Avatar sx={{ width: 32, height: 32 }} />
        <Typography
          component="h3"
          sx={{ fontWeight: 700, color: 'text.secondary' }}
        >
          {user?.username}
        </Typography>
        <UsersSearch onDirectCreated={refreshRooms} />
        <CreateGroup />
        <Box sx={{ flex: 1 }} />
        <Button onClick={handleSignOut} size="small">
          Log out
        </Button>
      </Box>

      <Box
        component="aside"
        sx={{
          gridArea: 'sidebar',
          borderRight: 1,
          borderColor: 'divider',
          overflowY: 'auto',
          display: { xs: 'none', md: 'block' },
          p: 2,
        }}
      >
        <Typography variant="overline" color="text.secondary">
          Rooms
        </Typography>

        {rooms.length > 0 ? (
          <List disablePadding sx={{ mt: 1 }}>
            {rooms.map((room) => (
              <RoomRow
                key={room.id}
                room={room}
                selected={room.id === selectedRoomId}
              />
            ))}
          </List>
        ) : (
          <EmptyRooms />
        )}
      </Box>

      <Box
        component="main"
        sx={{
          gridArea: 'main',
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
