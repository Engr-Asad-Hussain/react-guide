import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'app/hooks';

export function RequireAuth({ allowedRoles }) {
    console.log('Page: RequireAuth: ', window.location.pathname)
    const authState = useAuthState();
    const location = useLocation();

    return (
        authState?.role?.find(role => allowedRoles?.includes(role))
            ? (<Outlet />)
            : authState?.username
                ? (<Navigate to='/unauthorized' state={{ from: location }} replace />)
                : (<Navigate to='/login' state={{ from: location }} replace />)
    );
}