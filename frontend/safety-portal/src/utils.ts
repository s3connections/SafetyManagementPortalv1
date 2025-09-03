import { VALIDATION } from './constants';
import { ApiResponse, User } from './types';

/**
 * Format date to human readable string
 */
export const formatDate = (
  date: string | Date,
  format: 'short' | 'long' | 'time' = 'short'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const optionsMap: Record<string, Intl.DateTimeFormatOptions> = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' }
  };

  return dateObj.toLocaleDateString('en-US', optionsMap[format]);
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const timeIntervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];

  for (const interval of timeIntervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

/**
 * Debounce function to limit the rate of function calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
};

/**
 * Throttle function to limit function execution frequency
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Storage utilities with error handling
 */
export const storage = {
  get: <T = any>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error);
      return defaultValue || null;
    }
  },

  set: <T = any>(key: string, value: T): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage for key "${key}":`, error);
      return false;
    }
  },

  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage for key "${key}":`, error);
      return false;
    }
  },

  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

/**
 * Session storage utilities
 */
export const sessionStorage = {
  get: <T = any>(key: string, defaultValue?: T): T | null => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error(`Error reading from sessionStorage for key "${key}":`, error);
      return defaultValue || null;
    }
  },

  set: <T = any>(key: string, value: T): boolean => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to sessionStorage for key "${key}":`, error);
      return false;
    }
  },

  remove: (key: string): boolean => {
    try {
      window.sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from sessionStorage for key "${key}":`, error);
      return false;
    }
  }
};

/**
 * Validation utilities
 */
export const validation = {
  email: (email: string): boolean => {
    return VALIDATION.EMAIL_REGEX.test(email.trim());
  },

  password: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      errors.push(`Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long`);
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return { isValid: errors.length === 0, errors };
  },

  phone: (phone: string): boolean => {
    return VALIDATION.PHONE_REGEX.test(phone.trim());
  },

  employeeId: (id: string): boolean => {
    return VALIDATION.EMPLOYEE_ID_REGEX.test(id.trim());
  },

  required: (value: any): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  }
};

/**
 * Format file size to human readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generate random ID
 */
export const generateId = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const cloned = {} as T;
    Object.keys(obj).forEach(key => {
      (cloned as any)[key] = deepClone((obj as any)[key]);
    });
    return cloned;
  }
  return obj;
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj: any): boolean => {
  if (obj == null) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  if (typeof obj === 'string') return obj.trim().length === 0;
  return false;
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert string to title case
 */
export const titleCase = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Format currency
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Parse query string to object
 */
export const parseQueryString = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
};

/**
 * Convert object to query string
 */
export const objectToQueryString = (obj: Record<string, any>): string => {
  const params = new URLSearchParams();
  
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      params.append(key, String(value));
    }
  });
  
  return params.toString();
};

/**
 * Array utilities
 */
export const arrayUtils = {
  removeDuplicates: <T>(array: T[], key?: keyof T): T[] => {
    if (!key) {
      // Use Array.from instead of spread for compatibility
      return Array.from(new Set(array));
    }
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  },

  chunk: <T>(array: T[], size: number): T[][] => {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  },

  groupBy: <T>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const value = String(item[key]);
      (groups[value] = groups[value] || []).push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  sortBy: <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
};

/**
 * Color utilities
 */
export const colorUtils = {
  hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  rgbToHex: (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },

  lighten: (hex: string, percent: number): string => {
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return hex;
    
    const { r, g, b } = rgb;
    const amount = Math.round(2.55 * percent);
    
    return colorUtils.rgbToHex(
      Math.min(255, r + amount),
      Math.min(255, g + amount),
      Math.min(255, b + amount)
    );
  },

  darken: (hex: string, percent: number): string => {
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return hex;
    
    const { r, g, b } = rgb;
    const amount = Math.round(2.55 * percent);
    
    return colorUtils.rgbToHex(
      Math.max(0, r - amount),
      Math.max(0, g - amount),
      Math.max(0, b - amount)
    );
  }
};

/**
 * API response handler
 */
export const handleApiResponse = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new Error(response.message || 'API request failed');
  }
  return response.data as T;
};

/**
 * Error handler for API calls
 */
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

/**
 * Get user display name
 */
export const getUserDisplayName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`.trim() || user.email;
};

/**
 * Get user initials
 */
export const getUserInitials = (user: User): string => {
  const firstName = user.firstName?.charAt(0) || '';
  const lastName = user.lastName?.charAt(0) || '';
  return (firstName + lastName).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U';
};

/**
 * Download file from blob
 */
export const downloadFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Scroll to element
 */
export const scrollToElement = (elementId: string, offset: number = 0): void => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth'
    });
  }
};

export {};