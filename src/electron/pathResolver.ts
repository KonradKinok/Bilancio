import path from "path";
import { app } from "electron";
import { isDev } from "./util.js";
import fs from "fs";
import log from "electron-log";

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
  const uiPatch=path.join(app.getAppPath(), '/dist-react/index.html');
  return uiPatch
}

// Funkcja do pobierania ścieżki do folderu assets
export function getAssetPath() {
  const assetPatch=path.join(app.getAppPath(), isDev() ? '.' : '..', '/src/assets');
  return assetPatch;
}

// Funkcja do pobierania ścieżki do folderu userData
export function getUserDataDirPath() {
  let userDataPath;
  if (isDev()) {
    userDataPath= path.join(app.getAppPath(), 'userData');
  } else {
    const exeDir = path.dirname(process.execPath);
    userDataPath= path.join(exeDir, 'userData');
  }
  return userDataPath;
}

// Funkcja do pobierania ścieżki do pliku logów
export function getLogDir() {
  let logDir;
  if (isDev()) {
    logDir= path.join(getUserDataDirPath(), 'logs');
  } else {
    const exeDir = path.dirname(process.execPath);
    logDir= path.join(exeDir, 'logs');
  }
  return logDir;
}

// Funkcja do tworzenia katalogów document templates i saved documents
export function createDocumentDirectories() {
  const config = getConfig();
  const documentTemplatesPath = config.documentTemplatesPath;
  const savedDocumentsPath = config.savedDocumentsPath;
  try {
    if (!fs.existsSync(documentTemplatesPath)) {
      fs.mkdirSync(documentTemplatesPath, { recursive: true });
      log.info('Utworzono katalog szablonów dokumentów:', documentTemplatesPath);
    }
    if (!fs.existsSync(savedDocumentsPath)) {
      fs.mkdirSync(savedDocumentsPath, { recursive: true });
      log.info('Utworzono katalog zapisanych dokumentów:', savedDocumentsPath);
    }
  } catch (err) {
    log.error('Błąd tworzenia katalogów dokumentów:', err);
  }
};

// Funkcja do pobierania i zapisywania konfiguracji
export function getConfig() {
  const configPath = path.join(getUserDataDirPath(), 'config.json');
  const defaultConfig = {
    dbPath: path.join(getUserDataDirPath(), 'BilancioDataBase.db'),
    documentTemplatesPath: path.join(getUserDataDirPath(), 'document templates'),
    savedDocumentsPath: path.join(getUserDataDirPath(), 'saved documents'),
  };

  try {
    if (!fs.existsSync(getUserDataDirPath())) {
      fs.mkdirSync(getUserDataDirPath(), { recursive: true });
      log.info('pathResolver: Utworzono folder userData:', getUserDataDirPath());
    }

    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
      log.info('Utworzono domyślny plik config.json:', configPath);
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return { ...defaultConfig, ...config };
  } catch (err) {
    log.error('Błąd odczytu konfiguracji:', err);
    return defaultConfig;
  }
}

// Funkcja do zapisywania konfiguracji
export function saveConfig(config: { dbPath?: string; documentTemplatesPath?: string; savedDocumentsPath?: string }) {
  const configPath = path.join(getUserDataDirPath(), 'config.json');
  try {
    const currentConfig = getConfig();
    const newConfig = { ...currentConfig, ...config };
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
    log.info('Zapisano konfigurację:', newConfig);
    return newConfig;
  } catch (err) {
    log.error('Błąd zapisu konfiguracji:', err);
    throw err;
  }
}

// Funkcja do pobierania ścieżki do bazy danych BilancioDataBase.db
export function getDBbBilancioPath() {
  const config = getConfig();
  const pathToDb = config.dbPath;
  log.info('Ścieżka do BilancioDataBase.db:', pathToDb);
  if (!fs.existsSync(pathToDb)) {
    log.error('Plik BilancioDataBase.db nie istnieje w ścieżce:', pathToDb);
  }
  return pathToDb;
}

// Funkcja do sprawdzania istnienia bazy danych
export function checkDatabaseExists(dbPath: string): boolean {
  return fs.existsSync(dbPath);
}