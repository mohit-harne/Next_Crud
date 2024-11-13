// Redux/userThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch user list
export const fetchUserList = createAsyncThunk('users/fetchUserList', async () => {
    const response = await axios.get('/api/users');
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
