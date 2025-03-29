import { ipcMain, WebContents, WebFrameMain } from "electron";
import { getUIPath } from "./pathResolver.js";
import { pathToFileURL } from "url";

export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
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

export function validateEventFrame(frame: WebFrameMain) {
  if (isDev() && new URL(frame.url).host === 'localhost:5123') {
    return;
  }
  if (frame.url !== pathToFileURL(getUIPath()).toString()) {
    throw new Error('Malicious event');
  }
}