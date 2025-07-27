import { useState } from "react";
import { STATUS, DataBaseResponse } from "../../electron/sharedTypes/status";

export function useAddActivityLogs() {
  const [data, setData] = useState<ReturnMessageFromDb | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addActivityLogs = async (
    addedActivityLogs: ActivityLog
  ): Promise<DataBaseResponse<ReturnMessageFromDb>> => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result: DataBaseResponse<ReturnMessageFromDb> =
        await window.electron.saveActivityLog(addedActivityLogs);
      if (result.status === STATUS.Success) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.message || "Błąd podczas dodawania czynności.");
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

  return { data, loading, error, addActivityLogs };
}