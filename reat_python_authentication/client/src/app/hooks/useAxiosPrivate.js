import { axiosPrivate } from 'app/callbacks/axios';
import { useEffect } from 'react';
import { useAuthState } from 'app/hooks';
import { useRefreshToken } from 'app/hooks/useRefresh';

/**
 * This hook will attached the axios interceptors with axiosPrivate instance.
 * Now interceptors, you can think much like a vanilla javascript event listners.
 * So they get attached but we will also need to remove them because if not you could more and more 
 */
const useAxiosPrivate = () => {
    console.log('useAxiosPrivate');

    const refresh = useRefreshToken();
    const authState = useAuthState();


    useEffect(() => {
        // request interceptors
        const requestIntercept = axiosPrivate.interceptors.request.use(
            // checks if the authorization headers is missing in the request.
            // This is the initial request because we know authorization headers are not set initially
            config => {
                console.log('useAxiosPrivate UseEffect');
                if (!config.headers['Authorization']) {
                    // Then we know its not a retry this will be the first attempt 
                    config.headers['Authorization'] = `Bearer ${authState.accessToken}`;
                }
                return config
            },
            (error) => Promise.reject(error)
        );

        // response interceptors
        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                console.log('useAxiosPrivate Response UseEffect');
                // This async error handler is for, if our token has expired

                // Get the prev request
                const prevRequest = error?.config;

                // If our request fails due to expired token. !prevRequest.sent because we want to run it only once.
                if (error?.response?.status == 401 && !prevRequest.sent) {
                    prevRequest.sent = true;

                    // get a new accessToken
                    const newAccessToken = await refresh();

                    // attached headers in axios
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    // We have updated the axiosPrivate with the new access token
                    return axiosPrivate(prevRequest);
                }

                // If the status code is not 401
                return Promise.reject(error)
            }
        );
        
        return () => {
            axiosPrivate.interceptors.response.eject(responseIntercept);
            axiosPrivate.interceptors.request.eject(requestIntercept);
        }
    }, []);

    // axiosPrivate hook is going to return the axios private instance and it will have the interceptors
    // added to handle the jwt tokens that we need to request our data and possibly retry and 
    // get a new access token if necessary.
    return axiosPrivate;
}

export { useAxiosPrivate }