import { useEffect, useRef, useState, useCallback, RefObject } from 'react';

// ✅ FIXED: Custom hook for outside click detection
export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  callback: () => void
): RefObject<T> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [callback]);

  return ref;
};

// ✅ FIXED: Custom hook for keyboard shortcut
export const useKeyboardShortcut = (
  keys: string[],
  callback: (event: KeyboardEvent) => void,
  node: HTMLElement | null = null
) => {
  useEffect(() => {
    const targetNode = node || document;
    
    // ✅ FIXED: Proper event handler typing
    const handleKeyPress = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (keys.every(key => {
        // Handle modifier keys
        if (key === 'ctrl') return keyboardEvent.ctrlKey;
        if (key === 'shift') return keyboardEvent.shiftKey;
        if (key === 'alt') return keyboardEvent.altKey;
        if (key === 'meta') return keyboardEvent.metaKey;
        
        // Handle regular keys
        return keyboardEvent.key.toLowerCase() === key.toLowerCase();
      })) {
        callback(keyboardEvent);
      }
    };

    targetNode.addEventListener('keydown', handleKeyPress);
    
    return () => {
      targetNode.removeEventListener('keydown', handleKeyPress);
    };
  }, [keys, callback, node]);
};

// ✅ FIXED: Custom hook for debouncing
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// ✅ FIXED: Custom hook for local storage
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// ✅ FIXED: Custom hook for intersection observer
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
): [RefObject<HTMLElement>, boolean] => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [options]);

  return [targetRef, isIntersecting];
};

// ✅ FIXED: Custom hook for toggle
export const useToggle = (initialValue: boolean = false): [boolean, () => void] => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  return [value, toggle];
};

// ✅ FIXED: Custom hook for previous value
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T | undefined>(undefined); // ✅ FIXED: Added explicit undefined
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
};

// Custom hook for async operation
export const useAsync = <T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
) => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setValue(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setValue(response);
      setStatus('success');
    } catch (error) {
      setError(error as E);
      setStatus('error');
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error };
};

// Custom hook for window size
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Custom hook for media query
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};