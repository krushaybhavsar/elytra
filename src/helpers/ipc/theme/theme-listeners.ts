import { nativeTheme } from 'electron';
import { ipcMain } from 'electron';
import { THEME_MODE_CHANNELS } from './theme-channels';

export function addThemeEventListeners() {
  ipcMain.handle(THEME_MODE_CHANNELS.CURRENT, () => nativeTheme.themeSource);
  ipcMain.handle(THEME_MODE_CHANNELS.TOGGLE, () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light';
    } else {
      nativeTheme.themeSource = 'dark';
    }
    return nativeTheme.shouldUseDarkColors;
  });
  ipcMain.handle(THEME_MODE_CHANNELS.DARK, () => (nativeTheme.themeSource = 'dark'));
  ipcMain.handle(THEME_MODE_CHANNELS.LIGHT, () => (nativeTheme.themeSource = 'light'));
  ipcMain.handle(THEME_MODE_CHANNELS.SYSTEM, () => {
    nativeTheme.themeSource = 'system';
    return nativeTheme.shouldUseDarkColors;
  });
}
