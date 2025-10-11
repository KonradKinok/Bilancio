import { ipcRenderer } from "electron";

const electron = require('electron');
// console.log('Ładowanie preload.cts w trybie', process.env.NODE_ENV);

electron.contextBridge.exposeInMainWorld('electron', {

  // getTableDictionaryDocuments: (payload) => ipcInvoke2('getTableDictionaryDocuments', payload),
  getConnectedTableDictionary: (tableName, documentId, mainTypeId, typeId, subTypeId) => ipcInvoke2('getConnectedTableDictionary', tableName, documentId, mainTypeId, typeId, subTypeId),
  getDBbBilancioPath: () => ipcInvoke('getDBbBilancioPath'),
  getAllDocumentsName: (isDeleted) => ipcInvoke2('getAllDocumentName', isDeleted),
  deleteRestoreDocument: (documentId, isDeleted) => ipcInvoke2('deleteRestoreDocument', documentId, isDeleted),
  updateDocument: (document) => ipcInvoke2('updateDocument', document),
  addDocument: (document) => ipcInvoke2('addDocument', document),
  // getAllInvoices: (payload) => ipcInvoke2('getAllInvoices', payload),
  getAllInvoices: (payload, page, rowsPerPage) =>
    ipcInvoke2('getAllInvoices', payload, page, rowsPerPage),
  // addInvoice: (payload) => ipcInvoke2('addInvoice', payload),
  updateInvoice: (invoice, invoiceDetails) => ipcInvoke2('updateInvoice', invoice, invoiceDetails),
  addInvoiceDetails: (invoice, invoiceDetails) => ipcInvoke2('addInvoiceDetails', invoice, invoiceDetails),
  deleteInvoice: (invoiceId) => ipcInvoke2('deleteInvoice', invoiceId),
  restoreInvoice: (invoiceId) => ipcInvoke2('restoreInvoice', invoiceId),
  countInvoices: (payload) => ipcInvoke2('countInvoices', payload),

  getAllUsers: (user) => ipcInvoke2('getAllUsers', user),
  addUser: (user) => ipcInvoke2('addUser', user),
  updateUser: (user) => ipcInvoke2('updateUser', user),
  deleteUser: (userId) => ipcInvoke2('deleteUser', userId),

  //Auth
  // getWindowsUsernameHostname: () => ipcInvoke('getWindowsUsernameHostname'),
  getUserBySystemName: () => ipcInvoke('getUserBySystemName'),
  // loginUser: (systemUserName, password) => ipcInvoke2('loginUser', systemUserName, password),

  // getLastRowFromTable: () => ipcInvoke('getLastRowFromTable'),
  //REPORTS
  getReportStandardAllInvoices: (reportCriteriaToDb) => ipcInvoke2('getReportStandardAllInvoices', reportCriteriaToDb),
  exportStandardInvoiceReportToPDF: (dataReportStandardInvoices) => ipcInvoke2('exportStandardInvoiceReportToPDF', dataReportStandardInvoices),
  exportStandardInvoiceReportToXLSX: (dataReportStandardInvoices, reportCriteriaToDb) => ipcInvoke2('exportStandardInvoiceReportToXLSX', dataReportStandardInvoices, reportCriteriaToDb),
  exportStandardDocumentsReportToXLSX: (reportCriteriaToDb, dataReportStandardInvoices, documentsReadyForDisplay, reportDocumentsToTable) => ipcInvoke2('exportStandardDocumentsReportToXLSX', reportCriteriaToDb, dataReportStandardInvoices, documentsReadyForDisplay, reportDocumentsToTable),
  checkStatusDatabase: () => ipcInvoke('checkStatusDatabase'),
  getConfigBilancio1: (payload) => ipcInvoke2('getConfigBilancio1', payload),
  //Electron
  reloadWindow: () => ipcRenderer.send('reload-window'),
  restartApp: () => ipcRenderer.send("restart-app"),
  clipboard: (html, text) => ipcSend("clipboard", { html, text })

} satisfies Window["electron"]);


function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key
): Promise<EventPayloadMapping[Key]> {
  return electron.ipcRenderer.invoke(key);
}

function ipcInvoke2<Key extends keyof EventPayloadMapping>(
  key: Key,
  ...params: any[]
): Promise<EventPayloadMapping[Key]> {
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

