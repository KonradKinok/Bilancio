import { useCallback, useEffect, useState } from "react";
import { STATUS } from '../../electron/sharedTypes/status';

export function useAuth(login?: string, password?: string) {
  const [userDb, setUserDb] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [errorAuth, setErrorAuth] = useState<string | null>(null);

  const autoLogin = useCallback(async () => {

    setLoadingAuth(true);
    setErrorAuth(null);
    setUserDb(null); // Reset danych
    try {
      const result = await window.electron.getUserBySystemName();
      if (result.status === STATUS.Success) {
        setUserDb(result.data);
        setErrorAuth(null);
      } else {
        setErrorAuth(result.message || "Błąd podczas pobierania danych użytkowników");
      }
    } catch (err) {
      setErrorAuth(err instanceof Error ? err.message : "Nieznany błąd");
    } finally {
      setLoadingAuth(false);
    }
  }, []);
  useEffect(() => {
    autoLogin();
  }, [autoLogin]);


  return { userDb, loadingAuth, errorAuth, autoLogin };
}