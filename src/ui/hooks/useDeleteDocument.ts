import { useState } from "react";
import { STATUS, DataBaseResponse } from "../../electron/sharedTypes/status";

export function useDeleteDocument() {
  const [data, setData] = useState<AllDocumentsNameTable | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteDocument = async (
    documentId: number
  ): Promise<DataBaseResponse<AllDocumentsNameTable>> => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result: DataBaseResponse<AllDocumentsNameTable> =
        await window.electron.deleteRestoreDocument(documentId, 1);

      if (result.status === STATUS.Success) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.message || "Błąd podczas usuwania dokumentu");
      }
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Błąd podczas usuwania dokumentu";
      setError(errorMessage);
      return {
        status: STATUS.Error,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, deleteDocument };
}

