import { useCallback, useEffect, useState } from "react";
import { DataBaseResponse, STATUS } from "../../electron/sharedTypes/status";

export function useReportStandardInvoices() {
  const [data, setData] = useState<AllInvoices[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Funkcja do pobierania danych z użyciem useCallback
  const getReportStandardInvoices = useCallback(async (reportCriteriaToDb: ReportCriteriaToDb[]): Promise<DataBaseResponse<AllInvoices[]>> => {
    setLoading(true);
    setError(null);
    setData(null); // Reset danych
    try {
      const result = await window.electron.getReportStandardAllInvoices(reportCriteriaToDb);
      if (result.status === STATUS.Success) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.message || "Błąd podczas generowania raportu");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Nieznany błąd";
      setError(errorMessage);
      return {
        status: STATUS.Error,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, getReportStandardInvoices };
}
