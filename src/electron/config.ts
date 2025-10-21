import { BrowserWindow, dialog, shell } from "electron";
import log from "electron-log";
import path from "path";
import fs, { constants } from "fs";
import fsPromises from 'fs/promises';
import { ipcWebContentsSend, isDev } from "./util.js";
import { checkDirs, getAssetPath, getDBbBilancioPath, getLogDir, getPreloadPath, getSavedDocumentsPathWithCustomFile, getUIPath, getUserDataDirPath, } from "./pathResolver.js";
import { getFormattedDate, logTitle } from "./dataBase/dbFunction.js";


const defaultDirConfig = checkDirs();
const logDir = getLogDir();
const dbPatch = getDBbBilancioPath();

//Funkcja do zarządzania plikami logów
export async function configureLogs(): Promise<void> {
  try {
    const MAX_SAVED_LOG_FILES = parseInt(process.env.MAX_SAVED_LOG_FILES || '10', 10);
    //Utworzenie katalog dla logów, jeśli nie istnieje
    try {
      await fsPromises.access(logDir, constants.F_OK);
    } catch {
      await fsPromises.mkdir(logDir, { recursive: true });
      log.warn('[config] [configureLogs]: Utworzono katalog dla logów:', logDir);
    }

    //Nazwa pliku logów z aktualną datą
    const logFileName = `log-${getFormattedDate(new Date())}.log`;
    const logFilePath = path.join(logDir, logFileName);

    // Konfiguracja electron-log
    log.transports.file.level = 'info';
    log.transports.file.resolvePathFn = () => logFilePath;
    log.transports.console.level = isDev() ? false : false;

    //Sprawdzanie liczby plików logów
    const allFiles = await fsPromises.readdir(logDir);
    const logFiles = allFiles
      .filter(file => file.startsWith('log-') && file.endsWith('.log'))
      .sort((a, b) => {
        const dateA = new Date(a.replace('log-', '').replace('.log', '').split('.').reverse().join('-'));
        const dateB = new Date(b.replace('log-', '').replace('.log', '').split('.').reverse().join('-'));
        return dateA.getTime() - dateB.getTime();
      });

    // Jeśli jest 10 lub więcej plików, usuń najstarszy
    if (logFiles.length >= MAX_SAVED_LOG_FILES) {
      const oldestLogFile = path.join(logDir, logFiles[0]);
      await fsPromises.unlink(oldestLogFile);
      log.info('[config] [configureLogs]: Usunięto najstarszy plik logów:', oldestLogFile);
    }

    log.info('00. Logi zapisywane do pliku:', logFilePath);
  } catch (error) {
    console.error('[config] [configureLogs]: Błąd podczas konfiguracji logów:', error);
  }
}

// //Funkcja do zarządzania plikami logów1
// export function configureLogs1(): void {
//   //Utworzenie katalog dla logów, jeśli nie istnieje
//   if (!fs.existsSync(logDir)) {
//     fs.mkdirSync(logDir, { recursive: true });
//     log.warn('[config] [configureLogs]: Utworzono katalog dla logów:', logDir);
//   }

//   //Nazwa pliku logów z aktualną datą
//   const logFileName = `log-${getFormattedDate(new Date())}.log`;
//   const logFilePath = path.join(logDir, logFileName);

//   //Konfiguracja electron-log
//   log.transports.file.level = 'info';
//   log.transports.file.resolvePathFn = () => logFilePath;
//   log.transports.console.level = isDev() ? false : false;

//   //Sprawdzanie liczby plików logów
//   const logFiles = fs.readdirSync(logDir)
//     .filter(file => file.startsWith('log-') && file.endsWith('.log'))
//     .sort((a, b) => {
//       const dateA = new Date(a.replace('log-', '').replace('.log', '').split('.').reverse().join('-'));
//       const dateB = new Date(b.replace('log-', '').replace('.log', '').split('.').reverse().join('-'));
//       return dateA.getTime() - dateB.getTime();
//     });

//   //Jeśli jest 10 lub więcej plików, usunięcie najstarszego
//   if (logFiles.length >= 10) {
//     const oldestLogFile = path.join(logDir, logFiles[0]);
//     fs.unlinkSync(oldestLogFile);
//     log.info('[config] [configureLogs]: Usunięto najstarszy plik logów:', oldestLogFile);
//   }

