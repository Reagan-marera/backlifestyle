import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import RegistrationForm from './Component/RegistrationForm';
import Login from './Component/login'; // Ensure this matches the filename exactly
import Dashboard from './Component/Dashboard';
import Navbar from './Component/Navbar';
import Home from './Component/Home';
const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [userRole, setUserRole] = useState('');

    // Check token and set userRole on mount
    useEffect(() => {
        if (token) {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            setUserRole(decoded.role);
        }
    }, [token]);

    // Handle logout
    const handleLogout = () => {
        setToken('');
        setUserRole('');
        localStorage.removeItem('token');
    };

    const handleToken = (newToken) => {
        setToken(newToken);
        const decoded = JSON.parse(atob(newToken.split('.')[1]));
        setUserRole(decoded.role);
        localStorage.setItem('token', newToken);
    };

    return (
        <Router>
            <div>
                <Navbar token={token} onLogout={handleLogout} />
                <Routes>
                    {/* Redirect to Dashboard if already authenticated */}
                    <Route path="/login" element={!token ? <Login setToken={handleToken} /> : <Navigate to="/" />} />
                    <Route path="/register" element={!token ? <RegistrationForm /> : <Navigate to="/" />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={token ? <Dashboard token={token} userRole={userRole} /> : <Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;