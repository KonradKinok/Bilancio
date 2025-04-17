import { useState, useEffect } from "react";

// type FetchState<T> = {
//   data: T | null;
//   loading: boolean;
//   error: Error | null;
// };

// export function useFetch<T>(fetchFunction: () => Promise<T>): FetchState<T> {
//   const [data, setData] = useState<T | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<Error | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const result = await fetchFunction();
//         setData(result);
//       } catch (err) {
//         setError(err as Error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [fetchFunction]);

//   return { data, loading, error };
// }
// const fetchDocuments = async (): Promise<DictionaryDocuments[]> => {
//   return await window.electron.getTableDictionaryDocuments();
// };

// function DocumentsComponent() {
//   const { data: documents, loading, error } = useFetch<DictionaryDocuments[]>(fetchDocuments);
import  { STATUS, DataBaseResponse, isSuccess } from './../../sharedTypes/status';
export function useTableDictionaryDocuments() {
  const [data, setData] = useState<DictionaryDocuments[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: DataBaseResponse<DictionaryDocuments[]> = await window.electron.getTableDictionaryDocuments();
        console.log("frontend useTableDictionaryDocuments", result);
         if (result.status === STATUS.Success) {
           setData(result.data); // ustawiamy dane z odpowiedzi
           setError(null);
        } else {
          setError(result.message || "useTableDictionaryDocuments Błąd podczas pobierania danych");
        }
      } catch (err) {
         setError(err instanceof Error ? err.message : "Nieznany błąd");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

