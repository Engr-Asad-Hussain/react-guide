import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'app/hooks';

export function RequireAuth({ allowedRoles }) {
    console.log('RequireAuth: ', window.location.pathname)
    const authState = useAuthState();
    const location = useLocation();

    console.log('RequireAuth', authState, location);
    return (
        authState?.roles?.find(role => allowedRoles?.includes(role))
            ? (<Outlet />)
            : authState?.username
                ? (<Navigate to='/unauthorized' state={{ from: location }} replace />)
                : (<Navigate to='/login' state={{ from: location }} replace />)
    );
}