import { app, BrowserWindow, ipcMain, Menu, Tray, dialog } from "electron";
import path from "path";
import fs from "fs"
import { ipcMainHandle, ipcMainHandle2, ipcMainOn, isDev } from "./util.js";
// import { getStaticData, pollResources } from "./resourceManager.js";
import { checkDatabaseExists, createDocumentDirectories, getAssetPath, getConfig, getDBbBilancioPath, getPreloadPath, getUIPath, saveConfig } from "./pathResolver.js";
import { createTray } from "./tray.js";
import { createMenu } from "./menu.js";
import log from "electron-log"; // Dodaj import
import { addInvoice, addInvoiceDetails, countActivityLog, countInvoices, deleteInvoice, getAllActivityLog, getAllDocumentsName, getAllInvoices, getConfigBilancio1, getConnectedTableDictionary, getTableDictionaryDocuments, reinitializeDatabase, restoreInvoice, saveActivityLog, saveEditedDocument, saveNewDocument, updateDocumentDeletionStatus, updateInvoice } from "./dataBase/dbFunction.js";
import { configureLogs, defaultLogs, openDBDialog, openSavedDocumentsDialog, openTemplatesDialog } from "./config.js";



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
  configureLogs(); // Wywołanie funkcji konfiguracyjnej logowania
  defaultLogs();
  createDocumentDirectories();
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
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  }
  else {
    mainWindow.loadFile(getUIPath());
  }



  // pollResources(mainWindow);


  ipcMainHandle2('getTableDictionaryDocuments', (payload) => {
    return getTableDictionaryDocuments(payload);
  });
  ipcMainHandle2('getConnectedTableDictionary', (tableName, documentId, mainTypeId, typeId, subTypeId) => {
    return getConnectedTableDictionary(tableName, documentId, mainTypeId, typeId, subTypeId);
  });
  ipcMainHandle2('getAllDocumentName', (isDeleted) => {
    return getAllDocumentsName(isDeleted);
  });
  ipcMainHandle2('updateDocumentDeletionStatus', (documentId, isDeleted) => {
    return updateDocumentDeletionStatus(documentId, isDeleted);
  });
  ipcMainHandle2('saveNewDocument', (document) => {
    return saveNewDocument(document);
  });
  ipcMainHandle2('saveEditedDocument', (document) => {
    return saveEditedDocument(document);
  });
  ipcMainHandle2('getAllInvoices', (payload, page, rowsPerPage) => {
    return getAllInvoices(payload, page, rowsPerPage);
  });
  ipcMainHandle2('addInvoice', (payload) => {
    return addInvoice(payload);
  });
  ipcMainHandle2('updateInvoice', (invoice, invoiceDetails) => {
    return updateInvoice(invoice, invoiceDetails);
  });
  ipcMainHandle2('addInvoiceDetails', (invoice, invoiceDetails) => {
    return addInvoiceDetails(invoice, invoiceDetails);
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
  // ActivityLog
  ipcMainHandle('countActivityLog', () => {
    return countActivityLog();
  });
  ipcMainHandle2('getAllActivityLog', (page, rowsPerPage) => {
    return getAllActivityLog(page, rowsPerPage);
  });
  ipcMainHandle2('saveActivityLog', (activity) => {
    return saveActivityLog(activity);
  });

  // Nowe IPC dla konfiguracji
  ipcMainHandle('getConfigBilancio', () => {
    return getConfig();
  });

  ipcMainHandle2('saveConfig', (config) => {
    return saveConfig(config);
  });

  ipcMainHandle('openDBDialog', () => {
    return openDBDialog();
  });

  ipcMainHandle('openTemplatesDialog', () => {
    return openTemplatesDialog();
  });

  ipcMainHandle('openSavedDocumentsDialog', () => {
    return openSavedDocumentsDialog();
  });

  ipcMainHandle('checkDatabaseExists', () => {
    return checkDatabaseExists();
  });
  ipcMainHandle2('reinitializeDatabase', (dbPath) => {
    return reinitializeDatabase(dbPath);
  });

  ipcMainHandle('getDBbBilancioPath', () => {
    return getDBbBilancioPath();
  });

  ipcMainHandle2('getConfigBilancio1', (payload) => {
    log.info('FilesPage: Handler getDBbBilancioPath1 zarejestrowany i wywołany');
    return getConfigBilancio1(payload);
  });
  // ipcMainOn('sendFrameAction', (payload) => {
  //   switch (payload) {
  //     case 'CLOSE':
  //       mainWindow.close();
  //       break;
  //     case 'MAXIMIZE':
  //       mainWindow.maximize();
  //       break;
  //     case 'MINIMIZE':
  //       mainWindow.minimize();
  //       break;
  //   }
  // });

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

