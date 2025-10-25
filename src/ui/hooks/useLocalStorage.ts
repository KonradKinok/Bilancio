import { useEffect, useState } from "react";

const DEFAULT_LOCAL_STORAGE_KEY = "__defaultLocalStorageKey";


/**
 * Hook z automatyczną walidacją i naprawą danych w localStorage.
 * Jeśli dane w localStorage nie pasują do oczekiwanej struktury, zostaną nadpisane wartościami domyślnymi.
 */
export const useLocalStorage = <T>(
  initialValue: T,
  localStorageKey = DEFAULT_LOCAL_STORAGE_KEY
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [stateLocalStorage, setStateLocalStorage] = useState<T>(() => {
    try {
      const localValue = window.localStorage.getItem(localStorageKey);
      if (!localValue) return initialValue;

      const parsedValue = JSON.parse(localValue);

      // Sprawdzenie poprawności struktury obiektu — czy posiada wszystkie klucze z initialValue
      const isValid = validateStructure(parsedValue, initialValue);

      if (!isValid) {
        console.warn(
          `[useLocalStorage]: Nieprawidłowa struktura klucza "${localStorageKey}". Przywracanie wartości domyślnych.`
        );
        window.localStorage.setItem(
          localStorageKey,
          JSON.stringify(initialValue)
        );
        return initialValue;
      }

      return parsedValue;
    } catch (error) {
      console.error(
        `[useLocalStorage]: Nie udało się przeanalizować ani zweryfikować klucza "${localStorageKey}" z Local Storage. Użyto wartości domyślnej.`,
        error
      );
      window.localStorage.setItem(localStorageKey, JSON.stringify(initialValue));
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(
        localStorageKey,
        JSON.stringify(stateLocalStorage)
      );
    } catch (error) {
      console.error(
        `Błąd zapisu "${localStorageKey}" do Local Storage.`,
        error
      );
    }
  }, [localStorageKey, stateLocalStorage]);

  return [stateLocalStorage, setStateLocalStorage];
};

/**
 * Funkcja sprawdzająca, czy struktura obiektu `value`
 * pasuje do struktury `template` (czy ma te same pola, nawet zagnieżdżone).
 */

function validateStructure(value: unknown, template: unknown): boolean {
  if (typeof value !== typeof template) return false;

  if (typeof value !== "object" || value === null || template === null)
    return true;

  // Rzutowanie po sprawdzeniu typu, więc jest bezpieczne
  const valueObj = value as Record<string, unknown>;
  const templateObj = template as Record<string, unknown>;

  for (const key of Object.keys(templateObj)) {
    if (!(key in valueObj)) return false;
    if (!validateStructure(valueObj[key], templateObj[key])) return false;
  }

  return true;
}

// export const useLocalStorage =<T> (
//   initialValue:T,
//   localStorageKey = DEFAULT_LOCAL_STORAGE_KEY
// ): [T, React.Dispatch<React.SetStateAction<T>>] => {
//   const [stateLocalStorage, setStateLocalStorage] = useState<T>(() => {
//     try {
//       const localValue = window.localStorage.getItem(localStorageKey);
//       return localValue ? JSON.parse(localValue) : initialValue;
//     } catch (error) {
//       console.error(
//         `Failed to get "${localStorageKey}" value from Local Storage. Returning initial value.`,
//         error
//       );
//       return initialValue;
//     }
//   });

//   useEffect(() => {
//     window.localStorage.setItem(localStorageKey, JSON.stringify(stateLocalStorage));
//   }, [localStorageKey, stateLocalStorage]);

//   return [stateLocalStorage, setStateLocalStorage];
// };