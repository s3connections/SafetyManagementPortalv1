import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ApiResponse, PaginatedResponse, /* other types */ } from '../types';

// Investigation types
export interface Investigation {
  id: number;
  investigationNumber: string;
  title: string;
  description: string;
  status: InvestigationStatus;
  priority: InvestigationPriority;
  incidentId?: number;
  investigatedBy: number;
  startDate: string;
  targetCompletionDate: string;
  actualCompletionDate?: string;
  findings: string;
  rootCause?: string;
  recommendedActions: string[];
  createdAt: string;
  updatedAt: string;
}

export enum InvestigationStatus {
  INITIATED = 'Initiated',
  IN_PROGRESS = 'In_Progress',
  UNDER_REVIEW = 'Under_Review',
  COMPLETED = 'Completed',
  CLOSED = 'Closed'
}

export enum InvestigationPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

// Investigation state interface
interface InvestigationState {
  investigations: Investigation[];
  currentInvestigation: Investigation | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

// Initial state
const initialState: InvestigationState = {
  investigations: [],
  currentInvestigation: null,
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 10
};

// Async thunks
export const fetchInvestigations = createAsyncThunk(
  'investigations/fetchInvestigations',
  async (params: { 
    page?: number; 
    pageSize?: number; 
    search?: string; 
    status?: InvestigationStatus;
    priority?: InvestigationPriority;
  }) => {
    const response = await fetch('/api/investigations?' + new URLSearchParams({
      page: String(params.page || 1),
      pageSize: String(params.pageSize || 10),
      ...(params.search && { search: params.search }),
      ...(params.status && { status: params.status }),
      ...(params.priority && { priority: params.priority })
    }));
    
    if (!response.ok) {
      throw new Error('Failed to fetch investigations');
    }
    
    return response.json() as Promise<PaginatedResponse<Investigation>>;
  }
);

export const fetchInvestigationById = createAsyncThunk(
  'investigations/fetchInvestigationById',
  async (id: number) => {
    const response = await fetch(`/api/investigations/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch investigation');
    }
    
    const result = await response.json() as ApiResponse<Investigation>;
    return result.data;
  }
);

export const createInvestigation = createAsyncThunk(
  'investigations/createInvestigation',
  async (investigationData: Partial<Investigation>) => {
    const response = await fetch('/api/investigations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(investigationData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create investigation');
    }
    
    const result = await response.json() as ApiResponse<Investigation>;
    return result.data;
  }
);

export const updateInvestigation = createAsyncThunk(
  'investigations/updateInvestigation',
  async ({ id, data }: { id: number; data: Partial<Investigation> }) => {
    const response = await fetch(`/api/investigations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update investigation');
    }
    
    const result = await response.json() as ApiResponse<Investigation>;
    return result.data;
  }
);

export const deleteInvestigation = createAsyncThunk(
  'investigations/deleteInvestigation',
  async (id: number) => {
    const response = await fetch(`/api/investigations/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete investigation');
    }
    
    return id;
  }
);

export const completeInvestigation = createAsyncThunk(
  'investigations/completeInvestigation',
  async ({ id, findings, rootCause, recommendedActions }: { 
    id: number; 
    findings: string;
    rootCause: string;
    recommendedActions: string[];
  }) => {
    const response = await fetch(`/api/investigations/${id}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ findings, rootCause, recommendedActions })
    });
    
    if (!response.ok) {
      throw new Error('Failed to complete investigation');
    }
    
    const result = await response.json() as ApiResponse<Investigation>;
    return result.data;
  }
);

// Investigation slice
const investigationSlice = createSlice({
  name: 'investigations',
  initialState,
  reducers: {
    setCurrentInvestigation: (state, action: PayloadAction<Investigation | null>) => {
      state.currentInvestigation = action.payload;
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
    resetInvestigationState: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch investigations
      .addCase(fetchInvestigations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvestigations.fulfilled, (state, action) => {
        state.loading = false;
        state.investigations = action.payload.data;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.currentPage;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchInvestigations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch investigations';
      })
      
      // Fetch investigation by ID
      .addCase(fetchInvestigationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvestigationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvestigation = action.payload;
      })
      .addCase(fetchInvestigationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch investigation';
      })
      
      // Create investigation
      .addCase(createInvestigation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvestigation.fulfilled, (state, action) => {
        state.loading = false;
        state.investigations.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createInvestigation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create investigation';
      })
      
      // Update investigation
      .addCase(updateInvestigation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvestigation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.investigations.findIndex(inv => inv.id === action.payload.id);
        if (index !== -1) {
          state.investigations[index] = action.payload;
        }
        if (state.currentInvestigation?.id === action.payload.id) {
          state.currentInvestigation = action.payload;
        }
      })
      .addCase(updateInvestigation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update investigation';
      })
      
      // Delete investigation
      .addCase(deleteInvestigation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInvestigation.fulfilled, (state, action) => {
        state.loading = false;
        state.investigations = state.investigations.filter(inv => inv.id !== action.payload);
        state.totalCount -= 1;
        if (state.currentInvestigation?.id === action.payload) {
          state.currentInvestigation = null;
        }
      })
      .addCase(deleteInvestigation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete investigation';
      })
      
      // Complete investigation
      .addCase(completeInvestigation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeInvestigation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.investigations.findIndex(inv => inv.id === action.payload.id);
        if (index !== -1) {
          state.investigations[index] = action.payload;
        }
        if (state.currentInvestigation?.id === action.payload.id) {
          state.currentInvestigation = action.payload;
        }
      })
      .addCase(completeInvestigation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to complete investigation';
      });
  }
});

// Export actions
export const {
  setCurrentInvestigation,
  clearError,
  setPage,
  setPageSize,
  resetInvestigationState
} = investigationSlice.actions;

// Export reducer
export default investigationSlice.reducer;

// Selectors
export const selectInvestigations = (state: { investigations: InvestigationState }) => state.investigations.investigations;
export const selectCurrentInvestigation = (state: { investigations: InvestigationState }) => state.investigations.currentInvestigation;
export const selectInvestigationLoading = (state: { investigations: InvestigationState }) => state.investigations.loading;
export const selectInvestigationError = (state: { investigations: InvestigationState }) => state.investigations.error;
export const selectInvestigationTotalCount = (state: { investigations: InvestigationState }) => state.investigations.totalCount;
export const selectInvestigationCurrentPage = (state: { investigations: InvestigationState }) => state.investigations.currentPage;
export const selectInvestigationPageSize = (state: { investigations: InvestigationState }) => state.investigations.pageSize;