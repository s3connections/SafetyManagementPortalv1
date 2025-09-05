export const APP_CONFIG = {
  APP_NAME: 'Safety Management Portal',
  VERSION: '1.0.0',
  ITEMS_PER_PAGE: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf'
  ] as const,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  NOTIFICATION_TIMEOUT: 5000,
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  ENABLE_NOTIFICATIONS: true,
  THEME: {
    PRIMARY_COLOR: '#1976d2',
    SECONDARY_COLOR: '#dc004e',
    SUCCESS_COLOR: '#4caf50',
    WARNING_COLOR: '#ff9800',
    ERROR_COLOR: '#f44336',
    INFO_COLOR: '#2196f3'
  }
} as const;

export type AppConfig = typeof APP_CONFIG;

export const getAppTitle = (): string => {
  return APP_CONFIG.APP_NAME;
};

export const getAppVersion = (): string => {
  return APP_CONFIG.VERSION;
};

export const getApiUrl = (): string => {
  return APP_CONFIG.API_BASE_URL;
};