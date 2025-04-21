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
      let shouldFetch = false;

      switch (tableName) {
        case DbTables.DictionaryDocuments:
          shouldFetch = true;
          break;
        case DbTables.DictionaryMainType:
          shouldFetch = !!documentId;
          break;
        case DbTables.DictionaryType:
          shouldFetch = !!documentId && !!mainTypeId;
          break;
        case DbTables.DictionarySubtype:
          shouldFetch = !!documentId && !!mainTypeId && !!typeId;
          break;
        default:
          shouldFetch = false;
      }

      if (!shouldFetch) {
        setData(null);
        setLoading(false);
        return;
      }

      const result: DataBaseResponse<T[]> = await window.electron.getConnectedTableDictionary<T>(
        tableName, documentId, mainTypeId, typeId, subTypeId
      );

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
}, [tableName, documentId, mainTypeId, typeId, subTypeId]);

  return { data, loading, error };
}

