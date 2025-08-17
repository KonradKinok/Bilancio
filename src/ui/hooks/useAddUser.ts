import { useState } from "react";
import { STATUS, DataBaseResponse } from "../../electron/sharedTypes/status";

export function useAddUser() {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addUser = async (
    addedUser: User
  ): Promise<DataBaseResponse<User>> => {
    setLoading(true);
    setError(null);
    setData(null);
    console.log("useAddUser: ", addedUser);
    try {
      const result: DataBaseResponse<User> =
        await window.electron.saveUser(addedUser);
      if (result.status === STATUS.Success) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.message || "Błąd podczas dodawania użytkownika.");
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

  return { data, loading, error, addUser };
}