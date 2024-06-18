import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Custom hook for auth operations

const Register = () => {
    const navigate = useNavigate();
    const { sendOTP, registerUser } = useAuth();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOTP] = useState('');
    const [error, setError] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        try {
            await sendOTP(email);
            setOtpSent(true);
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerUser({ email, username, password, otp });
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubmit = (e) => {
        if (otpSent) {
            handleRegister(e);
        } else {
            handleSendOTP(e);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
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
                {otpSent && (
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOTP(e.target.value)}
                    />
                )}
                <button type="submit">
                    {otpSent ? 'Verify and Register' : 'Send OTP'}
                </button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Register;
