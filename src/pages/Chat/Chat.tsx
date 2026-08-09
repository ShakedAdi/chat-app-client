import { Box, Typography, Stack, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function ChatsRoom() {
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
        <Box sx={{ flex: 1 }} />
        <Button component={RouterLink} to="/" size="small">
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
