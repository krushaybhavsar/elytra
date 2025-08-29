import { contextBridge, ipcRenderer } from 'electron';
import { WINDOW_CHANNELS } from './window-channels';

export function exposeWindowContext() {
  contextBridge.exposeInMainWorld('electronWindow', {
    minimize: () => ipcRenderer.invoke(WINDOW_CHANNELS.MINIMIZE),
    maximize: () => ipcRenderer.invoke(WINDOW_CHANNELS.MAXIMIZE),
    close: () => ipcRenderer.invoke(WINDOW_CHANNELS.CLOSE),
    rename: (newName: string) => ipcRenderer.invoke(WINDOW_CHANNELS.RENAME, newName),
    onDeepLink: (callback: (url: string) => void) => {
      ipcRenderer.on(WINDOW_CHANNELS.DEEP_LINK, (_event, url) => callback(url));
      return () => {
        ipcRenderer.removeAllListeners(WINDOW_CHANNELS.DEEP_LINK);
      };
    },
  });
}
