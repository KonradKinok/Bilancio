import { useState } from "react";
import { STATUS, DataBaseResponse } from "../../electron/sharedTypes/status";

export function useUpdateInvoice() {
  const [data, setData] = useState<ReturnMessageFromDb | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateInvoice = async (invoice: InvoiceTable, invoiceDetails: InvoiceDetailsTable[]): Promise<DataBaseResponse<ReturnMessageFromDb>> => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result: DataBaseResponse<ReturnMessageFromDb> = await window.electron.updateInvoice(
        invoice,
        invoiceDetails
      );
      console.log("useUpdateInvoice", result);

      if (result.status === STATUS.Success ) {
        setData(result.data);
        console.log("useUpdateInvoice result.data", result.data);
        setError(null);
      } else {
        setError(result.message || "useUpdateInvoice Błąd podczas zapisywania faktury");
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "useUpdateInvoice Nieznany błąd");
      const errorMessage = err instanceof Error ? err.message : "useUpdateInvoice Nieznany błąd";
      setError(errorMessage);
      return {
        status: STATUS.Error,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, updateInvoice };
}