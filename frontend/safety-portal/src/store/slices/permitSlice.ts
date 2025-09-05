import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface PermitState {
  permits: any[];
  currentPermit: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: PermitState = {
  permits: [],
  currentPermit: null,
  loading: false,
  error: null,
};

// Mock async thunks for now
export const fetchPermits = createAsyncThunk(
  'permits/fetchAll',
  async () => {
    // Mock API call
    return [];
  }
);

const permitSlice = createSlice({
  name: 'permits',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermits.fulfilled, (state, action) => {
        state.loading = false;
        state.permits = action.payload;
      })
      .addCase(fetchPermits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch permits';
      });
  },
});

export const { clearError } = permitSlice.actions;
export default permitSlice.reducer;