export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Route Constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  OBSERVATIONS: '/observations',
  INCIDENTS: '/incidents',
  AUDITS: '/audits',
  PERMITS: '/permits',
  USERS: '/users',
  PROFILE: '/profile'
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'Admin',
  SAFETY_MANAGER: 'Safety_Manager',
  SAFETY_OFFICER: 'Safety_Officer',
  RESPONSIBLE_ENGINEER: 'Responsible_Engineer',
  EMPLOYEE: 'Employee'
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  REFRESH_TOKEN: 'refresh_token',
  THEME_PREFERENCE: 'theme_preference'
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile'
  },
  OBSERVATIONS: {
    BASE: '/observations',
    CREATE: '/observations',
    UPDATE: '/observations',
    DELETE: '/observations',
    CLOSE: '/observations/{id}/close'
  },
  INCIDENTS: {
    BASE: '/incidents',
    CREATE: '/incidents',
    UPDATE: '/incidents'
  },
  AUDITS: {
    BASE: '/audits',
    CREATE: '/audits',
    UPDATE: '/audits'
  },
  PERMITS: {
    BASE: '/permits',
    CREATE: '/permits',
    UPDATE: '/permits',
    APPROVE: '/permits/{id}/approve'
  },
  USERS: {
    BASE: '/users',
    CREATE: '/users',
    UPDATE: '/users'
  },
  PLANTS: '/plants',
  DEPARTMENTS: '/departments'
} as const;

// Validation Constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  EMPLOYEE_ID_REGEX: /^[A-Z]{3}\d{3}$/
} as const;

// Application Constants
export const APP_CONFIG = {
  ITEMS_PER_PAGE: 10,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  NOTIFICATION_TIMEOUT: 5000
} as const;

// Status Colors
export const STATUS_COLORS = {
  OPEN: '#1976d2',
  IN_PROGRESS: '#ff9800',
  CLOSED: '#4caf50',
  CANCELLED: '#f44336',
  HIGH: '#f44336',
  MEDIUM: '#ff9800',
  LOW: '#4caf50'
} as const;