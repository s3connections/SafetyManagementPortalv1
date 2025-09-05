import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationContextType {
  showError: (title: string, message: string) => void;
  showSuccess: (title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const showError = (title: string, message: string) => {
    console.error(`${title}: ${message}`);
    alert(`Error - ${title}: ${message}`);
  };

  const showSuccess = (title: string, message: string) => {
    console.log(`${title}: ${message}`);
    alert(`Success - ${title}: ${message}`);
  };

  return (
    <NotificationContext.Provider value={{ showError, showSuccess }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationProvider;
