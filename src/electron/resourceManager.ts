// import osUtils from 'os-utils';
// import os from 'os';
// import fs from 'fs';
// import { BrowserWindow } from 'electron';
// import { ipcWebContentsSend } from './util.js';
// const POLLING_INTERVAL = 2500;

// export function pollResources(mainWindow:BrowserWindow) {
//   setInterval(async() => {
//     const cpuUsage = await getCpuUsage();
//     const ramUsage = getRamUsage();
//     const storageData = getStorageData();
//    ipcWebContentsSend('statistics',mainWindow.webContents, {
//       cpuUsage,
//       ramUsage,
//       storageUsage: storageData.usage
//     });
//    }, POLLING_INTERVAL);
// }

// export function getStaticData() {
//   const totalStorage = getStorageData().total;
//   const cpuModel = os.cpus()[0].model;
//   const totalMemoryGB = Math.floor(osUtils.totalmem() / 1024);
//   return { totalStorage, cpuModel, totalMemoryGB };
// }


// function getCpuUsage(): Promise<number> {
//   return new Promise((resolve) => {
//     osUtils.cpuUsage(resolve);
//   });
// }

// function getRamUsage() {
//   return 1 - osUtils.freememPercentage();
// }

// function getStorageData() {
//   // requires node 18
//   const stats = fs.statfsSync(process.platform === 'win32' ? 'C://' : '/');
//   const total = stats.bsize * stats.blocks;
//   const free = stats.bsize * stats.bfree;

//   return {
//     total: Math.floor(total / 1_000_000_000),
//     usage: 1 - free / total,
//   };
// }

// Funkcja do tworzenia katalogów document templates i saved documents
// export function createDocumentDirectories() {
//   const config = getConfig();
//   const documentTemplatesPath = config.documentTemplatesPath;
//   const savedDocumentsPath = config.savedDocumentsPath;
//   try {
//     if (!fs.existsSync(documentTemplatesPath)) {
//       fs.mkdirSync(documentTemplatesPath, { recursive: true });
//       log.info('Utworzono katalog szablonów dokumentów:', documentTemplatesPath);
//     }
//     if (!fs.existsSync(savedDocumentsPath)) {
//       fs.mkdirSync(savedDocumentsPath, { recursive: true });
//       log.info('Utworzono katalog zapisanych dokumentów:', savedDocumentsPath);
//     }
//   } catch (err) {
//     log.error('Błąd tworzenia katalogów dokumentów:', err);
//   }
// };

// Funkcja do pobierania i zapisywania konfiguracji
// export function getConfig() {
//   const configPath = path.join(getUserDataDirPath(), 'config.json');
//   const defaultConfig = {
//     dbPath: path.join(getUserDataDirPath(), 'BilancioDataBase.db'),
//     documentTemplatesPath: path.join(getUserDataDirPath(), 'szablony dokumentów'),
//     savedDocumentsPath: path.join(getUserDataDirPath(), 'zapisane dokumenty'),
//   };

//   try {
//     if (!fs.existsSync(getUserDataDirPath())) {
//       fs.mkdirSync(getUserDataDirPath(), { recursive: true });
//       log.info('pathResolver: Utworzono folder userData:', getUserDataDirPath());
//     }

//     if (!fs.existsSync(configPath)) {
//       fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
//       log.info('Utworzono domyślny plik config.json:', configPath);
//     }

//     const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
//     return { ...defaultConfig, ...config };
//   } catch (err) {
//     log.error('Błąd odczytu konfiguracji:', err);
//     return defaultConfig;
//   }
// }

// Funkcja do zapisywania konfiguracji
// export function saveConfig(config: { dbPath?: string; documentTemplatesPath?: string; savedDocumentsPath?: string }) {
//   const configPath = path.join(getUserDataDirPath(), 'config.json');
//   try {
//     const currentConfig = getConfig();
//     const newConfig = { ...currentConfig, ...config };
//     fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
//     log.info('Zapisano konfigurację:', newConfig);
//     return newConfig;
//   } catch (err) {
//     log.error('Błąd zapisu konfiguracji:', err);
//     throw err;
//   }
// }

// Funkcja do otwierania dialogu wyboru bazy danych
// oraz aktualizacji ścieżki w konfiguracji
// export const openDBDialog = async () => {
//   const config = getConfig();
//   if (!config) {
//     log.error('Nie można otworzyć dialogu wyboru bazy danych, brak konfiguracji.');
//     return { success: false, path: null };
//   }
//   const result = await dialog.showOpenDialog({
//     properties: ['openFile'],
//     defaultPath: path.dirname(config.dbPath),
//     filters: [{ name: 'BilancioDataBase', extensions: ['db'] }],
//     title: 'Wybierz plik bazy danych',
//   });
//   if (!result.canceled && result.filePaths.length > 0) {
//     const selectedPath = result.filePaths[0];
//     const currentConfig = getConfig()
//     const updatedConfig = {
//       ...currentConfig,
//       dbPath: selectedPath,
//     };

//     await saveConfig(updatedConfig); // Przekaż pełny obiekt Config
//     return { success: true, path: selectedPath };
//   }
//   return { success: false, path: null };
// };

// Funkcja do otwierania dialogu wyboru katalogu z szablonami dokumentów
// oraz aktualizacji ścieżki w konfiguracji
// export const openTemplatesDialog = async () => {
//   const config = getConfig();
//   const result = await dialog.showOpenDialog({
//     properties: ['openDirectory'],
//     defaultPath: path.dirname(config.documentTemplatesPath),
//     title: 'Wybierz katalog szablonów dokumentów',
//   });
//   if (!result.canceled && result.filePaths.length > 0) {
//     const selectedPath = result.filePaths[0];
//     const currentConfig = getConfig();
//     const updatedConfig = {
//       ...currentConfig,
//       documentTemplatesPath: selectedPath,
//     };
//     saveConfig(updatedConfig);
//     return { success: true, path: selectedPath };
//   }
//   return { success: false, path: null };
// };

