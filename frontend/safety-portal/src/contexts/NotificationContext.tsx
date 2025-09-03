import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success' as const,
  ERROR: 'error' as const,
  WARNING: 'warning' as const,
  INFO: 'info' as const,
};

interface Notification {
  id: string;
  type: AlertColor;
  title: string;
  message: string;
  duration?: number;
  autoHide?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (
    type: AlertColor,
    title: string,
    message: string,
    duration?: number,
    autoHide?: boolean
  ) => void;
  showSuccess: (title: string, message: string, duration?: number) => void;
  showError: (title: string, message: string, duration?: number) => void;
  showWarning: (title: string, message: string, duration?: number) => void;
  showInfo: (title: string, message: string, duration?: number) => void;
  hideNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const generateId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }, []);

  const showNotification = useCallback((
    type: AlertColor,
    title: string,
    message: string,
    duration: number = 5000,
    autoHide: boolean = true
  ) => {
    const id = generateId();
    const notification: Notification = {
      id,
      type,
      title,
      message,
      duration,
      autoHide,
    };

    setNotifications(prev => [...prev, notification]);

    if (autoHide && duration > 0) {
      setTimeout(() => {
        hideNotification(id);
      }, duration);
    }
  }, [generateId]);

  const showSuccess = useCallback((title: string, message: string, duration: number = 5000) => {
    showNotification(NOTIFICATION_TYPES.SUCCESS, title, message, duration);
  }, [showNotification]);

  const showError = useCallback((title: string, message: string, duration: number = 8000) => {
    showNotification(NOTIFICATION_TYPES.ERROR, title, message, duration);
  }, [showNotification]);

  const showWarning = useCallback((title: string, message: string, duration: number = 6000) => {
    showNotification(NOTIFICATION_TYPES.WARNING, title, message, duration);
  }, [showNotification]);

  const showInfo = useCallback((title: string, message: string, duration: number = 5000) => {
    showNotification(NOTIFICATION_TYPES.INFO, title, message, duration);
  }, [showNotification]);

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const handleClose = useCallback((id: string) => {
    hideNotification(id);
  }, [hideNotification]);

  const value: NotificationContextType = {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.autoHide ? notification.duration : null}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            severity={notification.type}
            onClose={() => handleClose(notification.id)}
            variant="filled"
            sx={{ width: '100%', minWidth: '300px' }}
          >
            <strong>{notification.title}</strong>
            {notification.message && (
              <div style={{ marginTop: '4px' }}>
                {notification.message}
              </div>
            )}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationProvider;