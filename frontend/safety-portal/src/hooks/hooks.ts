import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { debounce, storage } from '../utils';
import { API_BASE_URL } from '../constants';
import { ApiResponse, PaginatedResponse, SearchParams } from '../types';

/**
 * Hook for managing loading states
 */
export const useLoading = (initialState: boolean = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), []);
  const toggleLoading = useCallback(() => setIsLoading(prev => !prev), []);

  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
  };
};

/**
 * Hook for managing async operations
 */
export const useAsync = <T, E = any>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
) => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const result = await asyncFunction();
      setData(result);
      setStatus('success');
      return result;
    } catch (error) {
      setError(error as E);
      setStatus('error');
      throw error;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    execute,
    status,
    data,
    error,
    isLoading: status === 'pending',
    isError: status === 'error',
    isSuccess: status === 'success',
  };
};

/**
 * Hook for debounced values
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for local storage
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = storage.get<T>(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storage.set(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      storage.remove(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

/**
 * Hook for previous value
 */
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

/**
 * Hook for window size
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 100);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

/**
 * Hook for media queries
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

/**
 * Hook for click outside detection
 */
export const useClickOutside = <T extends HTMLElement>(
  callback: () => void
): React.RefObject<T> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [callback]);

  return ref;
};

/**
 * Hook for keyboard shortcuts
 */
export const useKeyboard = (
  targetKey: string,
  callback: () => void,
  modifiers: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
  } = {}
) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { ctrl = false, alt = false, shift = false, meta = false } = modifiers;

      if (
        event.key === targetKey &&
        event.ctrlKey === ctrl &&
        event.altKey === alt &&
        event.shiftKey === shift &&
        event.metaKey === meta
      ) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [targetKey, callback, modifiers]);
};

/**
 * Hook for API calls with caching
 */
export const useApi = <T>(
  url: string,
  options: RequestInit = {},
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result.data || result);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [url, ...dependencies]);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

/**
 * Hook for pagination
 */
export const usePagination = <T>(
  initialData: T[] = [],
  initialPageSize: number = 10
) => {
  const [data, setData] = useState<T[]>(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);

  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const updatePageSize = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page
  }, []);

  return {
    data: currentData,
    totalPages,
    currentPage,
    pageSize,
    totalItems: data.length,
    setData,
    goToPage,
    nextPage,
    prevPage,
    updatePageSize,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

/**
 * Hook for search functionality
 */
export const useSearch = <T>(
  data: T[],
  searchKeys: (keyof T)[],
  initialQuery: string = ''
) => {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);

  const filteredData = useMemo(() => {
    if (!debouncedQuery.trim()) return data;

    return data.filter(item =>
      searchKeys.some(key => {
        const value = item[key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(debouncedQuery.toLowerCase());
        }
        if (typeof value === 'number') {
          return value.toString().includes(debouncedQuery);
        }
        return false;
      })
    );
  }, [data, searchKeys, debouncedQuery]);

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  return {
    query,
    setQuery,
    filteredData,
    clearSearch,
    resultsCount: filteredData.length,
    hasResults: filteredData.length > 0,
  };
};

/**
 * Hook for form management
 */
export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationRules?: Partial<Record<keyof T, (value: any) => string | undefined>>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const setFieldTouched = useCallback((name: keyof T, isTouched: boolean = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));
  }, []);

  const validateField = useCallback((name: keyof T) => {
    const rule = validationRules?.[name];
    if (rule) {
      const error = rule(values[name]);
      setErrors(prev => ({ ...prev, [name]: error }));
      return !error;
    }
    return true;
  }, [values, validationRules]);

  const validateForm = useCallback(() => {
    let isValid = true;
    const newErrors: Partial<Record<keyof T, string>> = {};

    if (validationRules) {
      Object.keys(validationRules).forEach(key => {
        const fieldName = key as keyof T;
        const rule = validationRules[fieldName];
        if (rule) {
          const error = rule(values[fieldName]);
          if (error) {
            newErrors[fieldName] = error;
            isValid = false;
          }
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  const handleSubmit = useCallback((onSubmit: (values: T) => void | Promise<void>) => {
    return async (event: React.FormEvent) => {
      event.preventDefault();

      if (validateForm()) {
        await onSubmit(values);
      }
    };
  }, [values, validateForm]);

  const reset = useCallback((newValues?: T) => {
    setValues(newValues || initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  }, [values, initialValues]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateField,
    validateForm,
    handleSubmit,
    reset,
    isDirty,
    isValid,
  };
};

/**
 * Hook for intersection observer (for infinite scrolling, lazy loading)
 */
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
): [React.RefObject<Element>, boolean] => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<Element>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [options]);

  return [targetRef, isIntersecting];
};

/**
 * Hook for query parameters
 */
export const useQueryParams = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  const getParam = useCallback((key: string): string | null => {
    return queryParams.get(key);
  }, [queryParams]);

  const setParam = useCallback((key: string, value: string) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set(key, value);
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
  }, [location.pathname, location.search, navigate]);

  const removeParam = useCallback((key: string) => {
    const newParams = new URLSearchParams(location.search);
    newParams.delete(key);
    const search = newParams.toString();
    navigate(`${location.pathname}${search ? `?${search}` : ''}`, { replace: true });
  }, [location.pathname, location.search, navigate]);

  return {
    queryParams,
    getParam,
    setParam,
    removeParam,
  };
};

export default {
  useLoading,
  useAsync,
  useDebounce,
  useLocalStorage,
  usePrevious,
  useWindowSize,
  useMediaQuery,
  useClickOutside,
  useKeyboard,
  useApi,
  usePagination,
  useSearch,
  useForm,
  useIntersectionObserver,
  useQueryParams,
};