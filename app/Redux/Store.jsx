import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Reducer';

const store = configureStore({
  reducer: {
    users: userReducer
  }
});

export default store;
