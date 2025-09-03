export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Observations
  OBSERVATIONS: {
    BASE: '/observations',
    LIST: '/observations',
    CREATE: '/observations',
    UPDATE: (id: number) => `/observations/${id}`,
    DELETE: (id: number) => `/observations/${id}`,
    CLOSE: (id: number) => `/observations/${id}/close`,
    UPLOAD_IMAGE: (id: number) => `/observations/${id}/upload-image`,
    GET_BY_ID: (id: number) => `/observations/${id}`,
  },
  
  // Incidents
  INCIDENTS: {
    BASE: '/incidents',
    LIST: '/incidents',
    CREATE: '/incidents',
    UPDATE: (id: number) => `/incidents/${id}`,
    DELETE: (id: number) => `/incidents/${id}`,
    GET_BY_ID: (id: number) => `/incidents/${id}`,
    INVESTIGATE: (id: number) => `/incidents/${id}/investigate`,
    CLOSE: (id: number) => `/incidents/${id}/close`,
  },
  
  // Audits
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
  },
  
  // Permits
  PERMITS: {
    BASE: '/permits',
    LIST: '/permits',
    CREATE: '/permits',
    UPDATE: (id: number) => `/permits/${id}`,
    DELETE: (id: number) => `/permits/${id}`,
    GET_BY_ID: (id: number) => `/permits/${id}`,
    APPROVE: (id: number) => `/permits/${id}/approve`,
    ACTIVATE: (id: number) => `/permits/${id}/activate`,
    COMPLETE: (id: number) => `/permits/${id}/complete`,
    CANCEL: (id: number) => `/permits/${id}/cancel`,
  },
  
  // Users
  USERS: {
    BASE: '/users',
    LIST: '/users',
    CREATE: '/users',
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
    GET_BY_ID: (id: number) => `/users/${id}`,
    ACTIVATE: (id: number) => `/users/${id}/activate`,
    DEACTIVATE: (id: number) => `/users/${id}/deactivate`,
    CHANGE_PASSWORD: (id: number) => `/users/${id}/change-password`,
    RESET_PASSWORD: (id: number) => `/users/${id}/reset-password`,
  },
  
  // Organizations
  PLANTS: {
    BASE: '/plants',
    LIST: '/plants',
    CREATE: '/plants',
    UPDATE: (id: number) => `/plants/${id}`,
    DELETE: (id: number) => `/plants/${id}`,
    GET_BY_ID: (id: number) => `/plants/${id}`,
    DEPARTMENTS: (id: number) => `/plants/${id}/departments`,
  },
  
  DEPARTMENTS: {
    BASE: '/departments',
    LIST: '/departments',
    CREATE: '/departments',
    UPDATE: (id: number) => `/departments/${id}`,
    DELETE: (id: number) => `/departments/${id}`,
    GET_BY_ID: (id: number) => `/departments/${id}`,
    BY_PLANT: (plantId: number) => `/departments/by-plant/${plantId}`,
  },
  
  // Reports and Analytics
  REPORTS: {
    DASHBOARD_STATS: '/reports/dashboard-stats',
    OBSERVATION_TRENDS: '/reports/observation-trends',
    INCIDENT_ANALYSIS: '/reports/incident-analysis',
    AUDIT_COMPLIANCE: '/reports/audit-compliance',
    PERMIT_UTILIZATION: '/reports/permit-utilization',
    EXPORT_OBSERVATIONS: '/reports/export-observations',
    EXPORT_INCIDENTS: '/reports/export-incidents',
    EXPORT_AUDITS: '/reports/export-audits',
    EXPORT_PERMITS: '/reports/export-permits',
  },
  
  // File uploads
  FILES: {
    UPLOAD: '/files/upload',
    DOWNLOAD: (id: string) => `/files/download/${id}`,
    DELETE: (id: string) => `/files/delete/${id}`,
  },
  
  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/mark-read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
    DELETE: (id: string) => `/notifications/${id}`,
  }
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Request timeout configurations
export const TIMEOUT_CONFIG = {
  DEFAULT: 30000, // 30 seconds
  UPLOAD: 60000,  // 60 seconds for file uploads
  DOWNLOAD: 120000, // 2 minutes for downloads
} as const;

// API Response status messages
export const API_MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  ERROR: 'An error occurred while processing your request',
  VALIDATION_ERROR: 'Please check your input and try again',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  SERVER_ERROR: 'Server error occurred. Please try again later',
  NETWORK_ERROR: 'Network error. Please check your connection',
} as const;

// Default pagination settings
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

// Export utility function to build API URLs
export const buildApiUrl = (endpoint: string, params?: Record<string, any>): string => {
  let url = `${API_BASE_URL}${endpoint}`;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  return url;
};

export default API_ENDPOINTS;