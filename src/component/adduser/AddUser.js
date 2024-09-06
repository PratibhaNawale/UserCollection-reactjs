import React, { useState } from 'react';
import "./AddUser.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddUser({ handleClose, fetchUsers, setOpenAddUser }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ name: '', email: '', password: '' });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const validate = () => {
        let isValid = true;
        const newErrors = { name: '', email: '', password: '' };

        if (!name) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
            isValid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSave = async () => {
        if (!validate()) return;

        const userData = { name, email, password };

        try {
            const response = await fetch('http://localhost:5000/api/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                setOpenAddUser(false)
                toast.success("User created successfully!", {
                    style: {
                        backgroundColor: "#008000",
                        color: "white",
                        height: "50px",
                    },
                });
                fetchUsers();
            } else {
                toast.error('Failed to create user.');
                console.error('Failed to create user');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    };

    const handleCancel = () => {
        setName('');
        setEmail('');
        setPassword('');
        setErrors({ name: '', email: '', password: '' });
    };

    const handleInputChange = (e, field) => {
        const { value } = e.target;
        switch (field) {
            case 'name':
                setName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            default:
                break;
        }
        setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <div className=''>
            <div className='order-sidebar main-padding'>
                <div className='d-flex'>
                    <div>
                        <b className='font16'>Add a New User</b>
                        <p className='font14'>Fill in the Information to Add a New User</p>
                    </div>
                    <div>
                        <i className="fa-solid fa-circle-xmark cursor" onClick={handleClose}></i>
                    </div>
                </div>

                <hr />
                <label className='font14'>Name</label>
                <span className='font14 text-danger'>*</span>
                <input
                    className={`set-input ${errors.name ? 'input-error' : ''}`}
                    type='text'
                    placeholder='Enter your name'
                    value={name}
                    onChange={(e) => handleInputChange(e, 'name')}
                />
                {errors.name && <p className='error-message'>{errors.name}</p>}

                <label className='mt-3 font14'>Email</label>
                <span className='font14 text-danger'>*</span>
                <input
                    className={`set-input ${errors.email ? 'input-error' : ''}`}
                    type='text'
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => handleInputChange(e, 'email')}
                />
                {errors.email && <p className='error-message'>{errors.email}</p>}

                <label className='mt-3 font14'>Password</label>
                <span className='font14 text-danger'>*</span>
                <input
                    className={`set-input ${errors.password ? 'input-error' : ''}`}
                    type={isPasswordVisible ? 'text' : 'password'}
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => handleInputChange(e, 'password')}
                />
                <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                    {isPasswordVisible ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                </span>
                {errors.password && <p className='error-message'>{errors.password}</p>}

                <div className='set-btnfooter'>
                    <button onClick={handleSave} className='mt-3 add-btn'>Save</button>
                    <button onClick={handleCancel} className='ml-2 add-btn'>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default AddUser;
