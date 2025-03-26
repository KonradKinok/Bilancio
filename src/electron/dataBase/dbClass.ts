import sqlite3 from 'sqlite3';
const { Database: SQLiteDatabase, OPEN_READWRITE, OPEN_CREATE } = sqlite3;
import { open } from 'sqlite';
import { getDBPath1 } from '../pathResolver.js';
const dbPath=getDBPath1();
// Definicja typu parametrów zapytań
type QueryParams = Array<string | number | boolean | null>;

class Database {
  private db: sqlite3.Database;

  constructor() {
    // Tworzymy ścieżkę do pliku bazy danych
    
    // Inicjalizujemy połączenie z bazą danych
    this.db = new SQLiteDatabase(dbPath, OPEN_READWRITE | OPEN_CREATE, (err: Error | null) => {
      if (err) {
        console.error('Błąd połączenia z bazą danych:', err.message);
      } else {

        console.log('Polaczono z baza danych.', dbPath);
      }
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
