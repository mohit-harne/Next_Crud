import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUserList = createAsyncThunk(
    'users/fetchUserList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/users');
            console.log('Fetched users:', response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching users:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (userId, { rejectWithValue }) => {
        try {
            await axios.delete(`/api/users/${userId}`);
            return userId;
        } catch (error) {
            console.error("Error deleting user:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async (userData, { rejectWithValue }) => {
        try {
            const { id, ...data } = userData;
            const response = await axios.put(`/api/users/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating user:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addUser = createAsyncThunk(
    'users/addUser',
    async (formData) => {
        try {
            const userData = {};
            formData.forEach((value, key) => {
                if (key !== 'file') {
                    userData[key] = value;
                }
            });

            // Handle file if present
            const file = formData.get('file');
            if (file) {
                const base64String = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result);
                    };
                    reader.readAsDataURL(file);
                });
                
                userData.image = base64String;
            }

            const userResponse = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!userResponse.ok) {
                const errorData = await userResponse.json();
                throw new Error(errorData.error || 'Failed to create user');
            }

            return await userResponse.json();
        } catch (error) {
            console.error('Error in addUser thunk:', error);
            throw error;
        }
    }
);

export const setUploadProgress = (progress) => ({
    type: 'users/setUploadProgress',
    payload: progress,
});