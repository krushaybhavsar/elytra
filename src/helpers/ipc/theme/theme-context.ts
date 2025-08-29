import { contextBridge, ipcRenderer } from 'electron';
import { THEME_MODE_CHANNELS } from './theme-channels';

export function exposeThemeContext() {
  contextBridge.exposeInMainWorld('themeMode', {
    current: () => ipcRenderer.invoke(THEME_MODE_CHANNELS.CURRENT),
    toggle: () => ipcRenderer.invoke(THEME_MODE_CHANNELS.TOGGLE),
    dark: () => ipcRenderer.invoke(THEME_MODE_CHANNELS.DARK),
    light: () => ipcRenderer.invoke(THEME_MODE_CHANNELS.LIGHT),
    system: () => ipcRenderer.invoke(THEME_MODE_CHANNELS.SYSTEM),
  });
}
