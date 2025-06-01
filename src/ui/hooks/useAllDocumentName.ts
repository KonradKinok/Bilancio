import { useState, useEffect } from "react";
import { STATUS, DataBaseResponse, isSuccess } from '../../electron/sharedTypes/status';

export function useAllDocumentsName() {
  const [data, setData] = useState<AllDocumentsName[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await window.electron.getAllDocumentsName();
        if (result.status === STATUS.Success) {
                setData(result.data);
                setError(null);
              } else {
                setError(result.message || "Błąd podczas pobierania danych");
              }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nieznany błąd");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}