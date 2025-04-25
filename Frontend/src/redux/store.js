// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import healthReducer from './healthSlice';
import userReducer from './userSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    health: healthReducer,
    user: userReducer
  },
});
