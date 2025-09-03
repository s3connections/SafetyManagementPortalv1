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
    BY_STATUS: (status: string) => `/observations/status/${status}`,
    BY_REPORTER: (reporterId: number) => `/observations/reporter/${reporterId}`,
    BY_ASSIGNEE: (assigneeId: number) => `/observations/assignee/${assigneeId}`,
    BY_PLANT: (plantId: number) => `/observations/plant/${plantId}`,
    BY_DEPARTMENT: (departmentId: number) => `/observations/department/${departmentId}`,
    OVERDUE: '/observations/overdue',
    STATISTICS: '/observations/statistics',
    ASSIGN: (id: number) => `/observations/${id}/assign`,
    UPDATE_STATUS: (id: number) => `/observations/${id}/status`,
  },
  AUDITS: {
    BASE: '/audits',
    LIST: '/audits',
    CREATE: '/audits',
    UPDATE: (id: number) => `/audits/${id}`,
    DELETE: (id: number) => `/audits/${id}`,
    GET_BY_ID: (id: number) => `/audits/${id}`,
    START: (id: number) => `/audits/${id}/start`,
    COMPLETE: (id: number) => `/audits/${id}/complete`,
    CANCEL: (id: number) => `/audits/${id}/cancel`,
    BY_STATUS: (status: string) => `/audits/status/${status}`,
    BY_AUDITOR: (auditorId: number) => `/audits/auditor/${auditorId}`,
    BY_PLANT: (plantId: number) => `/audits/plant/${plantId}`,
    BY_DEPARTMENT: (departmentId: number) => `/audits/department/${departmentId}`,
    OVERDUE: '/audits/overdue',
    STATISTICS: '/audits/statistics',
  },
  PERMITS: {
    BASE: '/permits',
    LIST: '/permits',
    CREATE: '/permits',
    UPDATE: (id: number) => `/permits/${id}`,
    DELETE: (id: number) => `/permits/${id}`,
    GET_BY_ID: (id: number) => `/permits/${id}`,
    SUBMIT: (id: number) => `/permits/${id}/submit`,
    APPROVE: (id: number) => `/permits/${id}/approve`,
    REJECT: (id: number) => `/permits/${id}/reject`,
    BY_STATUS: (status: string) => `/permits/status/${status}`,
    BY_REQUESTOR: (requestorId: number) => `/permits/requestor/${requestorId}`,
    BY_APPROVER: (approverId: number) => `/permits/approver/${approverId}`,
    BY_PLANT: (plantId: number) => `/permits/plant/${plantId}`,
    BY_DEPARTMENT: (departmentId: number) => `/permits/department/${departmentId}`,
    EXPIRING: (days: number) => `/permits/expiring/${days}`,
    STATISTICS: '/permits/statistics',
    GENERATE_NUMBER: '/permits/generate-number',
  },
  USERS: {
    BASE: '/users',
    LIST: '/users',
    CREATE: '/users',
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
    GET_BY_ID: (id: number) => `/users/${id}`,
    BY_ROLE: (role: string) => `/users/role/${role}`,
    BY_DEPARTMENT: (departmentId: number) => `/users/department/${departmentId}`,
    BY_PLANT: (plantId: number) => `/users/plant/${plantId}`,
  },
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// Routes
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  OBSERVATIONS: '/observations',
  AUDITS: '/audits',
  PERMITS: '/permits',
  USERS: '/users',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  REPORTS: '/reports',
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
export const APP_NAME = 'Safety Management System';

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
  {
    name: 'Reports',
    path: ROUTES.REPORTS,
    icon: 'reports',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
  },
] as const;