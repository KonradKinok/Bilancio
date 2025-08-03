import { useCallback, useEffect, useState } from "react";
import { STATUS } from '../../electron/sharedTypes/status';

export function useUsers(isDeleted?: 0 | 1) {
  const [data, setData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Funkcja do pobierania danych z użyciem useCallback
  const getUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    setData(null); // Reset danych
    try {
      const result = await window.electron.getAllUsers(isDeleted);
      if (result.status === STATUS.Success) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.message || "Błąd podczas pobierania danych użytkowników");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nieznany błąd");
    } finally {
      setLoading(false);
    }
  }, [isDeleted]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);
  return { data, loading, error, getUsers };
}