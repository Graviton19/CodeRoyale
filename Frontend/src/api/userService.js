    import axios from 'axios';

    const API_URL = process.env.REACT_APP_API_URL;

    export const registerUser = async (userData) => {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    };

    export const loginUser = async (userData) => {
        const response = await axios.post(`${API_URL}/login`, userData);
        return response.data;
    };

    export const logoutUser = async () => {
        await axios.post(`${API_URL}/logout`);
    };

    export const refreshToken = async (token) => {
        const response = await axios.post(`${API_URL}/refresh-token`, { refreshToken: token });
        return response.data;
    };
