import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignIn() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = 'Name is required';
        if (!email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
        if (!password.trim()) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters long';
        return newErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/user/signin', {
                name,
                email,
                password
            });

            const { token } = response.data;
            localStorage.setItem('token', token);

            navigate('/user');
        } catch (err) {
            setError('Failed to sign in .');
        }
    };

    return (
        <div className='main-back'>
            <div className="signup-container">
                <h1 className="signup-title">Sign In</h1>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className={`form-input ${errors.name ? 'error' : ''}`}
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setErrors((prevErrors) => ({ ...prevErrors, name: '' }));
                            }}
                        />
                        {errors.name && <p className="error-message">{errors.name}</p>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
                            }}
                        />
                        {errors.email && <p className="error-message">{errors.email}</p>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className={`form-input ${errors.password ? 'error' : ''}`}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
                            }}
                        />
                        {errors.password && <p className="error-message">{errors.password}</p>}
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="signup-button">Sign In</button>
                </form>
            </div>
        </div>

    );
}

export default SignIn;
