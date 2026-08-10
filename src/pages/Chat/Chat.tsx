import { Avatar, Box, Button, Divider, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ChatsRoom() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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
        <Stack spacing={1} sx={{ mt: 1 }}>
          {/* room list goes here */}
        </Stack>
      </Box>

      <Box
        component="main"
        sx={{
          gridArea: 'main',
          bgcolor: 'background.paper',
          overflowY: 'auto',
          p: 3,
        }}
      >
        {/* messages go here */}
      </Box>
    </Box>
  );
}
