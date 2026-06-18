import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center text-white">
                <div className="animate-pulse font-orbitron tracking-widest uppercase">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin) {
        // Logged in but not an admin → send to the public home page.
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
