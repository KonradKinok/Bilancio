import { app, BrowserWindow, ipcMain, Menu, Tray,dialog } from "electron";
import path from "path";
import fs from "fs"
import { ipcMainHandle, ipcMainHandle2, ipcMainOn, isDev } from "./util.js";
import {checkDatabaseExists, getAssetPath, getConfigBilancio, getDBbBilancioPath, getDBPath, getPreloadPath, getUIPath, saveConfig} from "./pathResolver.js";
import log from "electron-log"; // Dodaj import
import {getFormattedDate} from "../ui/components/GlobalFunctions/GlobalFunctions.js";


/// Określ ścieżkę do folderu userData w zależności od trybu
const appPath = isDev() ? app.getAppPath() : path.dirname(app.getPath('exe'));
const userDataPath = path.join(appPath, 'userData');
const logDir = path.join(userDataPath, 'logs');

// Funkcja do formatowania daty w formacie dd.mm.yyyy
// function getFormattedDate(): string {
//   const today = new Date();
//   const day = String(today.getDate()).padStart(2, '0');
//   const month = String(today.getMonth() + 1).padStart(2, '0');
//   const year = today.getFullYear();
//   return `${day}.${month}.${year}`;
// }

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

// export const openDBDialog= async () => {
//   const result = await dialog.showOpenDialog({
//     properties: ['openFile'],
//     defaultPath: path.dirname(process.execPath),
//     filters: [{ name: 'SQLite Database', extensions: ['db'] }],
//     title: 'Wybierz plik bazy danych',
//   });
//   if (!result.canceled && result.filePaths.length > 0) {
//     const selectedPath = result.filePaths[0];
//     saveConfig({ dbPath: selectedPath });
//     return { success: true, dbPath: selectedPath };
//   }
//   return { success: false, dbPath: null };
// };

// export const openTemplatesDialog= async () => {
//   const result = await dialog.showOpenDialog({
//     properties: ['openDirectory'],
//     defaultPath: path.dirname(process.execPath),
//     title: 'Wybierz katalog szablonów dokumentów',
//   });
//   if (!result.canceled && result.filePaths.length > 0) {
//     const selectedPath = result.filePaths[0];
//     saveConfig({ documentTemplatesPath: selectedPath });
//     return { success: true, path: selectedPath };
//   }
//   return { success: false, path: null };
// };

// export const openSavedDocumentsDialog= async () => {
//   const result = await dialog.showOpenDialog({
//     properties: ['openDirectory'],
//     defaultPath: path.dirname(process.execPath),
//     title: 'Wybierz katalog zapisanych dokumentów',
//   });
//   if (!result.canceled && result.filePaths.length > 0) {
//     const selectedPath = result.filePaths[0];
//     saveConfig({ savedDocumentsPath: selectedPath });
//     return { success: true, path: selectedPath };
//   }
//   return { success: false, path: null };
// };

export const openDBDialog = async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    defaultPath: path.dirname(process.execPath),
    filters: [{ name: 'SQLite Database', extensions: ['db'] }],
    title: 'Wybierz plik bazy danych',
  });
  if (!result.canceled && result.filePaths.length > 0) {
    const selectedPath = result.filePaths[0];
    const currentConfig = await getConfigBilancio() || { // Upewnij się, że currentConfig jest zainicjalizowany
      dbPath: '',
      documentTemplatesPath: '',
      savedDocumentsPath: '',
    };
    const updatedConfig = {
      ...currentConfig,
      dbPath: selectedPath,
    };
    await saveConfig(updatedConfig); // Przekaż pełny obiekt Config
    return { success: true, path: selectedPath };
  }
  return { success: false, path: null };
};

export const openTemplatesDialog = async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    defaultPath: path.dirname(process.execPath),
    title: 'Wybierz katalog szablonów dokumentów',
  });
  if (!result.canceled && result.filePaths.length > 0) {
    const selectedPath = result.filePaths[0];
    const currentConfig = await getConfigBilancio();
    const updatedConfig = {
      ...currentConfig,
      documentTemplatesPath: selectedPath,
    };
    await saveConfig(updatedConfig);
    return { success: true, path: selectedPath };
  }
  return { success: false, path: null };
};

export const openSavedDocumentsDialog = async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    defaultPath: path.dirname(process.execPath),
    title: 'Wybierz katalog zapisanych dokumentów',
  });
  if (!result.canceled && result.filePaths.length > 0) {
    const selectedPath = result.filePaths[0];
    const currentConfig = await getConfigBilancio();
    const updatedConfig = {
      ...currentConfig,
      savedDocumentsPath: selectedPath,
    };
    await saveConfig(updatedConfig);
    return { success: true, path: selectedPath };
  }
  return { success: false, path: null };
};