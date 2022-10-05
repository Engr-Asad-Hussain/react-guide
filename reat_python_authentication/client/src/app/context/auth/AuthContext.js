import { createContext, useState } from 'react';

const AuthContextState = createContext();
const AuthContextDispatch = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(false);
    return (
        <AuthContextDispatch.Provider value={setAuth}>
            <AuthContextState.Provider value={auth}>
                {children}
            </AuthContextState.Provider>
        </AuthContextDispatch.Provider>
    )
}

export { AuthContextState, AuthContextDispatch, AuthProvider }