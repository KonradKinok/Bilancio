import sqlite3 from 'sqlite3';
const { Database: SQLiteDatabase, OPEN_READWRITE } = sqlite3;
import log from 'electron-log';
import { getDBbBilancioPath } from '../pathResolver.js';
// Rejestr sprzątania pamięci
const dbFinalizer = new FinalizationRegistry((db: sqlite3.Database) => {
  db.close((err) => {
    if (err) {
      log.error("[Database] Finalizer - błąd przy zamykaniu bazy:", err.message);
    } else {
      log.info("[Database] Finalizer - baza została zamknięta automatycznie.");
    }
  });
});
// Definicja typu parametrów zapytań
export type QueryParams = Array<string | number | boolean | null>;

export const statusDatabase: ReturnStatusDbMessage = { status: 0, message: '' };

class Database {
  private db: sqlite3.Database;

  constructor() {
    // Tworzymy ścieżkę do pliku bazy danych
    const dbPath = getDBbBilancioPath();
    // Inicjalizujemy połączenie z bazą danych
    this.db = new SQLiteDatabase(dbPath, OPEN_READWRITE, (err: Error | null) => {
      if (err) {
        log.error('[dbClass.js] [class Database]: Błąd połączenia z bazą danych:', err.message);
        statusDatabase.status = 0;
        statusDatabase.message = `Błąd połączenia z bazą danych: ${err.message}`;
      } else {
        statusDatabase.status = 1;
        statusDatabase.message = `Połączono z bazą danych: ${dbPath}`;
        log.info('[dbClass.js] [class Database]: Połączono z bazą danych.', dbPath);

        // Dodane: Optymalizacje PRAGMA dla dysku sieciowego
        // PRAGMA journal_mode = DELETE;
        //     PRAGMA synchronous = NORMAL;;
        try {
          this.db.exec(`
            PRAGMA journal_mode = DELETE;
            PRAGMA synchronous = NORMAL;
          `);
          log.info('[dbClass.js] [class Database]: Zastosowano PRAGMA dla sieci: journal_mode=DELETE, synchronous=NORMAL');
          // W konstruktorze Database, po otwarciu bazy i PRAGMA
          try {
            this.db.exec('PRAGMA user_version = 0;');  // Nieszkodliwy zapis (zmienia metadane, ale można zignorować)
            statusDatabase.status = 2;
            console.log('Baza danych jest Writable (można zapisywać)');
            log.info('[dbClass.js] [class Database]: Baza jest writable');
          } catch (err) {
            interface SqliteError extends Error {
              code?: string;
              message: string;
            }
            const sqliteErr = err as SqliteError;
            if (typeof err === 'object' && err !== null && 'code' in sqliteErr && sqliteErr.code === 'SQLITE_READONLY') {
              statusDatabase.status = 1;
              console.log('Baza danych jest Read-Only (tylko do odczytu)');
              log.error('[dbClass.js] [class Database]: Baza jest read-only');
            } else {
              const message = typeof err === 'object' && err !== null && 'message' in sqliteErr ? sqliteErr.message : String(err);
              statusDatabase.status = 0;
              console.log('Inny błąd przy sprawdzaniu bazy:', message);
              log.error('[dbClass.js] [class Database]: Błąd sprawdzania bazy', err);
            }
          }
        } catch (pragmaErr) {
          log.error('[dbClass.js] [class Database]: Błąd stosowania PRAGMA:', (pragmaErr as Error).message);
          // Opcjonalnie: throw pragmaErr;  // Jeśli krytyczne
        }
      }
    });
    // Rejestrujemy obiekt do cleanupu
    dbFinalizer.register(this, this.db);
  }


  // Metoda do ponownego załadowania połączenia z nową ścieżką
  public reinitialize(dbPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          log.error('Błąd zamykania bazy danych:', err.message);
          console.error('Błąd zamykania bazy danych:', err.message);
          reject(err);
          return;
        }
        this.db = new SQLiteDatabase(dbPath, OPEN_READWRITE, (err: Error | null) => {
          if (err) {
            log.error('Błąd połączenia z nową bazą danych:', err.message);
            console.error('Błąd połączenia z nową bazą danych:', err.message);
            reject(err);
          } else {
            log.info('Połączono z nową bazą danych:', dbPath);
            console.log('Połączono z nową bazą danych:', dbPath);
            resolve();
          }
        });
      });
    });
  }
  // Metoda do rozpoczynania transakcji
  public async beginTransaction(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('BEGIN TRANSACTION', (err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Metoda do zatwierdzania transakcji
  public async commit(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('COMMIT', (err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Metoda do cofania transakcji
  public async rollback(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('ROLLBACK', (err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  // Metoda do wykonywania zapytań SELECT
  public all<T>(sql: string, params: QueryParams = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as T[]);
        }
      });
    });
  }

  // Metoda do pobierania jednego rekordu
  public get<T>(sql: string, params: QueryParams = []): Promise<T> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as T);
        }
      });
    });
  }

  // Metoda do wstawiania danych do bazy danych
  public run(sql: string, params: QueryParams = []): Promise<{ lastID: number; changes: number }> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (this: sqlite3.RunResult, err: Error | null) {
        if (err) {
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }


}

export default Database;
