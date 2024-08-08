import React from 'react';
import { useAuth } from '../hooks/useAuth';
import './Dashboard.css'; // Ensure the path is correct

const Dashboard = () => {
    const { user, logout } = useAuth();

    console.log(user);
    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="dashboard"> {/* Apply the dashboard class */}
            <h1>Welcome helo , {user.email}</h1>
            <button className="logout-button" onClick={logout}>Logout</button> {/* Apply the logout-button class */}
        </div>
    );
};

export default Dashboard;
