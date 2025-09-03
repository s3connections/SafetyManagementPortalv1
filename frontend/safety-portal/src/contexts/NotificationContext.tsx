import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';

// Notification interface
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  autoHide?: boolean;
  duration?: number;
}

// Notification context type
export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  clearByType: (type: Notification['type']) => void;
}

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success' as const,
  ERROR: 'error' as const,
  WARNING: 'warning' as const,
  INFO: 'info' as const,
};

// App settings
export const APP_SETTINGS = {
  NOTIFICATION_TIMEOUT: 5000,
  MAX_NOTIFICATIONS: 10,
  AUTO_HIDE_SUCCESS: true,
  AUTO_HIDE_INFO: true,
  AUTO_HIDE_WARNING: false,
  AUTO_HIDE_ERROR: false,
};

// Action types
type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'CLEAR_ALL' }
  | { type: 'CLEAR_BY_TYPE'; payload: Notification['type'] };

// Initial state
const initialState: { notifications: Notification[] } = {
  notifications: [],
};

// Reducer function
const notificationReducer = (
  state: { notifications: Notification[] },
  action: NotificationAction
): { notifications: Notification[] } => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          action.payload,
          ...state.notifications.slice(0, APP_SETTINGS.MAX_NOTIFICATIONS - 1),
        ],
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };

    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };

    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };

    case 'CLEAR_ALL':
      return {
        ...state,
        notifications: [],
      };

    case 'CLEAR_BY_TYPE':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.type !== action.payload),
      };

    default:
      return state;
  }
};

// Create context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider component
interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Generate unique ID
  const generateId = useCallback(() => {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Add notification
  const addNotification = useCallback(
    (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const notification: Notification = {
        ...notificationData,
        id: generateId(),
        timestamp: new Date().toISOString(),
        read: false,
        autoHide: notificationData.autoHide !== undefined 
          ? notificationData.autoHide 
          : (notificationData.type === 'success' || notificationData.type === 'info'),
        duration: notificationData.duration || APP_SETTINGS.NOTIFICATION_TIMEOUT,
      };

      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });

      // Auto-hide notification if configured
      if (notification.autoHide) {
        setTimeout(() => {
          dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
        }, notification.duration);
      }
    },
    [generateId]
  );

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  // Mark as read
  const markAsRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: id });
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    dispatch({ type: 'MARK_ALL_AS_READ' });
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  // Clear notifications by type
  const clearByType = useCallback((type: Notification['type']) => {
    dispatch({ type: 'CLEAR_BY_TYPE', payload: type });
  }, []);

  // Context value
  const contextValue: NotificationContextType = {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    clearByType,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use notification context
export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
};

// Convenience hooks for different notification types
export const useNotificationActions = () => {
  const { addNotification } = useNotification();

  const showSuccess = useCallback(
    (title: string, message: string, options?: Partial<Notification>) => {
      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        title,
        message,
        ...options,
      });
    },
    [addNotification]
  );

  const showError = useCallback(
    (title: string, message: string, options?: Partial<Notification>) => {
      addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        title,
        message,
        autoHide: false,
        ...options,
      });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (title: string, message: string, options?: Partial<Notification>) => {
      addNotification({
        type: NOTIFICATION_TYPES.WARNING,
        title,
        message,
        autoHide: false,
        ...options,
      });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (title: string, message: string, options?: Partial<Notification>) => {
      addNotification({
        type: NOTIFICATION_TYPES.INFO,
        title,
        message,
        ...options,
      });
    },
    [addNotification]
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

// Default export
export default NotificationContext;

// Export types
export type { NotificationContextType };
export { NOTIFICATION_TYPES };