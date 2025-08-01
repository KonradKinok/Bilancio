import { useState, useEffect, useCallback } from "react";
import { STATUS, DataBaseResponse } from "../../electron/sharedTypes/status";

export function useAllActivityLog(
  page: number = 1,
  rowsPerPage: number = 10
) {
  const [dataAllActivityLog, setAllActivityLog] = useState<ActivityLog[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Pobierz liczbę aktywności
      const countResult = await window.electron.countActivityLog();
      if (countResult.status === STATUS.Success) {
        setTotalCount(countResult.data);
      } else {
        throw new Error(countResult.message || "Błąd podczas zliczania czynności");
      }

      // Pobierz dane aktywności z paginacją
      const result = await window.electron.getAllActivityLog(page, rowsPerPage);
      if (result.status === STATUS.Success) {
        console.log("useAllActivityLog", result.data)
        setAllActivityLog(result.data);
      } else {
        throw new Error(result.message || "Błąd podczas pobierania czynności");
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Funkcja do ponownego pobierania aktywności
  const getAllActivityLog = async () => {
    await fetchData();
  };
  return { data: dataAllActivityLog, totalCount, loading, error, getAllActivityLog };
}