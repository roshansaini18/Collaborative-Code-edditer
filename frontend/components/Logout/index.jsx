


import React, { useState } from 'react';

const Home = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [otp, setOtp] = useState('');
    const [authMode, setAuthMode] = useState('signin'); // 'signin', 'signup', 'forgot'
    const [signupStage, setSignupStage] = useState('email'); // 'email', 'otp', 'password'
    const [forgotStage, setForgotStage] = useState('email'); // 'email', 'otp', 'password'

    const handleSignIn = async (e) => {
        e.preventDefault();
        if (!userName || !email || !password) {
            alert('Please enter your username, email, and password.');
            return;
        }
        try {
            const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001';
            const finalObj = { email, password };
            const response = await fetch(`${apiUrl}/api/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalObj),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                localStorage.setItem('userName', userName);
                localStorage.setItem('email', email);
                onLoginSuccess({ userName, email });
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Failed to connect to the server.');
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email || !userName) {
            alert('Please fill in all fields.');
            return;
        }
        try {
            const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001';
            const finalObj = { email, userName };
            const response = await fetch(`${apiUrl}/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalObj),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setSignupStage('otp');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Failed to connect to the server.');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) {
            alert('Please enter the OTP.');
            return;
        }
        try {
            const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001';
            const finalObj = { email, otp };
            const response = await fetch(`${apiUrl}/api/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalObj),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setSignupStage('password');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Failed to connect to the server.');
        }
    };

    const handleSetPassword = async (e) => {
        e.preventDefault();
        if (!password) {
            alert('Please enter a password.');
            return;
        }
        try {
            const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001';
            const finalObj = { email, password };
            const response = await fetch(`${apiUrl}/api/set-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalObj),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setAuthMode('signin');
                setSignupStage('email');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Failed to connect to the server.');
        }
    };

    // --- FORGOT PASSWORD HANDLERS ---
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            alert('Please enter your email address.');
            return;
        }
        try {
            const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setForgotStage('otp');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Failed to connect to the server.');
        }
    };

    const handleVerifyResetOtp = async (e) => {
        e.preventDefault();
        if (!otp) {
            alert('Please enter the OTP.');
            return;
        }
        try {
            const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/verify-reset-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setForgotStage('password');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Failed to connect to the server.');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!password) {
            alert('Please enter a new password.');
            return;
        }
        try {
            const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, password }),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setAuthMode('signin');
                setEmail('');
                setPassword('');
                setOtp('');
                setForgotStage('email');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Failed to connect to the server.');
        }
    };


    const renderAuthForm = () => {
        if (authMode === 'forgot') {
            switch (forgotStage) {
                case 'email':
                    return (
                        <form className="space-y-4" onSubmit={handleForgotPassword}>
                            <p className="text-center text-gray-600">Enter your email to receive a reset OTP.</p>
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition-colors">
                                Send OTP
                            </button>
                        </form>
                    );
                case 'otp':
                    return (
                        <form className="space-y-4" onSubmit={handleVerifyResetOtp}>
                            <p className="text-center text-gray-600">An OTP has been sent to {email}.</p>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition-colors">
                                Verify OTP
                            </button>
                        </form>
                    );
                case 'password':
                    return (
                        <form className="space-y-4" onSubmit={handleResetPassword}>
                            <p className="text-center text-gray-600">OTP verified. Set your new password.</p>
                            <input
                                type="password"
                                placeholder="New Password"
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition-colors">
                                Reset Password
                            </button>
                        </form>
                    );
                default:
                    return null;
            }
        }

        if (authMode === 'signin') {
            return (
                <div>
                    <form className="space-y-4" onSubmit={handleSignIn}>
                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Sign In
                        </button>
                    </form>
                    <div className="text-center mt-4">
                        <button
                            onClick={() => {
                                setAuthMode('forgot');
                                setForgotStage('email');
                                setPassword('');
                                setUserName('');
                            }}
                            className="text-sm text-blue-500 hover:underline"
                        >
                            Forgot Password?
                        </button>
                    </div>
                </div>
            );
        }

        // Signup form
        switch (signupStage) {
            case 'email':
                return (
                    <form className="space-y-4" onSubmit={handleSendOtp}>
                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Send OTP
                        </button>
                    </form>
                );
            case 'otp':
                return (
                    <form className="space-y-4" onSubmit={handleVerifyOtp}>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Verify OTP
                        </button>
                    </form>
                );
            case 'password':
                return (
                    <form className="space-y-4" onSubmit={handleSetPassword}>
                        <input
                            type="password"
                            placeholder="Set Password"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Set Password
                        </button>
                    </form>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-200">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full border border-gray-300">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    {authMode === 'signin' && 'Sign In'}
                    {authMode === 'signup' && 'Sign Up'}
                    {authMode === 'forgot' && 'Reset Password'}
                </h2>
                {renderAuthForm()}
                <div className="text-center mt-4">
                    {authMode === 'signin' ? (
                        <button
                            onClick={() => {
                                setAuthMode('signup');
                                setSignupStage('email');
                            }}
                            className="text-blue-500 hover:underline"
                        >
                            Don't have an account? Sign Up
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setAuthMode('signin');
                            }}
                            className="text-blue-500 hover:underline"
                        >
                            Already have an account? Sign In
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;

