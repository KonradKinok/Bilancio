import { useState } from "react";
import { STATUS, DataBaseResponse } from "../../electron/sharedTypes/status";

interface AddInvoiceResponse {
  changes: number;
  lastID: number;
}

export function useAddInvoice() {
  const [data, setData] = useState<ReturnInvoiceSave | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addInvoice = async (invoice: InvoiceTable, invoiceDetails: InvoiceDetailsTable[]): Promise<DataBaseResponse<ReturnInvoiceSave>> => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result: DataBaseResponse<ReturnInvoiceSave> = await window.electron.addInvoiceDetails(
        invoice,
        invoiceDetails
      );
      console.log("useAddInvoice", result);

      if (result.status === STATUS.Success ) {
        setData(result.data);
        console.log("useAddInvoice result.data", result.data);
        setError(null);
      } else {
        setError(result.message || "Błąd podczas zapisywania faktury");
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nieznany błąd");
      const errorMessage = err instanceof Error ? err.message : "Nieznany błąd";
      setError(errorMessage);
      return {
        status: STATUS.Error,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, addInvoice };
}