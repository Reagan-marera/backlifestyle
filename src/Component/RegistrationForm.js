import React, { useState, useEffect } from 'react';
import './RegistrationForm.css'; // Import the CSS file

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        nationality_number: '',
        date_of_birth: '',
        branch: '',  // Added branch field
        total_fees: '',
        phone_number: '',
        role: 'student',
        secret_password: '', // New field for secret password
    });

    const [message, setMessage] = useState('');

    // Effect to reset form fields when role changes
    useEffect(() => {
        if (formData.role === 'ceo') {
            setFormData(prevState => ({
                ...prevState,
                branch: '',
                total_fees: '',
                secret_password: '',
            }));
        }
    }, [formData.role]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if role is 'ceo' and secret password is correct
        if (formData.role === 'ceo' && formData.secret_password !== 'SKYNETCEO') {
            setMessage('Invalid secret password for CEO registration.');
            return;
        }

        // Remove fields that are not relevant to the selected role
        const submissionData = { ...formData };
        if (formData.role === 'ceo') {
            delete submissionData.branch;
            delete submissionData.total_fees;
            delete submissionData.secret_password;
        }

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error registering');
            }

            setMessage(data.message);
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="registration-container">
            <h2 className="registration-title">Register</h2>
            <form onSubmit={handleSubmit} className="registration-form">
                <div className="input-group">
                    <label className="input-label">Role:</label>
                    <select 
                        name="role" 
                        value={formData.role} 
                        onChange={handleChange} 
                        className="input-field"
                        required
                    >
                        <option value="student">Student</option>
                        <option value="ceo">CEO</option>
                    </select>
                </div>
                {formData.role === 'student' && (
                    <>
                        <div className="input-group">
                            <label className="input-label">Branch:</label>
                            <input 
                                type="text" 
                                name="branch" 
                                value={formData.branch} 
                                onChange={handleChange} 
                                className="input-field"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Total Fees:</label>
                            <input 
                                type="number" 
                                name="total_fees" 
                                value={formData.total_fees} 
                                onChange={handleChange} 
                                className="input-field"
                                required
                            />
                        </div>
                    </>
                )}
                <div className="input-group">
                    <label className="input-label">Name:</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        className="input-field"
                        required
                    />
                </div>
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
                <div className="input-group">
                    <label className="input-label">Nationality Number:</label>
                    <input 
                        type="text" 
                        name="nationality_number" 
                        value={formData.nationality_number} 
                        onChange={handleChange} 
                        className="input-field"
                        required
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Date of Birth:</label>
                    <input 
                        type="date" 
                        name="date_of_birth" 
                        value={formData.date_of_birth} 
                        onChange={handleChange} 
                        className="input-field"
                        required
                    />
                </div>
                {formData.role === 'ceo' && (
                    <div className="input-group">
                        <label className="input-label">Secret Password:</label>
                        <input 
                            type="password" 
                            name="secret_password" 
                            value={formData.secret_password} 
                            onChange={handleChange} 
                            className="input-field"
                            required
                        />
                    </div>
                )}
                <div className="input-group">
                    <label className="input-label">Phone Number:</label>
                    <input 
                        type="tel" 
                        name="phone_number" 
                        value={formData.phone_number} 
                        onChange={handleChange} 
                        className="input-field"
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Register</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default RegistrationForm;
