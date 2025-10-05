import fs from "fs";
import path from "path";
import { jsPDF } from "jspdf";
import { autoTable } from 'jspdf-autotable'
import { STATUS, DataBaseResponse, isSuccess } from "./sharedTypes/status.js";

import { getDb, getFormattedDate, isValidDate, logTitle } from "./dataBase/dbFunction.js";
import Database, { statusDatabase, QueryParams } from "./dataBase/dbClass.js";
import log from "electron-log";
import { getSavedDocumentsPathWithCustomFile, openFile } from "./pathResolver.js";
import ExcelJS from "exceljs";
import { exec } from "child_process";
//Funkcja do pobierania wszystkich faktur z bazy danych do raportów
export async function getReportStandardAllInvoices(
  reportCriteriaToDb: ReportCriteriaToDb[]
): Promise<DataBaseResponse<ReportStandardInvoice[]>> {
  const functionName = getReportStandardAllInvoices.name;
  // --- Walidacja danych wejściowych ---
  if (!reportCriteriaToDb || reportCriteriaToDb.length === 0) {
    const message = `Brak dat do pobrania raportu standardowego faktur z bazy danych`;
    log.error(logTitle(functionName, message));
    return { status: STATUS.Error, message: message };
  }

  for (const item of reportCriteriaToDb) {
    if (item.firstDate && item.secondDate) {
      if (!(item.firstDate instanceof Date && !isNaN(item.firstDate.getTime()))) {
        const message = `Pierwsza data ma nieprawidłowy format: ${item.firstDate}`;
        log.error(logTitle(functionName, message));
        return { status: STATUS.Error, message };
      }

      if (!(item.secondDate instanceof Date && !isNaN(item.secondDate.getTime()))) {
        const message = `Druga data ma nieprawidłowy format: ${item.secondDate}`;
        log.error(logTitle(functionName, message));
        return { status: STATUS.Error, message };
      }
    }
  }

  try {
    // --- Budowa zapytania SQL ---
    let query = `
      SELECT 
        Invoices.InvoiceId,
        Invoices.InvoiceName,
        Invoices.ReceiptDate,
        Invoices.DeadlineDate,
        Invoices.PaymentDate,
        Invoices.IsDeleted,
        GROUP_CONCAT(IFNULL(DictionaryDocuments.DocumentId, ''), ';') AS DocumentIds,
        GROUP_CONCAT(IFNULL(DictionaryDocuments.DocumentName, ''), ';') AS DocumentNames,
        GROUP_CONCAT(IFNULL(DictionaryMainType.MainTypeId, ''), ';') AS MainTypeIds,
        GROUP_CONCAT(IFNULL(DictionaryMainType.MainTypeName, ''), ';') AS MainTypeNames,
        GROUP_CONCAT(IFNULL(DictionaryType.TypeId, ''), ';') AS TypeIds,
        GROUP_CONCAT(IFNULL(DictionaryType.TypeName, ''), ';') AS TypeNames,
        GROUP_CONCAT(IFNULL(DictionarySubtype.SubtypeId, ''), ';') AS SubtypeIds,
        GROUP_CONCAT(IFNULL(DictionarySubtype.SubtypeName, ''), ';') AS SubtypeNames,
        GROUP_CONCAT(IFNULL(InvoiceDetails.Quantity, ''), ';') AS Quantities,
        GROUP_CONCAT(IFNULL(InvoiceDetails.Price, ''), ';') AS Prices
      FROM Invoices
      LEFT JOIN InvoiceDetails ON Invoices.InvoiceId = InvoiceDetails.InvoiceId
      LEFT JOIN DictionaryDocuments ON InvoiceDetails.DocumentId = DictionaryDocuments.DocumentId
      LEFT JOIN DictionaryMainType ON InvoiceDetails.MainTypeId = DictionaryMainType.MainTypeId
      LEFT JOIN DictionaryType ON InvoiceDetails.TypeId = DictionaryType.TypeId
      LEFT JOIN DictionarySubtype ON InvoiceDetails.SubtypeId = DictionarySubtype.SubtypeId
      WHERE Invoices.IsDeleted = 0
    `;
    const params: QueryParams = [];
    console.log('reportCriteriaToDb', reportCriteriaToDb);
    reportCriteriaToDb.forEach((item) => {
      if (item.firstDate && item.secondDate) {
        query += ` AND Invoices.${item.name} BETWEEN ? AND ?`;
        console.log('item.firstDate', item.firstDate);
        console.log('item.firstDate.toLocaleDateString', item.firstDate.toLocaleDateString().split("T")[0]);
        console.log('item.firstDate.getFormattedDate', getFormattedDate(item.firstDate, "-", "year"));
        // Dodajemy tylko datę w formacie YYYY-MM-DD, bez czasu
        params.push(
          getFormattedDate(item.firstDate, "-", "year"),
          getFormattedDate(item.secondDate, "-", "year"),
          // item.firstDate.toISOString().split("T")[0],
          // item.secondDate.toISOString().split("T")[0],
          // item.firstDate.toLocaleDateString().split("T")[0],
          // item.secondDate.toLocaleDateString().split("T")[0],
        );
      } else {
        query += ` AND Invoices.${item.name} IS NULL`;
      }
    });

    query += `
  GROUP BY Invoices.InvoiceId
  ORDER BY Invoices.ReceiptDate DESC
`;
    // Wykonanie zapytania
    const result = await getDb().all<AllInvoicesReport>(query, params);

    // Mapowanie do formatu ReportStandardInvoice
    const parsedResult: ReportStandardInvoice[] = result.map((invoice) => {
      const docNames = invoice.DocumentNames ? invoice.DocumentNames.split(";") : [];
      const mainTypes = invoice.MainTypeNames ? invoice.MainTypeNames.split(";") : [];
      const types = invoice.TypeNames ? invoice.TypeNames.split(";") : [];
      const subtypes = invoice.SubtypeNames ? invoice.SubtypeNames.split(";") : [];
      const quantities = invoice.Quantities ? invoice.Quantities.split(";").map(Number) : [];
      const prices = invoice.Prices ? invoice.Prices.split(";") : [];

      const documents = docNames.map((name, idx) => ({
        DocumentName: name,
        MainTypeName: mainTypes[idx] || "",
        TypeName: types[idx] || "",
        SubtypeName: subtypes[idx] || "",
        Quantity: quantities[idx] || 0,
        Price: prices[idx] || "0",
        Total: quantities[idx] && prices[idx] ? (quantities[idx] * parseFloat(prices[idx])).toFixed(2) : "0",
      }));

      const totalAmount = documents.reduce((sum, doc) => sum + parseFloat(doc.Total), 0);

      return {
        InvoiceId: invoice.InvoiceId,
        TotalAmount: totalAmount,
        InvoiceName: invoice.InvoiceName,
        ReceiptDate: invoice.ReceiptDate,
        DeadlineDate: invoice.DeadlineDate,
        PaymentDate: invoice.PaymentDate,
        Documents: documents,
      };
    });

    return {
      status: STATUS.Success,
      data: parsedResult ?? [],
    };
  } catch (err) {
    const message = `Nieznany błąd podczas pobierania raportu standardowego faktur z bazy danych.`;
    log.error(logTitle(functionName, message), err);
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : message,
    };
  }
}



