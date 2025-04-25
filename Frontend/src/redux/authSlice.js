// src/redux/authSlice.js

import { createSlice } from '@reduxjs/toolkit';

// Try to load user data from localStorage
const persistedUser = localStorage.getItem('user');
const persistedToken = localStorage.getItem('token');

const initialState = {
  user: persistedUser ? JSON.parse(persistedUser) : null,  // Retrieve user from localStorage if available
  token: persistedToken || null,  // Retrieve token from localStorage if available
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      // Save user and token to localStorage
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);

      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      // Clear user and token from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      state.user = null;
      state.token = null;
    },
    updateUserData: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    }
    
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
