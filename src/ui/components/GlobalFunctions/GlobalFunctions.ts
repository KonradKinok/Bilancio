import toast from "react-hot-toast";

//Suma ceny faktury
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

  return currencyFormater(totalAmount.toFixed(2));
}

//Formater do ceny
export function currencyFormater(value: string | number | null | undefined, maximumFractionDigits: number = 4): string {
  const currencyFormatter = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: maximumFractionDigits, // Maksymalna liczba cyfr po przecinku
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

//Porównanie danych w dwóch fakturach
export function compareInvoices(oldInvoice: InvoiceSave | undefined, newInvoice: InvoiceSave | undefined): InvoicesDifferences[] {
  const differences: InvoicesDifferences[] = [];
  if (!oldInvoice || !newInvoice) {
    return differences; // lub inne domyślne zachowanie
  }
  // Compare top-level invoice properties
  const invoiceKeys = Object.keys(oldInvoice.invoice) as (keyof InvoiceTable)[];

  for (const key of invoiceKeys) {
    if (key === "InvoiceId") continue; // Pomijanie InvoiceId
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
      // const detailKeys = Object.keys(oldInvoice.details[i]) as (keyof InvoiceDetailsTable)[];
      // for (const key of detailKeys) {
      //   if (key === "InvoiceId") continue; // Skip DocumentId comparison
      //   if (oldInvoice.details[i][key] !== newInvoice.details[i][key]) {
      //     differences.push({
      //       key: `details[${i}]`,
      //       oldValue: oldInvoice.details[i],
      //       newValue: newInvoice.details[i],
      //     });
      //     break; // Exit after the first difference in this detail
      //   }
      // }
      const detailKeys = Object.keys(oldInvoice.details[i]) as (keyof InvoiceDetailsTable)[];
      for (const key of detailKeys) {
        if (key === "InvoiceId") continue; // Pomijanie InvoiceId
        const oldValue = oldInvoice.details[i][key];
        const newValue = newInvoice.details[i][key];
        // Sprawdzanie, czy wartości są różne, traktując null i 0 jako równe
        if (!(oldValue === null && newValue === 0) && !(oldValue === 0 && newValue === null) && oldValue !== newValue) {
          differences.push({
            key: `details[${i}]`,
            oldValue: oldInvoice.details[i],
            newValue: newInvoice.details[i],
          });
          break; // Zakończ po pierwszej różnicy w tym wpisie
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



export function formatDocumentDetailsFunction(
  dataAllDocumentsName: AllDocumentsName[] | null
) {
  return (detail: InvoiceDetailsTable) => {
    const document = dataAllDocumentsName?.find(
      (doc) => doc.DocumentId === detail.DocumentId
    );
    const mainType = detail.MainTypeId
      ? dataAllDocumentsName?.find(
        (doc) => doc.MainTypeId === detail.MainTypeId
      )
      : null;
    const type = detail.TypeId
      ? dataAllDocumentsName?.find((doc) => doc.TypeId === detail.TypeId)
      : null;
    const subtype = detail.SubtypeId
      ? dataAllDocumentsName?.find((doc) => doc.SubtypeId === detail.SubtypeId)
      : null;

    return {
      documentName:
        document?.DocumentName || `Dokument ID: ${detail.DocumentId}`,
      mainTypeName:
        mainType?.MainTypeName ||
        (detail.MainTypeId ? `Typ główny ID: ${detail.MainTypeId}` : ""),
      typeName:
        type?.TypeName || (detail.TypeId ? `Typ ID: ${detail.TypeId}` : ""),
      subtypeName:
        subtype?.SubtypeName ||
        (detail.SubtypeId ? `Podtyp ID: ${detail.SubtypeId}` : ""),
      quantity: detail.Quantity,
      price: detail.Price.toFixed(2),
      total: (detail.Quantity * detail.Price).toFixed(2),
    };
  };
}


export function formatDocumentDetailsFunctionChanges(dataAllDocumentsName: AllDocumentsName[] | null) {
  // Helper function to format a single InvoiceDetailsTable object
  const formatDetail = (detail: InvoiceDetailsTable | null): FormattedDetail | null => {
    if (!detail || typeof detail !== 'object' || !('DocumentId' in detail) || !('Quantity' in detail) || !('Price' in detail)) {
      console.error('formatDetail: Invalid detail object', detail);
      return null;
    }

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

    return {
      documentName: document?.DocumentName ?? `Document Id: ${detail.DocumentId}`,
      mainTypeName: mainType?.MainTypeName ?? (detail.MainTypeId ? `Main Type ID: ${detail.MainTypeId}` : ""),
      typeName: type?.TypeName ?? (detail.TypeId ? `Type ID: ${detail.TypeId}` : ""),
      subtypeName: subtype?.SubtypeName ?? (detail.SubtypeId ? `Subtype ID: ${detail.SubtypeId}` : ""),
      quantity: detail.Quantity,
      price: detail.Price.toFixed(2),
      total: (detail.Quantity * detail.Price).toFixed(2),
    };
  };

  // Main function to format an array of Difference objects
  return (differences: InvoicesDifferences[]): FormattedDifference[] => {
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

export const getFormatedDate = (date: Date | null, separator: string = "-"): string | null => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() zwraca 0-11, więc dodajemy 1
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${separator}${month}${separator}${day}`; // YYYY-MM-DD
};

export function getTodayFormattedDate(separator: string = "-"): string {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}${separator}${month}${separator}${year}`;
}

export function displayErrorMessage(componentName: string, functionName: string, error: unknown, isToast: boolean = true) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(
    `%c[ERROR]%c [${componentName}] [${functionName}]\n%c${errorMessage}`,
    "color: rgb(255, 255, 255); background: rgb(255, 0, 0); ",
    "color: rgb(255, 255, 0); font-weight: bold; ",
    "color: rgb(224, 255, 255); font-style: italic;"
  );
  if (isToast) {
    toast.error(`${errorMessage}`);
  }
}


export function copyTableToClipboard(
  tableRef: React.RefObject<HTMLTableElement | null>
) {
  try {
    if (tableRef.current) {
      // Klonujemy tabelę
      const tableClone = tableRef.current.cloneNode(true) as HTMLTableElement;

      // Dodanie obramowań
      tableClone.style.borderCollapse = "collapse";
      tableClone.querySelectorAll("th, td").forEach((cell) => {
        (cell as HTMLElement).style.border = "1px solid black";
        (cell as HTMLElement).style.padding = "4px"; // opcjonalnie padding
      });

      const htmlClean = tableClone.outerHTML;
      const textClean = tableClone.innerText;

      window.electron.clipboard(htmlClean, textClean);
      const successTextToast =
        "Tabela została skopiowana do schowka. Użyj skrótu Ctr+V żeby wkleić tabelę do pliku Word lub Excell";
      toast.success(`${successTextToast} `);
    }
  } catch (err) {
    const errorTextToast = "Błąd podczas kopiowania tabeli do schowka:";
    displayErrorMessage(
      "ReportStandardInvoicePage",
      "handleExportButtonClick",
      ` ${errorTextToast} ${err}`
    );
  }
};

//REPORTS
// export function reportStandardInvoicesAllDocumentsName(allInvoices: AllInvoices[]): ReportStandardInvoiceWithDocumentsName[] | null | undefined {
//   if (!allInvoices || allInvoices.length === 0) {
//     displayErrorMessage(
//       "GlobalFunctions",
//       "ReportStandardInvoicesAllDocumentsName",
//       "allInvoices nie istnieje lub jest puste");
//     return null
//   };
//   const reportStandardInvoiceWithDocumentsName = allInvoices.map((invoice) => {

//     const reportStandardInvoiceWithDocumentsName = invoice.
//     const invoiceName = dataAllDocumentsName.find(
//       (doc) => doc.DocumentId === detail.DocumentId
//     );
//     return ({
//       InvoiceName: invoice.InvoiceName,
//       ReceiptDate: invoice.ReceiptDate,
//       DeadlineDate: invoice.DeadlineDate,
//     })
//   }
// const document = dataAllDocumentsName.find(
//   (doc) => doc.DocumentId === detail.DocumentId
// );
// const mainType = detail.MainTypeId
//   ? dataAllDocumentsName.find((doc) => doc.MainTypeId === detail.MainTypeId)
//   : null;
// const type = detail.TypeId
//   ? dataAllDocumentsName.find((doc) => doc.TypeId === detail.TypeId)
//   : null;
// const subtype = detail.SubtypeId
//   ? dataAllDocumentsName.find((doc) => doc.SubtypeId === detail.SubtypeId)
//   : null;

// return {
//   documentName: document?.DocumentName ?? `Document Id: ${detail.DocumentId}`,
//   mainTypeName: mainType?.MainTypeName ?? (detail.MainTypeId ? `Main Type ID: ${detail.MainTypeId}` : ""),
//   typeName: type?.TypeName ?? (detail.TypeId ? `Type ID: ${detail.TypeId}` : ""),
//   subtypeName: subtype?.SubtypeName ?? (detail.SubtypeId ? `Subtype ID: ${detail.SubtypeId}` : ""),
//   quantity: detail.Quantity,
//   price: detail.Price.toFixed(2),
//   total: (detail.Quantity * detail.Price).toFixed(2),
// };
// }

// Funkcja do poprawnej polskiej deklinacji słowa "pozycja"
const pluralRules = new Intl.PluralRules("pl-PL");
export function pluralizePozycja(count: number): string {
  const forms: Record<string, string> = {
    one: "pozycja",
    few: "pozycje",
    many: "pozycji",
    other: "pozycji",
  };

  const rule = pluralRules.select(count);
  return `${count} ${forms[rule]}`;
}

// Funkcja pomocnicza do opóźnienia
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
// await delay(5000); // czekamy 5 sekund
//ACTIVITIES
enum ActivityType {
  addInvoice = "dodanie faktury",
  editInvoice = "edycja faktury",
  deleteInvoice = "usunięcie faktury",
}
type UserActivitiesType = {
  date: string;
  userName: string;
  activityType: ActivityType;
  activityData: string;
};

export function createActivitiesObject(dataAllDocumentsName: AllDocumentsName[] | null, userName: string, activityType: ActivityType, addedInvoice?: InvoiceTable, invoiceDetails?: InvoiceDetailsTable[]): UserActivitiesType | null {
  let activityData = "";

  switch (activityType) {
    case ActivityType.addInvoice:
      if (!addedInvoice || !invoiceDetails || !dataAllDocumentsName || dataAllDocumentsName.length === 0) {
        displayErrorMessage(
          "GlobalFunctions",
          "createActivitiesObject - case ActivityType.addInvoice",
          `addedInvoice lub invoiceDetails lub dataAllDocumentsName nie istnieją`
        );
        return null;
      }

      else {
        const displayDocumentsName = invoiceDetails.map(
          formatDocumentDetailsFunction(dataAllDocumentsName || [])
        )
        const combinedData = {
          ...addedInvoice,
          invoiceDetails: displayDocumentsName,
        };
        activityData = JSON.stringify(combinedData, null, 2);
      }

      break;
    case ActivityType.editInvoice:
      if (!addedInvoice || !invoiceDetails) {
        throw new Error("editInvoice activity requires addedInvoice and invoiceDetails");
      }
      break;
    case ActivityType.deleteInvoice:
      if (!addedInvoice || !invoiceDetails) {
        throw new Error("deleteInvoice activity requires addedInvoice and invoiceDetails");
      }
      break;
    default:
      throw new Error("Invalid activity type");
  }

  return {
    date: new Date().toISOString(),
    userName,
    activityType,
    activityData: activityData,
  };
}