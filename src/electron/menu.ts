import { BrowserWindow, Menu, app, dialog, shell } from 'electron';
import { ipcWebContentsSend, isDev } from './util.js';
import { showAboutDialog, showCaptureScreenPdfDialog } from './config.js';
import { getSavedDocumentsPath, getSavedDocumentsPathWithCustomFile } from './pathResolver.js';
import fs from "fs";
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
                  silent: false, // Otwiera dialog drukowania (true = bez dialogu)
                  printBackground: true, // Drukuje tło i kolory
                  deviceName: '', // Opcjonalnie: nazwa drukarki, pusta = domyślna
                  // color: true, // Drukuj w kolorze (domyślnie true)
                  // landscape: false, // Orientacja pozioma (domyślnie false)
                },
                (success, errorType) => {
                  if (!success && errorType !== 'Print job canceled') {
                    console.error('[menu.js] Błąd drukowania:', errorType); // Obsługa błędów, np. brak drukarki
                    dialog.showErrorBox('Błąd drukowania', 'Nie udało się wydrukować.');
                  }
                }
              );
            },
          },
          {
            label: 'Drukuj do PDF',
            accelerator: process.platform === 'darwin' ? 'Cmd+Shift+P' : 'Ctrl+Shift+P',
            click: () => {
              mainWindow.webContents.printToPDF({
                printBackground: false,
                landscape: false,
                pageSize: 'A4',
              }).then(data => {
                const timestamp = new Date().toLocaleString().replace(/[:., ]/g, '-');
                const filePath = getSavedDocumentsPathWithCustomFile(`widok-${timestamp}.pdf`)

                fs.writeFile(filePath, data, (err) => {
                  if (err) {
                    console.error('[menu.js] Błąd zapisu PDF:', err);
                    dialog.showErrorBox('Błąd zapisu PDF', 'Nie udało się zapisać pliku PDF.');
                  } else {
                    console.log('PDF zapisany:', filePath);
                    showCaptureScreenPdfDialog(mainWindow, filePath, "Zapis do pliku PDF", "", "Plik PDF zapisano w:");
                  }
                });
              }).catch(error => {
                console.error('[menu.js] Błąd generowania PDF:', error);
                dialog.showErrorBox('Błąd generowania PDF', 'Nie udało się wygenerowania pliku PDF.');
              });
            },
          },
          {
            label: 'Zrzut ekranu',
            // accelerator: process.platform === 'darwin' ? 'Cmd+P' : 'Ctrl+P',
            accelerator: process.platform === 'darwin' ? 'Cmd+Shift+S' : 'Ctrl+Shift+S',
            click: () => {
              mainWindow.webContents.capturePage()
                .then(image => {
                  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                  const filePath = getSavedDocumentsPathWithCustomFile(`zrzut-${timestamp}.png`)
                  fs.writeFile(filePath, image.toPNG(), (err) => {
                    if (err) {
                      console.error('[menu.js] Błąd zapisu zrzutu:', err);
                      dialog.showErrorBox('Błąd zapisu zrzutu', 'Nie udało się zapisać zrzutu ekranu.');
                    } else {
                      console.log('Zapisano zrzut:', filePath);
                      showCaptureScreenPdfDialog(mainWindow, filePath, "Zrzut ekranu", "", "Zrzut ekranu zapisano w:");
                    }
                  });
                }).catch(error => {
                  console.error('[menu.js] Błąd generowania zrzutu ekranu:', error);
                  dialog.showErrorBox('Błąd generowania zrzutu ekranu', 'Nie udało się wygenerować zrzutu ekranu.');
                });;
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


