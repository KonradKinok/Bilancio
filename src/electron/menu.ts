import { BrowserWindow, Menu, app, shell } from 'electron';
import { ipcWebContentsSend, isDev } from './util.js';
import { showAboutDialog } from './config.js';

export function createMenu(mainWindow: BrowserWindow) {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: process.platform === 'darwin' ? undefined : 'Plik',
        type: 'submenu',
        submenu: [
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
            role: 'undo', // Używa natywnej funkcjonalności cofania
          },
          {
            label: 'Ponów',
            role: 'redo', // Używa natywnej funkcjonalności ponawiania
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
