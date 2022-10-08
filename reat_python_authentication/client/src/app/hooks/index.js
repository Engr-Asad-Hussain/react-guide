import { useContext } from 'react';
import { AuthContextState, AuthContextDispatch } from 'app/context';

const useAuthState = () => useContext(AuthContextState);
const useAuthDispatch = () => useContext(AuthContextDispatch);


export { useAuthState, useAuthDispatch }
export { useRefreshToken } from './useRefresh';