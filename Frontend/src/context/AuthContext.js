import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { loginUser, registerUser, logoutUser, refreshToken } from '../api/userService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        if (storedAccessToken && storedUser) {
            setAccessToken(storedAccessToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (userData) => {
        const response = await loginUser(userData);
        setAccessToken(response.accessToken);
        setUser(response.user);
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
    };

    const register = async (userData) => {
        await registerUser(userData);
    };

    const logout = () => {
        logoutUser();
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
    };

    const value = {
        user,
        accessToken,
        login,
        register,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
