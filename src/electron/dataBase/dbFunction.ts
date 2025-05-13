import Database from './dbClass.js';
import * as sqlString from "./dbQuerySqlString.js";
import { DbTables, InvoicesTable } from './enum.js';
import { STATUS, DataBaseResponse, isSuccess } from '../sharedTypes/status.js';

// Tworzymy instancję bazy danych
const db = new Database();

// Pobierz tablicę DictionaryDocuments
// export async function getTableDictionaryDocuments()  {
//   try {
//     const rows = await db.all<DictionaryDocuments>(sqlString.getTableDictionaryDocumentsSqlString());
//     return rows || [];
//   } catch (err) {
//     console.error('getTableDictionaryDocuments() Błąd podczas pobierania dokumentów:');
//    return [];
//   }
// };

// export type Status = (typeof STATUS)[keyof typeof STATUS];

// Pobierz tablicę DictionaryDocuments
// export async function getTableDictionaryDocuments()  {
//  try {
//     const rows = await db.all<DictionaryDocuments>(sqlString.getTableDictionaryDocumentsSqlString());
// console.log("dbFunction.ts getTableDictionaryDocuments()", rows);
//     return {
//       status: STATUS.Success,
//       data: rows ?? [],
//     };
//   } catch (err) {
//     console.error("getTableDictionaryDocuments() Błąd podczas pobierania dokumentów:", err);
//     return {
//       status: STATUS.Error,
//       message: "Błąd podczas pobierania dokumentów z bazy danych.",
//     };
//   }
// };



export async function getTableDictionaryDocuments<T>(tableName: DbTables) {
  try {
    let query = "";
    switch (tableName) {
      case DbTables.DictionaryDocuments:
        query = sqlString.getTableDictionaryDocumentsSqlString(tableName);
        break;
      case DbTables.DictionaryMainType:
        query = sqlString.getTableDictionaryDocumentsSqlString(tableName);
        break;
      case DbTables.DictionaryType:
        query = sqlString.getTableDictionaryDocumentsSqlString(tableName);
        break;
      case DbTables.DictionarySubtype:
        query = sqlString.getTableDictionaryDocumentsSqlString(tableName);
        break;
      default:
        throw new Error(`Nieznana tabela: ${tableName}`);
    }

    const rows = await db.all<T>(query);
    console.log("dbFunction.ts getTableDictionaryDocuments()", tableName, rows);
    return {
      status: STATUS.Success,
      data: rows ?? [],
    };
  } catch (err) {
    console.error("getTableDictionaryDocuments() Błąd podczas pobierania dokumentów:", err);
    return {
      status: STATUS.Error,
      message: "Błąd podczas pobierania dokumentów z bazy danych.",
    };
  }
};

export async function getConnectedTableDictionary<T>(tableName: DbTables, documentId?: number,mainTypeId?: number,typeId?: number,subTypeId?: number) {
  try {
    let query = "";
    switch (tableName) {
      case DbTables.DictionaryDocuments:
        query = sqlString.getTableDictionaryDocumentsSqlString(tableName);
        break;
      case DbTables.DictionaryMainType:
        if (!documentId) {
          throw new Error("documentName is required for DictionaryMainType");
        }
        query = sqlString.getConnectedTableDictionaryDocumentsDictionaryMainTypeSqlString(documentId);
        break;
      case DbTables.DictionaryType:
         if (!documentId || !mainTypeId) {
          throw new Error("documentName and mainTypeId is required for DictionaryType");
        }
        query = sqlString.getConnectedTableDictionaryMainTypeDictionaryTypeSqlString(documentId, mainTypeId);
        break;
      case DbTables.DictionarySubtype:
         if (!documentId || !mainTypeId || !typeId) {
          throw new Error("documentName, mainTypeId  and typeId is required for DictionarySubtype");
        }
        query = sqlString.getConnectedTableDictionaryTypeDictionarySubtypeSqlString(documentId, mainTypeId, typeId);
        break;
      default:
        throw new Error(`Nieznana tabela: ${tableName}`);
    }
    console.log("getConnectedTableDictionary", query);
    const rows = await db.all<T>(query);
    console.log("dbFunction.ts getConnectedTableDictionary()", tableName, rows);
    return {
      status: STATUS.Success,
      data: rows ?? [],
    };
  } catch (err) {
    console.error("getTableDictionaryDocuments() Błąd podczas pobierania dokumentów:", err);
    return {
      status: STATUS.Error,
      message: `Błąd podczas pobierania dokumentów z bazy danych. ${err} coś tam`,
    };
  }
};

