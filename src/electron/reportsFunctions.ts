import fs from "fs";
import path from "path";
import { jsPDF } from "jspdf";
import { autoTable } from 'jspdf-autotable'
import { STATUS, DataBaseResponse, isSuccess } from "./sharedTypes/status.js";

import { getDb, getFormattedDate, logTitle } from "./dataBase/dbFunction.js";
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
  console.log('getReportStandardAllInvoices called with:', reportCriteriaToDb);
  if (!reportCriteriaToDb || reportCriteriaToDb.length === 0) {
    const message = `Brak dat do pobrania raportu standardowego faktur z bazy danych`;
    log.error(logTitle(functionName, message));
    return { status: STATUS.Error, message: message };
  }

  reportCriteriaToDb.map((item) => {
    if (!item.firstDate || !item.secondDate) {
      const message = `Pierwsza albo druga data nie jest ustawiona. Pierwsza data: ${item.firstDate || "brak"}, druga data: ${item.secondDate || "brak"
        }`;
      log.error(logTitle(functionName, message));
      return { status: STATUS.Error, message: message };
    }
    if (!(item.firstDate instanceof Date && !isNaN(item.firstDate.getTime()))) {
      const message = `Pierwsza data ma nieprawidłowy format: ${item.firstDate}`;
      log.error(logTitle(functionName, message));
      return { status: STATUS.Error, message: message };
    }
    if (
      !(item.secondDate instanceof Date && !isNaN(item.secondDate.getTime()))
    ) {
      const message = `Druga data ma nieprawidłowy format: ${item.secondDate}`;
      log.error(logTitle(functionName, message));
      return { status: STATUS.Error, message: message };
    }
  });

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

    reportCriteriaToDb.map((item) => {
      query += ` AND Invoices.${item.name} BETWEEN ? AND ?`;
      params.push(
        item.firstDate.toISOString().split("T")[0],
        item.secondDate.toISOString().split("T")[0]
      );
    });

    query += `
  GROUP BY Invoices.InvoiceId
  ORDER BY Invoices.ReceiptDate DESC
`;
    // --- Wykonanie zapytania ---
    const result = await getDb().all<AllInvoicesReport>(query, params);

    // --- Mapowanie do formatu ReportStandardInvoiceWithDocumentsName ---
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
    console.log('getReportStandardAllInvoices parsedResult:', parsedResult[0]);
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
  try { // Zapis pliku
    const workbook = new ExcelJS.Workbook();
    const sheetData = workbook.addWorksheet("Raport");
    const sheetCriteria = workbook.addWorksheet("Kryteria");

    //sheetCriteria
    const titleRowSheetCriteria = sheetCriteria.addRow(["", "Kryteria raportu", getFormattedDate(new Date())]);
    sheetCriteria.addRow([]);
    const headerRowSheetCriteria = sheetCriteria.addRow(["Lp.", "Nazwa", "Data początkowa", "Data końcowa"]);
    // headerSheetCryteria.eachCell((cell) => {
    //   cell.font = { bold: true, size: 14 }; // pogrubienie + większa czcionka
    //   cell.alignment = { horizontal: "center" }; // opcjonalnie wyśrodkowanie
    //   cell.border = { // opcjonalnie obramowanie
    //     top: { style: "thin" },
    //     left: { style: "thin" },
    //     bottom: { style: "thin" },
    //     right: { style: "thin" },
    //   };
    // });

    styleHeaderRow(headerRowSheetCriteria)
    // reportCriteriaToDb.map((item, index) => sheetCriteria.addRow([index + 1, item.description, getFormattedDate(item.firstDate), getFormattedDate(item.secondDate)]))
    // const contentRowSheetCriteria = reportCriteriaToDb.map((item, index) => {
    //   const row = sheetCriteria.addRow([
    //     index + 1,
    //     item.description,
    //     getFormattedDate(item.firstDate),
    //     getFormattedDate(item.secondDate),
    //   ]);

    //   // Dodaj obramowanie do wszystkich komórek w wierszu
    //   row.eachCell((cell) => {
    //     cell.border = {
    //       top: { style: "thin" },
    //       left: { style: "thin" },
    //       bottom: { style: "thin" },
    //       right: { style: "thin" },
    //     };
    //   });
    // });
    reportCriteriaToDb.forEach((item, index) => {
      const row = sheetCriteria.addRow([
        index + 1,
        item.description,
        getFormattedDate(item.firstDate),
        getFormattedDate(item.secondDate),
      ]);

      // Stylizowanie wiersza od razu po utworzeniu
      styleContentRow(row, ["number", "string", "date", "date"]);
    });
    // Dodaj nagłówki
    const headerRowSheetData = sheetData.addRow(["Lp.", "Nazwa faktury", "Data wpływu", "Termin płatności", "Data płatności", "Dokumenty", "Liczba", "Cena"]);
    styleHeaderRow(headerRowSheetData)

    // Dodaj przykładowe dane
    sheetData.addRow([1, "FV/0714", "2025-07-14"]);
    sheetData.addRow([2, "Produkt B", 456.78]);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = getSavedDocumentsPathWithCustomFile(`raport-${timestamp}.xlsx`)
    await workbook.xlsx.writeFile(filePath);

    //Sprawdzenie czy zapisany plik xlsx istnieje
    if (!fs.existsSync(filePath)) {
      const message = `Plik xlsx nie istnieje w ścieżce: ${filePath}`
      log.error(logTitle(functionName, message));
      return { status: 2, message: message };
    }

    //Otwórz plik
    openFile(filePath);

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

// Funkcja pomocnicza do nadania stylu wierszowi
function styleHeaderRow(
  row: ExcelJS.Row,
) {
  row.eachCell((cell) => {
    // Styl
    cell.font = { name: "Arial", size: 11, bold: true };
    cell.alignment = { horizontal: "center", vertical: "middle" }; // wrapText przy długim tekście
    cell.border = {
      top: { style: "thin" },
      left: { style: "medium" },
      bottom: { style: "thin" },
      right: { style: "medium" },
    };
  });
}

function styleContentRow(
  row: ExcelJS.Row,
  cellFormats?: ("string" | "number" | "date" | "currency" | "general")[]
) {
  row.eachCell((cell, colNumber) => {
    // Formatowanie komórki
    if (cellFormats && cellFormats[colNumber - 1]) {
      switch (cellFormats[colNumber - 1]) {
        case "string":
          cell.numFmt = "@";
          break;
        case "number":
          cell.numFmt = "#,##0";
          break;
        case "date":
          cell.numFmt = "yyyy.mm.dd";
          break;
        case "currency":
          cell.numFmt = '"zł"#,##0.0000'; // format walutowy PLN cztery miejsca po przecinku
          break;
        case "general":
        default:
          cell.numFmt = "General"; // domyślny format Excela
          break;
      }
    }

    // Styl
    cell.font = { name: "Arial", size: 10, bold: false };
    cell.alignment = { horizontal: "left", vertical: "middle" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "medium" },
      bottom: { style: "thin" },
      right: { style: "medium" },
    };
  });
}