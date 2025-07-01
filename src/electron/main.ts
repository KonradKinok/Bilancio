import { app, BrowserWindow, ipcMain, Menu, Tray,dialog } from "electron";
import path from "path";
import fs from "fs"
import { ipcMainHandle, ipcMainHandle2, ipcMainOn, isDev } from "./util.js";
import { getStaticData, pollResources } from "./resourceManager.js";
import {getAssetPath, getDBbBilancioPath, getDBPath, getPreloadPath, getUIPath} from "./pathResolver.js";
import { createTray } from "./tray.js";
import { createMenu } from "./menu.js";
import log from "electron-log"; // Dodaj import
import { addInvoice, addInvoiceDetails, countInvoices, deleteInvoice, getAllDocumentsName, getAllInvoices, getConnectedTableDictionary, getTableDictionaryDocuments, przykladowaFunkcja, przykladowaFunkcja2, queryToDB, restoreInvoice, updateInvoice } from "./dataBase/dbFunction.js";

// /// Określ ścieżkę do folderu userData w zależności od trybu
// const appPath = isDev() ? app.getAppPath() : path.dirname(app.getPath('exe'));
// const userDataPath = path.join(appPath, 'userData');
// const logDir = path.join(userDataPath, 'logs');

// // Konfiguracja electron-log
// log.transports.file.level = 'info';
// log.transports.file.resolvePathFn = () => path.join(logDir, 'main.log');
// log.transports.console.level = isDev() ? 'info' : false;

// // Utwórz katalog dla logów
// if (!fs.existsSync(logDir)) {
//   fs.mkdirSync(logDir, { recursive: true });
//   log.info('Utworzono katalog dla logów:', logDir);
// }

/// Określ ścieżkę do folderu userData w zależności od trybu
const appPath = isDev() ? app.getAppPath() : path.dirname(app.getPath('exe'));
const userDataPath = path.join(appPath, 'userData');
const logDir = path.join(userDataPath, 'logs');

