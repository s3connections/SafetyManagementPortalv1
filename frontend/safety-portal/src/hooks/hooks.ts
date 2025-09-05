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

// ✅ FIXED: Custom hook for previous value
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T | undefined>(undefined); // ✅ FIXED: Added undefined initial value
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
};