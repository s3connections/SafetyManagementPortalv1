import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserRole, ApiResponse, PaginatedResponse } from '../types';

// User state interface
interface UserState {
  users: User[];
  currentUser: User | null;
  authenticatedUser: User | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  isAuthenticated: boolean;
}

// Initial state
const initialState: UserState = {
  users: [],
  currentUser: null,
  authenticatedUser: null,
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
  isAuthenticated: false
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params: { 
    page?: number; 
    pageSize?: number; 
    search?: string; 
    role?: UserRole;
    isActive?: boolean;
  }) => {
    const response = await fetch('/api/users?' + new URLSearchParams({
      page: String(params.page || 1),
      pageSize: String(params.pageSize || 10),
      ...(params.search && { search: params.search }),
      ...(params.role && { role: params.role }),
      ...(params.isActive !== undefined && { isActive: String(params.isActive) })
    }));
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    return response.json() as Promise<PaginatedResponse<User>>;
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id: number) => {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    
    const result = await response.json() as ApiResponse<User>;
    return result.data;
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: Partial<User>) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    
    const result = await response.json() as ApiResponse<User>;
    return result.data;
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }: { id: number; data: Partial<User> }) => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    
    const result = await response.json() as ApiResponse<User>;
    return result.data;
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: number) => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
    
    return id;
  }
);

export const deactivateUser = createAsyncThunk(
  'users/deactivateUser',
  async (id: number) => {
    const response = await fetch(`/api/users/${id}/deactivate`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error('Failed to deactivate user');
    }
    
    const result = await response.json() as ApiResponse<User>;
    return result.data;
  }
);

export const activateUser = createAsyncThunk(
  'users/activateUser',
  async (id: number) => {
    const response = await fetch(`/api/users/${id}/activate`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error('Failed to activate user');
    }
    
    const result = await response.json() as ApiResponse<User>;
    return result.data;
  }
);

export const changeUserPassword = createAsyncThunk(
  'users/changeUserPassword',
  async ({ id, currentPassword, newPassword }: { 
    id: number; 
    currentPassword: string; 
    newPassword: string; 
  }) => {
    const response = await fetch(`/api/users/${id}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    
    if (!response.ok) {
      throw new Error('Failed to change password');
    }
    
    const result = await response.json() as ApiResponse<{ success: boolean }>;
    return result.data;
  }
);

export const resetUserPassword = createAsyncThunk(
  'users/resetUserPassword',
  async (id: number) => {
    const response = await fetch(`/api/users/${id}/reset-password`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error('Failed to reset password');
    }
    
    const result = await response.json() as ApiResponse<{ temporaryPassword: string }>;
    return result.data;
  }
);

// Authentication thunks
export const loginUser = createAsyncThunk(
  'users/loginUser',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
    
    const result = await response.json() as ApiResponse<{ user: User; token: string }>;
    
    // Store token in localStorage
    if (result.data?.token) {
      localStorage.setItem('auth_token', result.data.token);
    }
    
    return result.data;
  }
);

export const logoutUser = createAsyncThunk(
  'users/logoutUser',
  async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST'
    });
    
    // Remove token from localStorage regardless of response
    localStorage.removeItem('auth_token');
    
    if (!response.ok) {
      throw new Error('Failed to logout');
    }
    
    return true;
  }
);

export const getCurrentUser = createAsyncThunk(
  'users/getCurrentUser',
  async () => {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      localStorage.removeItem('auth_token');
      throw new Error('Failed to get current user');
    }
    
    const result = await response.json() as ApiResponse<User>;
    return result.data;
  }
);

// User slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
    setAuthenticatedUser: (state, action: PayloadAction<User | null>) => {
      state.authenticatedUser = action.payload;
      state.isAuthenticated = !!action.payload;
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
    resetUserState: (state) => {
      return {
        ...initialState,
        authenticatedUser: state.authenticatedUser,
        isAuthenticated: state.isAuthenticated
      };
    },
    clearAuthState: (state) => {
      state.authenticatedUser = null;
      state.isAuthenticated = false;
      localStorage.removeItem('auth_token');
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.currentPage;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user';
      })
      
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create user';
      })
      
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
        if (state.authenticatedUser?.id === action.payload.id) {
          state.authenticatedUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update user';
      })
      
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
        state.totalCount -= 1;
        if (state.currentUser?.id === action.payload) {
          state.currentUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete user';
      })
      
      // Activate/Deactivate users
      .addCase(activateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deactivateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      
      // Authentication
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.authenticatedUser = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
        state.isAuthenticated = false;
        state.authenticatedUser = null;
      })
      
      .addCase(logoutUser.fulfilled, (state) => {
        state.authenticatedUser = null;
        state.isAuthenticated = false;
      })
      
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.authenticatedUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.authenticatedUser = null;
        state.isAuthenticated = false;
      });
  }
});

// Export actions
export const {
  setCurrentUser,
  setAuthenticatedUser,
  clearError,
  setPage,
  setPageSize,
  resetUserState,
  clearAuthState
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;

// Selectors
export const selectUsers = (state: { users: UserState }) => state.users.users;
export const selectCurrentUser = (state: { users: UserState }) => state.users.currentUser;
export const selectAuthenticatedUser = (state: { users: UserState }) => state.users.authenticatedUser;
export const selectUserLoading = (state: { users: UserState }) => state.users.loading;
export const selectUserError = (state: { users: UserState }) => state.users.error;
export const selectUserTotalCount = (state: { users: UserState }) => state.users.totalCount;
export const selectUserCurrentPage = (state: { users: UserState }) => state.users.currentPage;
export const selectUserPageSize = (state: { users: UserState }) => state.users.pageSize;
export const selectIsAuthenticated = (state: { users: UserState }) => state.users.isAuthenticated;