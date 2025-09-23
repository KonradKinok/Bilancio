import log from "electron-log";

import { fileURLToPath } from "url";
import path from "path";
import os from "os";
import { DbTables } from "./enum.js";
import { STATUS, DataBaseResponse, isSuccess } from "../sharedTypes/status.js";
import Database, { statusDatabase, QueryParams } from "./dbClass.js";

// Pobieranie nazwy pliku w module ES
const __filename = fileURLToPath(import.meta.url);
const fileName = path.basename(__filename);

// Tworzymy instancję bazy danych
export let db: Database | null = null;
// Pobieranie nazwy użytkownika systemu Windows
let displayUserName = await displayUserNameForLog();
export function initDb() {
  if (!db) {
    db = new Database();
    log.info("[dbFunction.js] [initDb]: Utworzono instancję bazy danych.", db);
  }
}

export function getDb(): Database {
  if (!db) {
    log.error(
      "[dbFunction.js] [getDb]: Baza danych nie została zainicjalizowana. Brak wywołania funkcji initDb"
    );
    throw new Error(
      "[dbFunction.js] [getDb]: Baza danych nie została zainicjalizowana. Brak wywołania funkcji initDb()."
    );
  }
  return db;
}

// Funkcja do sprawdzania istnienia bazy danych
export function checkStatusDatabase(): ReturnStatusDbMessage {
  return statusDatabase;
}

// Pobierz połączone dane ze słowników
export async function getConnectedTableDictionary<T>(
  tableName: DbTables,
  documentId?: number,
  mainTypeId?: number,
  typeId?: number,
  subTypeId?: number
): Promise<DataBaseResponse<T[]>> {
  const functionName = getConnectedTableDictionary.name;
  try {
    let query = "";

    switch (tableName) {
      case DbTables.DictionaryDocuments:
        query = `
          SELECT * 
          FROM DictionaryDocuments
          ORDER BY LOWER(DocumentName) ASC
        `;
        break;

      case DbTables.DictionaryMainType:
        if (!documentId) {
          const message = `documentId jest wymagany do zapisu w DictionaryMainType`;
          log.error(logTitle(functionName, message));
          return { status: STATUS.Error, message: message };
        }
        query = `
          SELECT DISTINCT DictionaryMainType.MainTypeId, DictionaryMainType.MainTypeName
          FROM DictionaryMainType
          JOIN AllDocuments ON AllDocuments.MainTypeId = DictionaryMainType.MainTypeId
          JOIN DictionaryDocuments ON AllDocuments.DocumentId = DictionaryDocuments.DocumentId
          WHERE DictionaryDocuments.DocumentId = ?
          ORDER BY LOWER(DictionaryMainType.MainTypeName) ASC
        `;
        break;

      case DbTables.DictionaryType:
        if (!documentId || !mainTypeId) {
          const message = `documentId i mainTypeId są wymagane do zapisu w DictionaryType`;
          log.error(logTitle(functionName, message));
          return { status: STATUS.Error, message: message };
        }
        query = `
          SELECT DISTINCT DictionaryType.*
          FROM DictionaryType
          JOIN AllDocuments ON DictionaryType.TypeId = AllDocuments.TypeId
          JOIN DictionaryDocuments ON AllDocuments.DocumentId = DictionaryDocuments.DocumentId
          JOIN DictionaryMainType ON AllDocuments.MainTypeId = DictionaryMainType.MainTypeId
          WHERE DictionaryDocuments.DocumentId = ?
            AND DictionaryMainType.MainTypeId = ?
          ORDER BY LOWER(DictionaryType.TypeName) ASC
        `;
        break;

      case DbTables.DictionarySubtype:
        if (!documentId || !mainTypeId || !typeId) {
          const message = `documentId, mainTypeId i typeId są wymagane do zapisu w DictionarySubtype`;
          log.error(logTitle(functionName, message));
          return { status: STATUS.Error, message: message };
        }
        query = `
          SELECT DISTINCT DictionarySubtype.*
          FROM DictionarySubtype
          JOIN AllDocuments ON DictionarySubtype.SubtypeId = AllDocuments.SubtypeId
          JOIN DictionaryDocuments ON AllDocuments.DocumentId = DictionaryDocuments.DocumentId
          JOIN DictionaryMainType ON AllDocuments.MainTypeId = DictionaryMainType.MainTypeId
          JOIN DictionaryType ON AllDocuments.TypeId = DictionaryType.TypeId
          WHERE DictionaryDocuments.DocumentId = ?
            AND DictionaryMainType.MainTypeId = ?
            AND DictionaryType.TypeId = ?
          ORDER BY LOWER(DictionarySubtype.SubtypeName) ASC
        `;
        break;

      default: {
        const message = `Nieznana tabela ${tableName}`;
        log.error(logTitle(functionName, message));
        return { status: STATUS.Error, message: message };
      }
    }

    // --- Parametry zapytania ---
    const params: QueryParams = [];
    if (documentId) params.push(documentId);
    if (mainTypeId) params.push(mainTypeId);
    if (typeId) params.push(typeId);

    // --- Wykonanie zapytania ---
    const rows = await getDb().all<T>(query, params);

    return {
      status: STATUS.Success,
      data: rows ?? [],
    };
  } catch (err) {
    const message = `Nieznany błąd podczas pobierania danych z ${tableName}`;
    log.error(logTitle(functionName, message), err);
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : message,
    };
  }
}

