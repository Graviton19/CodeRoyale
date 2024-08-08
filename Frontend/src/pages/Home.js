import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Home.css'; // Ensure the path is correct

const Home = () => {
    const { user, logout } = useAuth();
    console.log("User in Home component:----------------", user); 
    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error("Failed to log out:", err);
        }
    };

    return (
        <div className="home-container"> {/* Apply the CSS class */}
            <h1>Welcome to our application</h1>
            
            {user ? (
                <div>
                    <h2>Welcome, {user.email}</h2>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div>
                    <Link to="/login">
                        <button>Login</button>
                    </Link>
                    <Link to="/register">
                        <button>Register</button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Home;
