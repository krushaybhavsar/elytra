import { contextBridge, ipcRenderer } from 'electron';
import {
  WIN_MINIMIZE_CHANNEL,
  WIN_MAXIMIZE_CHANNEL,
  WIN_CLOSE_CHANNEL,
  WIN_RENAME_CHANNEL,
  WIN_DEEP_LINK_CHANNEL,
} from './window-channels';

export function exposeWindowContext() {
  contextBridge.exposeInMainWorld('electronWindow', {
    minimize: () => ipcRenderer.invoke(WIN_MINIMIZE_CHANNEL),
    maximize: () => ipcRenderer.invoke(WIN_MAXIMIZE_CHANNEL),
    close: () => ipcRenderer.invoke(WIN_CLOSE_CHANNEL),
    rename: (newName: string) => ipcRenderer.invoke(WIN_RENAME_CHANNEL, newName),
    onDeepLink: (callback: (url: string) => void) => {
      ipcRenderer.on(WIN_DEEP_LINK_CHANNEL, (_event, url) => callback(url));
      return () => {
        ipcRenderer.removeAllListeners(WIN_DEEP_LINK_CHANNEL);
      };
    },
  });
}