//Funkcja do pobierania wszystkich dokumentów
export async function getAllDocumentsName(
  isDeleted?: number
): Promise<DataBaseResponse<AllDocumentsName[]>> {
  const functionName = getAllDocumentsName.name;
  try {
    // --- Budowa zapytania SQL ---
    let query = `
      SELECT
        AllDocuments.AllDocumentsId,
        AllDocuments.DocumentId, 
        AllDocuments.MainTypeId, 
        AllDocuments.TypeId, 
        AllDocuments.SubtypeId, 
        AllDocuments.Price,
        AllDocuments.IsDeleted,
        DictionaryDocuments.DocumentName,
        DictionaryMainType.MainTypeName,
        DictionaryType.TypeName,
        DictionarySubtype.SubtypeName
      FROM AllDocuments
      LEFT JOIN DictionaryDocuments ON AllDocuments.DocumentId = DictionaryDocuments.DocumentId
      LEFT JOIN DictionaryMainType ON AllDocuments.MainTypeId = DictionaryMainType.MainTypeId
      LEFT JOIN DictionaryType ON AllDocuments.TypeId = DictionaryType.TypeId
      LEFT JOIN DictionarySubtype ON AllDocuments.SubtypeId = DictionarySubtype.SubtypeId
    `;

    const params: QueryParams = [];
    if (isDeleted !== undefined) {
      query += ` WHERE AllDocuments.IsDeleted = ?`;
      params.push(isDeleted);
    }

    query += ` ORDER BY 
      LOWER(DictionaryDocuments.DocumentName) ASC, 
      LOWER(DictionaryMainType.MainTypeName) ASC, 
      LOWER(DictionaryType.TypeName) ASC, 
      LOWER(DictionarySubtype.SubtypeName) ASC
    `;

    // --- Wykonanie zapytania ---
    const rows = await getDb().all<AllDocumentsName>(query, params);

    return {
      status: STATUS.Success,
      data: rows ?? [],
    };
  } catch (err) {
    const message = `Nieznany błąd podczas pobierania dokumentów.`;
    log.error(logTitle(functionName, message), err);
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : message,
    };
  }
}

