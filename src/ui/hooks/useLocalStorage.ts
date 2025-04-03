import { useEffect, useState } from "react";

const DEFAULT_LOCAL_STORAGE_KEY = "__defaultLocalStorageKey";

export const useLocalStorage =<T> (
  initialValue:T,
  localStorageKey = DEFAULT_LOCAL_STORAGE_KEY
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [stateLocalStorage, setStateLocalStorage] = useState<T>(() => {
    try {
      const localValue = window.localStorage.getItem(localStorageKey);
      return localValue ? JSON.parse(localValue) : initialValue;
    } catch (error) {
      console.error(
        `Failed to get "${localStorageKey}" value from Local Storage. Returning initial value.`,
        error
      );
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(localStorageKey, JSON.stringify(stateLocalStorage));
  }, [localStorageKey, stateLocalStorage]);

  return [stateLocalStorage, setStateLocalStorage];
};