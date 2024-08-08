import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css'; 
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Correct import path

ReactDOM.render(
    <AuthProvider>
        <App />
    </AuthProvider>,
    document.getElementById('root')
);
