import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { NOTIFICATION_TYPES, APP_SETTINGS, NotificationTypes } from './constants';

// Notification interface
export interface Notification {
  id: string;
  message: string;
  type: NotificationTypes;
  timestamp: number;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Notification state
interface NotificationState {
  notifications: Notification[];
}

// Action types
type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' };

// Context type
interface NotificationContextType {
  notifications: Notification[];
  showNotification: (message: string, type?: NotificationTypes, duration?: number) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

// Initial state
const initialState: NotificationState = {
  notifications: []
};

// Reducer
const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload)
      };
    
    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: []
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
  const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  };

  // Add notification
  const showNotification = useCallback((
    message: string, 
    type: NotificationTypes = NOTIFICATION_TYPES.INFO, 
    duration: number = APP_SETTINGS.NOTIFICATION_DURATION
  ) => {
    const id = generateId();
    const notification: Notification = {
      id,
      message,
      type,
      timestamp: Date.now(),
      duration
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });

    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
      }, duration);
    }
  }, []);

  // Convenience methods
  const showSuccess = useCallback((message: string) => {
    showNotification(message, NOTIFICATION_TYPES.SUCCESS);
  }, [showNotification]);

  const showError = useCallback((message: string) => {
    showNotification(message, NOTIFICATION_TYPES.ERROR, 0); // Don't auto-dismiss errors
  }, [showNotification]);

  const showWarning = useCallback((message: string) => {
    showNotification(message, NOTIFICATION_TYPES.WARNING);
  }, [showNotification]);

  const showInfo = useCallback((message: string) => {
    showNotification(message, NOTIFICATION_TYPES.INFO);
  }, [showNotification]);

  // Remove specific notification
  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
  }, []);

  const contextValue: NotificationContextType = {
    notifications: state.notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearAllNotifications
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

// Export types
export type { NotificationContextType, Notification };
export { NOTIFICATION_TYPES };