export async function getAllDocumentsName() {
  try {
    const rows = await db.all<AllDocumentsName>(sqlString.getAllDocumentsNameSqlString());
    return {
      status: STATUS.Success,
      data: rows ?? [],
    };
  } catch (err) {
    console.error('getAllDocumentName() Błąd podczas pobierania dokumentów:', err);
    return {
      status: STATUS.Error,
      message: `Błąd podczas pobierania dokumentów z bazy danych. ${err} coś tam`,
    };
  }
};

// Pobierz wszystkie faktury
export async function getAllInvoices(formValuesHomePage: FormValuesHomePage) {
  try {
    const rows = await db.all<AllInvoices>(sqlString.getAllInvoicesSqlString(formValuesHomePage));
    return rows || [];

  } catch (err) {
    console.error('getAllInvoices() Błąd podczas pobierania faktur:', err);
    return [];
  }
};

// Pobierz ostatni wiersz z tabeli
export async function getLastRowFromTable(tableName: DbTables, tableNameId: InvoicesTable) {
  try {
    const row = await db.get(sqlString.getLastRowFromTableSqlString(tableName, tableNameId));
    return row || [];
  } catch (err) {
    console.error('getLastRowFromTable() Błąd podczas pobierania faktur:', err);
    return [];
  }
};
export async function addInvoice(invoice: InvoiceTable): Promise<DataBaseResponse<ReturnInvoiceSave>> {
  const sql = `
    INSERT INTO Invoices (InvoiceName, ReceiptDate, DeadlineDate, PaymentDate, IsDeleted)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [
    invoice.InvoiceName,
    invoice.ReceiptDate,
    invoice.DeadlineDate || null,
    invoice.PaymentDate || null,
    invoice.IsDeleted,
  ];

  try {
    const result = await db.run(sql, params);
    if (!result.lastID || !result.changes) {
      return {
        status: STATUS.Error,
        message: "Nie udało się dodać faktury do bazy danych.",
      };
    }
    return {
      status: STATUS.Success,
      data: { lastID: result.lastID, changes: result.changes },
    };
  } catch (err) {
    console.error("Błąd podczas dodawania nowej faktury:", err);
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : "Nieznany błąd podczas dodawania faktury.",
    };
  }
}
export async function addInvoiceDetails(
  invoice: InvoiceTable,
  invoiceDetails: InvoiceDetailsTable[]
): Promise<DataBaseResponse<ReturnInvoiceSave>> {
  const sql = `
    INSERT INTO InvoiceDetails (InvoiceId, DocumentId, MainTypeId, TypeId, SubtypeId, Quantity, Price)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    await db.beginTransaction();
    const resultAddInvoice = await addInvoice(invoice);
    if (resultAddInvoice.status === STATUS.Success && resultAddInvoice.data) {
      console.log(`Dodano nową fakturę z ID: ${resultAddInvoice.data.lastID}`);
      for (const detail of invoiceDetails) {
        if (!detail.DocumentId || detail.Quantity <= 0) {
          await db.rollback();
          return {
            status: STATUS.Error,
            message: "Nieprawidłowe dane szczegółów faktury (DocumentId lub Quantity).",
          };
        }
        const params = [
          resultAddInvoice.data.lastID,
          detail.DocumentId,
          detail.MainTypeId || null,
          detail.TypeId || null,
          detail.SubtypeId || null,
          detail.Quantity,
          detail.Price,
        ];
        const resultDetail = await db.run(sql, params);
        if (!resultDetail.changes) {
          await db.rollback();
          return {
            status: STATUS.Error,
            message: `Nie udało się dodać szczegółów faktury dla DocumentId: ${detail.DocumentId}.`,
          };
        }
      }
      await db.commit();
      return resultAddInvoice;
    }
    await db.rollback();
    return resultAddInvoice;
  } catch (err) {
    await db.rollback();
    console.error("Błąd podczas dodawania szczegółów faktury:", err);
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : "Nieznany błąd podczas dodawania szczegółów faktury.",
    };
  }
}
// export async function addInvoiceDetails(
//   invoice: InvoiceTable,
//   invoiceDetails: InvoiceDetailsTable[]
// ): Promise<DataBaseResponse<ReturnInvoiceSave>> {
//   const sql = `
//     INSERT INTO InvoiceDetails (InvoiceId, DocumentId, MainTypeId, TypeId, SubtypeId, Quantity, Price)
//     VALUES (?, ?, ?, ?, ?, ?, ?)
//   `;

