import React, { useState } from 'react';
import { login } from "../authapi"; // Ensure path to authapi.js is correct
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Base URL:", process.env.REACT_APP_ARI_CALL_URL);

        try {
            const response = await login({ email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow-lg p-4" style={{ width: '400px', borderRadius: '10px' }}>
                <h2 className="text-center mb-4" style={{ color: '#007BFF' }}>Login</h2>
                {error && <div className="alert alert-danger text-center">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        style={{ backgroundColor: '#007BFF', border: 'none' }}
                    >
                        Login
                    </button>
                </form>
                <p className="text-center mt-3">
                    <small>Don't have an account? <a href="/register" className="text-decoration-none">Sign up</a></small>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
