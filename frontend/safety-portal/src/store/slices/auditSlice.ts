import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface AuditState {
  audits: any[];
  currentAudit: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuditState = {
  audits: [],
  currentAudit: null,
  loading: false,
  error: null,
};

// Mock async thunks for now
export const fetchAudits = createAsyncThunk(
  'audits/fetchAll',
  async () => {
    // Mock API call
    return [];
  }
);

const auditSlice = createSlice({
  name: 'audits',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAudits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAudits.fulfilled, (state, action) => {
        state.loading = false;
        state.audits = action.payload;
      })
      .addCase(fetchAudits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch audits';
      });
  },
});

export const { clearError } = auditSlice.actions;
export default auditSlice.reducer;