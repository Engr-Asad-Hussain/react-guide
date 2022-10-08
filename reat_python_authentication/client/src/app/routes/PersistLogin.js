import { Outlet } from 'react-router-dom';
import { useState, useEffect, Fragment } from 'react';
import { useRefreshToken, useAuthState } from 'app/hooks';


const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const authState = useAuthState();
    const persist = JSON.parse(window.localStorage.getItem('persist')) || false;

    useEffect(() => {
        let isMounted = true;
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        // Avoids unwanted call to verifyRefreshToken
        !authState?.accessToken ? verifyRefreshToken() : setIsLoading(false)

        return () => isMounted = false;
    }, [])

    return (
        <Fragment>
            {!persist
                ? <Outlet />
                : isLoading
                    ? <p>Loading ...</p>
                    : <Outlet />
            }
        </Fragment>
    )
}

export { PersistLogin }