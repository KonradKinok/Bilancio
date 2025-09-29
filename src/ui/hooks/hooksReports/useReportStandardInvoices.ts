import { useCallback, useEffect, useState } from "react";
import { DataBaseResponse, STATUS } from "../../../electron/sharedTypes/status";
// Funkcja pomocnicza do opóźnienia
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export function useReportStandardInvoices() {
  const [data, setData] = useState<ReportStandardInvoice[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Funkcja do pobierania danych z użyciem useCallback
  const getReportStandardInvoices = useCallback(async (reportCriteriaToDb: ReportCriteriaToDb[]): Promise<DataBaseResponse<ReportStandardInvoice[]>> => {
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
  const clearReport = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);
  return { data, loading, error, getReportStandardInvoices, clearReport };
}
