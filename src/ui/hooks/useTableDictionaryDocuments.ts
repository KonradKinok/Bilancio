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
export function useTableDictionaryDocuments() {
  const [data, setData] = useState<DictionaryDocuments[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await window.electron.getTableDictionaryDocuments();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

