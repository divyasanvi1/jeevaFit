// src/redux/healthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios';

export const fetchHealthData = createAsyncThunk('health/fetch', async () => {
  const res = await axios.get('/health/user-data', {
    withCredentials: true
  });
  console.log('fetchHealthData response:', res.data);
  return res.data; // assuming res.data contains the health data directly
});

const healthSlice = createSlice({
  name: 'health',
  initialState: { data: [], status: 'idle', error: null },
  reducers: {
    addNewHealthData: (state, action) => {
      state.data = [action.payload, ...state.data];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHealthData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHealthData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.data; // updated this line to directly set the data
      })
      .addCase(fetchHealthData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});
export const { addNewHealthData } = healthSlice.actions
export default healthSlice.reducer;
