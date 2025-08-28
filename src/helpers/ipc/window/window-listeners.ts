import { BrowserWindow, ipcMain } from 'electron';
import {
  WIN_CLOSE_CHANNEL,
  WIN_MAXIMIZE_CHANNEL,
  WIN_MINIMIZE_CHANNEL,
  WIN_RENAME_CHANNEL,
  WIN_DEEP_LINK_CHANNEL,
} from './window-channels';

export function addWindowEventListeners(mainWindow: BrowserWindow) {
  ipcMain.handle(WIN_MINIMIZE_CHANNEL, () => {
    mainWindow.minimize();
  });
  ipcMain.handle(WIN_MAXIMIZE_CHANNEL, () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });
  ipcMain.handle(WIN_CLOSE_CHANNEL, () => {
    mainWindow.hide();
  });
  ipcMain.handle(WIN_RENAME_CHANNEL, (event, newName: string) => {
    mainWindow.setTitle(newName);
  });
}

export function sendDeepLinkUrl(mainWindow: BrowserWindow, url: string) {
  mainWindow.webContents.send(WIN_DEEP_LINK_CHANNEL, url);
}
