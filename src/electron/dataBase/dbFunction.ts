import Database, { QueryParams } from './dbClass.js';
import * as sqlString from "./dbQuerySqlString.js";
import { DbTables, InvoicesTable } from './enum.js';
import { STATUS, DataBaseResponse, isSuccess } from '../sharedTypes/status.js';
import log from "electron-log"; // Dodaj import

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

export async function getConnectedTableDictionary<T>(tableName: DbTables, documentId?: number, mainTypeId?: number, typeId?: number, subTypeId?: number) {
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

// export async function getAllDocumentsName() {
//   try {
//     const rows = await db.all<AllDocumentsName>(sqlString.getAllDocumentsNameSqlString());
//     return {
//       status: STATUS.Success,
//       data: rows ?? [],
//     };
//   } catch (err) {
//     console.error('getAllDocumentName() Błąd podczas pobierania dokumentów:', err);
//     return {
//       status: STATUS.Error,
//       message: `Błąd podczas pobierania dokumentów z bazy danych. ${err} coś tam`,
//     };
//   }
// };

export async function getAllDocumentsName(isDeleted?: number): Promise<DataBaseResponse<AllDocumentsName[]>> {
  try {
    const query = sqlString.getAllDocumentsNameSqlString(isDeleted);
    const params: QueryParams = isDeleted !== undefined ? [isDeleted] : [];
    const rows = await db.all<AllDocumentsName>(query, params);
    return {
      status: STATUS.Success,
      data: rows ?? [],
    };
  } catch (err) {
    log.error('getAllDocumentsName() Błąd podczas pobierania dokumentów:', err);
    return {
      status: STATUS.Error,
      message: `Błąd podczas pobierania dokumentów z bazy danych: ${err}`,
    };
  }
};

// Funkcja do zapisywania nowego dokumentu
export async function saveNewDocument(
  document: AllDocumentsName
): Promise<DataBaseResponse<ReturnMessageFromDb>> {
  try {
    if (!document || !document.DocumentName) {
      return {
        status: STATUS.Error,
        message: "DocumentName jest wymagane.",
      };
    }
    if (document.Price == null || isNaN(document.Price) || document.Price < 0) {
      return {
        status: STATUS.Error,
        message: "Cena musi być wypełniona i mieć wartość równą lub większą od 0.",
      };
    }
    await db.beginTransaction();

    // Krok 1: Sprawdzenie lub dodanie DocumentName w DictionaryDocuments
    let documentId: number;
    const existingDocument = await db.get<{ DocumentId: number }>(
      `SELECT DocumentId FROM DictionaryDocuments WHERE LOWER(DocumentName) = LOWER(?)`,
      [document.DocumentName]
    );
    if (existingDocument) {
      documentId = existingDocument.DocumentId;
    } else {

      const insertDocument = await db.run(
        `INSERT INTO DictionaryDocuments (DocumentName) VALUES (?)`,
        [document.DocumentName]
      );
      if (!insertDocument.lastID) {
        await db.rollback();
        return {
          status: STATUS.Error,
          message: "Nie udało się dodać DocumentName do DictionaryDocuments.",
        };
      }
      documentId = insertDocument.lastID;
    }

    // Krok 2: Sprawdzenie lub dodanie MainTypeName w DictionaryMainType (jeśli istnieje)
    let mainTypeId: number | null = null;
    if (document.MainTypeName) {
      const existingMainType = await db.get<{ MainTypeId: number }>(
        `SELECT MainTypeId FROM DictionaryMainType WHERE LOWER(MainTypeName) = LOWER(?)`,
        [document.MainTypeName]
      );
      if (existingMainType) {
        mainTypeId = existingMainType.MainTypeId;
      } else {
        const insertMainType = await db.run(
          `INSERT INTO DictionaryMainType (MainTypeName) VALUES (?)`,
          [document.MainTypeName]
        );
        if (!insertMainType.lastID) {
          await db.rollback();
          return {
            status: STATUS.Error,
            message: "Nie udało się dodać MainTypeName do DictionaryMainType.",
          };
        }
        mainTypeId = insertMainType.lastID;
      }
    }

    // Krok 3: Sprawdzenie lub dodanie TypeName w DictionaryType (jeśli istnieje)
    let typeId: number | null = null;
    if (document.TypeName) {
      if (!mainTypeId) {
        await db.rollback();
        return {
          status: STATUS.Error,
          message: "MainTypeName musi być podane, jeśli TypeName jest wypełnione.",
        };
      }
      const existingType = await db.get<{ TypeId: number }>(
        `SELECT TypeId FROM DictionaryType WHERE LOWER(TypeName) = LOWER(?)`,
        [document.TypeName]
      );
      if (existingType) {
        typeId = existingType.TypeId;
      } else {
        const insertType = await db.run(
          `INSERT INTO DictionaryType (TypeName) VALUES (?)`,
          [document.TypeName]
        );
        if (!insertType.lastID) {
          await db.rollback();
          return {
            status: STATUS.Error,
            message: "Nie udało się dodać TypeName do DictionaryType.",
          };
        }
        typeId = insertType.lastID;
      }
    }

    // Krok 4: Sprawdzenie lub dodanie SubtypeName w DictionarySubtype (jeśli istnieje)
    let subtypeId: number | null = null;
    if (document.SubtypeName) {
      if (!typeId) {
        await db.rollback();
        return {
          status: STATUS.Error,
          message: "TypeName musi być podane, jeśli SubtypeName jest wypełnione.",
        };
      }
      const existingSubtype = await db.get<{ SubtypeId: number }>(
        `SELECT SubtypeId FROM DictionarySubtype WHERE LOWER(SubtypeName) = LOWER(?)`,
        [document.SubtypeName]
      );
      if (existingSubtype) {
        subtypeId = existingSubtype.SubtypeId;
      } else {
        const insertSubtype = await db.run(
          `INSERT INTO DictionarySubtype (SubtypeName) VALUES (?)`,
          [document.SubtypeName]
        );
        if (!insertSubtype.lastID) {
          await db.rollback();
          return {
            status: STATUS.Error,
            message: "Nie udało się dodać SubtypeName do DictionarySubtype.",
          };
        }
        subtypeId = insertSubtype.lastID;
      }
    }

    // Krok 5: Sprawdzenie, czy konfiguracja istnieje w AllDocuments
    const existingConfig = await db.get<{ AllDocumentsId: number }>(
      `SELECT AllDocumentsId FROM AllDocuments 
       WHERE DocumentId = ? 
       AND (MainTypeId = ? OR (MainTypeId IS NULL AND ? IS NULL))
       AND (TypeId = ? OR (TypeId IS NULL AND ? IS NULL))
       AND (SubtypeId = ? OR (SubtypeId IS NULL AND ? IS NULL))`,
      [documentId, mainTypeId, mainTypeId, typeId, typeId, subtypeId, subtypeId]
    );
    if (existingConfig) {
      await db.rollback();
      return {
        status: STATUS.Error,
        message: "Taki dokument już istnieje w bazie danych.",
      };
    }

    // Krok 6: Wstawienie nowego rekordu do AllDocuments
    const insertAllDocuments = await db.run(
      `INSERT INTO AllDocuments (DocumentId, MainTypeId, TypeId, SubtypeId, Price, IsDeleted) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [documentId, mainTypeId, typeId, subtypeId, document.Price, document.IsDeleted ?? 0]
    );
    if (!insertAllDocuments.lastID || !insertAllDocuments.changes) {
      await db.rollback();
      return {
        status: STATUS.Error,
        message: "Nie udało się zapisać dokumentu w AllDocuments.",
      };
    }

    await db.commit();
    return {
      status: STATUS.Success,
      data: { lastID: insertAllDocuments.lastID, changes: insertAllDocuments.changes },
    };
  } catch (err) {
    await db.rollback();
    log.error("Błąd podczas zapisywania nowego dokumentu:", err);
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : "Nieznany błąd podczas zapisywania dokumentu.",
    };
  }
}

// export async function saveNewDocument(
//   document: AllDocumentsName
// ): Promise<DataBaseResponse<ReturnMessageFromDb>> {
//   try {
//     await db.beginTransaction();

//     // Krok 1: Sprawdzenie lub dodanie DocumentName w DictionaryDocuments
//     let documentId: number;
//     const existingDocument = await db.get<{ DocumentId: number }>(
//       `SELECT DocumentId FROM DictionaryDocuments WHERE DocumentName = ?`,
//       [document.DocumentName]
//     );
//     if (existingDocument) {
//       documentId = existingDocument.DocumentId;
//     } else {
//       const insertDocument = await db.run(
//         `INSERT INTO DictionaryDocuments (DocumentName) VALUES (?)`,
//         [document.DocumentName]
//       );
//       if (!insertDocument.lastID) {
//         await db.rollback();
//         return {
//           status: STATUS.Error,
//           message: "Nie udało się dodać DocumentName do DictionaryDocuments.",
//         };
//       }
//       documentId = insertDocument.lastID;
//     }

//     // Krok 2: Sprawdzenie lub dodanie MainTypeName w DictionaryMainType (jeśli istnieje)
//     let mainTypeId: number | null = null;
//     if (document.MainTypeName) {
//       const existingMainType = await db.get<{ MainTypeId: number }>(
//         `SELECT MainTypeId FROM DictionaryMainType WHERE MainTypeName = ?`,
//         [document.MainTypeName]
//       );
//       if (existingMainType) {
//         mainTypeId = existingMainType.MainTypeId;
//       } else {
//         const insertMainType = await db.run(
//           `INSERT INTO DictionaryMainType (MainTypeName) VALUES (?)`,
//           [document.MainTypeName]
//         );
//         if (!insertMainType.lastID) {
//           await db.rollback();
//           return {
//             status: STATUS.Error,
//             message: "Nie udało się dodać MainTypeName do DictionaryMainType.",
//           };
//         }
//         mainTypeId = insertMainType.lastID;
//       }
//     }

//     // Krok 3: Sprawdzenie lub dodanie TypeName w DictionaryType (jeśli istnieje)
//     let typeId: number | null = null;
//     if (document.TypeName) {
//       if (!mainTypeId) {
//         await db.rollback();
//         return {
//           status: STATUS.Error,
//           message: "MainTypeName musi być podane, jeśli TypeName jest wypełnione.",
//         };
//       }
//       const existingType = await db.get<{ TypeId: number }>(
//         `SELECT TypeId FROM DictionaryType WHERE TypeName = ?`,
//         [document.TypeName]
//       );
//       if (existingType) {
//         typeId = existingType.TypeId;
//       } else {
//         const insertType = await db.run(
//           `INSERT INTO DictionaryType (TypeName) VALUES (?)`,
//           [document.TypeName]
//         );
//         if (!insertType.lastID) {
//           await db.rollback();
//           return {
//             status: STATUS.Error,
//             message: "Nie udało się dodać TypeName do DictionaryType.",
//           };
//         }
//         typeId = insertType.lastID;
//       }
//     }

//     // Krok 4: Sprawdzenie lub dodanie SubtypeName w DictionarySubtype (jeśli istnieje)
//     let subtypeId: number | null = null;
//     if (document.SubtypeName) {
//       if (!typeId) {
//         await db.rollback();
//         return {
//           status: STATUS.Error,
//           message: "TypeName musi być podane, jeśli SubtypeName jest wypełnione.",
//         };
//       }
//       const existingSubtype = await db.get<{ SubtypeId: number }>(
//         `SELECT SubtypeId FROM DictionarySubtype WHERE SubtypeName = ?`,
//         [document.SubtypeName]
//       );
//       if (existingSubtype) {
//         subtypeId = existingSubtype.SubtypeId;
//       } else {
//         const insertSubtype = await db.run(
//           `INSERT INTO DictionarySubtype (SubtypeName) VALUES (?)`,
//           [document.SubtypeName]
//         );
//         if (!insertSubtype.lastID) {
//           await db.rollback();
//           return {
//             status: STATUS.Error,
//             message: "Nie udało się dodać SubtypeName do DictionarySubtype.",
//           };
//         }
//         subtypeId = insertSubtype.lastID;
//       }
//     }

//     // Krok 5: Sprawdzenie, czy konfiguracja istnieje w AllDocuments
//     const existingConfig = await db.get<{ AllDocumentsId: number }>(
//       `SELECT AllDocumentsId FROM AllDocuments
//        WHERE DocumentId = ?
//        AND (MainTypeId = ? OR (MainTypeId IS NULL AND ? IS NULL))
//        AND (TypeId = ? OR (TypeId IS NULL AND ? IS NULL))
//        AND (SubtypeId = ? OR (SubtypeId IS NULL AND ? IS NULL))`,
//       [documentId, mainTypeId, mainTypeId, typeId, typeId, subtypeId, subtypeId]
//     );
//     if (existingConfig) {
//       await db.rollback();
//       return {
//         status: STATUS.Error,
//         message: "Nie udało się dodać nowego dokumentu. Taki dokument już istnieje w bazie danych.",
//       };
//     }

//     // Krok 6: Wstawienie nowego rekordu do AllDocuments
//     const insertAllDocuments = await db.run(
//       `INSERT INTO AllDocuments (DocumentId, MainTypeId, TypeId, SubtypeId, Price, IsDeleted)
//        VALUES (?, ?, ?, ?, ?, ?)`,
//       [documentId, mainTypeId, typeId, subtypeId, document.Price, document.IsDeleted ?? 0]
//     );
//     if (!insertAllDocuments.lastID || !insertAllDocuments.changes) {
//       await db.rollback();
//       return {
//         status: STATUS.Error,
//         message: "Nie udało się dodać nowego dokumentu. Nie udało się zapisać dokumentu w AllDocuments.",
//       };
//     }

//     await db.commit();
//     return {
//       status: STATUS.Success,
//       data: { lastID: insertAllDocuments.lastID, changes: insertAllDocuments.changes },
//     };
//   } catch (err) {
//     await db.rollback();
//     log.error("Błąd podczas zapisywania edytowanego dokumentu:", err);
//     return {
//       status: STATUS.Error,
//       message: err instanceof Error ? err.message : "Nieznany błąd podczas zapisywania dokumentu.",
//     };
//   }
// }

// Funkcja do edytowania dokumentu
export async function saveEditedDocument(
  document: AllDocumentsName
): Promise<DataBaseResponse<ReturnMessageFromDb>> {
  try {
    if (!document || !document.DocumentName) {
      return {
        status: STATUS.Error,
        message: "DocumentName jest wymagane.",
      };
    }
    if (document.Price == null || isNaN(document.Price) || document.Price < 0) {
      return {
        status: STATUS.Error,
        message: "Cena musi być wypełniona i mieć wartość równą lub większą od 0.",
      };
    }
    await db.beginTransaction();

    // Krok 1: Sprawdzenie i aktualizacja DocumentName w DictionaryDocuments
    let documentId: number;
    if (document.DocumentId && document.DocumentName) {
      // Aktualizacja istniejącego DocumentName
      const updateDocument = await db.run(
        `UPDATE DictionaryDocuments SET DocumentName = ? WHERE DocumentId = ?`,
        [document.DocumentName, document.DocumentId]
      );
      if (!updateDocument.changes) {
        await db.rollback();
        return {
          status: STATUS.Error,
          message: `Nie udało się zaktualizować DocumentName dla DocumentId: ${document.DocumentId}.`,
        };
      }
      documentId = document.DocumentId;
    } else if (!document.DocumentId && document.DocumentName) {
      // Wstawienie nowego DocumentName
      const existingDocument = await db.get<{ DocumentId: number }>(
        `SELECT DocumentId FROM DictionaryDocuments WHERE LOWER(DocumentName) = LOWER(?)`,
        [document.DocumentName]
      );
      if (existingDocument) {
        documentId = existingDocument.DocumentId;
      } else {
        const insertDocument = await db.run(
          `INSERT INTO DictionaryDocuments (DocumentName) VALUES (?)`,
          [document.DocumentName]
        );
        if (!insertDocument.lastID) {
          await db.rollback();
          return {
            status: STATUS.Error,
            message: "Nie udało się dodać DocumentName do DictionaryDocuments.",
          };
        }
        documentId = insertDocument.lastID;
      }
    } else {
      await db.rollback();
      return {
        status: STATUS.Error,
        message: "DocumentId lub DocumentName musi być podane.",
      };
    }

    // Krok 2: Sprawdzenie i aktualizacja MainTypeName w DictionaryMainType
    let mainTypeId: number | null = null;
    if (document.MainTypeId && document.MainTypeName) {
      // Aktualizacja istniejącego MainTypeName
      const updateMainType = await db.run(
        `UPDATE DictionaryMainType SET MainTypeName = ? WHERE MainTypeId = ?`,
        [document.MainTypeName, document.MainTypeId]
      );
      if (!updateMainType.changes) {
        await db.rollback();
        return {
          status: STATUS.Error,
          message: `Nie udało się zaktualizować MainTypeName dla MainTypeId: ${document.MainTypeId}.`,
        };
      }
      mainTypeId = document.MainTypeId;
    } else if (!document.MainTypeId && document.MainTypeName) {
      // Wstawienie nowego MainTypeName
      const existingMainType = await db.get<{ MainTypeId: number }>(
        `SELECT MainTypeId FROM DictionaryMainType WHERE LOWER(MainTypeName) = LOWER(?)`,
        [document.MainTypeName]
      );
      if (existingMainType) {
        mainTypeId = existingMainType.MainTypeId;
      } else {
        const insertMainType = await db.run(
          `INSERT INTO DictionaryMainType (MainTypeName) VALUES (?)`,
          [document.MainTypeName]
        );
        if (!insertMainType.lastID) {
          await db.rollback();
          return {
            status: STATUS.Error,
            message: "Nie udało się dodać MainTypeName do DictionaryMainType.",
          };
        }
        mainTypeId = insertMainType.lastID;
      }
    } else if (document.MainTypeId && !document.MainTypeName) {
      // Ustawienie MainTypeId na null w AllDocuments
      mainTypeId = null;
    }

    // Krok 3: Sprawdzenie i aktualizacja TypeName w DictionaryType
    let typeId: number | null = null;
    if (document.TypeId && document.TypeName) {
      if (!mainTypeId) {
        await db.rollback();
        return {
          status: STATUS.Error,
          message: "MainTypeId musi być podane, jeśli TypeName jest wypełnione.",
        };
      }
      // Aktualizacja istniejącego TypeName
      const updateType = await db.run(
        `UPDATE DictionaryType SET TypeName = ? WHERE TypeId = ?`,
        [document.TypeName, document.TypeId]
      );
      if (!updateType.changes) {
        await db.rollback();
        return {
          status: STATUS.Error,
          message: `Nie udało się zaktualizować TypeName dla TypeId: ${document.TypeId}.`,
        };
      }
      typeId = document.TypeId;
    } else if (!document.TypeId && document.TypeName) {
      if (!mainTypeId) {
        await db.rollback();
        return {
          status: STATUS.Error,
          message: "MainTypeId musi być podane, jeśli TypeName jest wypełnione.",
        };
      }
      // Wstawienie nowego TypeName
      const existingType = await db.get<{ TypeId: number }>(
        `SELECT TypeId FROM DictionaryType WHERE LOWER(TypeName) = LOWER(?)`,
        [document.TypeName]
      );
      if (existingType) {
        typeId = existingType.TypeId;
      } else {
        const insertType = await db.run(
          `INSERT INTO DictionaryType (TypeName) VALUES (?)`,
          [document.TypeName]
        );
        if (!insertType.lastID) {
          await db.rollback();
          return {
            status: STATUS.Error,
            message: "Nie udało się dodać TypeName do DictionaryType.",
          };
        }
        typeId = insertType.lastID;
      }
    } else if (document.TypeId && !document.TypeName) {
      // Ustawienie TypeId na null w AllDocuments
      typeId = null;
    }

    // Krok 4: Sprawdzenie i aktualizacja SubtypeName w DictionarySubtype
    let subtypeId: number | null = null;
    if (document.SubtypeId && document.SubtypeName) {
      if (!typeId) {
        await db.rollback();
        return {
          status: STATUS.Error,
          message: "TypeId musi być podane, jeśli SubtypeName jest wypełnione.",
        };
      }
      // Aktualizacja istniejącego SubtypeName
      const updateSubtype = await db.run(
        `UPDATE DictionarySubtype SET SubtypeName = ? WHERE SubtypeId = ?`,
        [document.SubtypeName, document.SubtypeId]
      );
      if (!updateSubtype.changes) {
        await db.rollback();
        return {
          status: STATUS.Error,
          message: `Nie udało się zaktualizować SubtypeName dla SubtypeId: ${document.SubtypeId}.`,
        };
      }
      subtypeId = document.SubtypeId;
    } else if (!document.SubtypeId && document.SubtypeName) {
      if (!typeId) {
        await db.rollback();
        return {
          status: STATUS.Error,
          message: "TypeId musi być podane, jeśli SubtypeName jest wypełnione.",
        };
      }
      // Wstawienie nowego SubtypeName
      const existingSubtype = await db.get<{ SubtypeId: number }>(
        `SELECT SubtypeId FROM DictionarySubtype WHERE LOWER(SubtypeName) = LOWER(?)`,
        [document.SubtypeName]
      );
      if (existingSubtype) {
        subtypeId = existingSubtype.SubtypeId;
      } else {
        const insertSubtype = await db.run(
          `INSERT INTO DictionarySubtype (SubtypeName) VALUES (?)`,
          [document.SubtypeName]
        );
        if (!insertSubtype.lastID) {
          await db.rollback();
          return {
            status: STATUS.Error,
            message: "Nie udało się dodać SubtypeName do DictionarySubtype.",
          };
        }
        subtypeId = insertSubtype.lastID;
      }
    } else if (document.SubtypeId && !document.SubtypeName) {
      // Ustawienie SubtypeId na null w AllDocuments
      subtypeId = null;
    }

    // Krok 5: Sprawdzenie, czy rekord istnieje w AllDocuments
    const existingConfig = await db.get<{ AllDocumentsId: number }>(
      `SELECT AllDocumentsId FROM AllDocuments WHERE AllDocumentsId = ?`,
      [document.AllDocumentsId]
    );
    if (!existingConfig) {
      await db.rollback();
      return {
        status: STATUS.Error,
        message: `Dokument o ID ${document.AllDocumentsId} nie istnieje w AllDocuments.`,
      };
    }

    // Krok 6: Aktualizacja rekordu w AllDocuments
    const updateAllDocuments = await db.run(
      `UPDATE AllDocuments 
       SET DocumentId = ?, MainTypeId = ?, TypeId = ?, SubtypeId = ?, Price = ?, IsDeleted = ? 
       WHERE AllDocumentsId = ?`,
      [documentId, mainTypeId, typeId, subtypeId, document.Price, document.IsDeleted, document.AllDocumentsId]
    );
    if (!updateAllDocuments.changes) {
      await db.rollback();
      return {
        status: STATUS.Error,
        message: "Nie udało się zaktualizować dokumentu w AllDocuments.",
      };
    }

    await db.commit();
    log.info("saveEditedDocument: Edytowany dokument zapisany pomyślnie:", document);
    return {
      status: STATUS.Success,
      data: { lastID: document.AllDocumentsId, changes: updateAllDocuments.changes },
    };
  } catch (err) {
    await db.rollback();
    log.error("Błąd podczas zapisywania edytowanego dokumentu:", err);
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : "Nieznany błąd podczas zapisywania dokumentu.",
    };
  }
}
// export async function saveEditedDocument(
//   document: AllDocumentsName
// ): Promise<DataBaseResponse<ReturnMessageFromDb>> {
//   try {
//     await db.beginTransaction();
//     // Krok 1: Sprawdzenie i aktualizacja DocumentName w DictionaryDocuments
//     let documentId: number;
//     if (document.DocumentId && document.DocumentName) {
//       // Aktualizacja istniejącego DocumentName
//       const updateDocument = await db.run(
//         `UPDATE DictionaryDocuments SET DocumentName = ? WHERE DocumentId = ?`,
//         [document.DocumentName, document.DocumentId]
//       );
//       if (!updateDocument.changes) {
//         await db.rollback();
//         return {
//           status: STATUS.Error,
//           message: `Nie udało się zaktualizować DocumentName dla DocumentId: ${document.DocumentId}.`,
//         };
//       }
//       documentId = document.DocumentId;
//     } else if (!document.DocumentId && document.DocumentName) {
//       // Wstawienie nowego DocumentName
//       const existingDocument = await db.get<{ DocumentId: number }>(
//         `SELECT DocumentId FROM DictionaryDocuments WHERE DocumentName = ?`,
//         [document.DocumentName]
//       );
//       if (existingDocument) {
//         documentId = existingDocument.DocumentId;
//       } else {
//         const insertDocument = await db.run(
//           `INSERT INTO DictionaryDocuments (DocumentName) VALUES (?)`,
//           [document.DocumentName]
//         );
//         if (!insertDocument.lastID) {
//           await db.rollback();
//           return {
//             status: STATUS.Error,
//             message: "Nie udało się dodać DocumentName do DictionaryDocuments.",
//           };
//         }
//         documentId = insertDocument.lastID;
//       }
//     } else {
//       await db.rollback();
//       return {
//         status: STATUS.Error,
//         message: "DocumentId lub DocumentName musi być podane.",
//       };
//     }

//     // Krok 2: Sprawdzenie i aktualizacja MainTypeName w DictionaryMainType
//     let mainTypeId: number | null = null;
//     if (document.MainTypeId && document.MainTypeName) {
//       // Aktualizacja istniejącego MainTypeName
//       const updateMainType = await db.run(
//         `UPDATE DictionaryMainType SET MainTypeName = ? WHERE MainTypeId = ?`,
//         [document.MainTypeName, document.MainTypeId]
//       );
//       if (!updateMainType.changes) {
//         await db.rollback();
//         return {
//           status: STATUS.Error,
//           message: `Nie udało się zaktualizować MainTypeName dla MainTypeId: ${document.MainTypeId}.`,
//         };
//       }
//       mainTypeId = document.MainTypeId;
//     } else if (!document.MainTypeId && document.MainTypeName) {
//       // Wstawienie nowego MainTypeName
//       const existingMainType = await db.get<{ MainTypeId: number }>(
//         `SELECT MainTypeId FROM DictionaryMainType WHERE MainTypeName = ?`,
//         [document.MainTypeName]
//       );
//       if (existingMainType) {
//         mainTypeId = existingMainType.MainTypeId;
//       } else {
//         const insertMainType = await db.run(
//           `INSERT INTO DictionaryMainType (MainTypeName) VALUES (?)`,
//           [document.MainTypeName]
//         );
//         if (!insertMainType.lastID) {
//           await db.rollback();
//           return {
//             status: STATUS.Error,
//             message: "Nie udało się dodać MainTypeName do DictionaryMainType.",
//           };
//         }
//         mainTypeId = insertMainType.lastID;
//       }
//     } else if (document.MainTypeId && !document.MainTypeName) {
//       // Ustawienie MainTypeId na null w AllDocuments
//       mainTypeId = null;
//     }

//     // Krok 3: Sprawdzenie i aktualizacja TypeName w DictionaryType
//     let typeId: number | null = null;
//     if (document.TypeId && document.TypeName) {
//       if (!mainTypeId) {
//         await db.rollback();
//         return {
//           status: STATUS.Error,
//           message: "MainTypeId musi być podane, jeśli TypeName jest wypełnione.",
//         };
//       }
//       // Aktualizacja istniejącego TypeName
//       const updateType = await db.run(
//         `UPDATE DictionaryType SET TypeName = ? WHERE TypeId = ?`,
//         [document.TypeName, document.TypeId]
//       );
//       if (!updateType.changes) {
//         await db.rollback();
//         return {
//           status: STATUS.Error,
//           message: `Nie udało się zaktualizować TypeName dla TypeId: ${document.TypeId}.`,
//         };
//       }
//       typeId = document.TypeId;
//     } else if (!document.TypeId && document.TypeName) {
//       if (!mainTypeId) {
//         await db.rollback();
//         return {
//           status: STATUS.Error,
//           message: "MainTypeId musi być podane, jeśli TypeName jest wypełnione.",
//         };
//       }
//       // Wstawienie nowego TypeName
//       const existingType = await db.get<{ TypeId: number }>(
//         `SELECT TypeId FROM DictionaryType WHERE TypeName = ?`,
//         [document.TypeName]
//       );
//       if (existingType) {
//         typeId = existingType.TypeId;
//       } else {
//         const insertType = await db.run(
//           `INSERT INTO DictionaryType (TypeName) VALUES (?)`,
//           [document.TypeName]
//         );
//         if (!insertType.lastID) {
//           await db.rollback();
//           return {
//             status: STATUS.Error,
//             message: "Nie udało się dodać TypeName do DictionaryType.",
//           };
//         }
//         typeId = insertType.lastID;
//       }
//     } else if (document.TypeId && !document.TypeName) {
//       // Ustawienie TypeId na null w AllDocuments
//       typeId = null;
//     }

//     // Krok 4: Sprawdzenie i aktualizacja SubtypeName w DictionarySubtype
//     let subtypeId: number | null = null;
//     if (document.SubtypeId && document.SubtypeName) {
//       if (!typeId) {
//         await db.rollback();
//         return {
//           status: STATUS.Error,
//           message: "TypeId musi być podane, jeśli SubtypeName jest wypełnione.",
//         };
//       }
//       // Aktualizacja istniejącego SubtypeName
//       const updateSubtype = await db.run(
//         `UPDATE DictionarySubtype SET SubtypeName = ? WHERE SubtypeId = ?`,
//         [document.SubtypeName, document.SubtypeId]
//       );
//       if (!updateSubtype.changes) {
//         await db.rollback();
//         return {
//           status: STATUS.Error,
//           message: `Nie udało się zaktualizować SubtypeName dla SubtypeId: ${document.SubtypeId}.`,
//         };
//       }
//       subtypeId = document.SubtypeId;
//     } else if (!document.SubtypeId && document.SubtypeName) {
//       if (!typeId) {
//         await db.rollback();
//         return {
//           status: STATUS.Error,
//           message: "TypeId musi być podane, jeśli SubtypeName jest wypełnione.",
//         };
//       }
//       // Wstawienie nowego SubtypeName
//       const existingSubtype = await db.get<{ SubtypeId: number }>(
//         `SELECT SubtypeId FROM DictionarySubtype WHERE SubtypeName = ?`,
//         [document.SubtypeName]
//       );
//       if (existingSubtype) {
//         subtypeId = existingSubtype.SubtypeId;
//       } else {
//         const insertSubtype = await db.run(
//           `INSERT INTO DictionarySubtype (SubtypeName) VALUES (?)`,
//           [document.SubtypeName]
//         );
//         if (!insertSubtype.lastID) {
//           await db.rollback();
//           return {
//             status: STATUS.Error,
//             message: "Nie udało się dodać SubtypeName do DictionarySubtype.",
//           };
//         }
//         subtypeId = insertSubtype.lastID;
//       }
//     } else if (document.SubtypeId && !document.SubtypeName) {
//       // Ustawienie SubtypeId na null w AllDocuments
//       subtypeId = null;
//     }

//     // Krok 5: Sprawdzenie, czy rekord istnieje w AllDocuments
//     const existingConfig = await db.get<{ AllDocumentsId: number }>(
//       `SELECT AllDocumentsId FROM AllDocuments WHERE AllDocumentsId = ?`,
//       [document.AllDocumentsId]
//     );
//       if (!existingConfig) {
//       await db.rollback();
//       return {
//         status: STATUS.Error,
//         message: `Dokument o ID ${document.AllDocumentsId} nie istnieje w AllDocuments.`,
//       };
//     }

//     // Krok 6: Aktualizacja rekordu w AllDocuments
//     const updateAllDocuments = await db.run(
//       `UPDATE AllDocuments 
//        SET DocumentId = ?, MainTypeId = ?, TypeId = ?, SubtypeId = ?, Price = ?, IsDeleted = ? 
//        WHERE AllDocumentsId = ?`,
//       [documentId, mainTypeId, typeId, subtypeId, document.Price, document.IsDeleted, document.AllDocumentsId]
//     );
//     if (!updateAllDocuments.changes) {
//       await db.rollback();
//       return {
//         status: STATUS.Error,
//         message: "Nie udało się zaktualizować dokumentu w AllDocuments.",
//       };
//     }

//     await db.commit();
//     console.log("saveEditedDocument: Dokument zapisany pomyślnie:", document);
//     return {
//       status: STATUS.Success,
//       data: { lastID:document.AllDocumentsId, changes: updateAllDocuments.changes },
//     };
//   } catch (err) {
//     await db.rollback();
//     log.error("Błąd podczas zapisywania edytowanego dokumentu:", err);
//     return {
//       status: STATUS.Error,
//       message: err instanceof Error ? err.message : "Nieznany błąd podczas zapisywania dokumentu.",
//     };
//   }
// }

export async function updateDocumentDeletionStatus(
  documentId: number,
  isDeleted: 0 | 1
): Promise<DataBaseResponse<ReturnMessageFromDb>> {
  // Walidacja InvoiceId
  if (!documentId || documentId <= 0) {
    return {
      status: STATUS.Error,
      message: "Nieprawidłowy identyfikator dokumentu.",
    };
  }

  // SQL do ustawienia IsDeleted
  const updateSql = `
    UPDATE AllDocuments 
    SET IsDeleted = ?
    WHERE AllDocumentsId = ?
  `;
  const updateParams: QueryParams = [isDeleted, documentId];

  try {
    await db.beginTransaction();

    // Sprawdzenie, czy faktura istnieje i ma odpowiedni status IsDeleted
    const existingDocument = await db.get<{ AllDocumentsId: number }>(
      `SELECT AllDocumentsId FROM AllDocuments WHERE AllDocumentsId = ? AND IsDeleted = ?`,
      [documentId, isDeleted === 0 ? 1 : 0]
    );
    if (!existingDocument) {
      await db.rollback();
      return {
        status: STATUS.Error,
        message: `Dokument o ID ${documentId} nie istnieje lub jest już oznaczony jako ${isDeleted === 0 ? "przywrócona" : "usunięta"
          }.`,
      };
    }

    // Aktualizacja flagi IsDeleted
    const updateResult = await db.run(updateSql, updateParams);
    if (!updateResult.changes) {
      await db.rollback();
      return {
        status: STATUS.Error,
        message: `Nie udało się ${isDeleted === 0 ? "przywrócić" : "usunąć"
          } dokumentu.`,
      };
    }

    await db.commit();
    return {
      status: STATUS.Success,
      data: { lastID: documentId, changes: updateResult.changes },
    };
  } catch (err) {
    await db.rollback();
    console.error(
      `Błąd podczas ${isDeleted === 0 ? "przywracania" : "usuwania"
      } dokumentu:`,
      err
    );
    return {
      status: STATUS.Error,
      message:
        err instanceof Error
          ? err.message
          : `Nieznany błąd podczas ${isDeleted === 0 ? "przywracania" : "usuwania"
          } dokumentu.`,
    };
  }
}
export async function getAllInvoices(
  formValuesHomePage: FormValuesHomePage,
  page: number = 1,
  rowsPerPage: number = 10
): Promise<DataBaseResponse<AllInvoices[]>> {
  try {
    let query = sqlString.getAllInvoicesSqlString(formValuesHomePage);
    const params: QueryParams = [];

    if (formValuesHomePage.firstDate) {
      params.push(formValuesHomePage.firstDate.toISOString().split("T")[0]);
    }
    if (formValuesHomePage.secondDate) {
      params.push(formValuesHomePage.secondDate.toISOString().split("T")[0]);
    }
    params.push(formValuesHomePage.isDeleted ?? 0); // Domyślna wartość isDeleted

    // Dodajemy paginację
    const offset = (page - 1) * rowsPerPage;
    query += ` LIMIT ? OFFSET ?`;
    params.push(rowsPerPage, offset);

    const rows = await db.all<AllInvoices>(query, params);
    return {
      status: STATUS.Success,
      data: rows ?? [],
    };
  } catch (err) {
    console.error("getAllInvoices() Błąd podczas pobierania faktur:", err);
    return {
      status: STATUS.Error,
      message: "Błąd podczas pobierania faktur z bazy danych.",
    };
  }
}
// Pobierz wszystkie faktury
// export async function getAllInvoices(formValuesHomePage: FormValuesHomePage) {
//   try {
//     const rows = await db.all<AllInvoices>(sqlString.getAllInvoicesSqlString(formValuesHomePage));
//     return rows || [];

//   } catch (err) {
//     console.error('getAllInvoices() Błąd podczas pobierania faktur:', err);
//     return [];
//   }
// };

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
export async function addInvoice(invoice: InvoiceTable): Promise<DataBaseResponse<ReturnMessageFromDb>> {
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
): Promise<DataBaseResponse<ReturnMessageFromDb>> {
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
): Promise<DataBaseResponse<ReturnMessageFromDb>> {
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
): Promise<DataBaseResponse<ReturnMessageFromDb>> {
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
): Promise<DataBaseResponse<ReturnMessageFromDb>> {
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


// Funkcja zliczająca faktury
export async function countInvoices(formValuesHomePage: FormValuesHomePage): Promise<DataBaseResponse<number>> {
  try {
    let query = `SELECT COUNT(*) as total FROM Invoices WHERE 1=1`;
    const params: QueryParams = [];

    if (formValuesHomePage.firstDate) {
      query += ` AND ReceiptDate >= ?`;
      params.push(formValuesHomePage.firstDate.toISOString().split("T")[0]);
    }
    if (formValuesHomePage.secondDate) {
      query += ` AND ReceiptDate <= ?`;
      params.push(formValuesHomePage.secondDate.toISOString().split("T")[0]);
    }
    if (formValuesHomePage.isDeleted !== undefined) {
      query += ` AND IsDeleted = ?`;
      params.push(formValuesHomePage.isDeleted);
    }

    const result = await db.get<{ total: number }>(query, params);
    return {
      status: STATUS.Success,
      data: result?.total ?? 0,
    };
  } catch (err) {
    console.error("countInvoices() Błąd podczas zliczania faktur:", err);
    return {
      status: STATUS.Error,
      message: "Błąd podczas zliczania faktur z bazy danych.",
    };
  }
}
//ACTIVITY LOG
//Funkcja zliczająca wiersze w ActivityLog
export async function countActivityLog(): Promise<DataBaseResponse<number>> {
  try {
    const query = `SELECT COUNT(*) as total FROM ActivityLog`;
    const result = await db.get<{ total: number }>(query);
    return {
      status: STATUS.Success,
      data: result?.total ?? 0,
    };
  } catch (err) {
    console.error("countActivityLog() Błąd podczas zliczania wpisów w ActivityLog:", err);
    return {
      status: STATUS.Error,
      message: "Błąd podczas zliczania wpisów w ActivityLog z bazy danych.",
    };
  }
}

//Pobranie wszystkich aktywności
export async function getAllActivityLog(
  page: number = 1,
  rowsPerPage: number = 10
): Promise<DataBaseResponse<ActivityLog[]>> {
  try {
    const query = `SELECT ActivityLogId, Date, UserName, ActivityType, ActivityData 
                   FROM ActivityLog 
                   ORDER BY Date DESC 
                   LIMIT ? OFFSET ?`;
    const params: QueryParams = [rowsPerPage, (page - 1) * rowsPerPage];

    const rows = await db.all<ActivityLog>(query, params);
    return {
      status: STATUS.Success,
      data: rows ?? [],
    };
  } catch (err) {
    console.error("getAllActivityLog() Błąd podczas pobierania aktywności:", err);
    return {
      status: STATUS.Error,
      message: "Błąd podczas pobierania aktywności z bazy danych.",
    };
  }
}

//Zapisanie aktywności
export async function saveActivityLog(activity: ActivityLog): Promise<DataBaseResponse<ReturnMessageFromDb>> {
  try {
    // Krok 1: Walidacja danych
    if (!activity.UserName) {
      return {
        status: STATUS.Error,
        message: "UserName jest wymagane.",
      };
    }
    if (!activity.ActivityType || !Object.values(ActivityType).includes(activity.ActivityType)) {
      return {
        status: STATUS.Error,
        message: "ActivityType musi być jednym z dozwolonych nazw.",
      };
    }
    if (!activity.ActivityData) {
      return {
        status: STATUS.Error,
        message: "ActivityData jest wymagane.",
      };
    }
    // Walidacja JSON
    try {
      JSON.parse(activity.ActivityData);
    } catch (err) {
      return {
        status: STATUS.Error,
        message: "ActivityData musi być poprawnym JSON-em.",
      };
    }

    await db.beginTransaction();

    // Krok 2: Wstawienie rekordu do ActivityLog
    const query = `
      INSERT INTO ActivityLog (UserName, ActivityType, ActivityData)
      VALUES (?, ?, ?)
      RETURNING ActivityLogId, changes()
    `;
    const params: QueryParams = [activity.UserName, activity.ActivityType, activity.ActivityData];

    const result = await db.get<{ ActivityLogId: number; changes: number }>(query, params);
    if (!result || !result.ActivityLogId || !result.changes) {
      await db.rollback();
      return {
        status: STATUS.Error,
        message: "Nie udało się zapisać aktywności w ActivityLog.",
      };
    }

    await db.commit();
    return {
      status: STATUS.Success,
      data: { lastID: result.ActivityLogId, changes: result.changes },
    };
  } catch (err) {
    await db.rollback();
    console.error("saveActivityLog() Błąd podczas zapisywania aktywności:", err);
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : "Nieznany błąd podczas zapisywania aktywności.",
    };
  }
}



export async function reinitializeDatabase(dbPath: string): Promise<ReturnStatusMessage> {
  try {
    await db.reinitialize(dbPath);
    log.info('Baza danych została pomyślnie zreinicjalizowana:', dbPath);
    return { status: true, message: 'Baza danych została pomyślnie zreinicjalizowana.' };
  } catch (err) {
    log.error('Błąd podczas reinicjalizacji bazy danych:', err);
    return { status: false, message: err instanceof Error ? err.message : 'Nieznany błąd podczas reinicjalizacji bazy danych.' };
  }
};

//USERS
// Funkcja do pobierania wszystkich użytkowników z tabeli Users
export async function getAllUsers(isDeleted?: number): Promise<DataBaseResponse<User[]>> {
  try {
    let query = `SELECT UserId, UserSystemName, UserDisplayName, UserPassword, UserRole, IsDeleted 
                 FROM Users`;
    const params: QueryParams = [];

    if (isDeleted !== undefined) {
      query += ` WHERE IsDeleted = ?`;
      params.push(isDeleted);
    }

    const rows = await db.all<User>(query, params);

    log.info('[dbFunction] [getAllUsers()] Pobrano użytkowników', { count: rows.length, isDeleted });
    return {
      status: STATUS.Success,
      data: rows ?? [],
    };
  } catch (err) {
    log.error('[dbFunction] [getAllUsers()] Błąd podczas pobierania użytkowników z bazy danych:', err);
    return {
      status: STATUS.Error,
      message: `Błąd podczas pobierania użytkowników z bazy danych: ${err}`,
    };
  }
}

// Weryfikacja użytkownika na podstawie UserSystemName
export async function getUserBySystemName(systemUserName: string): Promise<DataBaseResponse<User>> {
  try {
    const query = `SELECT UserId, UserSystemName, UserDisplayName, UserPassword, UserRole 
                   FROM Users 
                   WHERE LOWER(UserSystemName) = LOWER(?) AND IsDeleted = 0`;
    const params: QueryParams = [systemUserName];
    const user = await db.get<User>(query, params);

    if (!user) {
      log.error(`[dbFunction] [getUserBySystemName()] Brak użytkownika ${systemUserName} w bazie danych.`);
      return {
        status: STATUS.Error,
        message: `Brak użytkownika ${systemUserName} w bazie danych.`,
      };
    }

    return {
      status: STATUS.Success,
      data: user,
    };
  } catch (err) {
    log.error('[dbFunction] [getUserBySystemName()] Błąd podczas pobierania użytkownika:', err);
    return {
      status: STATUS.Error,
      message: `Błąd podczas pobierania użytkownika: ${err}`,
    };
  }
}

// Weryfikacja użytkownika na podstawie UserSystemName i hasła
export async function loginUser(systemUserName: string, password: string): Promise<DataBaseResponse<User>> {
  try {
    const query = `SELECT UserId, UserSystemName, UserDisplayName, UserPassword, UserRole 
                   FROM Users 
                   WHERE LOWER(UserSystemName) = LOWER(?) AND IsDeleted = 0`;
    const params: QueryParams = [systemUserName];
    const user = await db.get<User>(query, params);

    if (!user) {
      log.error(`[dbFunction] [loginUser()] Brak użytkownika ${systemUserName} w bazie danych.`);
      return {
        status: STATUS.Error,
        message: `Brak użytkownika ${systemUserName} w bazie danych.`,
      };
    }

    if (user.UserPassword && user.UserPassword !== password) {
      return {
        status: STATUS.Error,
        message: 'Nieprawidłowe hasło.',
      };
    }

    return {
      status: STATUS.Success,
      data: user,
    };
  } catch (err) {
    log.error('[dbFunction] [loginUser()] Błąd podczas logowania użytkownika:', err);
    return {
      status: STATUS.Error,
      message: `Błąd podczas logowania użytkownika: ${err}`,
    };
  }
}

export async function getConfigBilancio1(tekst: string): Promise<string> {
  console.log("getConfigBilancio1 called with text:", tekst);


  return Promise.resolve("getConfigBilancio text");
}
// import { app } from 'electron';
// app.on('before-quit', async () => {
//   try {
//     await db.close();
//     console.log('Połączenie z bazą danych zostało zamknięte.');
//   } catch (err) {
//     console.error('Błąd przy zamykaniu bazy danych:', err);
//   }
// });

