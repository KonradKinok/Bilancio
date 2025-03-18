import Database from './dbClass.js';
import * as sqlString from "./dbQuerySqlString.js"
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




