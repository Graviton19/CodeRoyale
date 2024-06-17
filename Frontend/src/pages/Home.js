import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { useAuth } from '../hooks/useAuth';

const Home = () => {
    const { user, logout } = useAuth();

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Welcome, {user.email}</h1>
            <button onClick={logout}>Logout</button>
            <div>
                <Link to="/login">Login</Link> {/* Link to Login page */}
                <span> | </span>
                <Link to="/register">Register</Link> {/* Link to Register page */}
            </div>
        </div>
    );
};

export default Home;
