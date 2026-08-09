import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Auth from './pages/Auth/Auth.tsx';
import { AuthAction } from './pages/Auth/types.ts';

/*
#000000
#500017
#CB2957
#eeeeee
#ffffff
*/

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#500017' },
    text: { primary: '#000000', secondary: '#CB2957' },
    background: { default: '#ffffff', paper: '#eeeeee' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h1: { fontWeight: 'bold', letterSpacing: '-0.03em' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, padding: '10px 24px' },
      },
    },
  },
});

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/signup', element: <Auth action={AuthAction.SIGNUP} /> },
  { path: '/signin', element: <Auth action={AuthAction.SIGNIN} /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
