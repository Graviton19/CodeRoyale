import React from 'react';
import useAuth from '../hooks/useAuth';

const Home = () => {
    const { user, logout } = useAuth();

    return (
        <div>
            <h2>Home</h2>
            {user ? (
                <div>
                    <p>Welcome, {user.username}</p>
                    <button onClick={logout}>Logout</button>
                </div>
            ) : (
                <p>Please login or register.</p>
            )}
        </div>
    );
};

export default Home;
