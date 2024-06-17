import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
    const { user, logout } = useAuth();

    if (!user) {
        return <p>Loading...</p>;
    }

    const handleLogout = async () => {
        try {
            await logout();
            // Optionally, redirect to a different page after logout
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <div>
            <h1>Welcome, {user.email}</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;
