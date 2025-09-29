import { useCallback, useState } from "react";

export function useExportStandardInvoiceReportToPDF() {
  const [data, setData] = useState<ReturnStatusDbMessage | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Funkcja do pobierania danych z użyciem useCallback
  const exportPdfReportStandardInvoices = useCallback(async (dataReportStandardInvoices: ReportStandardInvoice[]): Promise<ReturnStatusDbMessage> => {
    setLoading(true);
    setError(null);
    setData(null); // Reset danych
    try {
      const result = await window.electron.exportStandardInvoiceReportToPDF(dataReportStandardInvoices);
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

  return { data, loading, error, exportPdfReportStandardInvoices };
}
