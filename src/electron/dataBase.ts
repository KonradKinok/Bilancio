import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { BrowserWindow } from 'electron';
import { ipcWebContentsSend } from './util.js';
import { getDBPath, getDBPath1 } from './pathResolver.js';
// import { getDBPath, getAssetPath } from './pathResolver.js';
const dbPath = getDBPath();
const dbPath1=getDBPath1();
// const dbPath= "../../userData/DaneAdresowe.db";
async function openDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}
async function openDb1() {
  return open({
    filename: dbPath1,
    driver: sqlite3.Database
  });
}
export async function createTable() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL
    )
  `);
}

export async function insertUser(name: string, age: number) {
  const db = await openDb();
  await db.run('INSERT INTO Users (name, age) VALUES (?, ?)', [name, age]);
}

export async function getUser(id: number) {
  const db = await openDb();
  
  return db.get('SELECT * FROM Users WHERE id = ?', [id]);
}

export async function updateUser(id: number, name: string, age: number) {
  const db = await openDb();
  await db.run('UPDATE Users SET name = ?, age = ? WHERE id = ?', [name, age, id]);
}

export async function deleteUser(id: number) {
  const db = await openDb();
  await db.run('DELETE FROM Users WHERE id = ?', [id]);
}

export async function getDowodRejestracyjny(id: number) {
  const db = await openDb();
  
  return db.get('SELECT * FROM Users WHERE id = ?', [id]);
}
// Określenie ścieżki do pliku bazy danych
// const dbPath = getDBPath();
// export async function openDb () {
//   return open({
//     filename: '/tmp/database.db',
//     driver: sqlite3.Database
//   })
// }

// export async function createTable() {
//   const db = await openDb();
//   await db.exec(`CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)`);
// }
// const temp="Friend"
// async function textTemp1() {
//   const user = await getUser(2);
//   console.log("Uzytkownik:", { user });
  
//   return user;
// }

// export  async function textTemp() {
//   const user = await textTemp1();
//   const name = user.Name;
//   return { textNazwa: `Konrad Konik ${name}` };
// }

// export async function getAllDocuments(): Promise<DictionaryDocuments> {
//   const db = await openDb1();
  
//   return db.all('SELECT * FROM DictionaryDocuments');
// }
// export  async function getDataDocuments() {
//   const documents = await getAllDocuments();
//   console.dir( documents );
//   return documents;
// }

// // Otwarcie bazy danych
//  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
//   if (err) {
//     console.error('Błąd połączenia z bazą danych:', err);
//   } else {
//     console.log('Połączono z bazą danych:', dbPath);
//   }
//  });

// db.serialize(() => {
//   // Tworzenie tabeli ImieKobieta
//   db.run(`
//     CREATE TABLE IF NOT EXISTS ImieKobieta (
//       Id INTEGER PRIMARY KEY AUTOINCREMENT,
//       Imie TEXT NOT NULL,
//       LiczbaWystapien INTEGER NOT NULL
//     )
//   `);

//   // Tworzenie tabeli ImieMezczyzna
//   db.run(`
//     CREATE TABLE IF NOT EXISTS ImieMezczyzna (
//       Id INTEGER PRIMARY KEY AUTOINCREMENT,
//       Imie TEXT NOT NULL,
//       LiczbaWystapien INTEGER NOT NULL
//     )
//   `);

//   // Tworzenie tabeli NazwiskoKobieta
//   db.run(`
//     CREATE TABLE IF NOT EXISTS NazwiskoKobieta (
//       Id INTEGER PRIMARY KEY AUTOINCREMENT,
//       Nazwisko TEXT NOT NULL,
//       LiczbaWystapien INTEGER NOT NULL
//     )
//   `);

//   // Tworzenie tabeli NazwiskoMezczyzna
//   db.run(`
//     CREATE TABLE IF NOT EXISTS NazwiskoMezczyzna (
//       Id INTEGER PRIMARY KEY AUTOINCREMENT,
//       Nazwisko TEXT NOT NULL,
//       LiczbaWystapien INTEGER NOT NULL
//     )
//   `);
// });

// export function openConnectionDB() {
//   const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
//   if (err) {
//     console.error('Błąd połączenia z bazą danych:', err);
//   } else {
//     console.log('Połączono z bazą danych:', dbPath);
//   }
//   });
//   console.log({db});
//   // return db;
// }