// Funkcja do zapisywania nowego dokumentu w tabeli AllDocuments
export async function addDocument(
  document: AllDocumentsName
): Promise<DataBaseResponse<ReturnMessageFromDb>> {
  const functionName = addDocument.name;
  try {
    if (!document || !document.DocumentName) {
      const message = `DocumentName jest wymagane.`;
      log.error(logTitle(functionName, message), { document });
      return { status: STATUS.Error, message: message };
    }
    if (document.Price == null || isNaN(document.Price) || document.Price < 0) {
      const message = `Cena musi być wypełniona i mieć wartość równą lub większą od 0.`;
      log.error(logTitle(functionName, message), { document });
      return { status: STATUS.Error, message: message };
    }
    await getDb().beginTransaction();

    // Krok 1: Sprawdzenie lub dodanie DocumentName w DictionaryDocuments
    let documentId: number;
    const existingDocument = await getDb().get<{ DocumentId: number }>(
      `SELECT DocumentId FROM DictionaryDocuments WHERE LOWER(DocumentName) = LOWER(?)`,
      [document.DocumentName]
    );
    if (existingDocument) {
      documentId = existingDocument.DocumentId;
    } else {
      const insertDocument = await getDb().run(
        `INSERT INTO DictionaryDocuments (DocumentName) VALUES (?)`,
        [document.DocumentName]
      );
      if (!insertDocument.lastID) {
        await getDb().rollback();
        const message = `Nie udało się dodać DocumentName do DictionaryDocuments.`;
        log.error(logTitle(functionName, message), { document });
        return { status: STATUS.Error, message: message };
      }
      documentId = insertDocument.lastID;
    }

    // Krok 2: Sprawdzenie lub dodanie MainTypeName w DictionaryMainType (jeśli istnieje)
    let mainTypeId: number | null = null;
    if (document.MainTypeName) {
      const existingMainType = await getDb().get<{ MainTypeId: number }>(
        `SELECT MainTypeId FROM DictionaryMainType WHERE LOWER(MainTypeName) = LOWER(?)`,
        [document.MainTypeName]
      );
      if (existingMainType) {
        mainTypeId = existingMainType.MainTypeId;
      } else {
        const insertMainType = await getDb().run(
          `INSERT INTO DictionaryMainType (MainTypeName) VALUES (?)`,
          [document.MainTypeName]
        );
        if (!insertMainType.lastID) {
          await getDb().rollback();
          const message = `Nie udało się dodać MainTypeName do DictionaryMainType.`;
          log.error(logTitle(functionName, message), { document });
          return { status: STATUS.Error, message: message };
        }
        mainTypeId = insertMainType.lastID;
      }
    }

    // Krok 3: Sprawdzenie lub dodanie TypeName w DictionaryType (jeśli istnieje)
    let typeId: number | null = null;
    if (document.TypeName) {
      if (!mainTypeId) {
        await getDb().rollback();
        const message = `MainTypeName musi być podane, jeśli TypeName jest wypełnione.`;
        log.error(logTitle(functionName, message), { document });
        return { status: STATUS.Error, message: message };
      }
      const existingType = await getDb().get<{ TypeId: number }>(
        `SELECT TypeId FROM DictionaryType WHERE LOWER(TypeName) = LOWER(?)`,
        [document.TypeName]
      );
      if (existingType) {
        typeId = existingType.TypeId;
      } else {
        const insertType = await getDb().run(
          `INSERT INTO DictionaryType (TypeName) VALUES (?)`,
          [document.TypeName]
        );
        if (!insertType.lastID) {
          await getDb().rollback();
          const message = `Nie udało się dodać TypeName do DictionaryType.`;
          log.error(logTitle(functionName, message), { document });
          return { status: STATUS.Error, message: message };
        }
        typeId = insertType.lastID;
      }
    }

    // Krok 4: Sprawdzenie lub dodanie SubtypeName w DictionarySubtype (jeśli istnieje)
    let subtypeId: number | null = null;
    if (document.SubtypeName) {
      if (!typeId) {
        await getDb().rollback();
        const message = `TypeName musi być podane, jeśli SubtypeName jest wypełnione.`;
        log.error(logTitle(functionName, message), { document });
        return { status: STATUS.Error, message: message };
      }
      const existingSubtype = await getDb().get<{ SubtypeId: number }>(
        `SELECT SubtypeId FROM DictionarySubtype WHERE LOWER(SubtypeName) = LOWER(?)`,
        [document.SubtypeName]
      );
      if (existingSubtype) {
        subtypeId = existingSubtype.SubtypeId;
      } else {
        const insertSubtype = await getDb().run(
          `INSERT INTO DictionarySubtype (SubtypeName) VALUES (?)`,
          [document.SubtypeName]
        );
        if (!insertSubtype.lastID) {
          await getDb().rollback();
          const message = `Nie udało się dodać SubtypeName do DictionarySubtype.`;
          log.error(logTitle(functionName, message), { document });
          return { status: STATUS.Error, message: message };
        }
        subtypeId = insertSubtype.lastID;
      }
    }

    // Krok 5: Sprawdzenie, czy konfiguracja istnieje w AllDocuments
    const existingConfig = await getDb().get<{ AllDocumentsId: number }>(
      `SELECT AllDocumentsId FROM AllDocuments 
       WHERE DocumentId = ? 
       AND (MainTypeId = ? OR (MainTypeId IS NULL AND ? IS NULL))
       AND (TypeId = ? OR (TypeId IS NULL AND ? IS NULL))
       AND (SubtypeId = ? OR (SubtypeId IS NULL AND ? IS NULL))`,
      [documentId, mainTypeId, mainTypeId, typeId, typeId, subtypeId, subtypeId]
    );
    if (existingConfig) {
      await getDb().rollback();
      const message = `Nie udało się zapisać nowego dokumentu. Taki dokument już istnieje w bazie danych.`;
      log.error(logTitle(functionName, message), { document });
      return { status: STATUS.Error, message: message };
    }

    // Krok 6: Wstawienie nowego rekordu do AllDocuments
    const insertAllDocuments = await getDb().run(
      `INSERT INTO AllDocuments (DocumentId, MainTypeId, TypeId, SubtypeId, Price, IsDeleted) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        documentId,
        mainTypeId,
        typeId,
        subtypeId,
        document.Price,
        document.IsDeleted ?? 0,
      ]
    );
    if (!insertAllDocuments.lastID || !insertAllDocuments.changes) {
      await getDb().rollback();
      const message = `Nie udało się zapisać nowego dokumentu.`;
      log.error(logTitle(functionName, message), { document });
      return { status: STATUS.Error, message: message };
    }

    await getDb().commit();
    const message = "Zapisano dokument:";
    log.info(logTitle(functionName, message), {
      ...document,
      AllDocumentsId: insertAllDocuments.lastID,
    });
    return {
      status: STATUS.Success,
      data: {
        lastID: insertAllDocuments.lastID,
        changes: insertAllDocuments.changes,
      },
    };
  } catch (err) {
    const message = "Nieznany błąd podczas zapisywania nowego dokumentu.";
    log.error(logTitle(functionName, message), err, { document });
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : message,
    };
  }
}

// Funkcja do aktualizowania dokumentu w tabeli AllDocuments
export async function updateDocument(
  document: AllDocumentsName
): Promise<DataBaseResponse<ReturnMessageFromDb>> {
  const functionName = updateDocument.name;
  try {
    if (!document || !document.DocumentName) {
      const message = `DocumentName jest wymagane.`;
      log.error(logTitle(functionName, message), { document });
      return { status: STATUS.Error, message: message };
    }
    if (document.Price == null || isNaN(document.Price) || document.Price < 0) {
      const message = `Cena musi być wypełniona i mieć wartość równą lub większą od 0.`;
      log.error(logTitle(functionName, message), { document });
      return { status: STATUS.Error, message: message };
    }
    await getDb().beginTransaction();

    // Krok 1: Sprawdzenie i aktualizacja DocumentName w DictionaryDocuments
    let documentId: number;
    if (document.DocumentId && document.DocumentName) {
      // Aktualizacja istniejącego DocumentName
      const updateDocument = await getDb().run(
        `UPDATE DictionaryDocuments SET DocumentName = ? WHERE DocumentId = ?`,
        [document.DocumentName, document.DocumentId]
      );
      if (!updateDocument.changes) {
        await getDb().rollback();
        const message = `Nie udało się zaktualizować DocumentName dla DocumentId: ${document.DocumentId}.`;
        log.error(logTitle(functionName, message), { document });
        return { status: STATUS.Error, message: message };
      }
      documentId = document.DocumentId;
    } else if (!document.DocumentId && document.DocumentName) {
      // Wstawienie nowego DocumentName
      const existingDocument = await getDb().get<{ DocumentId: number }>(
        `SELECT DocumentId FROM DictionaryDocuments WHERE LOWER(DocumentName) = LOWER(?)`,
        [document.DocumentName]
      );
      if (existingDocument) {
        documentId = existingDocument.DocumentId;
      } else {
        const insertDocument = await getDb().run(
          `INSERT INTO DictionaryDocuments (DocumentName) VALUES (?)`,
          [document.DocumentName]
        );
        if (!insertDocument.lastID) {
          await getDb().rollback();
          const message = `Nie udało się dodać DocumentName do DictionaryDocuments.`;
          log.error(logTitle(functionName, message), { document });
          return { status: STATUS.Error, message: message };
        }
        documentId = insertDocument.lastID;
      }
    } else {
      await getDb().rollback();
      const message = `DocumentId lub DocumentName musi być podane..`;
      log.error(logTitle(functionName, message), { document });
      return { status: STATUS.Error, message: message };
    }

    // Krok 2: Sprawdzenie i aktualizacja MainTypeName w DictionaryMainType
    let mainTypeId: number | null = null;
    if (document.MainTypeId && document.MainTypeName) {
      // Aktualizacja istniejącego MainTypeName
      const updateMainType = await getDb().run(
        `UPDATE DictionaryMainType SET MainTypeName = ? WHERE MainTypeId = ?`,
        [document.MainTypeName, document.MainTypeId]
      );
      if (!updateMainType.changes) {
        await getDb().rollback();
        const message = `Nie udało się zaktualizować MainTypeName dla MainTypeId: ${document.MainTypeId}.`;
        log.error(logTitle(functionName, message), { document });
        return { status: STATUS.Error, message: message };
      }
      mainTypeId = document.MainTypeId;
    } else if (!document.MainTypeId && document.MainTypeName) {
      // Wstawienie nowego MainTypeName
      const existingMainType = await getDb().get<{ MainTypeId: number }>(
        `SELECT MainTypeId FROM DictionaryMainType WHERE LOWER(MainTypeName) = LOWER(?)`,
        [document.MainTypeName]
      );
      if (existingMainType) {
        mainTypeId = existingMainType.MainTypeId;
      } else {
        const insertMainType = await getDb().run(
          `INSERT INTO DictionaryMainType (MainTypeName) VALUES (?)`,
          [document.MainTypeName]
        );
        if (!insertMainType.lastID) {
          await getDb().rollback();
          const message = `Nie udało się dodać MainTypeName do DictionaryMainType.`;
          log.error(logTitle(functionName, message), { document });
          return { status: STATUS.Error, message: message };
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
        await getDb().rollback();
        const message = `MainTypeId musi być podane, jeśli TypeName jest wypełnione.`;
        log.error(logTitle(functionName, message), { document });
        return { status: STATUS.Error, message: message };
      }
      // Aktualizacja istniejącego TypeName
      const updateType = await getDb().run(
        `UPDATE DictionaryType SET TypeName = ? WHERE TypeId = ?`,
        [document.TypeName, document.TypeId]
      );
      if (!updateType.changes) {
        await getDb().rollback();
        const message = `Nie udało się zaktualizować TypeName dla TypeId: ${document.TypeId}.`;
        log.error(logTitle(functionName, message), { document });
        return { status: STATUS.Error, message: message };
      }
      typeId = document.TypeId;
    } else if (!document.TypeId && document.TypeName) {
      if (!mainTypeId) {
        await getDb().rollback();
        const message = `MainTypeId musi być podane, jeśli TypeName jest wypełnione.`;
        log.error(logTitle(functionName, message), { document });
        return { status: STATUS.Error, message: message };
      }
      // Wstawienie nowego TypeName
      const existingType = await getDb().get<{ TypeId: number }>(
        `SELECT TypeId FROM DictionaryType WHERE LOWER(TypeName) = LOWER(?)`,
        [document.TypeName]
      );
      if (existingType) {
        typeId = existingType.TypeId;
      } else {
        const insertType = await getDb().run(
          `INSERT INTO DictionaryType (TypeName) VALUES (?)`,
          [document.TypeName]
        );
        if (!insertType.lastID) {
          await getDb().rollback();
          const message = `Nie udało się dodać TypeName do DictionaryType.`;
          log.error(logTitle(functionName, message), { document });
          return { status: STATUS.Error, message: message };
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
        await getDb().rollback();
        const message = `TypeId musi być podane, jeśli SubtypeName jest wypełnione.`;
        log.error(logTitle(functionName, message), { document });
        return { status: STATUS.Error, message: message };
      }
      // Aktualizacja istniejącego SubtypeName
      const updateSubtype = await getDb().run(
        `UPDATE DictionarySubtype SET SubtypeName = ? WHERE SubtypeId = ?`,
        [document.SubtypeName, document.SubtypeId]
      );
      if (!updateSubtype.changes) {
        await getDb().rollback();
        const message = `Nie udało się zaktualizować SubtypeName dla SubtypeId: ${document.SubtypeId}.`;
        log.error(logTitle(functionName, message), { document });
        return { status: STATUS.Error, message: message };
      }
      subtypeId = document.SubtypeId;
    } else if (!document.SubtypeId && document.SubtypeName) {
      if (!typeId) {
        await getDb().rollback();
        const message = `TypeId musi być podane, jeśli SubtypeName jest wypełnione.`;
        log.error(logTitle(functionName, message), { document });
        return { status: STATUS.Error, message: message };
      }
      // Wstawienie nowego SubtypeName
      const existingSubtype = await getDb().get<{ SubtypeId: number }>(
        `SELECT SubtypeId FROM DictionarySubtype WHERE LOWER(SubtypeName) = LOWER(?)`,
        [document.SubtypeName]
      );
      if (existingSubtype) {
        subtypeId = existingSubtype.SubtypeId;
      } else {
        const insertSubtype = await getDb().run(
          `INSERT INTO DictionarySubtype (SubtypeName) VALUES (?)`,
          [document.SubtypeName]
        );
        if (!insertSubtype.lastID) {
          await getDb().rollback();
          const message = `Nie udało się dodać SubtypeName ${document.SubtypeName} do DictionarySubtype.`;
          log.error(logTitle(functionName, message), { document });
          return { status: STATUS.Error, message: message };
        }
        subtypeId = insertSubtype.lastID;
      }
    } else if (document.SubtypeId && !document.SubtypeName) {
      // Ustawienie SubtypeId na null w AllDocuments
      subtypeId = null;
    }

    // Krok 5: Sprawdzenie, czy rekord istnieje w AllDocuments
    const existingConfig = await getDb().get<{ AllDocumentsId: number }>(
      `SELECT AllDocumentsId FROM AllDocuments WHERE AllDocumentsId = ?`,
      [document.AllDocumentsId]
    );
    if (!existingConfig) {
      await getDb().rollback();
      const message = `Dokument o ID ${document.AllDocumentsId} nie istnieje w bazie danych.`;
      log.error(logTitle(functionName, message), { document });
      return { status: STATUS.Error, message: message };
    }

    // Krok 6: Aktualizacja rekordu w AllDocuments
    const updateAllDocuments = await getDb().run(
      `UPDATE AllDocuments 
       SET DocumentId = ?, MainTypeId = ?, TypeId = ?, SubtypeId = ?, Price = ?, IsDeleted = ? 
       WHERE AllDocumentsId = ?`,
      [
        documentId,
        mainTypeId,
        typeId,
        subtypeId,
        document.Price,
        document.IsDeleted,
        document.AllDocumentsId,
      ]
    );
    if (!updateAllDocuments.changes) {
      await getDb().rollback();
      const message = `Nie udało się zaktualizować dokumentu.`;
      log.error(logTitle(functionName, message), { document });
      return { status: STATUS.Error, message: message };
    }

    await getDb().commit();
    const message = "Zaktualizowano dokument:";
    log.info(logTitle(functionName, message), { document });
    return {
      status: STATUS.Success,
      data: {
        lastID: document.AllDocumentsId,
        changes: updateAllDocuments.changes,
      },
    };
  } catch (err) {
    const message = "Nieznany błąd podczas aktualizacji dokumentu.";
    log.error(logTitle(functionName, message), err, { document });
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : message,
    };
  }
}

//Funkcja do usuwania (soft) lub przywracania (soft) dokumentu w tabeli AllDocuments
export async function deleteRestoreDocument(
  documentId: number,
  isDeleted: 0 | 1
): Promise<DataBaseResponse<AllDocumentsNameTable>> {
  const functionName = deleteRestoreDocument.name;
  // Walidacja InvoiceId
  if (!documentId || documentId <= 0) {
    const message = `Nieprawidłowy identyfikator dokumentu. Id: ${documentId}.`;
    log.error(logTitle(functionName, message));
    return { status: STATUS.Error, message: message };
  }

  // SQL do ustawienia IsDeleted
  const updateSql = `
    UPDATE AllDocuments 
    SET IsDeleted = ?
    WHERE AllDocumentsId = ?
    RETURNING *
  `;
  const updateParams: QueryParams = [isDeleted, documentId];

  try {
    await getDb().beginTransaction();

    // Sprawdzenie, czy faktura istnieje i ma odpowiedni status IsDeleted
    const existingDocument = await getDb().get<{ AllDocumentsId: number }>(
      `SELECT AllDocumentsId FROM AllDocuments WHERE AllDocumentsId = ? AND IsDeleted = ?`,
      [documentId, isDeleted === 0 ? 1 : 0]
    );
    if (!existingDocument) {
      await getDb().rollback();
      const message = `Dokument o ID ${documentId} nie istnieje lub jest już oznaczony jako ${isDeleted === 0 ? "przywrócona" : "usunięta"
        }.`;
      log.error(logTitle(functionName, message));
      return { status: STATUS.Error, message: message };
    }

    // Aktualizacja flagi IsDeleted
    const result = await getDb().get<AllDocumentsNameTable>(
      updateSql,
      updateParams
    );
    if (!result) {
      await getDb().rollback();
      const message = `Nie udało się ${isDeleted === 0 ? "przywrócić" : "usunąć"
        } dokumentu o Id: ${documentId}.`;
      log.error(logTitle(functionName, message));
      return { status: STATUS.Error, message: message };
    }

    await getDb().commit();
    const message = `${isDeleted === 0 ? "Przywrócono" : "Usunięto"
      } dokument Id: ${result.DocumentId}.`;
    log.info(logTitle(functionName, message), { result });
    return {
      status: STATUS.Success,
      data: result,
    };
  } catch (err) {
    const message = `Nieznany błąd podczas ${isDeleted === 0 ? "przywracania" : "usuwania"
      } dokumentu.`;
    log.error(logTitle(functionName, message), err);
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : message,
    };
  }
}

//Funkcja do pobierania wszystkich faktur z bazy danych
export async function getAllInvoices(
  formValuesHomePage: FormValuesHomePage,
  page: number = 1,
  rowsPerPage: number = 10
): Promise<DataBaseResponse<AllInvoices[]>> {
  const functionName = getAllInvoices.name;
  // --- Walidacja danych wejściowych ---
  if (!formValuesHomePage) {
    const message = `Brak dat do pobrania faktur z bazy danych (formValuesHomePage jest undefined)`;
    log.error(logTitle(functionName, message));
    return { status: STATUS.Error, message: message };
  }
  if (!formValuesHomePage.firstDate || !formValuesHomePage.secondDate) {
    const message = `Pierwsza albo druga data nie jest ustawiona. Pierwsza data: ${formValuesHomePage.firstDate}, druga data: ${formValuesHomePage.secondDate}`;
    log.error(logTitle(functionName, message));
    return { status: STATUS.Error, message: message };
  }
  if (
    !(
      formValuesHomePage.firstDate instanceof Date &&
      !isNaN(formValuesHomePage.firstDate.getTime())
    )
  ) {
    const message = `Pierwsza data ma nieprawidłowy format: ${formValuesHomePage.firstDate}`;
    log.error(logTitle(functionName, message));
    return { status: STATUS.Error, message: message };
  }
  if (
    !(
      formValuesHomePage.secondDate instanceof Date &&
      !isNaN(formValuesHomePage.secondDate.getTime())
    )
  ) {
    const message = `Druga data ma nieprawidłowy format: ${formValuesHomePage.secondDate}`;
    log.error(logTitle(functionName, message));
    return { status: STATUS.Error, message: message };
  }
  if (page < 1 || rowsPerPage < 1) {
    const message = `Nieprawidłowe wartości paginacji: page=${page}, rowsPerPage=${rowsPerPage}`;
    log.error(logTitle(functionName, message));
    return { status: STATUS.Error, message: message };
  }
  // Domyślna wartość isDeleted
  const isDeleted = formValuesHomePage.isDeleted ?? 0;
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
      WHERE 
        Invoices.ReceiptDate BETWEEN ? AND ?
        AND Invoices.IsDeleted = ?
      GROUP BY Invoices.InvoiceId
      ORDER BY Invoices.ReceiptDate DESC
    `;

    // --- Parametry ---
    const params: QueryParams = [
      formValuesHomePage.firstDate.toISOString().split("T")[0],
      formValuesHomePage.secondDate.toISOString().split("T")[0],
      isDeleted,
    ];

    // --- Paginacja ---
    const offset = (page - 1) * rowsPerPage;
    query += ` LIMIT ? OFFSET ?`;
    params.push(rowsPerPage, offset);

    // --- Wykonanie zapytania ---
    const result = await getDb().all<AllInvoices>(query, params);
    return {
      status: STATUS.Success,
      data: result ?? [],
    };
  } catch (err) {
    const message = `Nieznany błąd podczas pobierania faktur z bazy danych.`;
    log.error(logTitle(functionName, message), err);
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : message,
    };
  }
}

