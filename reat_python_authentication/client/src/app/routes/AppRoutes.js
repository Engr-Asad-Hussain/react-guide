import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Registration, Login, Dashboard, Profile, Teams, Error, AdminPortal } from 'app/pages';
import { Layout } from 'app/routes/Layout';
import { RequireAuth } from 'app/routes/RequireAuth';
import { PersistLogin } from 'app/routes/PersistLogin';

const ROLES = {
    'GlobalAdmin': 2001,
    'OrganizationAdmin': 1993,
    'Reader': 1834,
}

export function AppRoutes() {
    console.log('AppRoutes: ', window.location.pathname);

    return (
        <Routes>
            {/* Public Routes */}
            <Route path='/' element={<Navigate to='/login' />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Registration />} />

            <Route path='/' element={<Layout />}>
                
                <Route element={<PersistLogin />}>
                    {/* Protected Routes */}
                    <Route element={<RequireAuth allowedRoles={[ROLES.GlobalAdmin, ROLES.OrganizationAdmin, ROLES.Reader]} />}>
                        <Route path='dashboard' element={<Dashboard />} />
                        <Route path='profile' element={<Profile />} />
                        <Route path='teams' element={<Teams />} />
                    </Route>
                    <Route element={<RequireAuth allowedRoles={[ROLES.GlobalAdmin]} />}>
                        <Route path='admin' element={<AdminPortal />} />
                    </Route>
                </Route>

                {/* Unmatch route */}
                <Route path="*" element={<Error />} />
            </Route>
        </Routes>
    )
}