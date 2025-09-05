import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES, USER_ROLES } from '../constants';
import { useNotification } from '../contexts/NotificationContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { showError } = useNotification();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        setIsAuthorized(false);
        return;
      }

      // Check role-based authorization
      if (allowedRoles.length > 0 && user) {
        const hasAccess = allowedRoles.includes(user.role);
        if (!hasAccess) {
          showError('Access Denied', 'You do not have permission to access this page.');
        }
        setIsAuthorized(hasAccess);
      } else {
        setIsAuthorized(true);
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, showError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (!isAuthorized) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;