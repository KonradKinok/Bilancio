import { app, BrowserWindow, ipcMain, Menu, Tray } from "electron";
import path from "path";
import { ipcMainHandle, ipcMainOn, isDev } from "./util.js";
import { getStaticData, pollResources } from "./resourceManager.js";
import {getAssetPath, getDBPath, getPreloadPath, getUIPath} from "./pathResolver.js";
import { createTray } from "./tray.js";
import { createMenu } from "./menu.js";
import { getAllDocumentsName, getTableDictionaryDocuments, queryToDB } from "./dataBase/dbFunction.js";
export type DictionaryDocuments = {
  DocumentId: number;
  DocumentName: string;
}[];

Menu.setApplicationMenu(null);

app.on("ready", () => {
  
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    resizable: true,
    webPreferences: {
      preload:getPreloadPath(),
  },
    
    // disables default system frame (dont do this if you want a proper working menu bar)
    // frame: false,
  });
  if(isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  }
  else {
    mainWindow.loadFile(getUIPath());
  }
 
  pollResources(mainWindow);
  ipcMainHandle('getStaticData', () => {
    return getStaticData();
  });
  
  ipcMainHandle('getTableDictionaryDocuments',  () => {
    return getTableDictionaryDocuments();
  });
  ipcMainHandle('getAllDocumentName',  () => {
    return getAllDocumentsName();
  });
  ipcMainHandle('queryToDB',  () => {
    return queryToDB.secondMetod();
  });
 ipcMainOn('sendFrameAction', (payload) => {
    switch (payload) {
      case 'CLOSE':
        mainWindow.close();
        break;
      case 'MAXIMIZE':
        mainWindow.maximize();
        break;
      case 'MINIMIZE':
        mainWindow.minimize();
        break;
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

