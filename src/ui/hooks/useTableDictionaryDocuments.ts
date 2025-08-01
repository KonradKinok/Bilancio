import { useState, useEffect } from "react";
import { DbTables } from "./../../electron/dataBase/enum"
import { STATUS, DataBaseResponse } from '../../electron/sharedTypes/status';

export function useTableDictionaryDocuments<T>(tableName: DbTables) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: DataBaseResponse<T[]> = await window.electron.getTableDictionaryDocuments<T>(tableName);
        console.log("frontend useTableDictionaryDocuments", result);
        if (result.status === STATUS.Success) {
          setData(result.data); // ustawiamy dane z odpowiedzi
          setError(null);
        } else {
          setError(result.message || "useTableDictionaryDocuments Błąd podczas pobierania danych");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nieznany błąd");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName]);

  return { data, loading, error };
}

