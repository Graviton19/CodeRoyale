import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const AuthPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Authenticate</h2>
            <div>
                <button onClick={() => navigate('/login')}>Login</button>
                <button onClick={() => navigate('/register')}>Register</button>
            </div>
        </div>
    );
};

export default AuthPage;
