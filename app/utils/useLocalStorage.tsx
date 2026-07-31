"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const initialValueString = useMemo(
    () => JSON.stringify(initialValue),
    [initialValue],
  );

  const subscribe = useCallback((onStoreChange: () => void) => {
    if (typeof window === "undefined") {
      return () => {};
    }

    window.addEventListener("storage", onStoreChange);
    window.addEventListener("local-storage-update", onStoreChange);

    return () => {
      window.removeEventListener("storage", onStoreChange);
      window.removeEventListener("local-storage-update", onStoreChange);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") {
      return initialValueString;
    }

    try {
      return localStorage.getItem(key) ?? initialValueString;
    } catch {
      return initialValueString;
    }
  }, [key, initialValueString]);

  const rawValue = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => initialValueString,
  );

  const value = useMemo<T>(() => {
    try {
      return JSON.parse(rawValue) as T;
    } catch {
      return initialValue;
    }
  }, [rawValue, initialValue]);

  const setValue = useCallback(
    (updater: T | ((prev: T) => T)) => {
      if (typeof window === "undefined") return;

      try {
        const nextValue =
          typeof updater === "function"
            ? (updater as (prev: T) => T)(value)
            : updater;

        localStorage.setItem(key, JSON.stringify(nextValue));
        window.dispatchEvent(new Event("local-storage-update"));
      } catch (error) {
        console.error(`Error writing "${key}" to localStorage:`, error);
      }
    },
    [key, value],
  );

  return [value, setValue];
}
