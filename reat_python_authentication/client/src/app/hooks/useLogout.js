import axios from 'app/callbacks/axios';
import { useAuthDispatch, useAuthState } from 'app/hooks';

const useLogout = () => {
    const authState = useAuthState();
    const dispatchAuth = useAuthDispatch();

    const logout = async () => {
        dispatchAuth({})
        try {
            const response = await axios.get(`${process.env.REACT_APP_USER_SERVICE}/user/logout`, 
                {   headers: { 'Authorization': `Bearer ${authState.accessToken}` }, 
                    withCredentials: true 
                },
            )
        } catch (error) {
            console.error(error)
        }
    }

    return logout;
}

export { useLogout };