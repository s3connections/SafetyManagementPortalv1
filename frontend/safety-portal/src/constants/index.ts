export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  OBSERVATIONS: {
    BASE: '/observations',
    LIST: '/observations',
    CREATE: '/observations',
    UPDATE: (id: number) => `/observations/${id}`,
    DELETE: (id: number) => `/observations/${id}`,
    GET_BY_ID: (id: number) => `/observations/${id}`,
  },
  AUDITS: {
    BASE: '/audits',
    CREATE: '/audits',
    LIST: '/audits',
    UPDATE: (id: number) => `/audits/${id}`,
    DELETE: (id: number) => `/audits/${id}`,
    GET_BY_ID: (id: number) => `/audits/${id}`,
  },
  PERMITS: {
    BASE: '/permits',
    CREATE: '/permits',
    LIST: '/permits',
    UPDATE: (id: number) => `/permits/${id}`,
    DELETE: (id: number) => `/permits/${id}`,
    GET_BY_ID: (id: number) => `/permits/${id}`,
  },
} as const;

// Storage Keys (MATCH THE ACTUAL KEYS USED)
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  REFRESH_TOKEN: 'refresh_token',
  THEME_PREFERENCE: 'theme_preference',
  // Add aliases for compatibility
  ACCESS_TOKEN: 'auth_token',
  USER: 'user_data',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  OBSERVATIONS: '/observations',
  INCIDENTS: '/incidents',
  AUDITS: '/audits',
  PERMITS: '/permits',
  USERS: '/users',
  PROFILE: '/profile',
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  SUPERVISOR: 'supervisor',
  EMPLOYEE: 'employee',
  AUDITOR: 'auditor',
  SAFETY_OFFICER: 'safety_officer',
} as const;

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'Safety Management System',
  VERSION: '1.0.0',
} as const;

// For backward compatibility
export const APP_NAME = APP_CONFIG.APP_NAME;

// Status Colors
export const STATUS_COLORS = {
  success: 'green',
  error: 'red',
  warning: 'orange',
  info: 'blue',
} as const;

// Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 2000,
} as const;

// Sidebar Menu Items
export const SIDEBAR_MENU_ITEMS = [
  {
    name: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'dashboard',
    roles: [],
  },
  {
    name: 'Observations',
    path: ROUTES.OBSERVATIONS,
    icon: 'observations',
    roles: [],
  },
  {
    name: 'Audits',
    path: ROUTES.AUDITS,
    icon: 'audits',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.AUDITOR],
  },
  {
    name: 'Permits',
    path: ROUTES.PERMITS,
    icon: 'permits',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.SUPERVISOR],
  },
  {
    name: 'Users',
    path: ROUTES.USERS,
    icon: 'users',
    roles: [USER_ROLES.ADMIN],
  },
] as const;