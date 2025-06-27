import { useState } from "react";
import { STATUS, DataBaseResponse } from "../../electron/sharedTypes/status";

export function useRestoreInvoice() {
  const [data, setData] = useState<ReturnInvoiceSave | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const restoreInvoice = async (
    invoiceId: number
  ): Promise<DataBaseResponse<ReturnInvoiceSave>> => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result: DataBaseResponse<ReturnInvoiceSave> =
        await window.electron.restoreInvoice(invoiceId);
      console.log("useRestoreInvoice", result);

      if (result.status === STATUS.Success) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.message || "Błąd podczas przywracania faktury");
      }
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Nieznany błąd";
      setError(errorMessage);
      return {
        status: STATUS.Error,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, restoreInvoice };
}