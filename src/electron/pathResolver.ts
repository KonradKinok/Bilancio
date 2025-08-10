import path from "path";
import { app } from "electron";
import { isDev } from "./util.js";
import fs from "fs";
import log from "electron-log";
import { isDatabaseExists } from "./dataBase/dbClass.js";

// Funkcja do pobierania ścieżki do pliku preload
export function getPreloadPath() {
  return path.join(
    app.getAppPath(),
    isDev() ? "." : "..",
    "/dist-electron/preload.cjs"
  );
}

// Funkcja do pobierania ścieżki do pliku index.html
export function getUIPath() {
  const uiPatch = path.join(app.getAppPath(), '/dist-react/index.html');
  return uiPatch
}

// Funkcja do pobierania ścieżki do folderu assets
export function getAssetPath() {
  const assetPatch = path.join(app.getAppPath(), isDev() ? '.' : '..', '/src/assets');
  return assetPatch;
}

// Funkcja do pobierania ścieżki do folderu userData
export function getUserDataDirPath() {
  let userDataPath;
  if (isDev()) {
    userDataPath = path.join(app.getAppPath(), 'userData');
  } else {
    const exeDir = path.dirname(process.execPath);
    userDataPath = path.join(exeDir, 'userData');
  }
  return userDataPath;
}

// Funkcja do pobierania ścieżki do pliku logów
export function getLogDir() {
  const logDir = path.join(getUserDataDirPath(), "logs");

  if (!fs.existsSync(logDir)) {
    log.error('Katalog logs nie istnieje w ścieżce:', logDir);
  }
  return logDir;
}


// Funkcja do pobierania i zapisywania konfiguracji
export function checkDirs() {
  const defaultDirConfig = {
    dbPath: path.join(getUserDataDirPath(), 'BilancioDataBase.db'),
    documentTemplatesPath: path.join(getUserDataDirPath(), 'szablony dokumentów'),
    savedDocumentsPath: path.join(getUserDataDirPath(), 'zapisane dokumenty'),
    backupDbPath: path.join(getUserDataDirPath(), 'database', 'backup'),
  };

  try {
    if (!fs.existsSync(getUserDataDirPath())) {
      fs.mkdirSync(getUserDataDirPath(), { recursive: true });
      log.warn('[pathResolver] [checkDirs]: Utworzono katalog userData:', getUserDataDirPath());
    }
    if (!fs.existsSync(getDocumentTemplatesPath())) {
      fs.mkdirSync(getDocumentTemplatesPath(), { recursive: true });
      log.warn('[pathResolver] [checkDirs]: Utworzono katalog szablony dokumentów:', getDocumentTemplatesPath());
    }
    if (!fs.existsSync(getSavedDocumentsPath())) {
      fs.mkdirSync(getSavedDocumentsPath(), { recursive: true });
      log.warn('[pathResolver] [checkDirs]: Utworzono katalog zapisane dokumenty:', getSavedDocumentsPath());
    }
    if (!fs.existsSync(getBackupDbPath())) {
      fs.mkdirSync(getBackupDbPath(), { recursive: true });
      log.warn('[pathResolver] [checkDirs]: Utworzono katalog database/backup:', getBackupDbPath());
    }
    return defaultDirConfig;
  } catch (err) {
    log.error('[pathResolver] [checkDirs]: Błąd tworzenia katalogów:', err);
    return defaultDirConfig;
  }
}

// Funkcja do pobierania ścieżki do bazy danych BilancioDataBase.db
export function getDBbBilancioPath() {
  const pathToDb = path.join(getUserDataDirPath(), "database", 'BilancioDataBase.db');

  if (!fs.existsSync(pathToDb)) {
    log.error('Plik BilancioDataBase.db nie istnieje w ścieżce:', pathToDb);
  }
  return pathToDb;
}

// Funkcja do pobierania ścieżki do katalogu szablonów dokumentów
export function getDocumentTemplatesPath() {
  const pathToDocumentTemplates = path.join(getUserDataDirPath(), "szablony dokumentów");

  if (!fs.existsSync(pathToDocumentTemplates)) {
    log.error('Katalog szablony dokumentów nie istnieje w ścieżce:', pathToDocumentTemplates);
  }
  return pathToDocumentTemplates;
}

// Funkcja do pobierania ścieżki do katalogu zapisanych dokumentów
export function getSavedDocumentsPath() {
  const pathToSavedDocumentsPath = path.join(getUserDataDirPath(), "zapisane dokumenty");

  if (!fs.existsSync(pathToSavedDocumentsPath)) {
    log.error('Katalog zapisane dokumenty nie istnieje w ścieżce:', pathToSavedDocumentsPath);
  }
  return pathToSavedDocumentsPath;
}

// Funkcja do pobierania ścieżki do katalogu zapisanych dokumentów
export function getBackupDbPath() {
  const pathToBackupDbPath = path.join(getUserDataDirPath(), "database", "backup");

  if (!fs.existsSync(pathToBackupDbPath)) {
    log.error('Katalog database/backup nie istnieje w ścieżce:', pathToBackupDbPath);
  }
  return pathToBackupDbPath;
}
// Funkcja do sprawdzania istnienia bazy danych
export function checkDatabaseExists(): ReturnStatusMessage {
  return isDatabaseExists;
}