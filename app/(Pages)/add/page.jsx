'use client'
// AddUser.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { addUser } from '../../Redux/userThunks'; // Adjust path based on your project structure
import { toast } from 'react-toastify';

const AddUser = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    // Form state
    const [formData, setFormData] = useState({
        first_name: '',
        email: '',
        role: '',
        status: '',
        phone: '',
        image: null,
    });

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === 'file' ? files[0] : value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure email is not undefined or empty
        if (!formData.email) {
            toast.error('Email is required!');
            return;
        }

        try {
            await dispatch(addUser(formData)).unwrap();
            toast.success('User added successfully!');
            router.push('/users');
        } catch (error) {
            toast.error('Error adding user');
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">Add User</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="first_name">
                        First Name
                    </label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="role">
                        Role
                    </label>
                    <input
                        type="text"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="status">
                        Status
                    </label>
                    <input
                        type="text"
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="phone">
                        Phone
                    </label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="image">
                        Image
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleInputChange}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Add User
                </button>
            </form>
        </div>
    );
};

export default AddUser;
