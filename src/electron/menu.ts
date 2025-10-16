import { BrowserWindow, Menu, dialog, shell } from 'electron';
import fs from "fs";
import { generatePdf, generateScreenShot, showAboutDialog, showCaptureScreenPdfDialog } from './config.js';
import { getSavedDocumentsPath, getSavedDocumentsPathWithCustomFile } from './pathResolver.js';

//Funkcja do tworzenia menu aplikacji
export function createMenu(mainWindow: BrowserWindow) {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: process.platform === 'darwin' ? undefined : 'Plik',
        type: 'submenu',
        submenu: [
          {
            label: 'Drukuj',
            accelerator: process.platform === 'darwin' ? 'Cmd+P' : 'Ctrl+P',
            click: () => {
              mainWindow.webContents.print(
                {
                  silent: false, //Otwiera dialog drukowania (true = bez dialogu)
                  printBackground: true, //Drukuje tło i kolory
                  pageSize: 'A4', //Ustawia rozmiar papieru na A4
                  // deviceName: '', //Opcjonalnie: nazwa drukarki, pusta = domyślna
                  // color: true, // Drukuj w kolorze (domyślnie true)
                  // landscape: false, // Orientacja pozioma (domyślnie false)
                },
                (success, errorType) => {
                  if (!success && errorType !== 'Print job canceled') {
                    console.error('[menu.js] Błąd drukowania:', errorType); //Obsługa błędów, np. brak drukarki
                    dialog.showErrorBox('Błąd drukowania', 'Nie udało się wydrukować.');
                  }
                }
              );
            },
          },
          {
            label: 'Drukuj do PDF',
            accelerator: process.platform === 'darwin' ? 'Cmd+Shift+P' : 'Ctrl+Shift+P',
            click: async (_, browserWindow) => {
              if (!browserWindow) return;
              try {
                await generatePdf(browserWindow as BrowserWindow); // 👈 tu rzutowanie
              } catch (error) {
                console.error('[menu.ts] Błąd generowania PDF:', error);
                dialog.showErrorBox('Błąd generowania PDF', 'Nie udało się wygenerować pliku PDF.');
              }
            },
          },
          {
            label: 'Zrzut ekranu',
            accelerator: process.platform === 'darwin' ? 'Cmd+Shift+S' : 'Ctrl+Shift+S',
            click: async (_, browserWindow) => {
              if (!browserWindow) return;
              try {
                await generateScreenShot(browserWindow as BrowserWindow); // 👈 tu rzutowanie
              } catch (error) {
                console.error('[menu.ts] Błąd generowania PNG:', error);
                dialog.showErrorBox('Błąd generowania PNG', 'Nie udało się wygenerować pliku PNG.');
              }
            },
          },
          {
            type: "separator",
          },
          {
            label: 'Otwórz folder z dokumentami',
            click: () => {
              const documentsPath = getSavedDocumentsPath();
              shell.openPath(documentsPath);
            }
          },
          {
            type: 'separator',
          },
          {
            label: 'Zamknij',
            // click: app.quit,
            role: 'quit', // Zastępuje app.quit()
            accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          },
        ],
      },
      {
        label: 'Edycja',
        submenu: [
          {
            label: 'Cofnij',
            role: 'undo',
          },
          {
            label: 'Ponów',
            role: 'redo',
          },
          {
            type: 'separator',
          },
          {
            label: 'Wytnij',
            role: 'cut',
          },
          {
            label: 'Kopiuj',
            role: 'copy',
          },
          {
            label: 'Wklej',
            role: 'paste',
          },
        ],
      },
      {
        label: 'Widok',
        submenu: [
          {
            label: 'Powiększ',
            accelerator: process.platform === 'darwin' ? 'Cmd+=' : 'Ctrl+=',
            click: () => {
              const currentZoom = mainWindow.webContents.getZoomLevel();
              mainWindow.webContents.setZoomLevel(currentZoom + 0.5);
            },
          },
          {
            label: 'Pomniejsz',
            accelerator: process.platform === 'darwin' ? 'Cmd+-' : 'Ctrl+-',
            click: () => {
              const currentZoom = mainWindow.webContents.getZoomLevel();
              mainWindow.webContents.setZoomLevel(currentZoom - 0.5);
            },
          },
          {
            label: 'Resetuj powiększenie',
            accelerator: process.platform === 'darwin' ? 'Cmd+0' : 'Ctrl+0',
            click: () => {
              mainWindow.webContents.setZoomLevel(0);
            },
          },
          {
            type: 'separator',
          },
          {
            label: 'Przeładuj',
            accelerator: process.platform === 'darwin' ? 'Cmd+R' : 'Ctrl+R',
            click: () => {
              mainWindow.reload();
            },
          },
          {
            label: 'Tryb pełnoekranowy',
            accelerator: process.platform === 'darwin' ? 'Ctrl+Cmd+F' : 'F11',
            role: 'togglefullscreen',
          },
        ],
      },
      {
        label: 'Pomoc',
        submenu: [
          {
            label: 'O aplikacji',
            click: () => {
              showAboutDialog(mainWindow);
            },
          },
          {
            label: 'DevTools',
            accelerator: process.platform === 'darwin' ? 'Cmd+D' : 'Ctrl+D',
            click: () => {
              mainWindow.webContents.openDevTools();
            },

          },
          {
            label: 'Kary',
            click: () => {
              shell.openExternal('https://wkm1.netlify.app');
            },
          },
        ],
      },
      // {
      //   label: 'View',
      //   type: 'submenu',
      //   submenu: [
      //     {
      //       label: 'CPU',
      //       // click: () =>
      //       //   ipcWebContentsSend('changeView', mainWindow.webContents, 'CPU'),
      //     },
      //     {
      //       label: 'RAM',
      //       // click: () =>
      //       //   ipcWebContentsSend('changeView', mainWindow.webContents, 'RAM'),
      //     },
      //     {
      //       label: 'STORAGE',
      //       // click: () =>
      //       //   ipcWebContentsSend(
      //       //     'changeView',
      //       //     mainWindow.webContents,
      //       //     'STORAGE'
      //       //   ),
      //     },
      //   ],
      // },
    ])
  );
}


