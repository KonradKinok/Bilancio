
import { useState, useEffect, useCallback } from "react";
import { useMainDataContext } from "../components/Context/useOptionsImage";
// import { type FormValuesHomePage } from "../components/Context/ElectronProvider";
import { STATUS, DataBaseResponse } from "../../electron/sharedTypes/status";

export function useAllInvoices(
  formValuesHomePage: FormValuesHomePage,
  page: number = 1,
  rowsPerPage: number = 10
) {
  const [dataAllInvoices, setDataAllInvoices] = useState<AllInvoices[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

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


// export function useAllInvoices(formValuesHomePage: FormValuesHomePage) {
//   const [dataAllInvoices, setDataAllInvoices] = useState<AllInvoices[] | null>(null);
//   const [data, setData] = useState<AllInvoices[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<Error | null>(null);

// const fetchData = useCallback(async () => {
//   try {
//     setLoading(true);
//     console.log("useAllInvoices()", {formValuesHomePage})
//     const result = await window.electron.getAllInvoices(formValuesHomePage);

//     setDataAllInvoices(result);
//   } catch (err) {
//     setError(err as Error);
//   } finally {
//     setLoading(false);
//   }
// }, [formValuesHomePage]);
  
//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   useEffect(() => {
//     const fieldsToSplit = [
//       "DocumentIds",
//       "DocumentNames",
//       "MainTypeIds",
//       "MainTypeNames",
//       "TypeIds",
//       "TypeNames",
//       "SubtypeNames",
//       "SubtypeIds",
//       "Quantities",
//       "Prices",
//     ];
//     if (dataAllInvoices) {
//       const transformedData = dataAllInvoices.map((invoice) => {
//         const transformedInvoice = { ...invoice };
//         fieldsToSplit.forEach((field) => {
//           const fieldValue = transformedInvoice[field] as unknown as string;
//           if (fieldValue) {
//             transformedInvoice[field] = fieldValue.includes(";")
//               ? fieldValue.split(";")
//               : [fieldValue];
//           }
//         });
        
//         return transformedInvoice;
//       });
//       console.log("useAllInvoices() transformedData",transformedData)
//       setData(transformedData);
//       console.log("useAllInvoices(): data set to", transformedData);
//     }
//   }, [dataAllInvoices]);
//   console.log("useAllInvoices() transformedData data",data)
//   // Zwracamy także funkcję refetch
//   return { data, loading, error, refetch: fetchData };
// }

// useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const result: AllInvoicesDb[] = await window.electron.getAllInvoices();
//         const transformedData: AllInvoices[] = result.map((invoice) => {
//           const transformField = (field: string | null): string[] => {
//             return field ? field.split(";").map((item) => item.trim()) : [];
//           };

//           return {
//             InvoiceId: invoice.InvoiceId,
//             InvoiceName: invoice.InvoiceName,
//             ReceiptDate: invoice.ReceiptDate,
//             DeadlineDate: invoice.DeadlineDate,
//             PaymentDate: invoice.PaymentDate,
//             IsDeleted: invoice.IsDeleted,
//             DocumentNames: transformField(invoice.DocumentNames),
//             MainTypeNames: transformField(invoice.MainTypeNames),
//             TypeNames: transformField(invoice.TypeNames),
//             SubtypeNames: transformField(invoice.SubtypeNames),
//             Quantities: transformField(invoice.Quantities),
//             Prices: transformField(invoice.Prices),
//           };
//         });
//         setData(transformedData);
//       } catch (err) {
//         setError(err as Error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);