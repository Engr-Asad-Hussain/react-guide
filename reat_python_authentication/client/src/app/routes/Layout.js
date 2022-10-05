import { ThemeProvider, theme } from 'app/theme';
import { Outlet } from 'react-router-dom';
import { Header, Sidebar } from 'app/components';
import { Toolbar, Box, CssBaseline } from '@mui/material';


export function Layout() {
    console.log('Layout: ', window.location.pathname);
    return (
        <Box component="main" sx={{ display: 'flex' }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Header />
                <Box component="aside">
                    <Sidebar />
                </Box>
                <Box component="section" sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar />
                    <Box component="article">
                        <Outlet />
                    </Box>
                </Box>
            </ThemeProvider>
        </Box>
    )
}