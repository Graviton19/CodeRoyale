import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AuthenticateBeforeRender = ({ render }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { authenticate } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const auth = await authenticate();
            setIsAuthenticated(auth);
            if (!auth) {
                navigate('/login');
            }
        };
        checkAuth();
    }, [authenticate, navigate]);

    return isAuthenticated ? render() : null;
};

export default AuthenticateBeforeRender;
