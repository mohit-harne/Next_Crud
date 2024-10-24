import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Get API base URL from environment variables (use in production)
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// Thunks for asynchronous actions

// Fetch user list
export const fetchUserList = createAsyncThunk(
  'users/fetchUserList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/users`);
      console.log('Fetched user list:', response.data); // Log the fetched data
      return response.data;
    } catch (error) {
      console.error("Error fetching user list:", error);  // Log error to console
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Add user
export const addUser = createAsyncThunk(
  'users/addUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/api/users`, userData);
      toast.success("User Added Successfully");
      return response.data;
    } catch (error) {
      console.error('Error adding user:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Update user
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, ...userData }, { rejectWithValue }) => {
    try {
      await axios.put(`${apiBaseUrl}/api/users/${id}`, userData);
      toast.success("User Updated Successfully");
      return id; // Return the ID of the updated user
    } catch (error) {
      toast.error(`Update failed: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

// Delete user without browser confirm
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (_id, { rejectWithValue, dispatch }) => {
    try {
      // Directly proceed with delete request
      await axios.delete(`${apiBaseUrl}/api/users?id=${_id}`);
      dispatch(fetchUserList()); // Refetch user list after deletion
      return _id; // Return the deleted user ID
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Fetch user by ID
export const fetchUserObj = createAsyncThunk(
  'users/fetchUserObj',
  async (_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/users?id=${_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// User slice
const dataSlice = createSlice({
  name: 'users',
  initialState: {
    userList: [],
    userObj: null,
    loading: false,
    errorMessage: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch user list
      .addCase(fetchUserList.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = action.payload;
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })
      // Add user
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userList.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = state.userList.map(user =>
          user.id === action.payload ? { ...user, ...action.meta.arg } : user // Update the correct user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = state.userList.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })
      // Fetch user by ID
      .addCase(fetchUserObj.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
      })
      .addCase(fetchUserObj.fulfilled, (state, action) => {
        state.loading = false;
        state.userObj = action.payload;
      })
      .addCase(fetchUserObj.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      });
  }
});

// Selectors to get the state data
export const selectUserList = (state) => state.users.userList;
export const selectUserObj = (state) => state.users.userObj;
export const selectLoadingStatus = (state) => state.users.loading;
export const selectErrorMessage = (state) => state.users.errorMessage;

export default dataSlice.reducer;
