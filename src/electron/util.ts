import { ipcMain, WebContents, WebFrameMain } from "electron";
import { getUIPath } from "./pathResolver.js";
import { pathToFileURL } from "url";
import log from "electron-log";
import os from 'os';
import { STATUS, DataBaseResponse } from './sharedTypes/status.js';
import { getUserBySystemName } from "./dataBase/dbFunction.js";

export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}

//Pobierz nazwę użytkownika oraz hostname z systemu
export async function getWindowsUsernameHostname(): Promise<DataBaseResponse<WindowsUsername>> {
  const functionName = getWindowsUsernameHostname.name;
  try {
    const username = os.userInfo().username.toLowerCase();
    const hostname = os.hostname();
    return {
      status: STATUS.Success,
      data: { username, hostname },
    };
  } catch (err) {
    const message = `Nieznany błąd przy pobieraniu użytkownika z systemu.`;
    log.error(`[utils.js] [${functionName}] [nieznany użytkownik] ${message}`, err);
    return { status: STATUS.Error, message: err instanceof Error ? err.message : message };
  }
}

//Pobierz nazwę użytkownika oraz hostname z systemu
export async function getWindowsUsernameElektron(): Promise<string> {
  const functionName = getWindowsUsernameElektron.name;
  try {
    const username = os.userInfo().username.toLowerCase();
    const displayUserName = (await getUserBySystemName(username));
    if (!displayUserName || displayUserName.status === STATUS.Error) {
      const message = `Nie udało się pobrać nazwy użytkownika z bazy danych.`;
      log.error(`[utils.js] [${functionName}] [${username}] ${message}`);
      return "defaultUser";
    }
    return displayUserName.data.UserDisplayName;
  } catch (err) {
    const message = `Nieznany błąd przy pobieraniu użytkownika z bazy danych.`;
    log.error(`[utils.js] [${functionName}] [nieznany użytkownik] ${message}`, err);
    return "defaultUser";
  }
}
// export function ipcMainHandle2<Key extends keyof EventPayloadMapping>(
//   key: Key,
//   handler: () => EventPayloadMapping[Key]
// ) {
//   ipcMain.handle(key, (event) => {
//     if (event.senderFrame) {
//       validateEventFrame(event.senderFrame);
//     }
//     return handler();
//   });
// }

export function ipcMainHandle2<Key extends keyof EventPayloadMapping>(
  key: Key,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (...args: any[]) => EventPayloadMapping[Key] | Promise<EventPayloadMapping[Key]>
): void {
  ipcMain.handle(key, async (event, ...args) => {
    if (event.senderFrame) {
      validateEventFrame(event.senderFrame);
    }
    return await handler(...args);
  });
}

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: () => Promise<EventPayloadMapping[Key]> | EventPayloadMapping[Key]
) {
  ipcMain.handle(key, async (event) => {
    if (event.senderFrame) {
      validateEventFrame(event.senderFrame);
    }
    return await handler();
  });
}

export function ipcMainOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: (payload: EventPayloadMapping[Key]) => void
) {
  ipcMain.on(key, (event, payload) => {
    if (event.senderFrame) {
      validateEventFrame(event.senderFrame);
    }
    return handler(payload);
  });
}


export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  webContents: WebContents,
  payload: EventPayloadMapping[Key]
) {
  webContents.send(key, payload);
}

// export function validateEventFrame(frame: WebFrameMain) {
//   if (isDev() && new URL(frame.url).host === 'localhost:5123') {
//     return;
//   }
//   if (frame.url !== pathToFileURL(getUIPath()).toString()) {
//     // throw new Error('Malicious event');
//     log.error('validateEventFrame frame.url:', frame.url);
//     log.error('validateEventFrame pathToFileURL(getUIPath()):', pathToFileURL(getUIPath()).toString());
//     return;
//   }
// }

export function validateEventFrame(frame: WebFrameMain) {
  if (isDev() && new URL(frame.url).host === 'localhost:5123') {
    return;
  }
  // Porównaj tylko część ścieżki przed fragmentem (#)
  const frameUrlBase = frame.url.split('#')[0];
  const uiPathUrl = pathToFileURL(getUIPath()).toString().split('#')[0];
  if (frameUrlBase !== uiPathUrl) {
    log.error('validateEventFrame frame.url:', frame.url);
    log.error('validateEventFrame pathToFileURL(getUIPath()):', pathToFileURL(getUIPath()).toString());
    return;
  }
  //   const uiPathUrl = pathToFileURL(getUIPath()).toString();
  // if (!frame.url.startsWith(uiPathUrl)) {
  //   log.error('validateEventFrame frame.url:', frame.url);
  //   log.error('validateEventFrame pathToFileURL(getUIPath()):', uiPathUrl);
  //   return;
  // }
}