//   try {
//     const resultAddInvoice = await addInvoice(invoice);
//     if (resultAddInvoice.status === STATUS.Success && resultAddInvoice.data) {
//       console.log(`Dodano nową fakturę z ID: ${resultAddInvoice.data.lastID}`);
//       for (const detail of invoiceDetails) {
//         const params = [
//           resultAddInvoice.data.lastID,
//           detail.DocumentId,
//           detail.MainTypeId || null,
//           detail.TypeId || null,
//           detail.SubtypeId || null,
//           detail.Quantity,
//           detail.Price,
//         ];
//         const resultDetail = await db.run(sql, params);
//         if (!resultDetail.changes) {
//           return {
//             status: STATUS.Error,
//             message: "Nie udało się dodać szczegółów faktury.",
//           };
//         }
//       }
//       return resultAddInvoice; // Zwracamy wynik z addInvoice, który jest już w formacie DataBaseResponse
//     }
//     return resultAddInvoice; // Zwracamy błąd z addInvoice
//   } catch (err) {
//     console.error("Błąd podczas dodawania szczegółów faktury:", err);
//     return {
//       status: STATUS.Error,
//       message: err instanceof Error ? err.message : "Nieznany błąd podczas dodawania szczegółów faktury.",
//     };
//   }
// }
// export async function addInvoice(invoice: InvoiceTable): Promise<ReturnInvoiceSave> {
//   const sql = `
//     INSERT INTO Invoices (InvoiceName, ReceiptDate, DeadlineDate, PaymentDate, IsDeleted)
//     VALUES (?, ?, ?, ?, ?)
//   `;
//   const params = [
//     invoice.InvoiceName,
//     invoice.ReceiptDate,
//     invoice.DeadlineDate || null,
//     invoice.PaymentDate || null,
//     invoice.IsDeleted,
//   ];

//   try {
//     const result = await db.run(sql, params);
//     if (!result.lastID || !result.changes) {
//       throw new Error("Nie udało się dodać faktury.");
//     }
//     return { lastID: result.lastID, changes: result.changes };
//   } catch (err) {
//     console.error('Błąd podczas dodawania nowej faktury:', err);
//     throw err;
//   }
// }

// export async function addInvoiceDetails(invoice: InvoiceTable, invoiceDetails: InvoiceDetailsTable[]): Promise<ReturnInvoiceSave> {
//   const sql = `
//     INSERT INTO InvoiceDetails (InvoiceId, DocumentId, MainTypeId, TypeId, SubtypeId, Quantity, Price)
//     VALUES (?, ?, ?, ?, ?, ?, ?)
//   `;

//   try {
//     const resultAddInvoice = await addInvoice(invoice);
//     if (resultAddInvoice.changes && resultAddInvoice.lastID) {
//       console.log(`Dodano nową fakturę z ID: ${resultAddInvoice.lastID}`);
//       for (const detail of invoiceDetails) {
//         const params = [
//           resultAddInvoice.lastID,
//           detail.DocumentId,
//           detail.MainTypeId || null,
//           detail.TypeId || null,
//           detail.SubtypeId || null,
//           detail.Quantity,
//           detail.Price,
//         ];
//         const resultDetail = await db.run(sql, params);
//         if (!resultDetail.changes) {
//           throw new Error("Nie udało się dodać szczegółów faktury.");
//         }
//       }
//       return { lastID: resultAddInvoice.lastID, changes: resultAddInvoice.changes };
//     }
//     throw new Error("Nie udało się dodać faktury.");
//   } catch (err) {
//     console.error('Błąd podczas dodawania szczegółów faktury:', err);
//     throw err;
//   }
// }
//Dodaj fakturę do tabeli Invoice
// export async function addInvoice(invoice: InvoiceTable): Promise<ReturnInvoiceSave> {
//   const sql = `
//     INSERT INTO Invoices (InvoiceName, ReceiptDate, DeadlineDate, PaymentDate, IsDeleted)
//     VALUES (?, ?, ?, ?, ?)
//   `;
//   const params = [
//     invoice.InvoiceName,
//     invoice.ReceiptDate,
//     invoice.DeadlineDate|| null,
//     invoice.PaymentDate || null,
//     invoice.IsDeleted = 0,
//   ];

//   try {
//     const result = await db.run(sql, params);
//     return result;
//   } catch (err) {
//     console.error('Błąd podczas dodawania nowej faktury:', err);
//     throw err;
//   }
// }