// Funkcja do otwierania dialogu wyboru katalogu z zapisanymi dokumentami
// oraz aktualizacji ścieżki w konfiguracji
// export const openSavedDocumentsDialog = async () => {
//   const config = getConfig();
//   const result = await dialog.showOpenDialog({
//     properties: ['openDirectory'],
//     defaultPath: path.dirname(config.savedDocumentsPath),
//     title: 'Wybierz katalog zapisanych dokumentów',
//   });
//   if (!result.canceled && result.filePaths.length > 0) {
//     const selectedPath = result.filePaths[0];
//     const currentConfig = getConfig();
//     const updatedConfig = {
//       ...currentConfig,
//       savedDocumentsPath: selectedPath,
//     };
//     saveConfig(updatedConfig);
//     return { success: true, path: selectedPath };
//   }
//   return { success: false, path: null };
// };


// export async function reinitializeDatabase(dbPath: string): Promise<ReturnStatusMessage> {
//   try {
//     await db.reinitialize(dbPath);
//     log.info('Baza danych została pomyślnie zreinicjalizowana:', dbPath);
//     return { status: true, message: 'Baza danych została pomyślnie zreinicjalizowana.' };
//   } catch (err) {
//     log.error('Błąd podczas reinicjalizacji bazy danych:', err);
//     return { status: false, message: err instanceof Error ? err.message : 'Nieznany błąd podczas reinicjalizacji bazy danych.' };
//   }
// };

//Pobranie wszystkich aktywności
// export async function getAllActivityLog(
//   page: number = 1,
//   rowsPerPage: number = 10
// ): Promise<DataBaseResponse<ActivityLog[]>> {
//   try {
//     const query = `SELECT ActivityLogId, Date, UserName, ActivityType, ActivityData
//                    FROM ActivityLog
//                    ORDER BY Date DESC
//                    LIMIT ? OFFSET ?`;
//     const params: QueryParams = [rowsPerPage, (page - 1) * rowsPerPage];

//     const rows = await db.all<ActivityLog>(query, params);
//     return {
//       status: STATUS.Success,
//       data: rows ?? [],
//     };
//   } catch (err) {
//     console.error("getAllActivityLog() Błąd podczas pobierania aktywności:", err);
//     return {
//       status: STATUS.Error,
//       message: "Błąd podczas pobierania aktywności z bazy danych.",
//     };
//   }
// }

//Zapisanie aktywności
// export async function saveActivityLog(activity: ActivityLog): Promise<DataBaseResponse<ReturnMessageFromDb>> {
//   try {
//     // Krok 1: Walidacja danych
//     if (!activity.UserName) {
//       return {
//         status: STATUS.Error,
//         message: "UserName jest wymagane.",
//       };
//     }
//     if (!activity.ActivityType || !Object.values(ActivityType).includes(activity.ActivityType)) {
//       return {
//         status: STATUS.Error,
//         message: "ActivityType musi być jednym z dozwolonych nazw.",
//       };
//     }
//     if (!activity.ActivityData) {
//       return {
//         status: STATUS.Error,
//         message: "ActivityData jest wymagane.",
//       };
//     }
//     // Walidacja JSON
//     try {
//       JSON.parse(activity.ActivityData);
//     } catch (err) {
//       return {
//         status: STATUS.Error,
//         message: "ActivityData musi być poprawnym JSON-em.",
//       };
//     }

//     await db.beginTransaction();

//     // Krok 2: Wstawienie rekordu do ActivityLog
//     const query = `
//       INSERT INTO ActivityLog (UserName, ActivityType, ActivityData)
//       VALUES (?, ?, ?)
//       RETURNING ActivityLogId, changes()
//     `;
//     const params: QueryParams = [activity.UserName, activity.ActivityType, activity.ActivityData];

//     const result = await db.get<{ ActivityLogId: number; changes: number }>(query, params);
//     if (!result || !result.ActivityLogId || !result.changes) {
//       await db.rollback();
//       return {
//         status: STATUS.Error,
//         message: "Nie udało się zapisać aktywności w ActivityLog.",
//       };
//     }

//     await db.commit();
//     return {
//       status: STATUS.Success,
//       data: { lastID: result.ActivityLogId, changes: result.changes },
//     };
//   } catch (err) {
//     await db.rollback();
//     console.error("saveActivityLog() Błąd podczas zapisywania aktywności:", err);
//     return {
//       status: STATUS.Error,
//       message: err instanceof Error ? err.message : "Nieznany błąd podczas zapisywania aktywności.",
//     };
//   }
// }

//ACTIVITY LOG
//Funkcja zliczająca wiersze w ActivityLog
// export async function countActivityLog(): Promise<DataBaseResponse<number>> {
//   try {
//     const query = `SELECT COUNT(*) as total FROM ActivityLog`;
//     const result = await db.get<{ total: number }>(query);
//     return {
//       status: STATUS.Success,
//       data: result?.total ?? 0,
//     };
//   } catch (err) {
//     console.error("countActivityLog() Błąd podczas zliczania wpisów w ActivityLog:", err);
//     return {
//       status: STATUS.Error,
//       message: "Błąd podczas zliczania wpisów w ActivityLog z bazy danych.",
//     };
//   }
// }