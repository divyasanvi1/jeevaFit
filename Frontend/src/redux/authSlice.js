// src/redux/authSlice.js

import { createSlice } from '@reduxjs/toolkit';

// Try to load user data from localStorage
// Safe user parsing from localStorage
let persistedUser = null;
let persistedToken = null;

try {
  const userData = localStorage.getItem('user');
  const tokenData = localStorage.getItem('token');

  persistedUser = userData && userData !== "undefined" ? JSON.parse(userData) : null;
  persistedToken = tokenData && tokenData !== "undefined" ? tokenData : null;
} catch (error) {
  console.error("Failed to parse user/token from localStorage:", error);
  persistedUser = null;
  persistedToken = null;
}

const initialState = {
  user: persistedUser,
  token: persistedToken,
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
