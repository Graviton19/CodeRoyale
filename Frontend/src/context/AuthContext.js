import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/me`, {
                    withCredentials: true
                });
                setUser(response.data.user);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    const login = async ({ email, password }) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, {
                email,
                password
            }, {
                withCredentials: true
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

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext; // Export AuthContext itself
