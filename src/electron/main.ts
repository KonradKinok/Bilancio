import { app, BrowserWindow, ipcMain, Menu, Tray, dialog } from "electron";
import path from "path";
import fs from "fs"
import { getWindowsUsernameHostname, ipcMainHandle, ipcMainHandle2, ipcMainOn, isDev } from "./util.js";
// import { getStaticData, pollResources } from "./resourceManager.js";
import { checkDatabaseExists, checkDirs, getDBbBilancioPath, getPreloadPath, getUIPath, } from "./pathResolver.js";
import { createTray } from "./tray.js";
import { createMenu } from "./menu.js";
import log from "electron-log"; // Dodaj import
import { addInvoiceDetails, countInvoices, deleteInvoice, deleteUser, getAllDocumentsName, getAllInvoices, getAllUsers, getConfigBilancio1, getConnectedTableDictionary, getTableDictionaryDocuments, getUserBySystemName, restoreInvoice, saveEditedDocument, saveNewDocument, addUser, updateDocumentDeletionStatus, updateInvoice, updateUser } from "./dataBase/dbFunction.js";
import { configureBackupDb, configureLogs, defaultLogs, } from "./config.js";

// Deklaracja mainWindow na poziomie globalnym
let mainWindow: BrowserWindow | null = null;
const gotTheLock = app.requestSingleInstanceLock();

Menu.setApplicationMenu(null);
if (!gotTheLock) {
  // Jeśli lock nie uzyskany, zamknij bieżącą instancję i nie wykonuj dalszego kodu
  app.quit();
  process.exit(0);
} else {
  // Handler dla drugiej instancji
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore(); // Przywróć z minimalizacji
      }
      mainWindow.show(); // Pokaż okno
      mainWindow.focus(); // Ustaw fokus
      if (app.dock) {
        app.dock.show(); // Pokaż dock na macOS jeśli ukryty
      }
    }
  });
}
app.on("ready", () => {
  if (!gotTheLock) return;
  configureLogs(); // Wywołanie funkcji konfiguracyjnej plików logów
  defaultLogs();
  configureBackupDb();

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    resizable: true,
    webPreferences: {
      preload: getPreloadPath(),
      // contextIsolation: false, // Wyłącz contextIsolation (NIEBEZPIECZNE W PRODUKCJI)
      // nodeIntegration: true, // Włącz nodeIntegration (NIEBEZPIECZNE W PRODUKCJI)
      contextIsolation: true,
      nodeIntegration: false,
      additionalArguments: [
        `--content-security-policy="default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline';"`
      ],
    },

    // disables default system frame (dont do this if you want a proper working menu bar)
    // frame: false,
  });

  // Ustawienie polityki CSP dla trybu produkcyjnego
  if (!isDev()) {
    mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
      callback({ requestHeaders: details.requestHeaders });
    });

    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      // Sprawdzanie, czy responseHeaders istnieje
      const responseHeaders = details.responseHeaders || {};
      responseHeaders['Content-Security-Policy'] = [
        "default-src 'self'; img-src 'self' data: blob:; script-src 'self'; style-src 'self' 'unsafe-inline';",
      ];
      callback({ responseHeaders });
    });
  }



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
  // ipcMainHandle2('addInvoice', (payload) => {
  //   return addInvoice(payload);
  // });
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

  //Users
  ipcMainHandle2('getAllUsers', (isDeleted) => {
    return getAllUsers(isDeleted);
  });
  ipcMainHandle2('addUser', (user) => {
    return addUser(user);
  });
  ipcMainHandle2('updateUser', (user) => {
    return updateUser(user);
  });
  ipcMainHandle2('deleteUser', (userId) => {
    return deleteUser(userId);
  });

  //Auth
  ipcMainHandle('getWindowsUsernameHostname', () => {
    return getWindowsUsernameHostname();
  });
  ipcMainHandle2('getUserBySystemName', (systemUserName) => {
    return getUserBySystemName(systemUserName);
  });

  // Nowe IPC dla konfiguracji


  ipcMainHandle('checkDatabaseExists', () => {
    return checkDatabaseExists();
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
  ipcMain.on('reload-window', () => {
    if (mainWindow) {
      mainWindow.reload();
      log.info('Okno aplikacji zostało odświeżone');
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