//   log.info('00. Logi zapisywane do pliku:', logFilePath);
// }

//Funkcja do logowania podstawowych informacji o aplikacji oraz sprawdzania istnienia plików preload i UI
export const defaultLogs = async () => {
  log.info('01. Aplikacja uruchomiona w trybie', isDev() ? 'deweloperskim' : 'produkcyjnym');
  log.info(`02. Wersja Electron: ${process.versions.electron}`);
  log.info('03. Wersja Node.js:', process.versions.node);
  log.info('04. Wersja Chromium:', process.versions.chrome);

  const preloadPath = getPreloadPath();
  const uiPath = getUIPath();

  if (!fs.existsSync(preloadPath)) {
    log.error('[config] [defaultLogs]: Plik preload.cjs nie istnieje:', preloadPath);
  }
  if (!fs.existsSync(uiPath)) {
    log.error('[config] [defaultLogs]: Plik index.html nie istnieje:', uiPath);
  }

  log.info('05. Ścieżka preload:', preloadPath);
  log.info('06. Ścieżka UI:', uiPath);
  log.info('07. Ścieżka do katalogu logów:', logDir);
  log.info('08. Ścieżka do katalogu z szablonami dokumentów:', defaultDirConfig.documentTemplatesPath);
  log.info('09. Ścieżka do katalogu z zapisanymi dokumentami:', defaultDirConfig.savedDocumentsPath);
  log.info('10. Ścieżka do bazy danych:', defaultDirConfig.dbPath);
  log.info("11. Ścieżka do database\\backup:", defaultDirConfig.backupDbPath);
  log.info('12. Ścieżka do katalogu z plikami konfiguracyjnymi:', getUserDataDirPath());
  const MAX_BACKUP_DATABASE_FILES = parseInt(process.env.MAX_BACKUP_DATABASE_FILES || '10', 10);
  log.info(`13. Limit kopii bazy danych:`, MAX_BACKUP_DATABASE_FILES);
  const MAX_SAVED_LOG_FILES = parseInt(process.env.MAX_SAVED_LOG_FILES || '10', 10);
  log.info(`14. Limit zapisanych plików logów:`, MAX_SAVED_LOG_FILES);
  const MAX_SAVED_DOCUMENTS_FILES = parseInt(process.env.MAX_SAVED_DOCUMENTS_FILES || '50', 10);
  log.info(`15. Limit zapisanych dokumentów:`, MAX_SAVED_DOCUMENTS_FILES);
}

//Tworzenie pliku bazy danych
export async function configureBackupDb(): Promise<void> {
  try {
    //Sprawdzenie czy plik bazy danych istnieje
    const MAX_BACKUP_DATABASE_FILES = parseInt(process.env.MAX_BACKUP_DATABASE_FILES || '10', 10);

    try {
      await fsPromises.access(dbPatch, constants.F_OK);
    } catch {
      log.error('[config] [configureBackupDb]: Plik bazy danych nie istnieje:', dbPatch);
      return;
    }

    // Utworzenie katalogu dla kopii bazy danych, jeśli nie istnieje
    try {
      await fsPromises.mkdir(defaultDirConfig.backupDbPath, { recursive: true });
    } catch (err) {
      log.error('[config] [configureBackupDb]: Wystąpił błąd przy tworzeniu katalogu kopii bazy danych:', err);
      return;
    }

    //Nazwa pliku kopii bazy danych z aktualną datą
    const dataBaseBackupFileName = `BilancioDataBase-${getFormattedDate(new Date())}.db`;
    const dataBaseDestinationFilePath = path.join(defaultDirConfig.backupDbPath, dataBaseBackupFileName);

    //Sprawdzenie czy plik kopii bazy danych już istnieje
    try {
      await fsPromises.access(dataBaseDestinationFilePath, constants.F_OK);

      return;
    } catch {
      //Jeśli plik nie istnieje, kontynuowanie procesu tworzenia kopii
    }

    //Sprawdzanie liczby plików kopii bazy danych
    let dbBackUpFiles: { name: string; time: number }[] = [];
    try {
      const files = await fsPromises.readdir(defaultDirConfig.backupDbPath);
      const filteredFiles = files.filter(file => /^BilancioDataBase-\d{2}\.\d{2}\.\d{4}\.db$/.test(file));
      dbBackUpFiles = await Promise.all(
        filteredFiles.map(async file => ({
          name: file,
          time: (await fsPromises.stat(path.join(defaultDirConfig.backupDbPath, file))).mtime.getTime(),
        }))
      );
      dbBackUpFiles.sort((a, b) => a.time - b.time);
    } catch (err) {
      log.error('[config] [configureBackupDb]: Błąd odczytania plików kopii bazy danych:', err);
      return;
    }

    // Jeśli jest 10 lub więcej plików kopii bazy danych, usunięcie najstarszego
    if (dbBackUpFiles.length >= MAX_BACKUP_DATABASE_FILES) {
      const oldestDbBackupFile = path.join(defaultDirConfig.backupDbPath, dbBackUpFiles[0].name);
      await fsPromises.unlink(oldestDbBackupFile);
      log.info('[config] [configureBackupDb]: Usunięto najstarszy plik kopii bazy danych:', oldestDbBackupFile);
    }

    // Kopiowanie pliku
    await fsPromises.copyFile(dbPatch, dataBaseDestinationFilePath);

    // Weryfikacja kopii pliku bazy danych po skopiowaniu
    const [srcStat, destStat] = await Promise.all([
      fsPromises.stat(dbPatch),
      fsPromises.stat(dataBaseDestinationFilePath),
    ]);

    if (srcStat.size === destStat.size) {
      log.info('[config] [configureBackupDb]: Plik bazy danych został skopiowany poprawnie:', dataBaseDestinationFilePath);
    } else {
      log.error('[config] [configureBackupDb]: Rozmiar pliku kopii bazy danych różni się, możliwe uszkodzenie kopii:', dataBaseDestinationFilePath);
    }
  }
  catch (err) {
    log.error('[config] [configureBackupDb]: Błąd podczas tworzenia kopii bazy danych:', dbPatch);
  }
}

