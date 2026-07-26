import { useSyncExternalStore, useCallback } from "react";

// Helper hook to subscribe to localStorage safely in Next.js
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
  // 1. Subscribe to storage changes (and custom local events)
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener("storage", onChange);
    window.addEventListener("local-storage-update", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("local-storage-update", onChange);
    };
  }, []);

  // 2. Client snapshot reader
  const getSnapshot = useCallback(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? item : JSON.stringify(initialValue);
    } catch {
      return JSON.stringify(initialValue);
    }
  }, [key, initialValue]);

  // 3. SSR fallback snapshot
  const getServerSnapshot = useCallback(() => {
    return JSON.stringify(initialValue);
  }, [initialValue]);

  const rawValue = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // 4. Setter function
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const currentValue = JSON.parse(rawValue) as T;
        const nextValue =
          value instanceof Function ? value(currentValue) : value;
        localStorage.setItem(key, JSON.stringify(nextValue));
        // Dispatch custom event so other components or hooks update immediately
        window.dispatchEvent(new Event("local-storage-update"));
      } catch (error) {
        console.error(`Error writing key "${key}" to localStorage:`, error);
      }
    },
    [key, rawValue],
  );

  return [JSON.parse(rawValue) as T, setValue];
}
