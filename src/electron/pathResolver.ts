import path from "path";
import { app } from "electron";
import { isDev } from "./util.js";

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

export function getDBPath1() {
  const pathToDb = path.join(app.getAppPath(), '/userData/BilancioDataBase.db');
  console.log({pathToDb});
  return pathToDb;
}