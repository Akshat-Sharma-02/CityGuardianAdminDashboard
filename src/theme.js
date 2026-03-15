import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0B1120',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2563EB',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F8FAFC',
      paper: '#ffffff',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
    divider: '#F1F5F9',
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: { fontFamily: '"Outfit", sans-serif', fontWeight: 800, letterSpacing: '-1px' },
    h2: { fontFamily: '"Outfit", sans-serif', fontWeight: 800, letterSpacing: '-0.5px' },
    h3: { fontFamily: '"Outfit", sans-serif', fontWeight: 700, letterSpacing: '-0.5px' },
    h4: { fontFamily: '"Outfit", sans-serif', fontWeight: 700, letterSpacing: '-0.5px' },
    h5: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
    h6: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
          border: '1px solid #F1F5F9'
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          border: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
        }
      }
    }
  },
});

export default theme;
