import { BrowserWindow, ipcMain } from 'electron';
import { WINDOW_CHANNELS } from './window-channels';

export function addWindowEventListeners(mainWindow: BrowserWindow) {
  ipcMain.removeHandler(WINDOW_CHANNELS.MINIMIZE);
  ipcMain.removeHandler(WINDOW_CHANNELS.MAXIMIZE);
  ipcMain.removeHandler(WINDOW_CHANNELS.CLOSE);
  ipcMain.removeHandler(WINDOW_CHANNELS.RENAME);
  ipcMain.removeHandler(WINDOW_CHANNELS.GET_PLATFORM);

  ipcMain.handle(WINDOW_CHANNELS.MINIMIZE, () => {
    mainWindow.minimize();
  });
  ipcMain.handle(WINDOW_CHANNELS.MAXIMIZE, () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });
  ipcMain.handle(WINDOW_CHANNELS.CLOSE, () => {
    mainWindow.hide();
  });
  ipcMain.handle(WINDOW_CHANNELS.RENAME, (event, newName: string) => {
    mainWindow.setTitle(newName);
  });
  ipcMain.handle(WINDOW_CHANNELS.GET_PLATFORM, () => {
    return process.platform;
  });
}

export function sendDeepLinkUrl(mainWindow: BrowserWindow, url: string) {
  mainWindow.webContents.send(WINDOW_CHANNELS.DEEP_LINK, url);
}
