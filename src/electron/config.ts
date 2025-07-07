import {dialog } from "electron";
import path from "path";
import fs from "fs"
import { isDev } from "./util.js";
import {getConfig, getLogDir, getPreloadPath, getUIPath, getUserDataDirPath, saveConfig} from "./pathResolver.js";
import log from "electron-log"; // Dodaj import

const logDir = getLogDir();

// Funkcja do zarządzania plikami logów
export function configureLogs(): void {
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
    log.info('Usunięto najstarszy plik logów:', oldestLogFile);
  }

  log.info('00. Logi zapisywane do pliku:', logFilePath);
}

// Funkcja do otwierania dialogu wyboru bazy danych
// oraz aktualizacji ścieżki w konfiguracji
export const openDBDialog = async () => {
  const config= getConfig();
  if (!config) {
    log.error('Nie można otworzyć dialogu wyboru bazy danych, brak konfiguracji.');
    return { success: false, path: null };
  }
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    defaultPath: path.dirname(config.dbPath),
    filters: [{ name: 'BilancioDataBase', extensions: ['db'] }],
    title: 'Wybierz plik bazy danych',
  });
  if (!result.canceled && result.filePaths.length > 0) {
    const selectedPath = result.filePaths[0];
    const currentConfig = getConfig()
    const updatedConfig = {
      ...currentConfig,
      dbPath: selectedPath,
    };

    await saveConfig(updatedConfig); // Przekaż pełny obiekt Config
    return { success: true, path: selectedPath };
  }
  return { success: false, path: null };
};

// Funkcja do logowania podstawowych informacji o aplikacji
// oraz sprawdzania istnienia plików preload i UI
export const  defaultLogs = async () => {
  log.info('01. Aplikacja uruchomiona w trybie', isDev() ? 'deweloperskim' : 'produkcyjnym');
  log.info(`02. Wersja Electron: ${process.versions.electron}`);
  const preloadPath = getPreloadPath();
  const uiPath = getUIPath();
  log.info('03. Ścieżka preload:', preloadPath);
  log.info('04. Ścieżka UI:', uiPath);
  if (!fs.existsSync(preloadPath)) {
    log.error('BŁĄD: Plik preload.cjs nie istnieje:', preloadPath);
  }
  if (!fs.existsSync(uiPath)) {
    log.error('BŁĄD: Plik index.html nie istnieje:', uiPath);
  }
  const config = getConfig();
  if (!config) {
    log.error('BŁĄD: Nie można odczytać konfiguracji. Upewnij się, że plik konfiguracyjny istnieje.');
  }
  else {
    log.info('05. Ścieżka do katalogu logów:', logDir);
    log.info('06. Ścieżka do katalogu z szablonami dokumentów:', config.documentTemplatesPath);
    log.info('07. Ścieżka do katalogu z zapisanymi dokumentami:', config.savedDocumentsPath);
    log.info('08. Ścieżka do bazy danych:', config.dbPath);
    log.info('09. Ścieżka do katalogu z plikami konfiguracyjnymi:', getUserDataDirPath());
  }
}

// Funkcja do otwierania dialogu wyboru katalogu z szablonami dokumentów
// oraz aktualizacji ścieżki w konfiguracji
export const openTemplatesDialog = async () => {
  const config= getConfig();
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    defaultPath: path.dirname(config.documentTemplatesPath),
    title: 'Wybierz katalog szablonów dokumentów',
  });
  if (!result.canceled && result.filePaths.length > 0) {
    const selectedPath = result.filePaths[0];
    const currentConfig = getConfig();
    const updatedConfig = {
      ...currentConfig,
      documentTemplatesPath: selectedPath,
    };
    saveConfig(updatedConfig);
    return { success: true, path: selectedPath };
  }
  return { success: false, path: null };
};

// Funkcja do otwierania dialogu wyboru katalogu z zapisanymi dokumentami
// oraz aktualizacji ścieżki w konfiguracji
export const openSavedDocumentsDialog = async () => {
  const config= getConfig();
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    defaultPath: path.dirname(config.savedDocumentsPath),
    title: 'Wybierz katalog zapisanych dokumentów',
  });
  if (!result.canceled && result.filePaths.length > 0) {
    const selectedPath = result.filePaths[0];
    const currentConfig = getConfig();
    const updatedConfig = {
      ...currentConfig,
      savedDocumentsPath: selectedPath,
    };
    saveConfig(updatedConfig);
    return { success: true, path: selectedPath };
  }
  return { success: false, path: null };
};

// Funkcja do formatowania daty w formacie dd.mm.yyyy
export function getFormattedDate(): string {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}.${month}.${year}`;
}