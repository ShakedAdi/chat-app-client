import { Stack, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function App() {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      <Box
        sx={{
          flex: 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          display: 'grid',
          placeItems: 'center start',
          p: { xs: 6, md: 10 },
        }}
      >
        <Typography
          variant="h1"
          sx={{ fontSize: { xs: '3.5rem', md: '6rem' }, lineHeight: 1 }}
        >
          Welcome to ChatApp
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          bgcolor: 'common.white',
          display: 'grid',
          placeItems: 'center start',
          p: { xs: 6, md: 10 },
        }}
      >
        <Stack spacing={4} sx={{ alignItems: 'flex-start' }}>
          <Typography
            variant="h3"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '2rem', md: '3rem' },
              lineHeight: 1.2,
            }}
          >
            Sign in to keep chatting, or create an account.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button variant="contained" component={RouterLink} to="/signin">
              Sign in
            </Button>
            <Button variant="outlined" component={RouterLink} to="/signup">
              Sign up
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

export default App;
