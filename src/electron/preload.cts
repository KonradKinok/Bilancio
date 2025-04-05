const electron = require('electron');


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
  getTableDictionaryDocuments: () => ipcInvoke('getTableDictionaryDocuments'),
  queryToDB: () => ipcInvoke('queryToDB'),
  getAllDocumentsName: () => ipcInvoke('getAllDocumentName'),
  getAllInvoices: (payload) => ipcInvoke2('getAllInvoices',payload),
  getLastRowFromTable: () => ipcInvoke('getLastRowFromTable'),
  // przykladowaFunkcja: (payload) => ipcInvoke('przykladowaFunkcja'),
  przykladowaFunkcja: (payload, numer) => ipcInvoke2('przykladowaFunkcja', payload, numer),
  przykladowaFunkcja2: (payload, numer) => ipcInvoke2('przykladowaFunkcja2', payload, numer),
  // addInvoice: (payload) => ipcInvoke('addInvoice'),
} satisfies Window["electron"]);


function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key
  
): Promise<EventPayloadMapping[Key]> {
  return electron.ipcRenderer.invoke(key );
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

