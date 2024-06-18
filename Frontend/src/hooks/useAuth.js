import { useContext } from 'react';
import AuthContext from '../context/AuthContext'; // Correct import path

export const useAuth = () => {
    return useContext(AuthContext);
};
