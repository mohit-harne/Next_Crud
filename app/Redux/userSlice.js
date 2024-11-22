import { createSlice } from '@reduxjs/toolkit';
import { fetchUserList, deleteUser, updateUser, addUser } from './userThunks';

const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        loading: false,
        error: null,
        uploadProgress: 0, // New state to track upload progress
    },
    reducers: {
        resetState: (state) => {
            state.users = [];
            state.loading = false;
            state.error = null;
            state.uploadProgress = 0; // Reset progress
        },
        setUploadProgress: (state, action) => {
            state.uploadProgress = action.payload; // Action to update progress
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch user list
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
                const updatedUser = action.payload;
                const index = state.users.findIndex((user) => user._id === updatedUser._id);
                if (index !== -1) {
                    state.users[index] = updatedUser;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Add user (handling upload progress)
            .addCase(addUser.fulfilled, (state, action) => {
                state.users.push(action.payload); // Add the new user to the list
                state.uploadProgress = 0; // Reset progress after upload is complete
            })
            .addCase(addUser.rejected, (state, action) => {
                state.error = action.payload;
                state.uploadProgress = 0; // Reset progress on error
            });
    },
});

export const { resetState, setUploadProgress } = userSlice.actions;

export const selectUserList = (state) => state.users.users;
export const selectLoadingStatus = (state) => state.users.loading;
export const selectErrorMessage = (state) => state.users.error;
export const selectUploadProgress = (state) => state.users.uploadProgress; // Select progress

// Export actions and thunks
export { fetchUserList, updateUser, addUser };

export default userSlice.reducer;
