import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useLogout } from 'app/hooks';

function Header() {
    console.log('Component: Headers')
    const logout = useLogout();

    const handleLogout = async () => {
        await logout();
    }
    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    BetaX
                </Typography>
                <Button
                    color="inherit"
                    onClick={handleLogout}
                >
                    LOG OUT
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export { Header }