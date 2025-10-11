import { useCallback, useState } from "react";

export function useExportStandardDocumentsReportToXLSX() {
  const [data, setData] = useState<ReturnStatusDbMessage | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Funkcja do pobierania danych z użyciem useCallback
  const exportStandardDocumentsReportToXLSX = useCallback(async (reportCriteriaToDb: ReportCriteriaToDb[], dataReportStandardInvoices: ReportStandardInvoice[], documentsReadyForDisplay: string[], reportDocumentsToTable: ReportAllDocumentsToTable[]): Promise<ReturnStatusDbMessage> => {
    setLoading(true);
    setError(null);
    setData(null); // Reset danych
    try {
      const result = await window.electron.exportStandardDocumentsReportToXLSX(reportCriteriaToDb, dataReportStandardInvoices, documentsReadyForDisplay, reportDocumentsToTable);
      setData(result);
      setError(null);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Nieznany błąd";
      setError(errorMessage);
      return {
        status: 2,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, exportStandardDocumentsReportToXLSX };
}
