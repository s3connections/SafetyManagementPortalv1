import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store';
import { useNotification } from '../hooks/useNotification';
import { USER_ROLES } from '../constants/userRoles';
import { ROUTES } from '../constants/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  requireAuth = true,
}) => {
  const location = useLocation();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const { showError } = useNotification();

  useEffect(() => {
    if (!loading && requireAuth) {
      // Check authentication
      if (!isAuthenticated || !user) {
        showError('Authentication Required', 'Please log in to access this page.');
        return;
      }

      // Check role-based authorization
      if (allowedRoles.length > 0 && user) {
        const hasAccess = allowedRoles.includes(user.role);
        if (!hasAccess) {
          showError('Access Denied', 'You do not have permission to access this page.');
        }
      }
    }
  }, [isAuthenticated, user, loading, allowedRoles, requireAuth, showError]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (requireAuth && (!isAuthenticated || !user)) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

// Higher-order component for role-based access
export const withRoleAccess = (allowedRoles: string[]) => {
  return (Component: React.ComponentType) => {
    const WrappedComponent: React.FC = (props) => (
      <ProtectedRoute allowedRoles={allowedRoles}>
        <Component {...props} />
      </ProtectedRoute>
    );

    WrappedComponent.displayName = `withRoleAccess(${Component.displayName || Component.name})`;
    return WrappedComponent;
  };
};

// Pre-defined role-based route guards
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
    {children}
  </ProtectedRoute>
);

export const SafetyManagerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SAFETY_MANAGER]}>
    {children}
  </ProtectedRoute>
);

export const SafetyOfficerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SAFETY_MANAGER, USER_ROLES.SAFETY_OFFICER]}>
    {children}
  </ProtectedRoute>
);