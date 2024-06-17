import React, { useContext, createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async ({ email, password }) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, {
                email,
                password
            }, {
                withCredentials: true // include credentials (cookies)
            });
            setUser(response.data.user);
            return response.data;
        } catch (error) {
            console.error("Failed to log in:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/users/logout`, {}, {
                withCredentials: true
            });
            setUser(null);
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    };

    useEffect(() => {
        const autoLogin = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/me`, {
                    withCredentials: true
                });
                setUser(response.data.user);
            } catch (error) {
                // If auto-login fails (e.g., session expired), user remains null
                console.error("Auto-login failed:", error);
            }
        };

        autoLogin(); // Invoke autoLogin function on component mount

        // Optionally, you can clean up any resources in the return function of useEffect
        // e.g., clear timeouts, subscriptions, etc.
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
