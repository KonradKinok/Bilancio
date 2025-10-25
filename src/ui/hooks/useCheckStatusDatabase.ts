import { useEffect, useState } from "react";
import { STATUS, DataBaseResponse } from "../../electron/sharedTypes/status";

export function useCheckStatusDatabase() {
  const [data, setData] = useState<ReturnStatusDbMessage | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatusDatabase = async (): Promise<ReturnStatusDbMessage> => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result: ReturnStatusDbMessage =
        await window.electron.checkStatusDatabase();
      if (result) {
        setData(result);
        setError(null);
      }
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Nieznany błąd";
      setError(errorMessage);
      return {
        status: 0,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  //Automatyczne wywołanie przy montowaniu hooka
  useEffect(() => {
    checkStatusDatabase();
  }, []);
  return { data, loading, error, checkStatusDatabase };
}