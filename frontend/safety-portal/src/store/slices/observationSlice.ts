import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Observation, CreateObservationDto, UpdateObservationDto, ObservationStatus } from '../../types/index';
import { ObservationService } from '../../services/ObservationService';

interface ObservationState {
  observations: Observation[];
  currentObservation: Observation | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: ObservationStatus;
    assignedToMe: boolean;
    searchTerm: string;
  };
}

const initialState: ObservationState = {
  observations: [],
  currentObservation: null,
  loading: false,
  error: null,
  filters: {
    assignedToMe: false,
    searchTerm: '',
  },
};

export const fetchObservations = createAsyncThunk(
  'observations/fetchAll',
  async () => {
    const result = await ObservationService.getAllObservations();
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.data!;
  }
);

export const fetchObservationById = createAsyncThunk(
  'observations/fetchById',
  async (id: number) => {
    const result = await ObservationService.getObservationById(id);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.data!;
  }
);

// ✅ FIXED: Create observation with proper data type mapping
export const createObservation = createAsyncThunk(
  'observations/create',
  async ({ observationData, imageFile }: { observationData: CreateObservationDto; imageFile?: File }) => {
    // ✅ FIXED: Create ObservationFormData from CreateObservationDto
    const formData = {
      title: observationData.title,
      description: observationData.description,
      observationType: observationData.observationType,
      priority: observationData.priorityId,
      location: observationData.location || '', // ✅ FIXED: Ensure location is never undefined
      dueDate: observationData.dueDate || '',
      assignedToUserId: observationData.assignedToUserId,
      plantId: observationData.plantId,
      departmentId: observationData.departmentId,
    };
    
    const result = await ObservationService.createObservation(formData, imageFile);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.data!;
  }
);

// ✅ FIXED: Update observation with proper service method
export const updateObservation = createAsyncThunk(
  'observations/update',
  async ({ id, observationData }: { id: number; observationData: UpdateObservationDto }) => {
    const result = await ObservationService.updateObservation(id, observationData);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.data!;
  }
);

// ✅ FIXED: Update observation status with proper service method
export const updateObservationStatus = createAsyncThunk(
  'observations/updateStatus',
  async ({ id, status, notes }: { id: number; status: ObservationStatus; notes?: string }) => {
    const result = await ObservationService.updateObservationStatus(id, status, notes);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.data!;
  }
);

// ✅ FIXED: Delete observation with proper service method
export const deleteObservation = createAsyncThunk(
  'observations/delete',
  async (id: number) => {
    const result = await ObservationService.deleteObservation(id);
    if (!result.success) {
      throw new Error(result.error);
    }
    return id;
  }
);

const observationSlice = createSlice({
  name: 'observations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentObservation: (state) => {
      state.currentObservation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all observations
      .addCase(fetchObservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchObservations.fulfilled, (state, action) => {
        state.loading = false;
        state.observations = action.payload;
      })
      .addCase(fetchObservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch observations';
      })
      // Fetch observation by ID
      .addCase(fetchObservationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchObservationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentObservation = action.payload;
      })
      .addCase(fetchObservationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch observation';
      })
      // Create observation
      .addCase(createObservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createObservation.fulfilled, (state, action) => {
        state.loading = false;
        state.observations.unshift(action.payload);
      })
      .addCase(createObservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create observation';
      })
      // Update observation
      .addCase(updateObservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateObservation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.observations.findIndex(obs => obs.id === action.payload.id);
        if (index !== -1) {
          state.observations[index] = action.payload;
        }
        if (state.currentObservation?.id === action.payload.id) {
          state.currentObservation = action.payload;
        }
      })
      .addCase(updateObservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update observation';
      })
      // Update observation status
      .addCase(updateObservationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateObservationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.observations.findIndex(obs => obs.id === action.payload.id);
        if (index !== -1) {
          state.observations[index] = action.payload;
        }
        if (state.currentObservation?.id === action.payload.id) {
          state.currentObservation = action.payload;
        }
      })
      .addCase(updateObservationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update observation status';
      })
      // Delete observation
      .addCase(deleteObservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteObservation.fulfilled, (state, action) => {
        state.loading = false;
        state.observations = state.observations.filter(obs => obs.id !== action.payload);
        if (state.currentObservation?.id === action.payload) {
          state.currentObservation = null;
        }
      })
      .addCase(deleteObservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete observation';
      });
  },
});

export const { clearError, setFilters, clearCurrentObservation } = observationSlice.actions;
export default observationSlice.reducer;