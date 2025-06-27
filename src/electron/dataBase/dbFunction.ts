import Database, { QueryParams} from './dbClass.js';
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




export async function updateInvoice(
  invoice: InvoiceTable,
  invoiceDetails: InvoiceDetailsTable[]
): Promise<DataBaseResponse<ReturnInvoiceSave>> {
  // Walidacja InvoiceId
  if (invoice.InvoiceId === undefined) {
    return {
      status: STATUS.Error,
      message: "Brak InvoiceId. Aktualizacja faktury wymaga identyfikatora.",
    };
  }

  // SQL do aktualizacji faktury
  const updateInvoiceSql = `
    UPDATE Invoices 
    SET InvoiceName = ?, ReceiptDate = ?, DeadlineDate = ?, PaymentDate = ?, IsDeleted = ?
    WHERE InvoiceId = ?
  `;
  const updateInvoiceParams: QueryParams = [
    invoice.InvoiceName ?? "",
    invoice.ReceiptDate ?? "",
    invoice.DeadlineDate ?? null,
    invoice.PaymentDate ?? null,
    invoice.IsDeleted ?? 0,
    invoice.InvoiceId, // Teraz gwarantujemy, że jest to number
  ];

  // SQL do usuwania istniejących szczegółów faktury
  const deleteDetailsSql = `
    DELETE FROM InvoiceDetails WHERE InvoiceId = ?
  `;
  const deleteDetailsParams: QueryParams = [invoice.InvoiceId];

  // SQL do wstawiania nowych szczegółów faktury
  const insertDetailsSql = `
    INSERT INTO InvoiceDetails (InvoiceId, DocumentId, MainTypeId, TypeId, SubtypeId, Quantity, Price)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    await db.beginTransaction();

    // Sprawdzenie, czy faktura istnieje
    const existingInvoice = await db.get<{ InvoiceId: number }>(
      `SELECT InvoiceId FROM Invoices WHERE InvoiceId = ?`,
      [invoice.InvoiceId]
    );
    if (!existingInvoice) {
      await db.rollback();
      return {
        status: STATUS.Error,
        message: `Faktura o ID ${invoice.InvoiceId} nie istnieje.`,
      };
    }

    // Aktualizacja faktury
    const updateResult = await db.run(updateInvoiceSql, updateInvoiceParams);
    if (!updateResult.changes) {
      await db.rollback();
      return {
        status: STATUS.Error,
        message: "Nie udało się zaktualizować faktury.",
      };
    }

    // Usunięcie istniejących szczegółów
    await db.run(deleteDetailsSql, deleteDetailsParams);

    // Wstawianie nowych szczegółów
    for (const detail of invoiceDetails) {
      if (!detail.DocumentId || detail.Quantity <= 0) {
        await db.rollback();
        return {
          status: STATUS.Error,
          message: "Nieprawidłowe dane szczegółów faktury (DocumentId lub Quantity).",
        };
      }
      const insertParams: QueryParams = [
        invoice.InvoiceId,
        detail.DocumentId,
        detail.MainTypeId ?? null,
        detail.TypeId ?? null,
        detail.SubtypeId ?? null,
        detail.Quantity,
        detail.Price,
      ];
      const insertResult = await db.run(insertDetailsSql, insertParams);
      if (!insertResult.changes) {
        await db.rollback();
        return {
          status: STATUS.Error,
          message: `Nie udało się dodać szczegółów faktury dla DocumentId: ${detail.DocumentId}.`,
        };
      }
    }

    await db.commit();
    return {
      status: STATUS.Success,
      data: { lastID: invoice.InvoiceId, changes: updateResult.changes },
    };
  } catch (err) {
    await db.rollback();
    console.error("Błąd podczas aktualizacji faktury:", err);
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : "Nieznany błąd podczas aktualizacji faktury.",
    };
  }
}


export async function deleteInvoice(
  invoiceId: number
): Promise<DataBaseResponse<ReturnInvoiceSave>> {
  // Walidacja InvoiceId
  if (!invoiceId || invoiceId <= 0) {
    return {
      status: STATUS.Error,
      message: "Nieprawidłowy identyfikator faktury.",
    };
  }

  // SQL do ustawienia IsDeleted na 1
  const deleteInvoiceSql = `
    UPDATE Invoices 
    SET IsDeleted = 1
    WHERE InvoiceId = ?
  `;
  const deleteInvoiceParams: QueryParams = [invoiceId];

  try {
    await db.beginTransaction();

    // Sprawdzenie, czy faktura istnieje
    const existingInvoice = await db.get<{ InvoiceId: number }>(
      `SELECT InvoiceId FROM Invoices WHERE InvoiceId = ? AND IsDeleted = 0`,
      [invoiceId]
    );
    if (!existingInvoice) {
      await db.rollback();
      return {
        status: STATUS.Error,
        message: `Faktura o ID ${invoiceId} nie istnieje lub jest już oznaczona jako usunięta.`,
      };
    }

    // Aktualizacja flagi IsDeleted
    const deleteResult = await db.run(deleteInvoiceSql, deleteInvoiceParams);
    if (!deleteResult.changes) {
      await db.rollback();
      return {
        status: STATUS.Error,
        message: "Nie udało się oznaczyć faktury jako usuniętej.",
      };
    }

    await db.commit();
    return {
      status: STATUS.Success,
      data: { lastID: invoiceId, changes: deleteResult.changes },
    };
  } catch (err) {
    await db.rollback();
    console.error("Błąd podczas oznaczania faktury jako usuniętej:", err);
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : "Nieznany błąd podczas usuwania faktury.",
    };
  }
}

//restore invoice
export async function restoreInvoice(
  invoiceId: number
): Promise<DataBaseResponse<ReturnInvoiceSave>> {
  // Walidacja InvoiceId
  if (!invoiceId || invoiceId <= 0) {
    return {
      status: STATUS.Error,
      message: "Nieprawidłowy identyfikator faktury.",
    };
  }

  // SQL do ustawienia IsDeleted na 0
  const restoreInvoiceSql = `
    UPDATE Invoices 
    SET IsDeleted = 0
    WHERE InvoiceId = ?
  `;
  const restoreInvoiceParams: QueryParams = [invoiceId];

  try {
    await db.beginTransaction();

    // Sprawdzenie, czy faktura istnieje i jest oznaczona jako usunięta
    const existingInvoice = await db.get<{ InvoiceId: number }>(
      `SELECT InvoiceId FROM Invoices WHERE InvoiceId = ? AND IsDeleted = 1`,
      [invoiceId]
    );
    if (!existingInvoice) {
      await db.rollback();
      return {
        status: STATUS.Error,
        message: `Faktura o ID ${invoiceId} nie istnieje lub nie jest oznaczona jako usunięta.`,
      };
    }

    // Aktualizacja flagi IsDeleted
    const restoreResult = await db.run(restoreInvoiceSql, restoreInvoiceParams);
    if (!restoreResult.changes) {
      await db.rollback();
      return {
        status: STATUS.Error,
        message: "Nie udało się przywrócić faktury.",
      };
    }

    await db.commit();
    return {
      status: STATUS.Success,
      data: { lastID: invoiceId, changes: restoreResult.changes },
    };
  } catch (err) {
    await db.rollback();
    console.error("Błąd podczas przywracania faktury:", err);
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : "Nieznany błąd podczas przywracania faktury.",
    };
  }
}
// Przykładowa funkcja, która zwraca obiekt
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

