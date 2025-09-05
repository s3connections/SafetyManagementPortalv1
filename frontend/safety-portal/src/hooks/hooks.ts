import { useState, useEffect, useRef, RefObject } from 'react';

// Custom hook for local storage
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

// Custom hook for debounced value
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

// ✅ FIXED: Custom hook for previous value
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T | undefined>(undefined); // ✅ FIXED: Explicit undefined initial value
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
};

// Custom hook for window size
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
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

// ✅ FIXED: Custom hook for click outside - proper generic constraint
export const useClickOutside = <T extends HTMLElement>(
  callback: () => void
): RefObject<T> => {
  const ref = useRef<T>(null); // ✅ FIXED: Proper generic typing with constraint

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

// ✅ FIXED: Custom hook for keyboard shortcut
export const useKeyboardShortcut = (
  keys: string[],
  callback: (event: KeyboardEvent) => void,
  node: HTMLElement | null = null
) => {
  useEffect(() => {
    const targetNode = node ?? document;
    const handleKeyPress = (event: KeyboardEvent) => {
      const pressedKeys: string[] = []; // ✅ FIXED: Explicit typing
      
      if (event.ctrlKey) pressedKeys.push('ctrl');
      if (event.shiftKey) pressedKeys.push('shift');
      if (event.altKey) pressedKeys.push('alt');
      if (event.metaKey) pressedKeys.push('meta');
      
      pressedKeys.push(event.key.toLowerCase());
      
      const normalizedKeys = keys.map(key => key.toLowerCase());
      
      if (normalizedKeys.every(key => pressedKeys.includes(key)) && 
          normalizedKeys.length === pressedKeys.length) {
        event.preventDefault();
        callback(event);
      }
    };

    targetNode.addEventListener('keydown', handleKeyPress as EventListener);
    return () => targetNode.removeEventListener('keydown', handleKeyPress as EventListener);
  }, [keys, callback, node]);
};

// ✅ FIXED: Custom hook for intersection observer - return proper types
export const useIntersectionObserver = (
  options?: IntersectionObserverInit
): [RefObject<HTMLElement>, boolean] => { // ✅ FIXED: Specific element type
  const targetRef = useRef<HTMLElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

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

  return [targetRef, isIntersecting]; // ✅ FIXED: Return properly typed RefObject
};

// Custom hook for toggle
export const useToggle = (initialValue = false): [boolean, () => void] => {
  const [value, setValue] = useState(initialValue);

  const toggle = () => {
    setValue(prevValue => !prevValue);
  };

  return [value, toggle];
};