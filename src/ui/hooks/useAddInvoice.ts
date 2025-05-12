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

  const addInvoice = async (invoice: InvoiceTable, invoiceDetails: InvoiceDetailsTable[]) => {
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
        setError(null);
      } else {
        setError(result.message || "Błąd podczas zapisywania faktury");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nieznany błąd");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, addInvoice };
}