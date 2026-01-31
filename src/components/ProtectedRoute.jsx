import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        } else if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
            // Redirect based on role or to 403
            if (user.role === 'admin') navigate('/admin');
            else navigate('/student');
        }
    }, [user, loading, navigate, allowedRoles]);

    if (loading) return <Loader />;

    return user ? <Outlet /> : null;
};

export default ProtectedRoute;
