import { useState } from 'react';
import { ButtonLoading } from 'app/custom';
import { userLogin } from 'app/callbacks';
import { useAuthDispatch, useAuthState } from 'app/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Grid, FormControlLabel, Typography, TextField, Fade, Checkbox } from '@mui/material';


export function Login() {
    console.log('Page: Login: ', window.location.pathname);
    const navigate = useNavigate();
    const location = useLocation();

    const authDispatch = useAuthDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({
        status: false,
        details: "",
    });
    const _submitLogin = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const username = data.get("username");
        const password = data.get("password");
        console.log(document.getElementById("password"))
        if (!username || !password) {
            setError({
                status: true,
                details: "Please provide valid input fields",
            });
            return
        }
        userLogin(
            username,
            password,
            setIsLoading,
            setError,
            authDispatch,
            navigate,
            location
        );
    };
    const delError = () => {
        setError({
            status: false,
            details: "",
        });
    };

    return (
            <Box maxWidth={400} marginInline='auto'>
                <Fade in={error.status}>
                    <Typography color='error' align='center'>
                        {error.details}
                    </Typography>
                </Fade>

                <Grid
                    item
                    xs={12}
                    component="form"
                    id="login-form"
                    onSubmit={_submitLogin}
                >
                    <TextField
                        required
                        id="email"
                        name="username"
                        // type="email"
                        margin="normal"
                        placeholder="Email address"
                        onFocus={delError}
                        fullWidth
                    />
                    <TextField
                        required
                        id="password"
                        type="password"
                        name="password"
                        margin="normal"
                        placeholder="Password"
                        onFocus={delError}
                        fullWidth
                    />
                    <Grid
                        item
                        xs={12}
                        style={{ display: "flex", marginTop: '10px' }}
                    >
                        <ButtonLoading
                            isLoading={isLoading}
                            fullWidth
                        >
                            LOGIN
                        </ButtonLoading>
                    </Grid>
                </Grid>

                <Grid container style={{ placeItems: 'center' }}>
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    disabled
                                    checked={false}
                                    // onChange={}
                                    color="primary"
                                />
                            }
                            label="Stay signed in"
                        />
                    </Grid>
                    {/* <Grid
                    item
                    xs={6}
                >
                    <ForgetPassword />
                </Grid> */}
                </Grid>
            </Box>
    );
}