// const invoice = {
//   InvoiceName: "D01PF0031",
//   ReceiptDate: "2016-06-14",
//   DeadlineDate: "2016-07-28",
//   PaymentDate: "2016-07-10",
//   IsDeleted: 0 as const,
// }
// const invoiceDetails = [
//   // Rekord 1
//   { DocumentId: 1, MainTypeId: null, TypeId: null, SubtypeId: null, Quantity: 23, Price: 40 },
//   // Rekord 2
//   { DocumentId: 3, MainTypeId: 4, TypeId: 3, SubtypeId: 5, Quantity: 4, Price: 24 },
//   // Rekord 3
//   { DocumentId: 3, MainTypeId: null, TypeId: 2, SubtypeId: 2, Quantity: 7, Price: 42.34 }
// ];
// //Dodaj szczegóły faktury do tabeli Invoice
// export async function addInvoiceDetails(invoice: InvoiceTable, invoiceDetails: InvoiceDetailsTable[]) {
//   const sql = `
//     INSERT INTO InvoiceDetails (InvoiceId, DocumentId, MainTypeId, TypeId, SubtypeId, Quantity, Price)
//     VALUES (?, ?, ?, ?, ?, ?, ?)`;
//   // const params = [
//   //   invoice.InvoiceName,
//   //   invoice.ReceiptDate,
//   //   invoice.DeadlineDate ,
//   //   invoice.PaymentDate|| null,
//   //   invoice.IsDeleted,
//   // ];
//   //   // Dane szczegółowe faktury
//   // const invoiceDetails = [
//   //   // Rekord 1
//   //   { DocumentId: 1, MainTypeId: null, TypeId: null, SubtypeId: null, Quantity: 23, Price: 40 },
//   //   // Rekord 2
//   //   { DocumentId: 3, MainTypeId: 4, TypeId: 3, SubtypeId: 5, Quantity: 4, Price: 24 },
//   //   // Rekord 3
//   //   { DocumentId: 3, MainTypeId: null, TypeId: 2, SubtypeId: 2, Quantity: 7, Price: 42.34 }
//   // ];


//   try {
//     const resultAddInvoice = await addInvoice(invoice);
//     if (resultAddInvoice.changes && resultAddInvoice.lastID) {
//       console.log(`Dodano nowa fakture z ID -lastId: ${resultAddInvoice.lastID}`);
//       console.log(`Dodano nowa fakture z ID -changes: ${resultAddInvoice.changes}`);
//       for (const detail of invoiceDetails) {
//         const invoiceDetailsTableToSave = [resultAddInvoice.lastID, detail.DocumentId, detail.MainTypeId, detail.TypeId, detail.SubtypeId, detail.Quantity, detail.Price];
//         console.log(invoiceDetailsTableToSave)
//         const result = await db.run(sql, invoiceDetailsTableToSave);
//         console.log({ result })
//       }
//     }


//     // for (const detail of invoiceDetails) {
//     //           stmt.run(
//     //             [newInvoiceId, detail.DocumentId, detail.MainTypeId, detail.TypeId, detail.SubtypeId, detail.Quantity, detail.Price],
//     //             (err) => {
//     //               if (err) reject(err);
//     //             }
//     //           );
//     //         }
//     return "";
//   } catch (err) {
//     console.error('Błąd podczas dodawania nowej faktury:', err);
//     throw err;
//   }
// }

// addInvoiceDetails(invoice,invoiceDetails);

// export async function addInvoice(invoice: {
//   InvoiceName: string;
//   ReceiptDate: string;
//   DeadlineDate?: string;
//   PaymentDate: string;
//   IsDeleted: 0 | 1;
// }) {
//   const sql = `
//     INSERT INTO Invoices (InvoiceName, ReceiptDate, DeadlineDate, PaymentDate, IsDeleted)
//     VALUES ($InvoiceName, $ReceiptDate, $DeadlineDate, $PaymentDate, $IsDeleted)
//   `;
//   const params = {
//     $InvoiceName: invoice.InvoiceName,
//     $ReceiptDate: invoice.ReceiptDate,
//     $DeadlineDate: invoice.DeadlineDate || null,
//     $PaymentDate: invoice.PaymentDate,
//     $IsDeleted: invoice.IsDeleted,
//   };

//   try {
//     const result = await db.run(sql, params);
//     console.log(`Dodano nową fakturę z ID: ${result.lastID}`);
//     return result.lastID;
//   } catch (err) {
//     console.error('Błąd podczas dodawania nowej faktury:', err);
//     throw err;
//   }
// }
export async function przykladowaFunkcja(tekst2: string, jakisNumer: number) {
  try {
    const obiekt = { jakisTekst: tekst2, jakisNumer: jakisNumer };
    return obiekt;
  }
  catch (err) {
    console.error('fetchDocuments() Błąd podczas pobierania dokumentów:', err);
    const obiekt = { jakisTekst: tekst2, jakisNumer: jakisNumer };
    return obiekt;
  }
}

export async function przykladowaFunkcja2(tekst2: string, jakisNumer: number): Promise<PrzykladowaFunkcjaResult> {
  try {
    const obiekt = { jakisTekst: tekst2, jakisNumer: jakisNumer };
    return { status: "sukces", dane: obiekt };
  } catch (err) {
    const errorMessage = (err as Error).message || 'Nieznany błąd';
    return { status: "error", komunikat: errorMessage };
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

    } catch (err: unknown) {
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

