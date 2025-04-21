import { useState, useEffect } from "react";
import {DbTables} from "../../electron/dataBase/enum"

import  { STATUS, DataBaseResponse, isSuccess } from '../../electron/sharedTypes/status';
export function useConnectedTableDictionary<T>(tableName:DbTables, documentId?:number, mainTypeId?:number, typeId?:number, subTypeId?:number) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: DataBaseResponse<T[]> = await window.electron.getConnectedTableDictionary<T>(tableName,documentId||null, mainTypeId, typeId, subTypeId);
        console.log("frontend useConnectedTableDictionary", result);
         if (result.status === STATUS.Success) {
           setData(result.data); // ustawiamy dane z odpowiedzi
           setError(null);
        } else {
          setError(result.message || "useConnectedTableDictionary Błąd podczas pobierania danych");
        }
      } catch (err) {
         setError(err instanceof Error ? err.message : "Nieznany błąd");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName,documentId, mainTypeId, typeId, subTypeId]);

  return { data, loading, error };
}

