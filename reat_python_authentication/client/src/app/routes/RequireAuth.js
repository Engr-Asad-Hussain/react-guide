import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'app/hooks';
import jwt_decode from 'jwt-decode';


export function RequireAuth({ allowedRoles }) {
    console.log('Page: RequireAuth: ', window.location.pathname)
    const authState = useAuthState();
    const location = useLocation();

    const decoded = authState?.accessToken
        ? jwt_decode(authState.accessToken)
        : undefined

    const roles = decoded?.roles || []

    return (
        roles.find(role => allowedRoles?.includes(role))
            ? (<Outlet />)
            : authState?.username
                ? (<Navigate to='/unauthorized' state={{ from: location }} replace />)
                : (<Navigate to='/login' state={{ from: location }} replace />)
    );
}