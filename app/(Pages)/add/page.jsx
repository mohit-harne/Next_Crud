'use client';
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
        dob: '',
        address: '',
        gender: '',
        blood_group: '',
        languages_known: '',
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

        // Ensure required fields are filled
        if (!formData.email || !formData.first_name) {
            toast.error('First name and email are required!');
            return;
        }

        const formDataToSend = new FormData();
        
        // Append all form data fields to the FormData object
        Object.keys(formData).forEach(key => {
            if (key === 'image' && formData[key]) {
                // Append file with 'file' as the field name to match the backend
                formDataToSend.append('file', formData[key]);
            } else if (formData[key]) {
                // Only append non-null values
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            // Send the data to the server with the image as part of the FormData
            await dispatch(addUser(formDataToSend)).unwrap();
            toast.success('User added successfully!');
            router.push('/users');
        } catch (error) {
            console.error('Error adding user:', error);
            toast.error('Error adding user');
        }
    };

    // Handle file input change separately
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));
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
                        required
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
                        required
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
                    <label className="block text-gray-700" htmlFor="dob">
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="address">
                        Address
                    </label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="border rounded p-2 w-full"
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="gender">
                        Gender
                    </label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="border rounded p-2 w-full"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="blood_group">
                        Blood Group
                    </label>
                    <input
                        type="text"
                        id="blood_group"
                        name="blood_group"
                        value={formData.blood_group}
                        onChange={handleInputChange}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="languages_known">
                        Languages Known (comma-separated)
                    </label>
                    <input
                        type="text"
                        id="languages_known"
                        name="languages_known"
                        value={formData.languages_known}
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
                    <label className="block text-gray-700" htmlFor="image">
                        Image
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleFileChange}
                        accept="image/*"
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