// Funkcja do formatowania daty w formacie dd.mm.yyyy
function getFormattedDate(): string {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}.${month}.${year}`;
}

// Funkcja do zarządzania plikami logów
function configureLogging(): void {
  // Utwórz katalog dla logów, jeśli nie istnieje
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
    log.info('Utworzono katalog dla logów:', logDir);
  }

  // Nazwa pliku logów z aktualną datą
  const logFileName = `log-${getFormattedDate()}.log`;
  const logFilePath = path.join(logDir, logFileName);

  // Konfiguracja electron-log
  log.transports.file.level = 'info';
  log.transports.file.resolvePathFn = () => logFilePath;
  log.transports.console.level = isDev() ? 'info' : false;

  // Sprawdzanie liczby plików logów
  const logFiles = fs.readdirSync(logDir)
    .filter(file => file.startsWith('log-') && file.endsWith('.log'))
    .sort((a, b) => {
      const dateA = new Date(a.replace('log-', '').replace('.log', '').split('.').reverse().join('-'));
      const dateB = new Date(b.replace('log-', '').replace('.log', '').split('.').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    });

  // Jeśli jest 10 lub więcej plików, usuń najstarszy
  if (logFiles.length >= 10) {
    const oldestLogFile = path.join(logDir, logFiles[0]);
    fs.unlinkSync(oldestLogFile);
    log.info('Usunięto najstarszy plik logów:', oldestLogFile);
  }

  log.info('Logi zapisywane do pliku:', logFilePath);
}


export type DictionaryDocuments = {
  DocumentId: number;
  DocumentName: string;
}[];

Menu.setApplicationMenu(null);
// const configPath = path.join(app.getPath('userData'), 'config.json');

// Funkcja do odczytu zapisanej ścieżki bazy danych
// function getSavedDBPath(): string {
//   try {
//     if (fs.existsSync(configPath)) {
//       const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
//       return config.dbPath || getDefaultDBPath();
//     }
//     return getDefaultDBPath();
//   } catch (err) {
//     console.error('Błąd odczytu konfiguracji:', err);
//     return getDefaultDBPath();
//   }
// }

// // Funkcja do zapisu ścieżki bazy danych
// function saveDBPath(dbPath: string) {
//   try {
//     fs.writeFileSync(configPath, JSON.stringify({ dbPath }, null, 2));
//   } catch (err) {
//     console.error('Błąd zapisu konfiguracji:', err);
//   }
// }

// // Domyślna ścieżka bazy danych
// function getDefaultDBPath(): string {
//   return path.join(app.getAppPath(), 'BazaDanych', 'BilancioDataBase.db');
// }

app.on("ready", () => {
  configureLogging(); // Wywołanie funkcji konfiguracyjnej logowania
  log.info('Aplikacja uruchomiona w trybie', isDev() ? 'deweloperskim' : 'produkcyjnym');
  log.info(`Wersja Electrona: ${process.versions.electron}`);
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    resizable: true,
    webPreferences: {
      preload: getPreloadPath(),
      // contextIsolation: false, // Wyłącz contextIsolation (NIEBEZPIECZNE W PRODUKCJI)
      // nodeIntegration: true, // Włącz nodeIntegration (NIEBEZPIECZNE W PRODUKCJI)
      contextIsolation: true,
      nodeIntegration: false,
  },
    
    // disables default system frame (dont do this if you want a proper working menu bar)
    // frame: false,
  });
  if(isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  }
  else {
    mainWindow.loadFile(getUIPath());
  }
 // Ścieżka do pliku konfiguracyjnego


// // Obsługa IPC do pobierania bieżącej ścieżki
// ipcMainHandle('getDBPath', () => {
//   return getSavedDBPath();
// });

// // Obsługa IPC do ustawiania nowej ścieżki
// ipcMainHandle2('setDBPath', async (_event, newPath: string) => {
//   saveDBPath(newPath);
//   return { success: true, dbPath: newPath };
// });

// // Obsługa dialogu wyboru katalogu
// ipcMainHandle('openDialog', async () => {
//   const result = await dialog.showOpenDialog({
//     properties: ['openDirectory'],
//     title: 'Wybierz katalog bazy danych',
//   });
//   if (!result.canceled && result.filePaths.length > 0) {
//     const selectedPath = path.join(result.filePaths[0], 'BilancioDataBase.db');
//     saveDBPath(selectedPath);
//     return { success: true, dbPath: selectedPath };
//   }
//   return { success: false, dbPath: null };
// });




  pollResources(mainWindow);
  ipcMainHandle('getStaticData', () => {
    return getStaticData();
  });
  
  ipcMainHandle2('getTableDictionaryDocuments',  (payload) => {
    return getTableDictionaryDocuments(payload);
  });
  ipcMainHandle2('getConnectedTableDictionary',  (tableName, documentId, mainTypeId, typeId, subTypeId) => {
    return getConnectedTableDictionary(tableName, documentId, mainTypeId, typeId, subTypeId);
  });
  ipcMainHandle('getAllDocumentName',  () => {
    return getAllDocumentsName();
  });
  // ipcMainHandle2('getAllInvoices',  (payload) => {
  //   return getAllInvoices(payload);
  // });
  ipcMainHandle2('getAllInvoices', (payload, page, rowsPerPage) => {
    return getAllInvoices(payload, page, rowsPerPage);
  });
  ipcMainHandle2('addInvoice',  (payload) => {
    return addInvoice(payload);
  });
  ipcMainHandle2('updateInvoice',  (invoice, invoiceDetails) => {
    return updateInvoice(invoice , invoiceDetails);
  });
  ipcMainHandle2('addInvoiceDetails',  (invoice, invoiceDetails) => {
    return addInvoiceDetails(invoice , invoiceDetails);
  });
  ipcMainHandle2('deleteInvoice', (invoiceId) => {
    return deleteInvoice(invoiceId);
  });
  ipcMainHandle2('restoreInvoice', (invoiceId) => {
    return restoreInvoice(invoiceId);
  });
  ipcMainHandle2('countInvoices', (payload) => {
    return countInvoices(payload);
  });
  // ipcMainHandle2('przykladowaFunkcja',  (payload, jakisNumer) => {
  //   return przykladowaFunkcja(payload , jakisNumer);
  // });
  ipcMain.handle('przykladowaFunkcja', async (_event, tekst2: string, jakisNumer: number) => {
    return await przykladowaFunkcja2(tekst2, jakisNumer);
  });
  ipcMainHandle2('przykladowaFunkcja2',  (payload, jakisNumer) => {
    return przykladowaFunkcja2(payload , jakisNumer);
  });
  // ipcMainHandle('addInvoice',  ( invoice:unknown) => {
  //   return addInvoice(invoice);
  // });
  ipcMainHandle('queryToDB',  () => {
    return queryToDB.secondMetod();
  });
  ipcMainHandle('getDBbBilancioPath', () => {
    log.info('Handler getDBbBilancioPath zarejestrowany i wywołany');
    const path = getDBbBilancioPath();
    log.info('Zwracana ścieżka:', path);
    return path;
  });
 ipcMainOn('sendFrameAction', (payload) => {
    switch (payload) {
      case 'CLOSE':
        mainWindow.close();
        break;
      case 'MAXIMIZE':
        mainWindow.maximize();
        break;
      case 'MINIMIZE':
        mainWindow.minimize();
        break;
    }
  });

 createTray(mainWindow);
  handleCloseEvents(mainWindow);
  createMenu(mainWindow);
});


function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false;
  mainWindow.on("close", (e) => {
    if (willClose) {
      return;
    }
    e.preventDefault();
    mainWindow.hide();
    if (app.dock) {
      app.dock.hide();
    }
  });

 app.on('before-quit', () => {
    willClose = true;
  });

  mainWindow.on('show', () => {
    willClose = false;
  });
}