//Funkcja do usuwania najstarszego pliku w katalogu zapisane dokumenty, jeśli jest ich 50 lub więcej
export async function deleteOldestFileInSavedDocuments(): Promise<void> {
  try {
    const MAX_SAVED_DOCUMENTS_FILES = parseInt(process.env.MAX_SAVED_DOCUMENTS_FILES || '50', 10);
    // Utworzenie katalogu zapisane dokumenty, jeśli nie istnieje
    try {
      await fsPromises.mkdir(defaultDirConfig.savedDocumentsPath, { recursive: true });
    } catch (err) {
      log.error('[config] [deleteOldestFileInSavedDocuments]: Wystąpił błąd przy tworzeniu katalogu "zapisane dokumenty":', err);
      return;
    }
    // Sprawdzanie liczby plików w katalogu zapisane dokumenty
    const files = await fsPromises.readdir(defaultDirConfig.savedDocumentsPath);
    const savedDocumentsFiles = await Promise.all(
      files
        .filter(file => file !== "zapisane dokumenty.txt")
        .map(async (file) => ({
          name: file,
          time: (await fsPromises.stat(path.join(defaultDirConfig.savedDocumentsPath, file))).mtime.getTime(),
        }))
    ).then(files => files.sort((a, b) => a.time - b.time));
    // Jeśli jest 50 lub więcej plików, usunięcie najstarszego
    if (savedDocumentsFiles.length >= MAX_SAVED_DOCUMENTS_FILES) {
      const oldestFilePath = path.join(defaultDirConfig.savedDocumentsPath, savedDocumentsFiles[0].name);
      await fsPromises.unlink(oldestFilePath);
      log.info('[config] [deleteOldestFileInSavedDocuments]: Usunięto najstarszy plik z katalogu "zapisane dokumenty":', oldestFilePath);
    }
  } catch (err) {
    log.error('[config] [deleteOldestFileInSavedDocuments]: Błąd usuwania pliku:', err);
  }
}

//Menu i Tray "O aplikacji"
export async function showAboutDialog(mainWindow: BrowserWindow) {
  const response = await dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: '© 2026 Bilancio',
    message: 'Bilancio',
    detail: 'Wersja: 1.0.0\nAutor: Konrad Konik\nE-mail: 3K.nexgen@gmail.com',
    icon: path.join(getAssetPath(), 'trayIcon.png'),
    buttons: ['OK', 'Skontaktuj się'],
    defaultId: 0,
  });

  if (response.response === 1) {
    shell.openExternal('mailto:3K.nexgen@gmail.com?subject=Kontakt%20z%20Bilancio');
  }
}

