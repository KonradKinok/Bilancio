import path from "path";
import { app } from "electron";
import { isDev } from "./util.js";
import fs from "fs";
import log from "electron-log";
export function getPreloadPath() {
  return path.join(
    app.getAppPath(),
    isDev() ? "." : "..",
    "/dist-electron/preload.cjs"
  );
}

export function getUIPath() {
  return path.join(app.getAppPath(), '/dist-react/index.html');
}

export function getAssetPath() {
  return path.join(app.getAppPath(), isDev() ? '.' : '..', '/src/assets');
}

export function getDBPath() {
  const pathToDb = path.join(app.getAppPath(), '/userData/DaneAdresowe.db');
  console.log({pathToDb});
  return pathToDb;
}

export function getDBbBilancioPath() {
  let pathToDb;
  if (isDev()) {
    pathToDb = path.join(app.getAppPath(), '/userData/BilancioDataBase.db');
  }
  else {
    // Pobierz ścieżkę do katalogu, w którym znajduje się plik EXE
    const exeDir = path.dirname(process.execPath);
    // Utwórz ścieżkę do pliku bazy danych w folderze userData obok pliku EXE
    pathToDb = path.join(exeDir, 'userData', 'BilancioDataBase.db');
  }
  
  console.log({ pathToDb });
  log.info('Ścieżka do BilancioDataBase.db:', pathToDb);
  if (!fs.existsSync(pathToDb)) {
    log.error('Plik BilancioDataBase.db nie istnieje w ścieżce:', pathToDb);
    // pathToDb = "J:\\ProgramowanieKurs\\GitHub\\Bilancio\\userData\\BilancioDataBase.db";
  }
  // Sprawdź, czy plik istnieje
  // if (!fs.existsSync(pathToDb)) {
  //   log.error('Plik BilancioDataBase.db nie istnieje w ścieżce:', pathToDb);
  //   // Opcjonalnie: utwórz folder userData, jeśli nie istnieje
  //   const userDataDir = path.dirname(pathToDb);
  //   if (!fs.existsSync(userDataDir)) {
  //     fs.mkdirSync(userDataDir, { recursive: true });
  //     log.info('Utworzono folder userData:', userDataDir);
  //   }
  // }
  return pathToDb;
}