import { useCallback, useEffect, useState } from "react";
import { STATUS } from '../../electron/sharedTypes/status';

export function useAuth(login?: string, password?: string) {
  const [windowsUserName, setWindowsUserName] = useState<WindowsUsername | null>(null);
  const [loadingWindowsUserName, setLoadingWindowsUserName] = useState<boolean>(true);
  const [errorWindowsUserName, setErrorWindowsUserName] = useState<string | null>(null);
  const [userDb, setUserDb] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [errorAuth, setErrorAuth] = useState<string | null>(null);

  const windowsUserNameHostnameFunction = useCallback(async () => {
    setLoadingWindowsUserName(true);
    setErrorWindowsUserName(null);
    setUserDb(null); // Reset danych
    try {
      const result = await window.electron.getWindowsUsernameHostname();
      if (result.status === STATUS.Success) {
        setWindowsUserName(result.data);
        setErrorWindowsUserName(null);
      } else {
        setErrorWindowsUserName(result.message || "Błąd podczas pobierania danych użytkowników");
      }
    } catch (err) {
      setErrorWindowsUserName(err instanceof Error ? err.message : "Nieznany błąd");
    } finally {
      setLoadingWindowsUserName(false);
    }
  }, []);

  useEffect(() => {
    windowsUserNameHostnameFunction();
  }, [windowsUserNameHostnameFunction]);



  // Funkcja do pobierania danych z użyciem useCallback
  const autoLogin = useCallback(async () => {
    if (loadingWindowsUserName) {
      return; // Czekaj, aż dane z useWindowsUsernameHostname będą gotowe
    }

    if (!windowsUserName?.username) {
      await windowsUserNameHostnameFunction();
      if (!windowsUserName?.username) {
        setErrorAuth("Nie pobrano użytkownika z systemu");
        setLoadingWindowsUserName(false);
        return;
      }
    }
    setLoadingAuth(true);
    setErrorAuth(null);
    setUserDb(null); // Reset danych
    try {
      const result = await window.electron.getUserBySystemName(windowsUserName.username);
      if (result.status === STATUS.Success) {
        // Wzbogacanie obiektu userDb o pole Hostname
        const enrichedUser = {
          ...result.data,
          Hostname: windowsUserName?.hostname || null,
        };
        setUserDb(enrichedUser);
        setErrorAuth(null);
      } else {
        setErrorAuth(result.message || "Błąd podczas pobierania danych użytkowników");
      }
    } catch (err) {
      setErrorAuth(err instanceof Error ? err.message : "Nieznany błąd");
    } finally {
      setLoadingAuth(false);
    }
  }, [loadingWindowsUserName, windowsUserName?.hostname, windowsUserName?.username, windowsUserNameHostnameFunction]);

  useEffect(() => {
    autoLogin();
  }, [autoLogin]);


  return { userDb, loadingAuth, errorAuth, autoLogin };
}