//Menu "Drukuj do PDF"
export async function showCaptureScreenPdfDialog(mainWindow: BrowserWindow, filePath: string, title: string, message: string, detail: string) {
  const response = await dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: title,
    message: message,
    detail: `${detail}\n${filePath}`,
    buttons: ['OK', 'Otwórz folder'],
    defaultId: 0,
  });

  if (response.response === 1) {
    shell.showItemInFolder(filePath);
  }
}

// Generowanie pliku PDF z aktualnego widoku okna
export async function generatePdf(mainWindow: BrowserWindow) {
  const functionName = generatePdf.name;
  const timestamp = new Date().toLocaleString().replace(/[:., ]/g, '-');
  const fileName = `widok-${timestamp}.pdf`;
  const filePath = getSavedDocumentsPathWithCustomFile(fileName);

  // Generowanie pliku
  ipcWebContentsSend('onGeneratingDocumentStatus', mainWindow.webContents, { status: 0, message: "Poczekaj trwa tworzenie pliku PDF ..." });

  try {
    const pdfData = await mainWindow.webContents.printToPDF({
      printBackground: true,
      landscape: false,
      pageSize: 'A4',
    });

    // Zapisz plik PDF
    await fs.promises.writeFile(filePath, pdfData);
    // Sukces
    ipcWebContentsSend('onGeneratingDocumentStatus', mainWindow.webContents, {
      status: 1, message: `Plik "${fileName}" został pomyślnie zapisany.`
    });
    // Otwórz PDF w domyślnym programie
    const openResult = await shell.openPath(filePath);
    if (openResult) {
      // OpenPath zwraca treść błędu, jeśli się nie powiodło
      const message = `Plik PDF "${fileName}" został zapisany ale nie udało się go otworzyć w domyślnym programie.`;
      log.error(logTitle(functionName, message, { fileName: "config.js" }), openResult);
      ipcWebContentsSend('onGeneratingDocumentStatus', mainWindow.webContents, {
        status: 2,
        message: message,
      });
    }
  } catch (err) {
    // Error
    const message = 'Błąd podczas generowania pliku PDF.';
    log.error(logTitle(functionName, message, { fileName: "config.js" }), err);
    ipcWebContentsSend('onGeneratingDocumentStatus', mainWindow.webContents, {
      status: 2,
      message: err instanceof Error ? err.message : message,
    });
  }
}

// Generowanie zrzutu ekranu z aktualnego widoku okna
export async function generateScreenShot(mainWindow: BrowserWindow) {
  const functionName = generateScreenShot.name;
  const timestamp = new Date().toLocaleString().replace(/[:., ]/g, '-');
  const fileName = `zrzut-${timestamp}.png`;
  const filePath = getSavedDocumentsPathWithCustomFile(fileName);

  // Generowanie pliku
  ipcWebContentsSend('onGeneratingDocumentStatus', mainWindow.webContents, { status: 0, message: "Poczekaj trwa tworzenie zrzutu ekranu ..." });

  try {
    const screenData = await mainWindow.webContents.capturePage()

    // Zapisz plik PDF
    await fs.promises.writeFile(filePath, screenData.toPNG());
    // Sukces
    ipcWebContentsSend('onGeneratingDocumentStatus', mainWindow.webContents, {
      status: 1, message: `Plik "${fileName}" został pomyślnie zapisany.`
    });
    // Otwórz PDF w domyślnym programie
    const openResult = await shell.openPath(filePath);
    if (openResult) {
      // OpenPath zwraca treść błędu, jeśli się nie powiodło
      const message = `Plik "${fileName}" został zapisany ale nie udało się go otworzyć w domyślnym programie.`;
      log.error(logTitle(functionName, message, { fileName: "config.js" }), openResult);
      ipcWebContentsSend('onGeneratingDocumentStatus', mainWindow.webContents, {
        status: 2,
        message: message,
      });
    }
  } catch (err) {
    // Error
    const message = 'Błąd podczas generowania pliku PNG.';
    log.error(logTitle(functionName, message, { fileName: "config.js" }), err);
    ipcWebContentsSend('onGeneratingDocumentStatus', mainWindow.webContents, {
      status: 2,
      message: err instanceof Error ? err.message : message,
    });
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
