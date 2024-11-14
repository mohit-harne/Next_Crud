// Redux/userThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch the list of users
export const fetchUserList = createAsyncThunk('users/fetchUserList', async () => {
    const response = await axios.get('/api/users'); // Fetching from the correct endpoint
    console.log('Fetched users:', response.data); // Debugging
    return response.data;
});

// Async thunk to delete a user
export const deleteUser = createAsyncThunk('users/deleteUser', async (userId) => {
    await axios.delete(`/api/users/${userId}`);
    console.log('Deleted user:', userId); // Debugging  
    return userId;
});

// Async thunk to update a user
export const updateUser = createAsyncThunk('users/updateUser', async (userData) => {
    const { id, ...data } = userData;
    const response = await axios.put(`/api/users/${id}`, data);
    return response.data;
});

// Async thunk to add a user with image upload progress tracking
export const addUser = createAsyncThunk(
    'users/addUser',
    async (userData, { rejectWithValue, dispatch }) => {
        try {
            const { first_name, email, role, status, phone, image } = userData;

            // Log userData to check email value
            console.log('Adding user with data:', userData);

            // Prepare form data
            const formData = new FormData();
            formData.append('first_name', first_name);
            formData.append('email', email);
            formData.append('role', role);
            formData.append('status', status);
            formData.append('phone', phone);
            if (image) {
                formData.append('image', image); // Append image file
            }

            // Axios request config to handle upload progress
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the correct content type
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    // Dispatch an action or update state for progress
                    dispatch(setUploadProgress(percentCompleted));
                },
            };

            // Send request to add user
            const response = await axios.post('/api/users', formData, config);
            return response.data;
        } catch (error) {
            // Handle error properly, logging and passing the error data
            console.error('Error adding user:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Action to store upload progress
export const setUploadProgress = (progress) => ({
    type: 'users/setUploadProgress',
    payload: progress,
});
