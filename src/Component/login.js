import React, { useState } from 'react';
import './Login.css'; // Import the CSS file

const Login = ({ setToken, setUserRole }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            setMessage('Please fill in both fields.');
            return;
        }
        
        setLoading(true);

        try {
            const response = await fetch('https://lifestyle.boogiecoin.com/login', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Set the token and role from response
            setToken(data.access_token);
            setUserRole(data.role);
            setMessage('Login successful');
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                    <label className="input-label">Email:</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        className="input-field" 
                        required
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Password:</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        className="input-field" 
                        required
                    />
                </div>
                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default Login;
