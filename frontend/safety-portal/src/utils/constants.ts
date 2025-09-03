// Application Constants
export const APP_NAME = "Safety Management";
export const VERSION = "1.0.0";

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
export const API_VERSION = "v1";
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    VERIFY: "/auth/verify",
  },
  USERS: {
    GET_PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/profile",
    GET_ALL: "/users",
  },
  DASHBOARD: {
    STATS: "/dashboard/stats",
    ANALYTICS: "/dashboard/analytics",
  },
} as const;

// Route Paths
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  USERS: "/users",
  ANALYTICS: "/analytics",
} as const;

// Theme Configuration
export const THEME = {
  COLORS: {
    PRIMARY: "#3B82F6",
    SECONDARY: "#6366F1",
    SUCCESS: "#10B981",
    WARNING: "#F59E0B",
    ERROR: "#EF4444",
    INFO: "#06B6D4",
    BACKGROUND: {
      PRIMARY: "#FFFFFF",
      SECONDARY: "#F9FAFB",
      DARK: "#1F2937",
    },
    TEXT: {
      PRIMARY: "#111827",
      SECONDARY: "#6B7280",
      MUTED: "#9CA3AF",
    },
  },
  SPACING: {
    XS: "0.25rem",
    SM: "0.5rem",
    MD: "1rem",
    LG: "1.5rem",
    XL: "2rem",
    XXL: "3rem",
  },
  BREAKPOINTS: {
    SM: "640px",
    MD: "768px",
    LG: "1024px",
    XL: "1280px",
  },
} as const;

// Navigation Menu Items
export const SIDEBAR_MENU_ITEMS = [
  {
    label: "Dashboard",
    path: ROUTES.DASHBOARD,
    icon: "dashboard",
    roles: ["admin", "user"],
  },
  {
    label: "Users",
    path: ROUTES.USERS,
    icon: "users",
    roles: ["admin"],
  },
  {
    label: "Analytics",
    path: ROUTES.ANALYTICS,
    icon: "analytics",
    roles: ["admin", "user"],
  },
  {
    label: "Settings",
    path: ROUTES.SETTINGS,
    icon: "settings",
    roles: ["admin", "user"],
  },
] as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_PREFERENCES: "user_preferences",
  THEME: "app_theme",
} as const;

// Application Settings
export const APP_SETTINGS = {
  TOKEN_EXPIRY_TIME: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  NOTIFICATION_DURATION: 5000, // 5 seconds
  PAGINATION_SIZE: 20,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FILE_TYPES: [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"],
} as const;

// User Roles and Permissions
export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
  VIEWER: "viewer",
} as const;

export const PERMISSIONS = {
  READ: "read",
  WRITE: "write",
  DELETE: "delete",
  ADMIN: "admin",
} as const;

// Form Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: "Something went wrong. Please try again.",
  NETWORK: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to access this resource.",
  FORBIDDEN: "Access denied.",
  NOT_FOUND: "Resource not found.",
  VALIDATION_FAILED: "Please check your input and try again.",
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
