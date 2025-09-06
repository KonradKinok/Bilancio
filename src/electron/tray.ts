import { BrowserWindow, Menu, Tray, app, dialog, shell } from 'electron';
import { getAssetPath } from './pathResolver.js';
import path from 'path';
import { showAboutDialog } from './config.js';

export function createTray(mainWindow: BrowserWindow) {
  const tray = new Tray(
    path.join(
      getAssetPath(),
      process.platform === 'darwin' ? 'trayIconTemplate.png' : 'trayIcon.png'
    )
  );

  // Ustawienie tooltipa dla ikony w trayu
  tray.setToolTip('Bilancio');

  // Funkcja do płynnego pokazywania okna
  const showWindowWithAnimation = () => {
    // Ustaw początkową przezroczystość na 0
    mainWindow.setOpacity(0);
    mainWindow.show();
    if (app.dock) {
      app.dock.show();
    }

    // Animacja fade-in
    let opacity = 0;
    const fadeInInterval = setInterval(() => {
      opacity += 0.05; // Zwiększaj przezroczystość o 0.05 co 30ms
      if (opacity >= 1) {
        mainWindow.setOpacity(1);
        clearInterval(fadeInInterval); // Zakończ animację
      } else {
        mainWindow.setOpacity(opacity);
      }
    }, 20); // Interwał 30ms dla płynnego efektu
  };

  // Obsługa kliknięcia lewym przyciskiem myszy
  tray.on('click', () => {
    if (!mainWindow.isVisible()) {
      showWindowWithAnimation(); // Pokaż okno z animacją
    }
  });

  // Menu kontekstowe dla kliknięcia prawym przyciskiem myszy
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Pokaż',
        click: () => {
          if (!mainWindow.isVisible()) {
            showWindowWithAnimation(); // Pokaż okno z animacją
          }
        },
      },
      {
        label: 'Przeładuj',
        click: () => {
          mainWindow.reload();
        },
      },
      {
        label: 'Otwórz DevTools',
        // visible: isDev(), // Pokazuj tylko w trybie deweloperskim
        click: () => {
          mainWindow.webContents.openDevTools();
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'O aplikacji',
        click: () => {
          showAboutDialog(mainWindow);
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'Zamknij',
        click: () => app.quit(),
      },
    ])
  );

  return tray;
}