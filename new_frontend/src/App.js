import logo from './logo.svg';
import './App.css';
import * as React from 'react';

import Canvas from './components/Canvas'
import Panel from './components/Panel'

import { Stack } from "@mui/material"
import { createTheme, ThemeProvider } from '@mui/material/styles';

function App() {
  const theme = createTheme({
    background: {
      default: "#131313"
    },
    palette: {
      mode: 'dark',
      primary: {
        main: '#ffef3b',
      },
      secondary: {
        main: '#31f973',
      },
    },
    typography: {
      fontFamily: 'Source Sans Pro',
      fontWeightBold: 900,
      fontWeightMedium: 500,
      fontWeightRegular: 300,
    }
  });

  return (
    <Stack direction="column" alignItems="center" gap={1}>
    {/* <ThemeProvider theme={theme}> */}
      <Canvas />
      <Panel />
    {/* </ThemeProvider> */}
    </Stack>
  );
}

export default App;
