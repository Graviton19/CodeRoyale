import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Assuming useAuth handles login and authentication

const Register = () => {
    const navigate = useNavigate();
    const { sendOTP, registerUser } = useAuth(); // Custom hook to handle sending OTP and registering user
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOTP] = useState('');
    const [error, setError] = useState('');

    const handleSendOTP = async (e) => {
        e.preventDefault();
        try {
            await sendOTP(email); // Assuming sendOTP function sends OTP to the provided email
            setError('');
        } catch (err) {
            setError(err.message); // Handle error if OTP sending fails
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerUser({ email, username, password, otp }); // Assuming registerUser handles registration with OTP verification
            navigate('/'); // Navigate to dashboard on successful registration
        } catch (err) {
            setError(err.message); // Handle registration error
        }
    };

    return (
        <div>
            <form onSubmit={handleSendOTP}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Send OTP</button>
            </form>
            {error && <p>{error}</p>}

            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
