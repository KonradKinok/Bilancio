import { useCallback, useEffect, useState } from "react";
import { STATUS } from '../../electron/sharedTypes/status';

export function useAuth(login?: string, password?: string) {
  const [windowsUserName, setWindowsUserName] = useState<WindowsUsername | null>(null);
  const [userDb, setUserDb] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const windowsUserNameFunction = useCallback(async () => {
    setLoading(true);
    setError(null);
    setUserDb(null); // Reset danych
    try {
      const result = await window.electron.getWindowsUsername();
      if (result.status === STATUS.Success) {
        setWindowsUserName(result.data);
        setError(null);
      } else {
        setError(result.message || "Błąd podczas pobierania danych użytkowników");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nieznany błąd");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    windowsUserNameFunction();
  }, [windowsUserNameFunction]);



  // Funkcja do pobierania danych z użyciem useCallback
  const autoLogin = useCallback(async () => {
    if (!windowsUserName?.username) {
      await windowsUserNameFunction();
      return;
    }
    if (!windowsUserName?.username) { setError("Nie pobrano użytkownika z systemu"); return null }
    setLoading(true);
    setError(null);
    setUserDb(null); // Reset danych
    try {
      const result = await window.electron.getUserBySystemName(windowsUserName.username);
      if (result.status === STATUS.Success) {
        setUserDb(result.data);
        setError(null);
      } else {
        setError(result.message || "Błąd podczas pobierania danych użytkowników");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nieznany błąd");
    } finally {
      setLoading(false);
    }
  }, [windowsUserName, windowsUserNameFunction]);

  useEffect(() => {
    autoLogin();
  }, [autoLogin]);

  const loginFunction = useCallback(async () => {
    if (!login || !password) { setError("Login i hasło muszą być uzupełnione"); return null }
    setLoading(true);
    setError(null);
    setUserDb(null); // Reset danych
    try {
      const result = await window.electron.loginUser(login, password);
      if (result.status === STATUS.Success) {
        setUserDb(result.data);
        setError(null);
      } else {
        setError(result.message || "Błąd podczas pobierania danych użytkowników");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nieznany błąd");
    } finally {
      setLoading(false);
    }
  }, [login, password]);

  const logoutFunction = () => {
    setUserDb(null);
  };
  return { windowsUserName, userDb, loading, error, autoLogin, loginFunction, logoutFunction, windowsUserNameFunction };
}