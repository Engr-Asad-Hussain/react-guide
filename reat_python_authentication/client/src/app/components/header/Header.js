import { AppBar, Toolbar, Typography, Button } from '@mui/material';


function Header() {
    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    BetaX
                </Typography>
                <Button color="inherit">LOG OUT</Button>
            </Toolbar>
        </AppBar>
    );
}

export { Header }