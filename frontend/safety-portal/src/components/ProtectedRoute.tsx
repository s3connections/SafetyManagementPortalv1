import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES, USER_ROLES, STORAGE_KEYS, API_ENDPOINTS, API_BASE_URL } from './constants';
import { useNotification } from './NotificationContext';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  lastLogin?: string;
  isActive: boolean;
}

// Auth state interface
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
}

// Props interface
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  fallbackPath?: string;
  showUnauthorizedMessage?: boolean;
}

// Authentication service
class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  // Set token in localStorage
  setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  // Remove token from localStorage
  removeToken(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  // Verify token with backend
  async verifyToken(): Promise<{ isValid: boolean; user?: User }> {
    const token = this.getToken();

    if (!token) {
      return { isValid: false };
    }

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.VERIFY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return { isValid: true, user: data.user };
      } else {
        this.removeToken();
        return { isValid: false };
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return { isValid: false };
    }
  }

  // Check if user has required role
  hasRole(user: User | null, requiredRoles: string[]): boolean {
    if (!user || !requiredRoles.length) {
      return true;
    }
    return requiredRoles.includes(user.role);
  }

  // Check if user has required permissions
  hasPermissions(user: User | null, requiredPermissions: string[]): boolean {
    if (!user || !requiredPermissions.length) {
      return true;
    }
    return requiredPermissions.every(permission => 
      user.permissions.includes(permission)
    );
  }

  // Logout user
  async logout(): Promise<void> {
    const token = this.getToken();

    if (token) {
      try {
        await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }

    this.removeToken();
  }
}

// Custom hook for authentication
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    token: null,
  });

  const { showError } = useNotification();
  const authService = AuthService.getInstance();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { isValid, user } = await authService.verifyToken();
        const token = authService.getToken();

        setAuthState({
          isAuthenticated: isValid,
          isLoading: false,
          user: user || null,
          token: token,
        });
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          token: null,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        authService.setToken(data.token);

        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: data.user,
          token: data.token,
        });

        return true;
      } else {
        const errorData = await response.json();
        showError('Login Failed', errorData.message || 'Invalid credentials');
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      showError('Login Failed', 'Network error. Please try again.');
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
};

// Loading component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

// Unauthorized component
const UnauthorizedMessage: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center p-8">
      <div className="text-6xl text-red-500 mb-4">🚫</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
      <p className="text-gray-600 mb-4">
        {message || "You don't have permission to access this page."}
      </p>
      <button
        onClick={() => window.history.back()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Go Back
      </button>
    </div>
  </div>
);

// Main ProtectedRoute component
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  fallbackPath = ROUTES.LOGIN,
  showUnauthorizedMessage = true,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const authService = AuthService.getInstance();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRoles.length > 0 && !authService.hasRole(user, requiredRoles)) {
    if (showUnauthorizedMessage) {
      return (
        <UnauthorizedMessage message="Your account role doesn't have access to this page." />
      );
    }
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // Check permission-based access
  if (requiredPermissions.length > 0 && !authService.hasPermissions(user, requiredPermissions)) {
    if (showUnauthorizedMessage) {
      return (
        <UnauthorizedMessage message="You don't have the required permissions to access this page." />
      );
    }
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // User is authenticated and authorized
  return <>{children}</>;
};

// HOC version of ProtectedRoute
export const withProtection = (
  Component: React.ComponentType<any>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) => {
  return (props: any) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Role-specific route components
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN]}>
    {children}
  </ProtectedRoute>
);

export const UserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.USER]}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;
