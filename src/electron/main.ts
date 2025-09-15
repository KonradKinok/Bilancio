import { app, BrowserWindow, ipcMain, Menu, Tray, dialog } from "electron";
import log from "electron-log"; // Dodaj import
import { ipcMainHandle, ipcMainHandle2, ipcMainOn, isDev } from "./util.js";
// import { getStaticData, pollResources } from "./resourceManager.js";
import { getDBbBilancioPath, getPreloadPath, getSplashPath, getUIPath, } from "./pathResolver.js";
import { createTray } from "./tray.js";
import { createMenu } from "./menu.js";
import { db } from "./dataBase/dbFunction.js";
// import { configureBackupDb, configureLogs, defaultLogs, } from "./config.js";
import { Notification } from 'electron';

//Potrzebne do działania na dysku sieciowym
app.commandLine.appendSwitch("no-sandbox");
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');  // Opcjonalnie dla starszych wersji

// Deklaracja mainWindow na poziomie globalnym
let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let splash: BrowserWindow | null = null;
const gotTheLock = app.requestSingleInstanceLock();

Menu.setApplicationMenu(null);
if (!gotTheLock) {
  //Zamknij bieżącą instancję i nie wykonuj dalszego kodu
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

//Inicjalizacja aplikacji
app.on("ready", async () => {
  if (!gotTheLock) return;
  //Splash screen
  splash = new BrowserWindow({
    width: 512,
    height: 478,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    center: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  splash.loadFile(getSplashPath());
  splash.show();

  //Fallback timeout - jeśli coś pójdzie nie tak, splash zostanie zamknięty po 20 sekundach
  const splashTimeout = setTimeout(() => {
    if (splash) {
      splash.close();
      splash = null;
    }
    if (mainWindow) {
      mainWindow.show();
    }
  }, 20000); // 20 sekund


  // Dynamiczne importowanie modułów po splash
  try {
    const { configureLogs, defaultLogs, configureBackupDb } = await import("./config.js");
    const {
      addInvoiceDetails, countInvoices, deleteInvoice, deleteUser, getAllDocumentsName, getAllInvoices, getAllUsers, getConfigBilancio1, getConnectedTableDictionary, getUserBySystemName, restoreInvoice, updateDocument, addDocument, addUser, deleteRestoreDocument, updateInvoice, updateUser, initDb, checkStatusDatabase
    } = await import("./dataBase/dbFunction.js");

    configureLogs(); // Wywołanie funkcji konfiguracyjnej plików logów
    Object.assign(console, log.functions); //Przeniesienie console.log do log
    defaultLogs(); //Zapisanie domyślnych logów
    configureBackupDb(); //Utworzenie kopii bazu danych
    initDb(); //Zainicjalizowanie bazy danych

    mainWindow = new BrowserWindow({
      width: 1024,
      height: 768,
      resizable: true,
      show: false,
      // autoHideMenuBar: true,
      backgroundColor: "rgb(0, 128, 0)",  // tło okna podczas ładowania
      webPreferences: {
        preload: getPreloadPath(),
        // contextIsolation: false, // Wyłącz contextIsolation (NIEBEZPIECZNE W PRODUKCJI)
        // nodeIntegration: true, // Włącz nodeIntegration (NIEBEZPIECZNE W PRODUKCJI)
        contextIsolation: true,
        nodeIntegration: false,
        spellcheck: false,
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

    mainWindow!.once("ready-to-show", () => {
      clearTimeout(splashTimeout); // splash zamknięty wcześniej, nie trzeba backupu
      if (splash) {
        splash.close();
        splash = null;
      }
      mainWindow!.show();
    });

    if (isDev()) {
      mainWindow.loadURL("http://localhost:5123");
    }
    else {
      mainWindow.loadFile(getUIPath());
    }

    // pollResources(mainWindow);
    //Tables documents
    ipcMainHandle2('getConnectedTableDictionary', (tableName, documentId, mainTypeId, typeId, subTypeId) => {
      return getConnectedTableDictionary(tableName, documentId, mainTypeId, typeId, subTypeId);
    });

    //Documents
    ipcMainHandle2('getAllDocumentName', (isDeleted) => {
      return getAllDocumentsName(isDeleted);
    });
    ipcMainHandle2('deleteRestoreDocument', (documentId, isDeleted) => {
      return deleteRestoreDocument(documentId, isDeleted);
    });
    ipcMainHandle2('addDocument', (document) => {
      return addDocument(document);
    });
    ipcMainHandle2('updateDocument', (document) => {
      return updateDocument(document);
    });

    //Invoices
    ipcMainHandle2('getAllInvoices', (payload, page, rowsPerPage) => {
      return getAllInvoices(payload, page, rowsPerPage);
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
    ipcMainHandle2('getUserBySystemName', () => {
      return getUserBySystemName();
    });

    // Nowe IPC dla konfiguracji
    ipcMainHandle('checkStatusDatabase', () => {
      return checkStatusDatabase();
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

    // Electron
    //Przeładowanie okna
    ipcMain.on('reload-window', () => {
      if (mainWindow) {
        mainWindow.reload();
      }
    });
    //Przeładowanie aplikacji
    ipcMain.on("restart-app", () => {
      app.relaunch();   // Uruchamienie nowej instancji
      app.exit(0);      // Zamknięcie obecnej instancji
    });

    tray = createTray(mainWindow); //Utworzenie tray
    handleCloseEvents(mainWindow); //Handler do zamykania okna aplikacji
    createMenu(mainWindow); //Utworzenie menu
  } catch (error) {
    log.error("[main.js] Błąd podczas dynamicznego importu modułów:", error);
    // Opcjonalnie: Zamknięcie splash i pokazanie błędu
    if (splash) splash.close();
    dialog.showErrorBox("[main.js] Błąd inicjalizacji", "Nie udało się załadować modułów aplikacji.");
    app.quit();
  }
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
    // Wyświetlenie powiadomienia balonowego na Windows po zminimalizowaniu do trayu
    if (process.platform === 'win32' && tray) {
      tray.displayBalloon({
        title: 'Bilancio',
        content: 'Aplikacja działa w tle. Kliknij ikonę programu, aby ponownie otworzyć okno.',
        iconType: 'info',
        noSound: true,
      });
    }
    // if (process.platform === 'win32' && tray) {
    //   console.log("Wyświetlanie powiadomienia");
    //   try {
    //     const notification = new Notification({
    //       title: 'Bilancio',
    //       body: 'Aplikacja działa w tle. Kliknij ikonę, aby otworzyć okno.',
    //       // icon: path.join(getAssetPath(), 'trayIcon.png'), // Opcjonalna ikona
    //     });
    //     notification.show();
    //     notification.on('click', () => {
    //       mainWindow.show();
    //       if (app.dock) {
    //         app.dock.show();
    //       }
    //     });
    //     console.log("Powiadomienie wyświetlone pomyślnie");
    //   } catch (error) {
    //     console.error("Błąd podczas wyświetlania powiadomienia:", error);
    //   }
    // }
  });

  app.on("before-quit", async () => {
    try {
      if (db) {
        willClose = true;
        await db.close();
        log.info("[main.js] [handleCloseEvents]: Baza danych została zamknięta.");
      }
    } catch (err) {
      log.error("[main.js] [handleCloseEvents]: Błąd przy zamykaniu bazy:", err);
    }
  });

  mainWindow.on('show', () => {
    willClose = false;
  });
}