//EXPORT DANYCH DO EXCEL
type ExcelCellTypeAndAligment = "string" | "number" | "date" | "currency2" | "currency4" | "general";

const typeToStyle: Record<string, Partial<ExcelJS.Style>> = {
  string: { numFmt: '@', alignment: { horizontal: 'left', vertical: "middle" } },
  number: { numFmt: '#,##0', alignment: { horizontal: 'right', vertical: "middle" } },
  date: { numFmt: 'dd/mm/yyyy', alignment: { horizontal: 'right', vertical: "middle" } },
  currency2: { numFmt: '#,##0.00 [$zł-415]', alignment: { horizontal: 'right', vertical: "middle" } },
  currency4: { numFmt: '#,##0.0000 [$zł-415]', alignment: { horizontal: 'right', vertical: "middle" } },
  general: { numFmt: 'General' },
};

type ColumnType = {
  name: string;
  type: ExcelCellTypeAndAligment;
}
//Export standard invoice report do XLSX
export async function exportStandardInvoiceReportToXLSX(reportCriteriaToDb: ReportCriteriaToDb[], dataReportStandardInvoices: ReportStandardInvoice[]): Promise<ReturnStatusDbMessage> {
  const functionName = exportStandardInvoiceReportToXLSX.name;
  if (!dataReportStandardInvoices || dataReportStandardInvoices.length === 0) {
    const message = 'Brak danych do raportu.';
    log.error(logTitle(functionName, message));
    return {
      status: 2,
      message: message,
    };
  }
  if (!reportCriteriaToDb || reportCriteriaToDb.length === 0) {
    const message = 'Brak kryteriów do raportu.';
    log.error(logTitle(functionName, message));
    return {
      status: 2,
      message: message,
    };
  }
  try {
    const workbook = new ExcelJS.Workbook();
    const sheetData = workbook.addWorksheet("Raport");
    const sheetCriteria = workbook.addWorksheet("Kryteria");

    //SHEET CRITERIA
    //Dane
    const headersCriteria: ColumnType[] = [
      { name: "Lp.", type: "number" },
      { name: "Nazwa", type: "string" },
      { name: "Data początkowa", type: "date" },
      { name: "Data końcowa", type: "date" },
    ];
    //Stylowanie kolumn + wypisanie nazw kolumn
    sheetCriteria.columns = headersCriteria.map(column => ({
      header: column.name,
      style: typeToStyle[column.type] || typeToStyle.general
    }));

    // Pobranie pierwszego wiersza (nazwy kolumn)
    const headerRowSheetCriteria = sheetCriteria.getRow(1);

    //Stylowanie nazw kolumn
    styleHeaderRow(headerRowSheetCriteria);
    //Dodanie wartości zawartości tabeli + stylowanie komórek
    reportCriteriaToDb.forEach((item, index) => {
      const rowSheetCriteria = sheetCriteria.addRow([
        index + 1,
        item.description,
        isValidDate(item.firstDate) ? getFormattedDate(item.firstDate) : "brak daty",
        isValidDate(item.secondDate) ? getFormattedDate(item.secondDate) : "brak daty",
      ]);

      // Stylizowanie wiersza od razu po utworzeniu
      styleContentRow(rowSheetCriteria);
    });

    //Wstawienie pierwszego wiersza
    sheetCriteria.spliceRows(1, 0, ["", "Kryteria raportu", getFormattedDate(new Date())]);
    //Wstawienie drugiego wiersza
    sheetCriteria.spliceRows(2, 0, []);

    // SHEET DATA
    //Dane
    const headersData: ColumnType[] = [
      { name: "Lp.", type: "number" },
      { name: "Suma faktury", type: "currency2" },
      { name: "Nazwa faktury", type: "string" },
      { name: "Data wpływu", type: "date" },
      { name: "Termin płatności", type: "date" },
      { name: "Data płatności", type: "date" },
      { name: "Dokument", type: "string" },
      { name: "Liczba", type: "number" },
      { name: "Cena", type: "currency4" },
      { name: "Razem", type: "currency2" },
    ];
    //Ustawienia sheet data
    sheetData.views = [{ state: 'frozen', ySplit: 1 }];
    sheetData.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: headersData.length } };

    //Stylowanie kolumn + wypisanie nazw kolumn
    sheetData.columns = headersData.map(column => ({
      header: column.name,
      style: typeToStyle[column.type] || typeToStyle.general
    }));

    // Pobranie pierwszego wiersza (nazwy kolumn)
    const headerRowSheetData = sheetData.getRow(1);

    //Stylowanie nazw kolumn
    styleHeaderRow(headerRowSheetData);

    //Zawartość sheet data
    //Pobranie pierwszego pustego wiersza pod nazwami kolumn
    let currentRow = sheetData.rowCount + 1;
    const totalAmountAllInvoices = dataReportStandardInvoices.reduce((sum, invoice) => sum + invoice.TotalAmount, 0);
    //Dodanie wartości zawartości tabeli + stylowanie komórek
    dataReportStandardInvoices.forEach((invoice, invoiceIndex) => {
      const startRow = currentRow;

      invoice.Documents.forEach((doc) => {
        const rowSheetData = sheetData.addRow([
          invoiceIndex + 1,
          invoice.TotalAmount,
          invoice.InvoiceName,
          invoice.ReceiptDate ? new Date(invoice.ReceiptDate) : "",
          invoice.DeadlineDate ? new Date(invoice.DeadlineDate) : "",
          invoice.PaymentDate ? new Date(invoice.PaymentDate) : "",
          `${doc.DocumentName} ${doc.MainTypeName} ${doc.TypeName} ${doc.SubtypeName}`,
          doc.Quantity,
          Number(doc.Price),
          Number(doc.Total)
        ]);
        currentRow++;
        styleContentRow(rowSheetData);

      });

      const endRow = currentRow - 1;
      //Scalanie kolumn z danymi faktury
      if (invoice.Documents.length > 1) {
        sheetData.mergeCells(`A${startRow}: A${endRow}`); // Lp.
        sheetData.mergeCells(`B${startRow}: B${endRow}`); // Suma faktury
        sheetData.mergeCells(`C${startRow}: C${endRow}`); // Nazwa faktury
        sheetData.mergeCells(`D${startRow}: D${endRow}`); // Data wpływu
        sheetData.mergeCells(`E${startRow}: E${endRow}`); // Termin płatności
        sheetData.mergeCells(`F${startRow}: F${endRow}`); // Data płatności
      }

      //Pobranie wiersza który ma być dodatkowo ostylowany
      const row = sheetData.getRow(endRow);
      row.eachCell((cell) => {
        cell.border = {
          ...cell.border, // Zachowanie pozostałych krawędzi
          bottom: { style: "medium" } // Nadpisanie tylko dolnej krawędzi
        };
      });

      if (invoiceIndex === dataReportStandardInvoices.length - 1) {
        // Ustawienie wartości w komórce B[ostatni wiersz]
        sheetData.getCell(`B${currentRow}`).value = totalAmountAllInvoices;
        // Ustawienie pogrubienia tekstu w komórce B[ostatni wiersz]
        sheetData.getCell(`B${currentRow}`).font = { bold: true };
        // Ustawienie formatu liczbowego w komórce B[ostatni wiersz]
        sheetData.getCell(`B${currentRow}`).numFmt = '#,##0.00 [$zł-415]';
      }
    });

    //Automatyczne nadanie szerokości kolumn
    autoSizeColumns(sheetCriteria);
    autoSizeColumns(sheetData);

    // Wygenerowanie pliku xlsx
    const timestamp = new Date().toLocaleString().replace(/[[:., ]/g, '-');
    const filePath = getSavedDocumentsPathWithCustomFile(`raport-${timestamp}.xlsx`)
    await workbook.xlsx.writeFile(filePath);

    //Sprawdzenie czy zapisany plik xlsx istnieje
    if (!fs.existsSync(filePath)) {
      const message = `Plik xlsx nie istnieje w ścieżce: ${filePath}`
      log.error(logTitle(functionName, message));
      return { status: 2, message: message };
    }

    //Otworzenie pliku xlsx
    openFile(filePath);

    //Wiadomość zwrotna o poprawnym zapisaniu pliku xlsx
    return { status: 0, message: `XLSX został poprawnie zapisany.` };
  } catch (err) {
    const message = 'Błąd podczas generowania pliku XLSX.';
    log.error(logTitle(functionName, message));
    return {
      status: 2,
      message: err instanceof Error ? err.message : message,
    };
  }
}

