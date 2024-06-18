import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Login.css'; // Import the CSS file for styling

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ email, password });
            navigate('/'); // Navigate to home page on successful login
        } catch (err) {
            setError('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <div className="compiler-container">
            <div className="compiler-header">
                <button
                    className="compile-btn"
                    onClick={handleSubmit}
                >
                    Login
                </button>
            </div>
            <div className="compiler-content">
                <div className="editor">
                    <textarea
                        className="code-input ace_editor ace-twilight ace_dark"
                        value={`const email = '${email}';
const password = '${password}';
// Initial values
// Validate email format using regex
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Validate password length
const validatePassword = (password) => {
    return password.length >= 6 && password.length <= 30;
};

// Example usage: Simulate login attempt
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await login({ email, password });
        navigate('/'); // Navigate to home page on successful login
    } catch (err) {
        setError('Login failed. Please check your credentials and try again.');
    }
};

// Check email format
if (!validateEmail(email)) {
    setError('Invalid email format.');
}

// Check password length
if (password.length === 0) {
    setError('Password cannot be empty.');
} else if (password.length > 30 || password.length < 6) {
    setError('Password length does not meet criteria.');
}

// Example usage: Simulate login attempt
if (validateEmail(email) && validatePassword(password)) {
    setError('Login successful!');
} else {
    setError('Login failed. Please check your credentials.');
}`}

                    onChange={(e) => {
                        const newValue = e.target.value;
                        const lines = newValue.split('\n');
                        lines.forEach(line => {
                            if (line.startsWith('const email')) {
                                const match = line.match(/const email = '([^']*)'/);
                                if (match) {
                                    setEmail(match[1]);
                                }
                            } else if (line.startsWith('const password')) {
                                const match = line.match(/const password = '([^']*)'/);
                                if (match) {
                                    setPassword(match[1]);
                                }
                            }
                        });
                    }}
                    placeholder="Enter your email and password here"
                    rows={20}
                />
                </div>
                <div className="output">
                    <div className="output-header">Output:</div>
                    <div className="output-content">
                        <p className="output-message">{error}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
