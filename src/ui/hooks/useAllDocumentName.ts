import { useState, useEffect, useCallback } from "react";
import { STATUS, DataBaseResponse, isSuccess } from '../../electron/sharedTypes/status';

export function useAllDocumentsName() {
  const [data, setData] = useState<AllDocumentsName[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

 // Funkcja do pobierania danych z użyciem useCallback
 const fetchData = useCallback(async () => {
  setLoading(true);
  setError(null);
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
}, []); // Pusta tablica zależności, bo fetchData nie zależy od żadnych zewnętrznych zmiennych

// Efekt początkowego pobierania danych
useEffect(() => {
  fetchData();
}, [fetchData]);

// Funkcja do ponownego pobierania dokumentów
const getAllDocuments = async () => {
  await fetchData();
};

  return { data, loading, error, getAllDocuments };
}