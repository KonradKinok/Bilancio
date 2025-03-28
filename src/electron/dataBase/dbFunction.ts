import Database from './dbClass.js';
import * as sqlString from "./dbQuerySqlString.js";
import { DbTables, InvoicesTable } from './enum.js';


// Tworzymy instancję bazy danych
const db = new Database();

// Pobierz tablicę DictionaryDocuments
export async function getTableDictionaryDocuments()  {
  try {
    const rows = await db.all<DictionaryDocuments>(sqlString.getTableDictionaryDocumentsSqlString());
    return rows || [];
  } catch (err) {
    console.error('getTableDictionaryDocuments() Błąd podczas pobierania dokumentów:');
   return [];
  }
};

// Pobierz nazwy wszystkich dokumentów
export async function getAllDocumentsName()  {
  try {
    const rows = await db.all<AllDocumentsName>(sqlString.getAllDocumentsNameSqlString());
    return rows || [];
  } catch (err) {
    console.error('getAllDocumentName() Błąd podczas pobierania dokumentów:', err);
    return [];
  }
  
};

// Pobierz nazwy wszystkich dokumentów
export async function getAllInvoices()  {
  try {
    const rows = await db.all<AllInvoices>(sqlString.getAllInvoicesSqlString("2010-01-01", "2011-12-31", 0));
    return rows || [];
  } catch (err) {
    console.error('getAllInvoices() Błąd podczas pobierania faktur:', err);
   return [];
  }
};

// Pobierz ostatni wiersz z tabeli
export async function getLastRowFromTable(tableName:DbTables, tableNameId:InvoicesTable)  {
  try {
    const row = await db.get(sqlString.getLastRowFromTableSqlString(tableName, tableNameId));
    return row || [];
  } catch (err) {
    console.error('getLastRowFromTable() Błąd podczas pobierania faktur:', err);
   return [];
  }
};

//Dodaj fakturę do bd
 export async function addInvoice(invoice: {
  InvoiceName: string;
  ReceiptDate: string;
  DeadlineDate?: string;
  PaymentDate: string;
  IsDeleted: 0 | 1;
}) {
  const sql = `
    INSERT INTO Invoices (InvoiceName, ReceiptDate, DeadlineDate, PaymentDate, IsDeleted)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [
    invoice.InvoiceName,
    invoice.ReceiptDate,
    invoice.DeadlineDate || null,
    invoice.PaymentDate,
    invoice.IsDeleted,
  ];

  try {
    const result = await db.run(sql, params);
    console.log(`Dodano nową fakturę z ID: ${result.lastID}`);
    return result.lastID;
  } catch (err) {
    console.error('Błąd podczas dodawania nowej faktury:', err);
    throw err;
  }
}

export async function przykladowaFunkcja(tekst2:string, jakisNumer:number) {
  const tekst = "Przykładowa funkcja";
  try {
    console.log("Przykładowa funkcja:", tekst2);
    const obiekt={jakisTekst: tekst2, jakisNumer: jakisNumer};
    return obiekt;
  }
  catch (err) {
    console.error('fetchDocuments() Błąd podczas pobierania dokumentów:', err);
const obiekt={jakisTekst: tekst2, jakisNumer: jakisNumer};
    return obiekt;
  }
}


// Przykład funkcji asynchronicznej w module Electron do wstawiania nowej faktury


// Funkcja, która zwraca obiekt bazy danych  zakładamy, że baza jest już otwarta


// async function insertInvoice(db:Database) {

//   // Dane faktury
//   const invoiceData = {
//     InvoiceName: 'D01PF00297',
//     ReceiptDate: '2016-04-22',
//     DeadlineDate: '2016-05-30',
//     PaymentDate: '2016-05-12',
//     IsDeleted: 0
//   };

//   // Dane szczegółowe faktury
//   const invoiceDetails = [
//     // Rekord 1
//     { DocumentId: 1, MainTypeId: null, TypeId: null, SubtypeId: null, Quantity: 23, Price: 40 },
//     // Rekord 2
//     { DocumentId: 3, MainTypeId: 4, TypeId: 3, SubtypeId: 5, Quantity: 4, Price: 24 },
//     // Rekord 3
//     { DocumentId: 3, MainTypeId: null, TypeId: 2, SubtypeId: 2, Quantity: 7, Price: 42.34 }
//   ];

//   // Zmienna do przechwytywania nowego InvoiceId
//   let newInvoiceId;

//   try {
//     await new Promise((resolve, reject) => {
//       db.serialize(() => {
//         db.run("BEGIN TRANSACTION;");

//         // Wstawienie faktury
//         db.run(
//           `INSERT INTO Invoices (InvoiceName, ReceiptDate, DeadlineDate, PaymentDate, IsDeleted)
//            VALUES (?, ?, ?, ?, ?);`,
//           [invoiceData.InvoiceName, invoiceData.ReceiptDate, invoiceData.DeadlineDate, invoiceData.PaymentDate, invoiceData.IsDeleted],
//           function (err) {
//             if (err) return reject(err);
//             newInvoiceId = this.lastID; // Pobieramy identyfikator nowo wstawionej faktury

//             // Wstawienie szczegółów faktury
//             const stmt = db.prepare(
//               `INSERT INTO InvoiceDetails (InvoiceId, DocumentId, MainTypeId, TypeId, SubtypeId, Quantity, Price)
//                VALUES (?, ?, ?, ?, ?, ?, ?);`
//             );

//             for (const detail of invoiceDetails) {
//               stmt.run(
//                 [newInvoiceId, detail.DocumentId, detail.MainTypeId, detail.TypeId, detail.SubtypeId, detail.Quantity, detail.Price],
//                 (err) => {
//                   if (err) reject(err);
//                 }
//               );
//             }

//             stmt.finalize((err) => {
//               if (err) return reject(err);
//               db.run("COMMIT TRANSACTION;", (err) => {
//                 if (err) return reject(err);
//                 resolve();
//               });
//             });
//           }
//         );
//       });
//     });
//     console.log("Faktura została pomyślnie dodana, InvoiceId:", newInvoiceId);
//   } catch (error) {
//     console.error("Błąd podczas dodawania faktury:", error);
//     db.run("ROLLBACK TRANSACTION;");
//   } finally {
//     db.close();
//   }
// }


export const queryToDB = {
  firstMetod: async function fetchDocuments() {
    try {
      const rows = await db.all<DictionaryDocuments>('SELECT * FROM DictionaryDocuments');
      console.log("fetchDocuments()", rows);
      return rows || [];
    
    } catch (err:unknown) {
      console.error('fetchDocuments() Błąd podczas pobierania dokumentów:', err);
      return [];
    }

  
  },
  secondMetod: async function fetchDocuments() {
    try {
      const rows = await db.all('SELECT * FROM DictionaryMainType');
      console.log("fetchDocuments()", rows);
      return rows || [];
    
    } catch (err) {
      console.error('fetchDocuments() Błąd podczas pobierania dokumentów:');
      return [];
    }

  
  }
};

// import { app } from 'electron';
// app.on('before-quit', async () => {
//   try {
//     await db.close();
//     console.log('Połączenie z bazą danych zostało zamknięte.');
//   } catch (err) {
//     console.error('Błąd przy zamykaniu bazy danych:', err);
//   }
// });

