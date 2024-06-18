import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
    const { user, logout } = useAuth();



    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error("Failed to log out:", err);
        }
    };

    return (
        <div>
            <h1>Welcome to our application</h1>
            
            {user ? (
                <div>
                    <h2>Welcome, {user.email}</h2>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div>
                    <Link to="/login"><button>Login</button></Link>
                        
                    <Link to="/register"><button>Register</button></Link>
                </div>
            )}
        </div>
    );
};

export default Home;
