import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Registration, Login, Dashboard, Profile, Teams, Error, AdminPortal } from 'app/pages';
import { Layout } from 'app/routes/Layout';
import { RequireAuth } from 'app/routes/RequireAuth';

const ROLES = {
    'admin': 2001,
    'user': 1984
}
export function AppRoutes() {
    console.log('AppRoutes: ', window.location.pathname);
    console.log(useLocation())
    return (
        <Routes>
            <Route path='/' element={<Layout />}>
                {/* Public Routes */}
                <Route path='/' element={<Navigate to='/login' />} />
                <Route path='login' element={<Login />} />
                <Route path='register' element={<Registration />} />

                {/* Protected Routes */}
                <Route element={<RequireAuth allowedRoles={[ROLES.admin, ROLES.user]} />}>
                    <Route path='dashboard' element={<Dashboard />} />
                    <Route path='profile' element={<Profile />} />
                    <Route path='teams' element={<Teams />} />
                </Route>
                <Route element={<RequireAuth allowedRoles={[ROLES.admin]} />}>
                    <Route path='admin' element={<AdminPortal />} />
                </Route>

                {/* Unmatch route */}
                <Route path="*" element={<Error />} />
            </Route>
        </Routes>
    )
}