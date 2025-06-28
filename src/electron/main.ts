import { app, BrowserWindow, ipcMain, Menu, Tray } from "electron";
import path from "path";
import { ipcMainHandle, ipcMainHandle2, ipcMainOn, isDev } from "./util.js";
import { getStaticData, pollResources } from "./resourceManager.js";
import {getAssetPath, getDBPath, getPreloadPath, getUIPath} from "./pathResolver.js";
import { createTray } from "./tray.js";
import { createMenu } from "./menu.js";
import { addInvoice, addInvoiceDetails, countInvoices, deleteInvoice, getAllDocumentsName, getAllInvoices, getConnectedTableDictionary, getTableDictionaryDocuments, przykladowaFunkcja, przykladowaFunkcja2, queryToDB, restoreInvoice, updateInvoice } from "./dataBase/dbFunction.js";
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
      preload: getPreloadPath(),
     
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
  
  ipcMainHandle2('getTableDictionaryDocuments',  (payload) => {
    return getTableDictionaryDocuments(payload);
  });
  ipcMainHandle2('getConnectedTableDictionary',  (tableName, documentId, mainTypeId, typeId, subTypeId) => {
    return getConnectedTableDictionary(tableName, documentId, mainTypeId, typeId, subTypeId);
  });
  ipcMainHandle('getAllDocumentName',  () => {
    return getAllDocumentsName();
  });
  // ipcMainHandle2('getAllInvoices',  (payload) => {
  //   return getAllInvoices(payload);
  // });
  ipcMainHandle2('getAllInvoices', (payload, page, rowsPerPage) => {
    return getAllInvoices(payload, page, rowsPerPage);
  });
  ipcMainHandle2('addInvoice',  (payload) => {
    return addInvoice(payload);
  });
  ipcMainHandle2('updateInvoice',  (invoice, invoiceDetails) => {
    return updateInvoice(invoice , invoiceDetails);
  });
  ipcMainHandle2('addInvoiceDetails',  (invoice, invoiceDetails) => {
    return addInvoiceDetails(invoice , invoiceDetails);
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
  ipcMainHandle2('przykladowaFunkcja',  (payload, jakisNumer) => {
    return przykladowaFunkcja(payload , jakisNumer);
  });
  ipcMainHandle2('przykladowaFunkcja2',  (payload, jakisNumer) => {
    return przykladowaFunkcja2(payload , jakisNumer);
  });
  // ipcMainHandle('addInvoice',  ( invoice:unknown) => {
  //   return addInvoice(invoice);
  // });
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

