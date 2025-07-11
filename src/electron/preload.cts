import { ipcRenderer } from "electron";

const electron = require('electron');
// console.log('Ładowanie preload.cts w trybie', process.env.NODE_ENV);

electron.contextBridge.exposeInMainWorld('electron', {
  subscribeStatistics: (callback) => {
    return ipcOn('statistics', (stats) => {
      callback(stats);
    })
  },
  subscribeChangeView: (callback) =>
    ipcOn('changeView', (view) => {
      callback(view);
    }),
  getStaticData: () => ipcInvoke('getStaticData'),
  sendFrameAction: (payload) => ipcSend('sendFrameAction', payload),
  getTableDictionaryDocuments: (payload) => ipcInvoke2('getTableDictionaryDocuments', payload),
  getConnectedTableDictionary: (tableName, documentId, mainTypeId, typeId, subTypeId) => ipcInvoke2('getConnectedTableDictionary', tableName, documentId, mainTypeId, typeId, subTypeId),
  queryToDB: () => ipcInvoke('queryToDB'),
  getDBbBilancioPath: () => ipcInvoke('getDBbBilancioPath'),
  getAllDocumentsName: () => ipcInvoke('getAllDocumentName'),
  // getAllInvoices: (payload) => ipcInvoke2('getAllInvoices', payload),
  getAllInvoices: (payload, page, rowsPerPage) =>
    ipcInvoke2('getAllInvoices', payload, page, rowsPerPage),
  addInvoice: (payload) => ipcInvoke2('addInvoice', payload),
  updateInvoice: (invoice, invoiceDetails) => ipcInvoke2('updateInvoice', invoice, invoiceDetails),
  addInvoiceDetails: (invoice, invoiceDetails) => ipcInvoke2('addInvoiceDetails', invoice, invoiceDetails),
  deleteInvoice: (invoiceId) => ipcInvoke2('deleteInvoice', invoiceId),
  restoreInvoice: (invoiceId) => ipcInvoke2('restoreInvoice', invoiceId),
  countInvoices: (payload) => ipcInvoke2('countInvoices', payload),
  getLastRowFromTable: () => ipcInvoke('getLastRowFromTable'),
  // przykladowaFunkcja: (payload) => ipcInvoke('przykladowaFunkcja'),
  przykladowaFunkcja: (payload, numer) => ipcInvoke2('przykladowaFunkcja', payload, numer),
  przykladowaFunkcja2: (payload, numer) => ipcInvoke2('przykladowaFunkcja2', payload, numer),
  // addInvoice: (payload) => ipcInvoke('addInvoice'),
  getConfigBilancio: () => ipcInvoke('getConfigBilancio'),
  
  saveConfig: (config) => ipcInvoke2('saveConfig', config),
  openDBDialog: () => ipcInvoke('openDBDialog'),
  openTemplatesDialog: () => ipcInvoke('openTemplatesDialog'),
  openSavedDocumentsDialog: () => ipcInvoke('openSavedDocumentsDialog'),
  reinitializeDatabase: (payload) => ipcInvoke2('reinitializeDatabase', payload),
  checkDatabaseExists: () => ipcInvoke('checkDatabaseExists'),
  getConfigBilancio1: (payload) => ipcInvoke2('getConfigBilancio1', payload),
} satisfies Window["electron"]);


function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key
  
): Promise<EventPayloadMapping[Key]> {
  console.log(`Wywołano ipcInvoke dla klucza: ${key}`);
  return electron.ipcRenderer.invoke(key );
}
function ipcInvoke2<Key extends keyof EventPayloadMapping>(
  key: Key,
  ...params: any[]
): Promise<EventPayloadMapping[Key]> {
  console.log(`Wywołano ipcInvoke2 dla klucza: ${key}`);
  return electron.ipcRenderer.invoke(key, ...params);
}
function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}

function ipcSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key]
) {
  electron.ipcRenderer.send(key, payload);
}