// Funkcja pomocnicza do nadania stylu wierszowi nagłówka
function styleHeaderRow(
  row: ExcelJS.Row,
) {
  row.eachCell((cell) => {
    cell.font = { name: "Arial", size: 10, bold: true };
    cell.numFmt = "@";
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "medium" },
      left: { style: "medium" },
      bottom: { style: "medium" },
      right: { style: "medium" },
    };
  });
}

// Funkcja pomocnicza do nadania stylu wierszowi zawartości
function styleContentRow(
  row: ExcelJS.Row
) {
  row.eachCell((cell) => {
    cell.font = { name: "Arial", size: 10, bold: false };
    cell.border = {
      top: { style: "thin" },
      left: { style: "medium" },
      bottom: { style: "thin" },
      right: { style: "medium" },
    };
  });
}

// Funkcja pomocnicza do nadania szerokości kolumn
function autoSizeColumns(worksheet: ExcelJS.Worksheet, margin = 2) {
  worksheet.columns.forEach((column) => {
    let maxLength = 5; // minimalna szerokość

    if (!column.eachCell) return;

    column.eachCell({ includeEmpty: true }, (cell) => {
      if (cell.value == null) return;

      let cellValueLength = 0;

      if (cell.value instanceof Date) {
        // Daty liczone są po sformatowanym stringu
        cellValueLength = cell.value.toLocaleDateString("pl-PL").length;
      } else if (typeof cell.value === "number") {
        // Liczba -> uwzględnia walutę "zł" jeśli kolumna jest walutowa
        if (column.numFmt && column.numFmt.includes("[$zł")) {
          cellValueLength = cell.value.toString().length + 4;
        } else {
          cellValueLength = cell.value.toString().length;
        }
      } else if (typeof cell.value === "object" && "richText" in cell.value) {
        // RichText
        cellValueLength = cell.value.richText.map((t) => t.text).join("").length;
      } else {
        // Wszystko inne jest traktowane jako string
        cellValueLength = cell.value.toString().length;
      }

      maxLength = Math.max(maxLength, cellValueLength);
    });

    column.width = maxLength + margin;
  });
}
//Export standard invoice report do PDF
export async function exportStandardInvoiceReportToPDF(dataReportStandardInvoices: ReportStandardInvoice[]): Promise<ReturnStatusDbMessage> {
  const functionName = exportStandardInvoiceReportToPDF.name;
  try {
    if (!dataReportStandardInvoices || dataReportStandardInvoices.length === 0) {
      const message = 'Błąd podczas generowania PDF.';
      log.error(logTitle(functionName, message));
      return {
        status: 2,
        message: message,
      };
    }
    const doc = new jsPDF();
    // // const autoTable = (await import('jspdf-autotable')).default;
    // const doc = new jsPDF();

    // Nagłówek raportu
    doc.setFontSize(10);
    doc.text('Raport faktur', 10, 10);

    // Przygotowanie danych do tabeli
    const tableData: (string | number)[][] = [];
    const totalInvoices = dataReportStandardInvoices.length;

    dataReportStandardInvoices.forEach((invoice, index) => {
      const rowCount = invoice.Documents.length || 1; // Minimum 1 wiersz, jeśli brak dokumentów
      const firstRow: (string | number)[] = [
        String(index + 1).padStart(3, "0") + ".", // Lp.
        invoice.InvoiceName ?? "",
        invoice.ReceiptDate ?? "",
        invoice.DeadlineDate ?? "-",
        invoice.PaymentDate ?? "-",
        invoice.Documents.length > 0
          ? `${1}. ${invoice.Documents[0].DocumentName ?? ""} ${invoice.Documents[0].MainTypeName ?? ""} ${invoice.Documents[0].TypeName ?? ""} ${invoice.Documents[0].SubtypeName ?? ""}`.trim()
          : "-",
        invoice.Documents.length > 0 ? invoice.Documents[0].Quantity ?? 0 : "-",
        invoice.Documents.length > 0 ? invoice.Documents[0].Price ?? "0" : "-",
      ];
      tableData.push(firstRow);

      // Dodaj kolejne dokumenty w osobnych wierszach
      for (let i = 1; i < rowCount; i++) {
        tableData.push([
          "", // Puste Lp. dla dodatkowych wierszy
          "",
          "",
          "",
          "",
          `${i + 1}. ${invoice.Documents[i].DocumentName ?? ""} ${invoice.Documents[i].MainTypeName ?? ""} ${invoice.Documents[i].TypeName ?? ""} ${invoice.Documents[i].SubtypeName ?? ""}`.trim(),
          invoice.Documents[i].Quantity ?? 0,
          invoice.Documents[i].Price ?? "0",
        ]);
      }
    });

    // Stopka z liczbą faktur
    tableData.push(['', 'Liczba faktur:', totalInvoices.toString(), '', '', '', '', '']);

    // Generowanie tabeli
    autoTable(doc, {
      head: [['Lp.', 'Nazwa faktury', 'Data wpływu', 'Termin płatności', 'Data płatności', 'Dokumenty', 'Liczba', 'Cena']],
      body: tableData,
      startY: 20,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 128, 0], textColor: [255, 255, 255] }, // Zielone tło nagłówka
      alternateRowStyles: { fillColor: [240, 240, 240] }, // Lekko szare tło co drugi wiersz
      margin: { top: 20 },
    });

    // Zapis pliku
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = getSavedDocumentsPathWithCustomFile(`raport-${timestamp}.pdf`);
    doc.save(filePath);
    return { status: 0, message: `PDF zapisany w: ` };
  } catch (err) {
    const message = 'Błąd podczas generowania PDF.';
    log.error(logTitle(functionName, message));
    return {
      status: 2,
      message: err instanceof Error ? err.message : message,
    };
  }
};