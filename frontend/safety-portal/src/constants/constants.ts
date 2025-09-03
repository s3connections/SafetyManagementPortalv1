// Application constants
export const APP_NAME = 'Safety Management Portal';
export const VERSION = '1.0.0';

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7139/api';
export const API_TIMEOUT = 30000;

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  
  // Observations
  OBSERVATIONS: '/observations',
  OBSERVATION_LIST: '/observations/list',
  OBSERVATION_CREATE: '/observations/create',
  OBSERVATION_DETAILS: '/observations/:id',
  OBSERVATION_EDIT: '/observations/:id/edit',
  
  // Audits
  AUDITS: '/audits',
  AUDIT_LIST: '/audits/list',
  AUDIT_CREATE: '/audits/create',
  AUDIT_DETAILS: '/audits/:id',
  AUDIT_CONDUCT: '/audits/:id/conduct',
  
  // Permits
  PERMITS: '/permits',
  PERMIT_LIST: '/permits/list',
  PERMIT_CREATE: '/permits/create',
  PERMIT_DETAILS: '/permits/:id',
  PERMIT_APPROVAL: '/permits/:id/approval',
  
  // Investigations
  INVESTIGATIONS: '/investigations',
  INVESTIGATION_LIST: '/investigations/list',
  INVESTIGATION_CREATE: '/investigations/create',
  INVESTIGATION_DETAILS: '/investigations/:id',
  
  // User Management
  USERS: '/users',
  USER_LIST: '/users/list',
  USER_CREATE: '/users/create',
  USER_DETAILS: '/users/:id',
  USER_EDIT: '/users/:id/edit',
  
  // Settings
  SETTINGS: '/settings',
  ANALYTICS: '/analytics'
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  SUPERVISOR: 'Supervisor',
  EMPLOYEE: 'Employee',
  SAFETY_OFFICER: 'SafetyOfficer',
  AUDITOR: 'Auditor'
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  REFRESH_TOKEN: 'refresh_token',
  THEME: 'app_theme',
  LANGUAGE: 'app_language'
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  
  // Users
  USERS: '/users',
  USER_PROFILE: '/users/profile',
  
  // Observations
  OBSERVATIONS: '/observations',
  OBSERVATION_STATISTICS: '/observations/statistics',
  
  // Audits
  AUDITS: '/audits',
  AUDIT_STATISTICS: '/audits/statistics',
  AUDIT_START: '/audits/{id}/start',
  AUDIT_COMPLETE: '/audits/{id}/complete',
  
  // Permits
  PERMITS: '/permits',
  PERMIT_STATISTICS: '/permits/statistics',
  PERMIT_SUBMIT: '/permits/{id}/submit',
  PERMIT_APPROVE: '/permits/{id}/approve',
  PERMIT_REJECT: '/permits/{id}/reject',
  
  // Investigations
  INVESTIGATIONS: '/investigations',
  
  // Master Data
  PLANTS: '/master/plants',
  DEPARTMENTS: '/master/departments',
  CATEGORIES: '/master/categories',
  PRIORITIES: '/master/priorities',
  AUDIT_TYPES: '/master/audit-types',
  PERMIT_TYPES: '/master/permit-types'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Status Constants
export const OBSERVATION_STATUS = {
  OPEN: 'Open',
  IN_PROGRESS: 'InProgress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  CANCELLED: 'Cancelled'
};

export const AUDIT_STATUS = {
  PLANNED: 'Planned',
  IN_PROGRESS: 'InProgress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

export const PERMIT_STATUS = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'UnderReview',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  EXPIRED: 'Expired',
  CANCELLED: 'Cancelled'
};

// Priority Constants
export const PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical'
};

// Theme Configuration
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  PRIMARY_COLOR: '#1976d2',
  SECONDARY_COLOR: '#dc004e'
};

// Sidebar Menu Items
export const SIDEBAR_MENU_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    path: ROUTES.DASHBOARD,
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.SUPERVISOR, USER_ROLES.EMPLOYEE, USER_ROLES.SAFETY_OFFICER, USER_ROLES.AUDITOR]
  },
  {
    id: 'observations',
    label: 'Observations',
    icon: 'visibility',
    path: ROUTES.OBSERVATIONS,
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.SUPERVISOR, USER_ROLES.EMPLOYEE, USER_ROLES.SAFETY_OFFICER],
    children: [
      { label: 'View All', path: ROUTES.OBSERVATION_LIST },
      { label: 'Create New', path: ROUTES.OBSERVATION_CREATE }
    ]
  },
  {
    id: 'audits',
    label: 'Audits',
    icon: 'assignment',
    path: ROUTES.AUDITS,
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.SAFETY_OFFICER, USER_ROLES.AUDITOR],
    children: [
      { label: 'View All', path: ROUTES.AUDIT_LIST },
      { label: 'Create New', path: ROUTES.AUDIT_CREATE }
    ]
  },
  {
    id: 'permits',
    label: 'Permits',
    icon: 'description',
    path: ROUTES.PERMITS,
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.SUPERVISOR, USER_ROLES.EMPLOYEE, USER_ROLES.SAFETY_OFFICER],
    children: [
      { label: 'View All', path: ROUTES.PERMIT_LIST },
      { label: 'Create New', path: ROUTES.PERMIT_CREATE }
    ]
  },
  {
    id: 'investigations',
    label: 'Investigations',
    icon: 'search',
    path: ROUTES.INVESTIGATIONS,
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.SAFETY_OFFICER],
    children: [
      { label: 'View All', path: ROUTES.INVESTIGATION_LIST },
      { label: 'Create New', path: ROUTES.INVESTIGATION_CREATE }
    ]
  },
  {
    id: 'users',
    label: 'User Management',
    icon: 'people',
    path: ROUTES.USERS,
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
    children: [
      { label: 'View All', path: ROUTES.USER_LIST },
      { label: 'Create New', path: ROUTES.USER_CREATE }
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'analytics',
    path: ROUTES.ANALYTICS,
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.SAFETY_OFFICER]
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    path: ROUTES.SETTINGS,
    roles: [USER_ROLES.ADMIN]
  }
];

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  MIN_PASSWORD_LENGTH: 8,
  MAX_TEXT_LENGTH: 1000,
  MAX_DESCRIPTION_LENGTH: 2000,
  REQUIRED_MESSAGE: 'This field is required',
  INVALID_EMAIL_MESSAGE: 'Please enter a valid email address',
  INVALID_PHONE_MESSAGE: 'Please enter a valid phone number',
  PASSWORD_MIN_LENGTH_MESSAGE: `Password must be at least ${8} characters long`
};

// App Settings
export const APP_SETTINGS = {
  DEFAULT_PAGE_SIZE: 25,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif'],
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
  SESSION_TIMEOUT: 3600000, // 1 hour
  REFRESH_INTERVAL: 300000, // 5 minutes
  NOTIFICATION_DURATION: 5000 // 5 seconds
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: 'Data saved successfully!',
  UPDATE_SUCCESS: 'Data updated successfully!',
  DELETE_SUCCESS: 'Data deleted successfully!',
  SUBMIT_SUCCESS: 'Submitted successfully!',
  APPROVE_SUCCESS: 'Approved successfully!',
  REJECT_SUCCESS: 'Rejected successfully!'
};
