import { ipcMain, WebContents, WebFrameMain } from "electron";
import log from "electron-log";
import { pathToFileURL } from "url";
import { getUIPath } from "./pathResolver.js";

export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}



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