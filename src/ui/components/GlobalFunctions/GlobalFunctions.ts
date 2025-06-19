// export function calculateTotalAmount(quantities: string[], prices: string[]): string {
//   if (quantities && prices) {
//     const totalAmount = quantities.reduce((acc, quantity, i) => {
//       const price = prices[i];
//       if (price) {
//         return acc + parseFloat(quantity) * parseFloat(price);
//       }
//       return acc;
//     }, 0);

//     return currencyFormater(totalAmount.toString());
//   }
//   return currencyFormater("0");
// }

export function calculateTotalAmount(quantities: string[], prices: string[]): string {
  // Sprawdź, czy tablice są poprawne i mają tę samą długość
  if (!quantities || !prices || quantities.length !== prices.length) {
    return currencyFormater("0");
  }

  const totalAmount = quantities.reduce((acc, quantity, i) => {
    const price = prices[i];
    // Sprawdź, czy quantity i price są poprawnymi liczbami
    const parsedQuantity = parseFloat(quantity);
    const parsedPrice = parseFloat(price);
    if (!isNaN(parsedQuantity) && !isNaN(parsedPrice)) {
      return acc + parsedQuantity * parsedPrice;
    }
    return acc; // Pomiń niepoprawne pary
  }, 0);

  return currencyFormater(totalAmount.toString());
}
export function currencyFormater(value: string | number | null | undefined): string {
  const currencyFormatter = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  });

  if (value === null || value === undefined) {
    return currencyFormatter.format(0);
  }

  const num =
    typeof value === "number" ? value : parseFloat(value.replace(",", "."));

  if (isNaN(num)) {
    return currencyFormatter.format(0);
  }

  return currencyFormatter.format(num);
}




type Difference = {
  key: string;
  oldValue: unknown;
  newValue: unknown;
};

export function compareInvoices(oldInvoice: InvoiceSave | undefined, newInvoice: InvoiceSave| undefined): Difference[] {
  const differences: Difference[] = [];
  if (!oldInvoice || !newInvoice) {
    return differences; // lub inne domyślne zachowanie
  }
  // Compare top-level invoice properties
  const invoiceKeys = Object.keys(oldInvoice.invoice) as (keyof InvoiceTable)[];
  for (const key of invoiceKeys) {
    if (oldInvoice.invoice[key] !== newInvoice.invoice[key]) {
      differences.push({
        key: `invoice.${key}`,
        oldValue: oldInvoice.invoice[key],
        newValue: newInvoice.invoice[key],
      });
    }
  }

  // Compare details arrays
  const maxLength = Math.max(oldInvoice.details.length, newInvoice.details.length);
  for (let i = 0; i < maxLength; i++) {
    if (i >= oldInvoice.details.length) {
      // New details entry added
      differences.push({
        key: `details[${i}]`,
        oldValue: null,
        newValue: newInvoice.details[i],
      });
    } else if (i >= newInvoice.details.length) {
      // Old details entry removed
      differences.push({
        key: `details[${i}]`,
        oldValue: oldInvoice.details[i],
        newValue: null,
      });
    } else {
      // Compare properties of details entries
      const detailKeys = Object.keys(oldInvoice.details[i]) as (keyof InvoiceDetailsTable)[];
      for (const key of detailKeys) {
        if (oldInvoice.details[i][key] !== newInvoice.details[i][key]) {
          differences.push({
            key: `details[${i}].${key}`,
            oldValue: oldInvoice.details[i][key],
            newValue: newInvoice.details[i][key],
          });
        }
      }
    }
  }

  return differences;
}
export function compareInvoices2(oldInvoice: InvoiceSave | undefined, newInvoice: InvoiceSave| undefined): Difference[] {
  const differences: Difference[] = [];
  if (!oldInvoice || !newInvoice) {
    return differences; // lub inne domyślne zachowanie
  }
  // Compare top-level invoice properties
  const invoiceKeys = Object.keys(oldInvoice.invoice) as (keyof InvoiceTable)[];
  for (const key of invoiceKeys) {
    if (oldInvoice.invoice[key] !== newInvoice.invoice[key]) {
      differences.push({
        key: `invoice.${key}`,
        oldValue: oldInvoice.invoice[key],
        newValue: newInvoice.invoice[key],
      });
    }
  }

  // Compare details arrays
  const maxLength = Math.max(oldInvoice.details.length, newInvoice.details.length);
  for (let i = 0; i < maxLength; i++) {
    if (i >= oldInvoice.details.length) {
      // New details entry added
      differences.push({
        key: `details[${i}]`,
        oldValue: null,
        newValue: newInvoice.details[i],
      });
    } else if (i >= newInvoice.details.length) {
      // Old details entry removed
      differences.push({
        key: `details[${i}]`,
        oldValue: oldInvoice.details[i],
        newValue: null,
      });
    } else {
      // Compare properties of details entries
      const detailKeys = Object.keys(oldInvoice.details[i]) as (keyof InvoiceDetailsTable)[];
      for (const key of detailKeys) {
        if (oldInvoice.details[i][key] !== newInvoice.details[i][key]) {
          differences.push({
            key: `details[${i}]`,
            oldValue: oldInvoice.details[i],
            newValue: newInvoice.details[i],
          });
          break; // Exit after the first difference in this detail
        }
      }
    }
  }

  return differences;
}
type FormattedDetail = {
  documentName: string;
  mainTypeName: string;
  typeName: string;
  subtypeName: string;
  quantity: number;
  price: string;
  total: string;
};
type FormattedDifference = {
  key: string;
  oldValue: FormattedDetail | null | unknown;
  newValue: FormattedDetail | null | unknown;
};