// Funkcja przygotowująca do dodawania faktury
async function addInvoice(
  invoice: InvoiceTable
): Promise<DataBaseResponse<ReturnMessageFromDb>> {
  const functionName = addInvoice.name;
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
    const result = await getDb().run(sql, params);
    if (!result.lastID || !result.changes) {
      const message = `Nie udało się dodać faktury ${invoice.InvoiceName} do bazy danych: .`;
      log.error(logTitle(functionName, message), { invoice });
      return { status: STATUS.Error, message: message };
    }
    return {
      status: STATUS.Success,
      data: { lastID: result.lastID, changes: result.changes },
    };
  } catch (err) {
    const message = `Nieznany błąd podczas dodawania faktury: Id: ${invoice.InvoiceId} Nazwa: ${invoice.InvoiceName}`;
    log.error(logTitle(functionName, message), err);
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : message,
    };
  }
}

// Funkcja do dodawania faktury i jej szczegółów do bazy danych
export async function addInvoiceDetails(
  invoice: InvoiceTable,
  invoiceDetails: InvoiceDetailsTable[]
): Promise<DataBaseResponse<ReturnMessageFromDb>> {
  const functionName = addInvoiceDetails.name;
  const sql = `
    INSERT INTO InvoiceDetails (InvoiceId, DocumentId, MainTypeId, TypeId, SubtypeId, Quantity, Price)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    await getDb().beginTransaction();
    const resultAddInvoice = await addInvoice(invoice);
    if (resultAddInvoice.status === STATUS.Success && resultAddInvoice.data) {
      for (const detail of invoiceDetails) {
        if (!detail.DocumentId || detail.Quantity <= 0) {
          await getDb().rollback();
          const message = `Nieprawidłowe dane szczegółów faktury ${invoice.InvoiceName} (DocumentId ${detail.DocumentId} lub Quantity ${invoice.InvoiceName}).`;
          log.error(logTitle(functionName, message), {
            invoice,
            invoiceDetails,
          });
          return { status: STATUS.Error, message: message };
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
        const resultDetail = await getDb().run(sql, params);
        if (!resultDetail.changes) {
          await getDb().rollback();
          const message = `Nie udało się dodać szczegółów faktury dla DocumentId: ${detail.DocumentId} ${invoice.InvoiceName}.`;
          log.error(logTitle(functionName, message), {
            invoice,
            invoiceDetails,
          });
          return { status: STATUS.Error, message: message };
        }
      }
      await getDb().commit();
      const message = "Dodano fakturę:";
      log.info(
        logTitle(functionName, message),
        { invoice },
        { invoiceDetails }
      );
      return resultAddInvoice;
    }
    await getDb().rollback();
    return resultAddInvoice;
  } catch (err) {
    const message = `Nieznany błąd podczas dodawania szczegółów faktury: Id: ${invoice.InvoiceId} Nazwa: ${invoice.InvoiceName}`;
    log.error(logTitle(functionName, message), err);
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : message,
    };
  }
}

//Funkcja do aktualizacji faktury w bazie danych w tabeli Invoices
export async function updateInvoice(
  invoice: InvoiceTable,
  invoiceDetails: InvoiceDetailsTable[]
): Promise<DataBaseResponse<ReturnMessageFromDb>> {
  const functionName = updateInvoice.name;
  // Walidacja InvoiceId
  if (invoice.InvoiceId === undefined) {
    const message = `Brak InvoiceId. Aktualizacja faktury ${invoice.InvoiceName} wymaga identyfikatora.`;
    log.error(logTitle(functionName, message), { invoice, invoiceDetails });
    return { status: STATUS.Error, message: message };
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
    await getDb().beginTransaction();

    // Sprawdzenie, czy faktura istnieje
    const existingInvoice = await getDb().get<{ InvoiceId: number }>(
      `SELECT InvoiceId FROM Invoices WHERE InvoiceId = ?`,
      [invoice.InvoiceId]
    );
    if (!existingInvoice) {
      await getDb().rollback();
      const message = `Nie udało się zaktualizować faktury ${invoice.InvoiceName}. Faktura o ID ${invoice.InvoiceId} nie istnieje.`;
      log.error(logTitle(functionName, message), { invoice, invoiceDetails });
      return { status: STATUS.Error, message: message };
    }

    // Aktualizacja faktury
    const updateResult = await getDb().run(
      updateInvoiceSql,
      updateInvoiceParams
    );
    if (!updateResult.changes) {
      await getDb().rollback();
      const message = `Nie udało się zaktualizować faktury ${invoice.InvoiceName}.`;
      log.error(logTitle(functionName, message), { invoice, invoiceDetails });
      return { status: STATUS.Error, message: message };
    }

    // Usunięcie istniejących szczegółów
    await getDb().run(deleteDetailsSql, deleteDetailsParams);

    // Wstawianie nowych szczegółów
    for (const detail of invoiceDetails) {
      if (!detail.DocumentId || detail.Quantity <= 0) {
        await getDb().rollback();
        const message = `Nieprawidłowe dane szczegółów faktury ${invoice.InvoiceName} (DocumentId ${detail.DocumentId} lub Quantity ${invoice.InvoiceName}).`;
        log.error(logTitle(functionName, message), { invoice, invoiceDetails });
        return { status: STATUS.Error, message: message };
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
      const insertResult = await getDb().run(insertDetailsSql, insertParams);
      if (!insertResult.changes) {
        await getDb().rollback();
        const message = `Nie udało się dodać szczegółów faktury dla DocumentId: ${detail.DocumentId} ${invoice.InvoiceName}.`;
        log.error(logTitle(functionName, message), { invoice, invoiceDetails });
        return { status: STATUS.Error, message: message };
      }
    }

    await getDb().commit();
    const message = "Zaktualizowano fakturę:";
    log.info(logTitle(functionName, message), { invoice }, { invoiceDetails });
    return {
      status: STATUS.Success,
      data: { lastID: invoice.InvoiceId, changes: updateResult.changes },
    };
  } catch (err) {
    const message = `Nieznany błąd podczas aktualizacji faktury: Id: ${invoice.InvoiceId} Nazwa: ${invoice.InvoiceName}`;
    log.error(logTitle(functionName, message), err);
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : message,
    };
  }
}

//Funkcja do usuwania (soft) faktury w bazie danych w tabeli Invoices
export async function deleteInvoice(
  invoiceId: number
): Promise<DataBaseResponse<InvoiceTable>> {
  const functionName = deleteInvoice.name;
  // Walidacja InvoiceId
  if (!invoiceId || invoiceId <= 0) {
    const message = `Nieprawidłowy identyfikator faktury.`;
    log.error(logTitle(functionName, message));
    return { status: STATUS.Error, message: message };
  }
  // SQL do ustawienia IsDeleted na 1
  const deleteInvoiceSql = `
    UPDATE Invoices 
    SET IsDeleted = 1
    WHERE InvoiceId = ?
    RETURNING InvoiceId, InvoiceName, ReceiptDate, DeadlineDate, PaymentDate, IsDeleted
  `;
  const deleteInvoiceParams: QueryParams = [invoiceId];

  try {
    await getDb().beginTransaction();

    // Sprawdzenie, czy faktura istnieje
    const existingInvoice = await getDb().get<{ InvoiceId: number }>(
      `SELECT InvoiceId FROM Invoices WHERE InvoiceId = ? AND IsDeleted = 0`,
      [invoiceId]
    );
    if (!existingInvoice) {
      await getDb().rollback();
      const message = `Faktura o ID ${invoiceId} nie istnieje lub nie jest oznaczona jako usunięta.`;
      log.error(logTitle(functionName, message));
      return { status: STATUS.Error, message: message };
    }

    // Aktualizacja flagi IsDeleted
    const result = await getDb().get<InvoiceTable>(
      deleteInvoiceSql,
      deleteInvoiceParams
    );
    if (!result) {
      await getDb().rollback();
      const message = `Nie udało się usunąć faktury o ID ${invoiceId}`;
      log.error(logTitle(functionName, message));
      return { status: STATUS.Error, message: message };
    }

    await getDb().commit();
    const message = "Usunięto fakturę:";
    log.info(logTitle(functionName, message), { result });
    return { status: STATUS.Success, data: result };
  } catch (err) {
    const message = `Błąd podczas usuwania faktury o ID ${invoiceId}`;
    log.error(logTitle(functionName, message), err);
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : message,
    };
  }
}

//Funkcja do przywracania (soft) faktury w bazie danych w tabeli Invoices
export async function restoreInvoice(
  invoiceId: number
): Promise<DataBaseResponse<InvoiceTable>> {
  const functionName = restoreInvoice.name;
  // Walidacja InvoiceId
  if (!invoiceId || invoiceId <= 0) {
    const message = `Nieprawidłowy identyfikator faktury.`;
    log.error(logTitle(functionName, message));
    return { status: STATUS.Error, message: message };
  }

  // SQL do ustawienia IsDeleted na 0
  const restoreInvoiceSql = `
    UPDATE Invoices 
    SET IsDeleted = 0
    WHERE InvoiceId = ?
    RETURNING InvoiceId, InvoiceName, ReceiptDate, DeadlineDate, PaymentDate, IsDeleted
  `;
  const restoreInvoiceParams: QueryParams = [invoiceId];

  try {
    await getDb().beginTransaction();

    // Sprawdzenie, czy faktura istnieje i jest oznaczona jako usunięta
    const existingInvoice = await getDb().get<{ InvoiceId: number }>(
      `SELECT InvoiceId FROM Invoices WHERE InvoiceId = ? AND IsDeleted = 1`,
      [invoiceId]
    );
    if (!existingInvoice) {
      await getDb().rollback();
      const message = `Faktura o ID ${invoiceId} nie istnieje lub nie jest oznaczona jako usunięta.`;
      log.error(logTitle(functionName, message));
      return { status: STATUS.Error, message: message };
    }

    // Aktualizacja flagi IsDeleted
    const result = await getDb().get<InvoiceTable>(
      restoreInvoiceSql,
      restoreInvoiceParams
    );

    if (!result) {
      await getDb().rollback();
      const message = `Nie udało się przywrócić faktury o ID ${invoiceId}`;
      log.error(logTitle(functionName, message));
      return { status: STATUS.Error, message: message };
    }

    await getDb().commit();
    const message = "Przywrócono usuniętą fakturę:";
    log.info(logTitle(functionName, message), { result });
    return { status: STATUS.Success, data: result };
  } catch (err) {
    const message = `Błąd podczas przywracania faktury o ID ${invoiceId}`;
    log.error(logTitle(functionName, message), err);
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : message,
    };
  }
}

// Funkcja zwracająca liczbę faktur z bazy danych na podstawie filtrów z formularza
export async function countInvoices(
  formValuesHomePage: FormValuesHomePage
): Promise<DataBaseResponse<number>> {
  const functionName = countInvoices.name;
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

    const result = await getDb().get<{ total: number }>(query, params);
    return {
      status: STATUS.Success,
      data: result?.total ?? 0,
    };
  } catch (err) {
    const message = "Błąd podczas zliczania faktur z bazy danych.";
    log.error(logTitle(functionName, message), err);
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : message,
    };
  }
}

//USERS
// Funkcja do pobierania wszystkich użytkowników z tabeli Users
export async function getAllUsers(
  isDeleted?: number
): Promise<DataBaseResponse<User[]>> {
  const functionName = getAllUsers.name;
  try {
    let query = `SELECT UserId, UserSystemName, UserDisplayName, UserPassword, UserRole, IsDeleted FROM Users`;
    const params: QueryParams = [];

    if (isDeleted !== undefined) {
      query += ` WHERE IsDeleted = ?`;
      params.push(isDeleted);
    }

    const rows = await getDb().all<User>(query, params);

    return {
      status: STATUS.Success,
      data: rows ?? [],
    };
  } catch (err) {
    const message = "Błąd podczas pobierania użytkowników z bazy danych.";
    log.error(logTitle(functionName, message), err);
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : message,
    };
  }
}

// Funkcja do zapisywania użytkownika w tabeli Users
export async function addUser(user: User): Promise<DataBaseResponse<User>> {
  const functionName = addUser.name;
  const { UserPassword, ...userWithoutPassword } = user;
  try {
    // Walidacja
    if (!user.UserSystemName?.trim()) {
      const message = "UserSystemName jest wymagane.";
      log.error(logTitle(functionName, message), { user: userWithoutPassword });
      return { status: STATUS.Error, message: message };
    }
    if (!user.UserDisplayName?.trim()) {
      const message = `UserDisplayName jest wymagane.`;
      log.error(logTitle(functionName, message), { user: userWithoutPassword });
      return { status: STATUS.Error, message: message };
    }
    if (!["admin", "user"].includes(user.UserRole)) {
      const message = "UserRole może być tylko admin lub user.";
      log.error(logTitle(functionName, message), { user: userWithoutPassword });
      return { status: STATUS.Error, message: message };
    }
    const existingUser = await getDb().get<{ UserId: number }>(
      `SELECT UserId FROM Users WHERE LOWER(UserSystemName) = LOWER(?)`,
      [user.UserSystemName.trim()]
    );
    if (existingUser) {
      const message = "Użytkownik o podanej nazwie systemowej już istnieje.";
      log.error(logTitle(functionName, message), { user: userWithoutPassword });
      return { status: STATUS.Error, message: message };
    }
    await getDb().beginTransaction();

    const query = `
      INSERT INTO Users (UserSystemName, UserDisplayName, UserPassword, UserRole, IsDeleted)
      VALUES (?, ?, ?, ?, 0)
      RETURNING UserId, UserSystemName, UserDisplayName, UserRole
    `;
    const params: QueryParams = [
      user.UserSystemName.trim(),
      user.UserDisplayName.trim(),
      user.UserPassword || null,
      user.UserRole,
    ];

    const result = await getDb().get<User>(query, params);
    if (!result) {
      await getDb().rollback();
      const message = "Nie udało się zapisać użytkownika.";
      log.error(logTitle(functionName, message), { user: userWithoutPassword });
      return { status: STATUS.Error, message: message };
    }

    await getDb().commit();
    const message = "Zapisano użytkownika:";
    log.info(logTitle(functionName, message), { result });
    return { status: STATUS.Success, data: result };
  } catch (err) {
    const message = "Błąd zapisu użytkownika.";
    log.error(logTitle(functionName, message), err, {
      user: userWithoutPassword,
    });
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : message,
    };
  }
}

// Funkcja do aktualizowania użytkownika w tabeli Users
export async function updateUser(user: User): Promise<DataBaseResponse<User>> {
  const functionName = updateUser.name;
  const { UserPassword, ...userWithoutPassword } = user;
  try {
    // Walidacja
    if (!user.UserId) {
      const message = `UserId jest wymagane do edycji.`;
      log.error(logTitle(functionName, message), { user: userWithoutPassword });
      return { status: STATUS.Error, message: message };
    }
    if (!user.UserSystemName?.trim()) {
      const message = `UserSystemName jest wymagane.`;
      log.error(logTitle(functionName, message), { user: userWithoutPassword });
      return { status: STATUS.Error, message: message };
    }
    if (!user.UserDisplayName?.trim()) {
      const message = `UserDisplayName jest wymagane.`;
      log.error(logTitle(functionName, message), { user: userWithoutPassword });
      return { status: STATUS.Error, message: message };
    }
    if (!["admin", "user"].includes(user.UserRole)) {
      const message = `UserRole może być tylko admin lub user.`;
      log.error(logTitle(functionName, message), { user: userWithoutPassword });
      return { status: STATUS.Error, message: message };
    }

    await getDb().beginTransaction();

    const query = `
      UPDATE Users
      SET UserSystemName = ?, UserDisplayName = ?, UserPassword = ?, UserRole = ?
      WHERE UserId = ?
      RETURNING UserId, UserSystemName, UserDisplayName, UserRole
    `;
    const params: QueryParams = [
      user.UserSystemName.trim(),
      user.UserDisplayName.trim(),
      user.UserPassword || null,
      user.UserRole,
      user.UserId,
    ];

    const result = await getDb().get<User>(query, params);
    if (!result) {
      await getDb().rollback();
      const message = `Nie udało się zaktualizować użytkownika.`;
      log.error(logTitle(functionName, message), { user: userWithoutPassword });
      return { status: STATUS.Error, message: message };
    }

    await getDb().commit();
    const message = "Zaktualizowano użytkownika:";
    log.info(logTitle(functionName, message), { result });
    return { status: STATUS.Success, data: result };
  } catch (err) {
    const message = "Błąd edycji użytkownika.";
    log.error(logTitle(functionName, message), err, {
      user: userWithoutPassword,
    });
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : message,
    };
  }
}

// Funkcja do usuwania użytkownika z tabeli Users
export async function deleteUser(
  userId: number
): Promise<DataBaseResponse<User>> {
  const functionName = deleteUser.name;
  try {
    if (!userId) {
      const message = `UserId jest wymagane do usunięcia.`;
      log.error(logTitle(functionName, message));
      return { status: STATUS.Error, message: message };
    }

    await getDb().beginTransaction();

    const query = `
      DELETE FROM Users
      WHERE UserId = ?
      RETURNING UserId, UserSystemName, UserDisplayName, UserRole
    `;
    const params: QueryParams = [userId];

    const result = await getDb().get<User>(query, params);
    if (!result) {
      await getDb().rollback();
      const message = `Nie udało się usunąć użytkownika lub użytkownik nie istnieje.`;
      log.error(logTitle(functionName, message));
      return { status: STATUS.Error, message: message };
    }

    await getDb().commit();
    const message = "Usunięto użytkownika:";
    log.info(logTitle(functionName, message), { result });
    return { status: STATUS.Success, data: result };
  } catch (err) {
    const message = `Błąd usuwania użytkownika. `;
    log.error(logTitle(functionName, message), err);
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : message,
    };
  }
}

// Weryfikacja użytkownika na podstawie UserSystemName
export async function getUserBySystemName(): Promise<DataBaseResponse<User>> {
  const functionName = getUserBySystemName.name;
  let systemUserName = "nieznany użytkownik";
  let systemHostName = "nieznany host";
  try {
    systemUserName = os.userInfo().username.toLowerCase();
    systemHostName = os.hostname();
    if (!systemUserName) {
      const message = `Nieznany błąd przy pobieraniu użytkownika z systemu.`;
      log.error(
        `[dbFunction.js] [${functionName}] [${systemUserName}] ${message}`
      );
      return {
        status: STATUS.Error,
        message: message,
      };
    }
    const query = `SELECT UserId, UserSystemName, UserDisplayName, UserPassword, UserRole 
                   FROM Users 
                   WHERE LOWER(UserSystemName) = LOWER(?) AND IsDeleted = 0`;
    const params: QueryParams = [systemUserName];
    const result = await getDb().get<User>(query, params);

    if (!result) {
      const message = `Brak użytkownika ${systemUserName} w bazie danych.`;
      log.error(
        `[dbFunction.js] [${functionName}] [${systemUserName}] ${message}`
      );
      return {
        status: STATUS.Error,
        message: message,
      };
    }
    //Dodajemy wartość Host do User
    const enrichedUser = {
      ...result,
      Hostname: systemHostName,
    };
    displayUserName = result.UserDisplayName;
    const message = `Użytkownik ${result.UserDisplayName} został pomyślnie zalogowany.`;
    log.info(
      `[dbFunction.js] [${functionName}] [${result.UserDisplayName}] ${message}`
    );
    return {
      status: STATUS.Success,
      data: enrichedUser,
    };
  } catch (err) {
    const message = `Błąd podczas pobierania użytkownika: ${systemUserName}.`;
    log.info(
      `[dbFunction.js] [${functionName}] [${systemUserName}] ${message}`,
      err
    );
    return {
      status: STATUS.Error,
      message: err instanceof Error ? err.message : message,
    };
  }
}

export async function displayUserNameForLog(): Promise<string> {
  const functionName = displayUserNameForLog.name;
  let displayUserNameLog = "nieznany użytkownik";
  try {
    const systemUserName = os.userInfo().username.toLowerCase();
    if (!systemUserName) return displayUserNameLog;
    displayUserNameLog = systemUserName;
    return displayUserNameLog;
  } catch (err) {
    const message = `Błąd podczas pobierania użytkownika: ${displayUserNameLog}.`;
    log.error(
      `[dbFunction.js] [${functionName}] [${displayUserNameLog}] ${message}`,
      err
    );
    return displayUserNameLog;
  }
}



//Funkcja do konstrukcji logów
export function logTitle(
  functionName: string,
  message: string,
  displayUserNameLog: string = displayUserName
): string {
  const title = `[${fileName}] [${functionName}] [${displayUserNameLog}]: ${message}`;
  return title;
}

export const getFormattedDate = (date: Date | null, separator: string = "."): string | null => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() zwraca 0-11, więc dodajemy 1
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}${separator}${month}${separator}${year}`; // YYYY-MM-DD
};



// Przykładowa funkcja
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
