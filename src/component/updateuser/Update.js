import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Update({ handleClose, select, userId, fetchUsers , setOpenEditUser}) {

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const [formData, setFormData] = useState({
        name: select.name,
        email: select.email,
        password: select.password,
    });
    const [errors, setErrors] = useState({ name: '', email: '', password: '' });

    const validate = () => {
        let isValid = true;
        const newErrors = { name: '', email: '', password: '' };

        if (!formData.name) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const handleSave = async () => {
        if (!validate()) return;

        try {
            const response = await fetch(`http://localhost:5000/api/user/update/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            const updatedUser = await response.json();
            toast.success('User updated successfully!', {
                style: {
                  backgroundColor: "#008000",
                  color: "white",
                  height: "50px",
                },
              });
            // handleClose();
            setOpenEditUser(false)
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update user. Please try again.');
            console.error('Error updating user:', error);
        }
    };

    return (
        <div>
            {/* <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                 className="custom-toast-container"
            /> */}
            <div className='order-sidebar main-padding'>
                <div className='d-flex'>
                    <div>
                        <b className='font16'>Update User Information</b>
                        <p className='font14'>Update user information to keep records current.</p>
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
                    name='name'
                    placeholder='Enter your name'
                    value={formData.name}
                    onChange={handleInputChange}
                />
                {errors.name && <p className='error-message'>{errors.name}</p>}

                <label className='mt-3 font14'>Email</label>
                <span className='font14 text-danger'>*</span>
                <input
                    className={`set-input ${errors.email ? 'input-error' : ''}`}
                    type='text'
                    name='email'
                    placeholder='Enter your email'
                    value={formData.email}
                    onChange={handleInputChange}
                />
                {errors.email && <p className='error-message'>{errors.email}</p>}

                <label className='mt-3 font14'>Password</label>
                <span className='font14 text-danger'>*</span>
                <input
                    className={`set-input ${errors.password ? 'input-error' : ''}`}
                    type={isPasswordVisible ? 'text' : 'password'}
                    name='password'
                    placeholder='Enter your password'
                    value={formData.password}
                    onChange={handleInputChange}
                />
                <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                    {isPasswordVisible ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                </span>
                {errors.password && <p className='error-message'>{errors.password}</p>}

                <div className='set-btnfooter'>
                    <button className='mt-4 add-btn' onClick={handleSave}>Save</button>
                    <button onClick={handleClose} className='mt-4 ml-3 add-btn'>Cancel</button>
                </div>
            </div>
        </div>
    );
}
