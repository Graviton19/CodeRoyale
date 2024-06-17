import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
    const { user, logout } = useAuth();

    console.log(user)
    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Welcome, {user.email}</h1>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Dashboard;