export function formatDocumentDetailsFunctionChanges(dataAllDocumentsName: AllDocumentsName[] | null) {
  // Helper function to format a single InvoiceDetailsTable object
  console.log('function formatDocumentDetailsFunctionChanges - start');
  const formatDetail = (detail: InvoiceDetailsTable | null): FormattedDetail | null => {
    if (!detail || typeof detail !== 'object' || !('DocumentId' in detail) || !('Quantity' in detail) || !('Price' in detail)) {
      console.log('formatDetail: Invalid detail object', detail);
      return null;
    }

    // Log input data for debugging
    console.log('formatDetail: Processing detail', detail);
    console.log('formatDetail: dataAllDocumentsName', dataAllDocumentsName);

    // If dataAllDocumentsName is null or empty, use fallbacks
    if (!dataAllDocumentsName || dataAllDocumentsName.length === 0) {
      console.warn('formatDetail: dataAllDocumentsName is null or empty');
      return {
        documentName: `Document ID: ${detail.DocumentId}`,
        mainTypeName: detail.MainTypeId ? `Main Type ID: ${detail.MainTypeId}` : "",
        typeName: detail.TypeId ? `Type ID: ${detail.TypeId}` : "",
        subtypeName: detail.SubtypeId ? `Subtype ID: ${detail.SubtypeId}` : "",
        quantity: detail.Quantity,
        price: detail.Price.toFixed(2),
        total: (detail.Quantity * detail.Price).toFixed(2),
      };
    }

    const document = dataAllDocumentsName.find(
      (doc) => doc.DocumentId === detail.DocumentId
    );
    const mainType = detail.MainTypeId
      ? dataAllDocumentsName.find((doc) => doc.MainTypeId === detail.MainTypeId)
      : null;
    const type = detail.TypeId
      ? dataAllDocumentsName.find((doc) => doc.TypeId === detail.TypeId)
      : null;
    const subtype = detail.SubtypeId
      ? dataAllDocumentsName.find((doc) => doc.SubtypeId === detail.SubtypeId)
      : null;

    // Log found records for debugging
    console.log('formatDetail: Found document', document);
    console.log('formatDetail: Found mainType', mainType);
    console.log('formatDetail: Found type', type);
    console.log('formatDetail: Found subtype', subtype);

    return {
      documentName: document?.DocumentName ?? `Document ID: ${detail.DocumentId}`,
      mainTypeName: mainType?.MainTypeName ?? (detail.MainTypeId ? `Main Type ID: ${detail.MainTypeId}` : ""),
      typeName: type?.TypeName ?? (detail.TypeId ? `Type ID: ${detail.TypeId}` : ""),
      subtypeName: subtype?.SubtypeName ?? (detail.SubtypeId ? `Subtype ID: ${detail.SubtypeId}` : ""),
      quantity: detail.Quantity,
      price: detail.Price.toFixed(2),
      total: (detail.Quantity * detail.Price).toFixed(2),
    };
  };

  // Main function to format an array of Difference objects
  return (differences: Difference[]): FormattedDifference[] => {
    return differences.map((difference) => {
      // Format only for keys matching details[i] (e.g., details[0], details[1])
      const isFullDetail = difference.key.match(/^details\[\d+\]$/);
      const formattedOldValue = isFullDetail && difference.oldValue
        ? formatDetail(difference.oldValue as InvoiceDetailsTable)
        : difference.oldValue;
      const formattedNewValue = isFullDetail && difference.newValue
        ? formatDetail(difference.newValue as InvoiceDetailsTable)
        : difference.newValue;

      return {
        key: difference.key,
        oldValue: formattedOldValue,
        newValue: formattedNewValue,
      };
    });
  };
}