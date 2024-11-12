// Redux/Reducer.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
    const { id, ...data } = userData;  // Separate the ID from the rest of the data
    const response = await axios.put(`/api/users/${id}`, data); // Make PUT request
    return response.data;
});

const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {
        resetState: (state) => {
            state.users = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch user list
        builder
            .addCase(fetchUserList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserList.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUserList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Delete user
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter((user) => user._id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update user
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                // Update the user in the state
                const updatedUser = action.payload;
                const index = state.users.findIndex((user) => user._id === updatedUser._id);
                if (index !== -1) {
                    state.users[index] = updatedUser;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { resetState } = userSlice.actions;

export const selectUserList = (state) => state.users.users;
export const selectLoadingStatus = (state) => state.users.loading;
export const selectErrorMessage = (state) => state.users.error;

export default userSlice.reducer;
