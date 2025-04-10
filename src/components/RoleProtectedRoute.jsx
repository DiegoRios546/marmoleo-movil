import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const { token } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const userRole = JSON.parse(atob(token.split('.')[1])).role;

    // Redirigir si el rol no está permitido
    if (!allowedRoles.includes(userRole)) {
        // Redirigir al dashboard específico del rol del usuario
        const roleToPath = {
            admin: '/admin/adminDashboard',
            moderator: '/moderator/moderatorDashboard',
            user: '/user/userDashboard',
        };
        return <Navigate to={roleToPath[userRole]} replace />;
    }

    return children;
};

export default RoleProtectedRoute;
