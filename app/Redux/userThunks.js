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
                body: JSON.stringify(userData),
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
                body: JSON.stringify(userData),
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

// Delete user (individual or bulk)
export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (userIds, { rejectWithValue }) => {
        try {
            const isBulk = Array.isArray(userIds); // Check if it's a bulk delete

            const response = await fetch(`/api/users/${isBulk ? 'bulk-delete' : userIds}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: isBulk ? JSON.stringify({ ids: userIds }) : null, // Send user IDs in the body if it's a bulk delete
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete user(s)');
            }

            return isBulk ? userIds : userIds; // Return user IDs for single or bulk deletion
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
            const response = await fetch(`/api/users/bulk-delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: userIds }), // Send the IDs in the request body
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
            dispatch(setUploadProgress(0)); // Reset progress to 0

            return await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                const formData = new FormData();
                formData.append('image', file);

                xhr.open('POST', '/api/upload');

                // Monitor upload progress
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const progress = Math.round((event.loaded * 100) / event.total);
                        dispatch(setUploadProgress(progress)); // Dispatch progress updates
                    }
                };

                xhr.onload = () => {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        dispatch(setUploadProgress(100)); // Ensure 100% progress
                        resolve(response.imageUrl); // Return the image URL
                    } else {
                        reject(new Error(`Upload failed: ${xhr.statusText}`));
                    }
                };

                xhr.onerror = () => {
                    dispatch(setUploadProgress(0)); // Reset progress on error
                    reject(new Error('Network error occurred during upload.'));
                };

                xhr.send(formData);
            });
        } catch (error) {
            console.error('Error in uploadImage thunk:', error);
            return rejectWithValue(error.message);
        }
    }
);
