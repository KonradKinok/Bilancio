
import { useState, useEffect, useCallback } from "react";
import { STATUS } from "../../electron/sharedTypes/status";

export function useAllInvoices(
  formValuesHomePage: FormValuesHomePage,
  page: number = 1,
  rowsPerPage: number = 10
) {
  const [dataAllInvoices, setDataAllInvoices] = useState<AllInvoices[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      console.log("useAllInvoices", formValuesHomePage);
      // Pobierz liczbę faktur
      const countResult = await window.electron.countInvoices(formValuesHomePage);
      if (countResult.status === STATUS.Success) {
        setTotalCount(countResult.data);
      } else {
        throw new Error(countResult.message || "Błąd podczas zliczania faktur");
      }

      // Pobierz dane faktur z paginacją
      const result = await window.electron.getAllInvoices(formValuesHomePage, page, rowsPerPage);
      if (result.status === STATUS.Success) {
        const transformedData = result.data.map((invoice) => {
          const fieldsToSplit = [
            "DocumentIds",
            "DocumentNames",
            "MainTypeIds",
            "MainTypeNames",
            "TypeIds",
            "TypeNames",
            "SubtypeIds",
            "SubtypeNames",
            "Quantities",
            "Prices",
          ];
          const transformedInvoice = { ...invoice };
          fieldsToSplit.forEach((field) => {
            const fieldValue = transformedInvoice[field] as unknown as string;
            if (fieldValue) {
              transformedInvoice[field] = fieldValue.includes(";")
                ? fieldValue.split(";")
                : [fieldValue];
            }
          });
          return transformedInvoice;
        });
        setDataAllInvoices(transformedData);
      } else {
        throw new Error(result.message || "Błąd podczas pobierania faktur");
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [formValuesHomePage, page, rowsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data: dataAllInvoices, totalCount, loading, error, refetch: fetchData };
}