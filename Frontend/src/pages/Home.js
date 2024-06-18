import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
    const { user, setUser, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/me`, {
                    withCredentials: true
                });
                setUser(response.data.user);
            } catch (error) {
                console.error("Failed to fetch user:", error);
                navigate('/auth');
            }
        };

        if (!user) {
            checkAuth();
        }
    }, [user, setUser, navigate]);

    return (
        <div>
            {user ? (
                <div>
                    <h1>Welcome, {user.email}</h1>
                    <button onClick={logout}>Logout</button>
                </div>
            ) : (
                <div>
                    <h1>Welcome to our application</h1>
                    <Link to="/auth">Login or Register</Link>
                </div>
            )}
        </div>
    );
};

export default Home;
