import defaultTheme from 'app/theme/default';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const overrides = {};

const theme = createTheme({ 
    ...defaultTheme, ...overrides 
});

// const theme = createTheme({
//     components: {
//       // Name of the component ⚛️
//       MuiButtonBase: {
//         defaultProps: {
//           // The default props to change
//           disableRipple: true, // No more ripple, on the whole application 💣!
//         },
//       },
//     },
//   });

export { ThemeProvider, theme }