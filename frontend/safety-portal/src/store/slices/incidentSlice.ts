// src/store/slices/incidentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';     // NOT '../../utils/axios'
import { ApiResponse, PaginatedResponse, /* other types */ } from '../types';
  
export const fetchIncidents = createAsyncThunk(
  'incident/fetchAll',
  async () => {
    const response = await api.get('/incidents');
    return response.data;
  }
);

const incidentSlice = createSlice({
  name: 'incident',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidents.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default incidentSlice.reducer;
