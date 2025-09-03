import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ApiResponse, Audit, AuditStatus, AuditType } from '../types';

// Audit state interface
interface AuditState {
  audits: Audit[];
  currentAudit: Audit | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: AuditStatus;
    type?: AuditType;
    plantId?: number;
    departmentId?: number;
    auditorId?: number;
    dateFrom?: string;
    dateTo?: string;
  };
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

// Initial state
const initialState: AuditState = {
  audits: [],
  currentAudit: null,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  },
};

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7001/api';

// Async thunks
export const fetchAudits = createAsyncThunk(
  'audit/fetchAudits',
  async (params?: { page?: number; pageSize?: number; filters?: any }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    
    // Add filters
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/audits?${queryParams}`);
    const data: ApiResponse<{ audits: Audit[]; pagination: any }> = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch audits');
    }
    
    return data.data;
  }
);

export const fetchAuditById = createAsyncThunk(
  'audit/fetchAuditById',
  async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/audits/${id}`);
    const data: ApiResponse<Audit> = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch audit');
    }
    
    return data.data;
  }
);

export const createAudit = createAsyncThunk(
  'audit/createAudit',
  async (auditData: Partial<Audit>) => {
    const response = await fetch(`${API_BASE_URL}/audits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(auditData),
    });
    
    const data: ApiResponse<Audit> = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to create audit');
    }
    
    return data.data;
  }
);

export const updateAudit = createAsyncThunk(
  'audit/updateAudit',
  async ({ id, auditData }: { id: number; auditData: Partial<Audit> }) => {
    const response = await fetch(`${API_BASE_URL}/audits/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(auditData),
    });
    
    const data: ApiResponse<Audit> = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to update audit');
    }
    
    return data.data;
  }
);

export const deleteAudit = createAsyncThunk(
  'audit/deleteAudit',
  async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/audits/${id}`, {
      method: 'DELETE',
    });
    
    const data: ApiResponse<boolean> = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to delete audit');
    }
    
    return id;
  }
);

export const startAudit = createAsyncThunk(
  'audit/startAudit',
  async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/audits/${id}/start`, {
      method: 'POST',
    });
    
    const data: ApiResponse<Audit> = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to start audit');
    }
    
    return data.data;
  }
);

export const completeAudit = createAsyncThunk(
  'audit/completeAudit',
  async ({ id, score, remarks }: { id: number; score?: number; remarks?: string }) => {
    const response = await fetch(`${API_BASE_URL}/audits/${id}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ score, remarks }),
    });
    
    const data: ApiResponse<Audit> = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to complete audit');
    }
    
    return data.data;
  }
);

export const fetchAuditsByStatus = createAsyncThunk(
  'audit/fetchAuditsByStatus',
  async (status: AuditStatus) => {
    const response = await fetch(`${API_BASE_URL}/audits/status/${status}`);
    const data: ApiResponse<Audit[]> = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch audits by status');
    }
    
    return data.data;
  }
);

export const fetchAuditsByAuditor = createAsyncThunk(
  'audit/fetchAuditsByAuditor',
  async (auditorId: number) => {
    const response = await fetch(`${API_BASE_URL}/audits/auditor/${auditorId}`);
    const data: ApiResponse<Audit[]> = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch audits by auditor');
    }
    
    return data.data;
  }
);

export const fetchOverdueAudits = createAsyncThunk(
  'audit/fetchOverdueAudits',
  async () => {
    const response = await fetch(`${API_BASE_URL}/audits/overdue`);
    const data: ApiResponse<Audit[]> = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch overdue audits');
    }
    
    return data.data;
  }
);

// Audit slice
const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentAudit: (state, action: PayloadAction<Audit | null>) => {
      state.currentAudit = action.payload;
    },
    setFilters: (state, action: PayloadAction<AuditState['filters']>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setPagination: (state, action: PayloadAction<Partial<AuditState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetAuditState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch audits
      .addCase(fetchAudits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAudits.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.audits = action.payload.audits || [];
          state.pagination = action.payload.pagination || state.pagination;
        }
      })
      .addCase(fetchAudits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch audits';
      })
      
      // Fetch audit by ID
      .addCase(fetchAuditById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.currentAudit = action.payload;
        }
      })
      .addCase(fetchAuditById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch audit';
      })
      
      // Create audit
      .addCase(createAudit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAudit.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.audits.unshift(action.payload);
          state.currentAudit = action.payload;
        }
      })
      .addCase(createAudit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create audit';
      })
      
      // Update audit
      .addCase(updateAudit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAudit.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.audits.findIndex(audit => audit.id === action.payload!.id);
          if (index !== -1) {
            state.audits[index] = action.payload;
          }
          if (state.currentAudit?.id === action.payload.id) {
            state.currentAudit = action.payload;
          }
        }
      })
      .addCase(updateAudit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update audit';
      })
      
      // Delete audit
      .addCase(deleteAudit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAudit.fulfilled, (state, action) => {
        state.loading = false;
        state.audits = state.audits.filter(audit => audit.id !== action.payload);
        if (state.currentAudit?.id === action.payload) {
          state.currentAudit = null;
        }
      })
      .addCase(deleteAudit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete audit';
      })
      
      // Start audit
      .addCase(startAudit.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.audits.findIndex(audit => audit.id === action.payload!.id);
          if (index !== -1) {
            state.audits[index] = action.payload;
          }
          if (state.currentAudit?.id === action.payload.id) {
            state.currentAudit = action.payload;
          }
        }
      })
      
      // Complete audit
      .addCase(completeAudit.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.audits.findIndex(audit => audit.id === action.payload!.id);
          if (index !== -1) {
            state.audits[index] = action.payload;
          }
          if (state.currentAudit?.id === action.payload.id) {
            state.currentAudit = action.payload;
          }
        }
      });
  },
});

// Export actions
export const {
  clearError,
  setCurrentAudit,
  setFilters,
  clearFilters,
  setPagination,
  resetAuditState,
} = auditSlice.actions;

// Selectors
export const selectAudits = (state: { audit: AuditState }) => state.audit.audits;
export const selectCurrentAudit = (state: { audit: AuditState }) => state.audit.currentAudit;
export const selectAuditLoading = (state: { audit: AuditState }) => state.audit.loading;
export const selectAuditError = (state: { audit: AuditState }) => state.audit.error;
export const selectAuditFilters = (state: { audit: AuditState }) => state.audit.filters;
export const selectAuditPagination = (state: { audit: AuditState }) => state.audit.pagination;

// Export reducer
export default auditSlice.reducer;
