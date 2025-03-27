// import { useState, useEffect } from "react";

// export function useAllInvoices() {
//   const [dataAllInvoices, setDataAllInvoices] = useState<AllInvoices[] | null>(null);
//   const [data, setData] = useState<AllInvoices[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<Error | null>(null);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const result = await window.electron.getAllInvoices();
//         setDataAllInvoices(result);
//       } catch (err) {
//         setError(err as Error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

// useEffect(() => {
//   const fieldsToSplit = [
//     "DocumentNames",
//     "MainTypeNames",
//     "TypeNames",
//     "SubtypeNames",
//     "Quantities",
//     "Prices",
//   ];
//   if (dataAllInvoices) {
//     const transformedData = dataAllInvoices.map((invoice) => {
//       const transformedInvoice = { ...invoice };
//       fieldsToSplit.forEach((field) => {
//         const fieldValue = transformedInvoice[field] as unknown as string;
//         if (fieldValue) {
//           transformedInvoice[field] = fieldValue.includes(";")
//             ? fieldValue.split(";")
//             : [fieldValue];
//         }
//       });
//       return transformedInvoice;
//     });
//     setData(transformedData);
//   }
// }, [dataAllInvoices]);

//   return { data, loading, error };
// }

import { useState, useEffect } from "react";

export function useAllInvoices() {
  const [dataAllInvoices, setDataAllInvoices] = useState<AllInvoices[] | null>(null);
  const [data, setData] = useState<AllInvoices[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Funkcja pobierająca dane
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await window.electron.getAllInvoices();
      setDataAllInvoices(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fieldsToSplit = [
      "DocumentNames",
      "MainTypeNames",
      "TypeNames",
      "SubtypeNames",
      "Quantities",
      "Prices",
    ];
    if (dataAllInvoices) {
      const transformedData = dataAllInvoices.map((invoice) => {
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
      setData(transformedData);
    }
  }, [dataAllInvoices]);

  // Zwracamy także funkcję refetch
  return { data, loading, error, refetch: fetchData };
}

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