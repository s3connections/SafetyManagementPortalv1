import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Permit, PermitStatus, PermitType, ApiResponse, PaginatedResponse } from '../types';
import { ApiResponse, PaginatedResponse, /* other types */ } from '../types';

// Permit state interface
interface PermitState {
  permits: Permit[];
  currentPermit: Permit | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

// Initial state
const initialState: PermitState = {
  permits: [],
  currentPermit: null,
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 10
};

// Async thunks
export const fetchPermits = createAsyncThunk(
  'permits/fetchPermits',
  async (params: { page?: number; pageSize?: number; search?: string; status?: PermitStatus }) => {
    // This would be replaced with actual API call
    const response = await fetch('/api/permits?' + new URLSearchParams({
      page: String(params.page || 1),
      pageSize: String(params.pageSize || 10),
      ...(params.search && { search: params.search }),
      ...(params.status && { status: params.status })
    }));
    
    if (!response.ok) {
      throw new Error('Failed to fetch permits');
    }
    
    return response.json() as Promise<PaginatedResponse<Permit>>;
  }
);

export const fetchPermitById = createAsyncThunk(
  'permits/fetchPermitById',
  async (id: number) => {
    const response = await fetch(`/api/permits/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch permit');
    }
    
    const result = await response.json() as ApiResponse<Permit>;
    return result.data;
  }
);

export const createPermit = createAsyncThunk(
  'permits/createPermit',
  async (permitData: Partial<Permit>) => {
    const response = await fetch('/api/permits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(permitData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create permit');
    }
    
    const result = await response.json() as ApiResponse<Permit>;
    return result.data;
  }
);

export const updatePermit = createAsyncThunk(
  'permits/updatePermit',
  async ({ id, data }: { id: number; data: Partial<Permit> }) => {
    const response = await fetch(`/api/permits/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update permit');
    }
    
    const result = await response.json() as ApiResponse<Permit>;
    return result.data;
  }
);

export const deletePermit = createAsyncThunk(
  'permits/deletePermit',
  async (id: number) => {
    const response = await fetch(`/api/permits/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete permit');
    }
    
    return id;
  }
);

export const approvePermit = createAsyncThunk(
  'permits/approvePermit',
  async ({ id, remarks }: { id: number; remarks?: string }) => {
    const response = await fetch(`/api/permits/${id}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ remarks })
    });
    
    if (!response.ok) {
      throw new Error('Failed to approve permit');
    }
    
    const result = await response.json() as ApiResponse<Permit>;
    return result.data;
  }
);

// Permit slice
const permitSlice = createSlice({
  name: 'permits',
  initialState,
  reducers: {
    setCurrentPermit: (state, action: PayloadAction<Permit | null>) => {
      state.currentPermit = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    resetPermitState: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch permits
      .addCase(fetchPermits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermits.fulfilled, (state, action) => {
        state.loading = false;
        state.permits = action.payload.data;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.currentPage;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchPermits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch permits';
      })
      
      // Fetch permit by ID
      .addCase(fetchPermitById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermitById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPermit = action.payload;
      })
      .addCase(fetchPermitById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch permit';
      })
      
      // Create permit
      .addCase(createPermit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPermit.fulfilled, (state, action) => {
        state.loading = false;
        state.permits.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createPermit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create permit';
      })
      
      // Update permit
      .addCase(updatePermit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePermit.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.permits.findIndex(permit => permit.id === action.payload.id);
        if (index !== -1) {
          state.permits[index] = action.payload;
        }
        if (state.currentPermit?.id === action.payload.id) {
          state.currentPermit = action.payload;
        }
      })
      .addCase(updatePermit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update permit';
      })
      
      // Delete permit
      .addCase(deletePermit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePermit.fulfilled, (state, action) => {
        state.loading = false;
        state.permits = state.permits.filter(permit => permit.id !== action.payload);
        state.totalCount -= 1;
        if (state.currentPermit?.id === action.payload) {
          state.currentPermit = null;
        }
      })
      .addCase(deletePermit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete permit';
      })
      
      // Approve permit
      .addCase(approvePermit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approvePermit.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.permits.findIndex(permit => permit.id === action.payload.id);
        if (index !== -1) {
          state.permits[index] = action.payload;
        }
        if (state.currentPermit?.id === action.payload.id) {
          state.currentPermit = action.payload;
        }
      })
      .addCase(approvePermit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to approve permit';
      });
  }
});

// Export actions
export const {
  setCurrentPermit,
  clearError,
  setPage,
  setPageSize,
  resetPermitState
} = permitSlice.actions;

// Export reducer
export default permitSlice.reducer;

// Selectors
export const selectPermits = (state: { permits: PermitState }) => state.permits.permits;
export const selectCurrentPermit = (state: { permits: PermitState }) => state.permits.currentPermit;
export const selectPermitLoading = (state: { permits: PermitState }) => state.permits.loading;
export const selectPermitError = (state: { permits: PermitState }) => state.permits.error;
export const selectPermitTotalCount = (state: { permits: PermitState }) => state.permits.totalCount;
export const selectPermitCurrentPage = (state: { permits: PermitState }) => state.permits.currentPage;
export const selectPermitPageSize = (state: { permits: PermitState }) => state.permits.pageSize;