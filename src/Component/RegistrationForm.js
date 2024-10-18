import React, { useState, useEffect } from 'react';
import './RegistrationForm.css'; // Import the CSS file

const RegistrationForm = ({ onRegistrationSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        nationality_number: '',
        branch_name: '', // Only for student and branch_ceo
        phone_number: '',
        role: 'student', // Default role
        secret_password: '', // CEO secret password
        branch_ceo_secret: '', // Branch CEO secret password
    });

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Loading state

    // Clear fields that are not necessary for the selected role
    useEffect(() => {
        if (formData.role !== 'branch_ceo') {
            setFormData(prevState => ({
                ...prevState,
                branch_name: ''
            }));
        }
        if (formData.role !== 'ceo') {
            setFormData(prevState => ({
                ...prevState,
                secret_password: ''
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
        setLoading(true); // Set loading state

        // Prepare data for submission based on role
        const submissionData = { ...formData };

        // Remove unnecessary fields based on role
        if (formData.role === 'ceo') {
            delete submissionData.branch_name;
            delete submissionData.branch_ceo_secret; // Not needed for CEO
        } else if (formData.role === 'branch_ceo') {
            delete submissionData.secret_password; // Not needed for Branch CEO
        } else if (formData.role === 'student') {
            delete submissionData.secret_password; // Not needed for Student
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
            onRegistrationSuccess(); // Notify parent to redirect the user on success
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false); // Reset loading state
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
                        <option value="branch_ceo">Branch CEO</option> 
                    </select>
                </div>

                {formData.role === 'student' && (
                    <div className="input-group">
                        <label className="input-label">Branch Name:</label>
                        <input 
                            type="text" 
                            name="branch_name" 
                            value={formData.branch_name} 
                            onChange={handleChange} 
                            className="input-field"
                            required
                        />
                    </div>
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

                {formData.role === 'branch_ceo' && (
                    <>
                        <div className="input-group">
                            <label className="input-label">Branch CEO Secret Password:</label>
                            <input 
                                type="password" 
                                name="branch_ceo_secret" 
                                value={formData.branch_ceo_secret} 
                                onChange={handleChange} 
                                className="input-field"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Branch Name:</label>
                            <input 
                                type="text" 
                                name="branch_name" 
                                value={formData.branch_name} 
                                onChange={handleChange} 
                                className="input-field"
                                required
                            />
                        </div>
                    </>
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

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default RegistrationForm;
