import { useAuthDispatch } from 'app/hooks';
import axios from 'app/callbacks/axios';

const useRefreshToken = () => {
    console.log('useRefreshToken');
    
    const authDispatch = useAuthDispatch();

    const refresh = async () => {
        const response = await axios.get(`${process.env.REACT_APP_USER_SERVICE}/token/refresh`, 
            { withCredentials: true }, // withCredentials=True allow us to send cookies with our request
        );
        authDispatch(prev => {
            return { 
                ...prev, 
                role: response.data.role, 
                accessToken: response.data.accessToken 
            }
        })
        
        // We have to return the accessToken so that we can use it with our request.
        // Because we will call this function when our initial request fails when our accessToken is expired
        // Then it will refresh, get a new token and we can re-call the request
        return response.data.accessToken;
    }

    return refresh
};

export { useRefreshToken };