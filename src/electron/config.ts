import path from "path";
import fs from "fs"
import log from "electron-log";
import { isDev } from "./util.js";
import { checkDirs, getDBbBilancioPath, getLogDir, getPreloadPath, getUIPath, getUserDataDirPath, } from "./pathResolver.js";

const defaultDirConfig = checkDirs();
const logDir = getLogDir();
const dbPatch = getDBbBilancioPath();

// Funkcja do zarządzania plikami logów
export function configureLogs(): void {
  // Utwórz katalog dla logów, jeśli nie istnieje
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
    log.warn('[config] [configureLogs]: Utworzono katalog dla logów:', logDir);
  }

  // Nazwa pliku logów z aktualną datą
  const logFileName = `log-${getFormattedDate()}.log`;
  const logFilePath = path.join(logDir, logFileName);

  // Konfiguracja electron-log
  log.transports.file.level = 'info';
  log.transports.file.resolvePathFn = () => logFilePath;
  log.transports.console.level = isDev() ? false : false;

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
    log.info('[config] [configureLogs]: Usunięto najstarszy plik logów:', oldestLogFile);
  }

  log.info('00. Logi zapisywane do pliku:', logFilePath);
}

// Funkcja do logowania podstawowych informacji o aplikacji oraz sprawdzania istnienia plików preload i UI
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
}

//Tworzenie pliku bazy danych
export function configureBackupDb(): void {
  // Utwórz katalog dla kopii bazy danych, jeśli nie istnieje
  if (!fs.existsSync(dbPatch)) {
    log.error('[config] [defaultLogs]: Plik bazy danych nie istnieje:', dbPatch);
    return;
  }
  // Nazwa pliku kopi bazy danych z aktualną datą
  const dataBaseBackupFileName = `BilancioDataBase-${getFormattedDate()}.db`;
  const dataBaseDestinationFilePath = path.join(defaultDirConfig.backupDbPath, dataBaseBackupFileName);

  if (fs.existsSync(dataBaseDestinationFilePath)) {
    log.error('[config] [defaultLogs]: Plik bazy danych już istnieje:', dataBaseDestinationFilePath);
    return;
  }

  // Sprawdzanie liczby plików kopii bazy danych
  const dbBackUpFiles = fs.readdirSync(defaultDirConfig.backupDbPath)
    .filter(file => /^BilancioDataBase-\d{2}\.\d{2}\.\d{4}\.db$/.test(file))
    .map(file => ({
      name: file,
      time: fs.statSync(path.join(defaultDirConfig.backupDbPath, file)).mtime.getTime()
    }))
    .sort((a, b) => a.time - b.time);

  // Jeśli jest 10 lub więcej plików, usuń najstarszy
  if (dbBackUpFiles.length >= 10) {
    const oldestDbBackupFile = path.join(defaultDirConfig.backupDbPath, dbBackUpFiles[0].name);
    fs.unlinkSync(oldestDbBackupFile);
    log.info('[config] [configureBackupDb]: Usunięto najstarszy plik kopii bazy danych:', oldestDbBackupFile);
  }
  // Kopiowanie pliku
  fs.copyFileSync(dbPatch, dataBaseDestinationFilePath);
  // Weryfikacja
  if (fs.existsSync(dataBaseDestinationFilePath)) {
    const srcSize = fs.statSync(dbPatch).size;
    const destSize = fs.statSync(dataBaseDestinationFilePath).size;

    if (srcSize === destSize) {
      log.info('[config] [configureBackupDb]: Plik został skopiowany poprawnie:', dataBaseDestinationFilePath);
    } else {
      log.error('[config] [configureBackupDb]: Rozmiar pliku różni się, możliwe uszkodzenie kopii:', dataBaseDestinationFilePath);
    }
  } else {
    log.error('[config] [configureBackupDb]: Plik nie został znaleziony po kopiowaniu:', dataBaseDestinationFilePath);
  }
}

// Funkcja do formatowania daty w formacie dd.mm.yyyy
export function getFormattedDate(): string {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}.${month}.${year}`;
}