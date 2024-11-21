import { createAsyncThunk } from '@reduxjs/toolkit';
import { setUploadProgress } from './userSlice';

// Fetch all users
export const fetchUserList = createAsyncThunk(
    'users/fetchUserList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/users');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch users');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error in fetchUserList thunk:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Add new user
export const addUser = createAsyncThunk(
    'users/addUser',
    async (userData, { dispatch, rejectWithValue }) => {
        try {
            dispatch(setUploadProgress(0));
            
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add user');
            }

            dispatch(setUploadProgress(100));
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error in addUser thunk:', error);
            dispatch(setUploadProgress(0));
            return rejectWithValue(error.message);
        }
    }
);

// Update existing user
export const updateUser = createAsyncThunk(
    'users/updateUser',
    async (userData, { dispatch, rejectWithValue }) => {
        try {
            dispatch(setUploadProgress(0));
            
            const response = await fetch(`/api/users/${userData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update user');
            }

            dispatch(setUploadProgress(100));
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error in updateUser thunk:', error);
            dispatch(setUploadProgress(0));
            return rejectWithValue(error.message);
        }
    }
);

// Delete user
export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete user');
            }

            return userId; // Return the ID of the deleted user
        } catch (error) {
            console.error('Error in deleteUser thunk:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Bulk delete users
export const bulkDeleteUsers = createAsyncThunk(
    'users/bulkDeleteUsers',
    async (userIds, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/users/bulk-delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userIds })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete users');
            }

            return userIds; // Return the IDs of the deleted users
        } catch (error) {
            console.error('Error in bulkDeleteUsers thunk:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Upload image
export const uploadImage = createAsyncThunk(
    'users/uploadImage',
    async (file, { dispatch, rejectWithValue }) => {
        try {
            dispatch(setUploadProgress(0));

            // Create FormData
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload image');
            }

            dispatch(setUploadProgress(100));
            const data = await response.json();
            return data.imageUrl;
        } catch (error) {
            console.error('Error in uploadImage thunk:', error);
            dispatch(setUploadProgress(0));
            return rejectWithValue(error.message);
        }
    }
);