import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem("admin_authenticated") === "true";
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to={`/admin/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
    }

    return children;
};

export default ProtectedRoute;
