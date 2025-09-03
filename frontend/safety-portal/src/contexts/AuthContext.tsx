import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, UserRole, ApiResponse } from '../types';

// Auth state interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

// Auth context interface
export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

// Action types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ERROR' }
  | { type: 'CHECK_AUTH_START' }
  | { type: 'CHECK_AUTH_SUCCESS'; payload: User }
  | { type: 'CHECK_AUTH_FAILURE' };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: localStorage.getItem('auth_token'),
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'CHECK_AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'CHECK_AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case 'CHECK_AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const result: ApiResponse<{ user: User; token: string }> = await response.json();

      if (result.success && result.data) {
        // Store token in localStorage
        localStorage.setItem('auth_token', result.data.token);
        localStorage.setItem('user_data', JSON.stringify(result.data.user));

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: result.data.user,
            token: result.data.token,
          },
        });
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      // Call logout endpoint
      if (state.token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${state.token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Update user function
  const updateUser = (user: User): void => {
    localStorage.setItem('user_data', JSON.stringify(user));
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Check authentication function
  const checkAuth = async (): Promise<void> => {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      dispatch({ type: 'CHECK_AUTH_FAILURE' });
      return;
    }

    dispatch({ type: 'CHECK_AUTH_START' });

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token validation failed');
      }

      const result: ApiResponse<User> = await response.json();

      if (result.success && result.data) {
        localStorage.setItem('user_data', JSON.stringify(result.data));
        dispatch({ type: 'CHECK_AUTH_SUCCESS', payload: result.data });
      } else {
        throw new Error('User data invalid');
      }
    } catch (error) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      dispatch({ type: 'CHECK_AUTH_FAILURE' });
    }
  };

  // Role checking functions
  const hasRole = (role: UserRole): boolean => {
    return state.user?.userType === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return state.user ? roles.includes(state.user.userType) : false;
  };

  // Check auth on mount
  useEffect(() => {
    if (state.token && !state.user) {
      checkAuth();
    }
  }, [state.token]);

  // Context value
  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser,
    clearError,
    checkAuth,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Export context for testing
export default AuthContext;

// Re-export User type for convenience
export type { User };