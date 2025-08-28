import { app, BrowserWindow, Tray, Menu } from 'electron';
import registerListeners from './helpers/ipc/listeners-register';
import path, { resolve } from 'path';
import { installExtension, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { sendDeepLinkUrl } from './helpers/ipc/window/window-listeners';
import WinstonLogger from './utils/logUtils';
import { initializeLocalServer } from './server/server';
import { Server, IncomingMessage, ServerResponse } from 'http';

const inDevelopment = process.env.NODE_ENV === 'development';
const isMac = process.platform === 'darwin';
const isWin = process.platform === 'win32';
const DEEP_LINK_PROTOCOL = 'elytra';
const logger = WinstonLogger.getInstance().getLogger('Main Process');

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false;
let initialDeepLinkUrl: string | undefined = undefined;
let localExpressServer: Server<typeof IncomingMessage, typeof ServerResponse> | null = null;

// --- Protocol Registration ---
if (inDevelopment && isWin) {
  const mainScriptArg = process.argv[1];
  if (mainScriptArg && !mainScriptArg.includes('://')) {
    app.setAsDefaultProtocolClient(DEEP_LINK_PROTOCOL, process.execPath, [resolve(mainScriptArg)]);
  } else {
    logger.warn(
      `[DeepLink] Unsafe process.argv[1] ('${mainScriptArg}') for protocol registration in dev. ` +
        `If deep links malfunction, this might be the cause.`,
    );
    app.setAsDefaultProtocolClient(DEEP_LINK_PROTOCOL, process.execPath, [
      resolve(process.argv[1]),
    ]);
  }
} else if (!isMac) {
  app.setAsDefaultProtocolClient(DEEP_LINK_PROTOCOL);
}

// --- Handle initial deep link URL from command line (Windows/Linux) ---
if (!isMac) {
  const urlFromArgs = process.argv.find((arg) => arg.startsWith(DEEP_LINK_PROTOCOL + '://'));
  if (urlFromArgs) {
    initialDeepLinkUrl = urlFromArgs;
    logger.info('[DeepLink] Initial URL from argv:', initialDeepLinkUrl);
  }
}

// --- Single Instance Lock ---
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  function handleDeepLinkUrl(url: string) {
    logger.info('[DeepLink] URL received in main process:', url);
    if (mainWindow) {
      sendDeepLinkUrl(mainWindow, url);
    }
  }

  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }

    const urlFromCmd = commandLine.find((arg) => arg.startsWith(DEEP_LINK_PROTOCOL + '://'));
    if (urlFromCmd) {
      if (mainWindow) {
        handleDeepLinkUrl(urlFromCmd);
      } else {
        initialDeepLinkUrl = urlFromCmd;
      }
    }
  });

  // --- macOS handler ---
  app.on('open-url', (event, url) => {
    event.preventDefault();
    if (mainWindow) {
      handleDeepLinkUrl(url);
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    } else {
      initialDeepLinkUrl = url;
    }
  });

  function getIconPath() {
    if (isWin) {
      return './src/assets/icons/icon.ico';
    } else if (isMac) {
      return './src/assets/icons/icon.icns';
    }
    return './src/assets/icons/icon.png';
  }

  function createTray() {
    if (tray) return tray;
    tray = new Tray(getIconPath());
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Quit Elytra',
        click: () => {
          isQuitting = true;
          app.quit();
        },
      },
    ]);
    tray.setToolTip('Elytra');
    tray.setContextMenu(contextMenu);
    tray.on('double-click', () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    });
    tray.on('click', () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    });
    return tray;
  }

  function createWindow() {
    const preload = path.join(__dirname, 'preload.js');
    const newWindow = new BrowserWindow({
      title: 'Elytra',
      minWidth: 800,
      minHeight: 500,
      autoHideMenuBar: true,
      frame: false,
      icon: getIconPath(),
      titleBarStyle: 'hidden',
      webPreferences: {
        preload: preload,
        nodeIntegration: false,
        contextIsolation: true,
      },
    });
    newWindow.maximize();
    registerListeners(newWindow);

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      newWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
      newWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }
    return newWindow;
  }

  async function installExtensions() {
    try {
      const result = await installExtension(REACT_DEVELOPER_TOOLS);
      logger.info(`[DevTools] Extensions installed: ${result.name}`);
    } catch (error) {
      logger.error('[DevTools] Failed to install extensions:', error);
    }
  }

  app.whenReady().then(async () => {
    localExpressServer = await initializeLocalServer();

    if (!localExpressServer) {
      logger.error('Failed to start local server');
    }

    mainWindow = createWindow();
    createTray();

    if (inDevelopment) {
      await installExtensions();
    }

    // Process any initial deep link URL captured before window was ready
    if (initialDeepLinkUrl && mainWindow) {
      handleDeepLinkUrl(initialDeepLinkUrl);
      initialDeepLinkUrl = undefined;
    }
  });

  app.on('window-all-closed', () => {
    if (localExpressServer) {
      localExpressServer.close();
      logger.info('Local server gracefully shutdown');
    }
    if (!isMac) {
      app.quit();
    }
  });

  app.on('activate', () => {
    // macOS specific
    if (BrowserWindow.getAllWindows().length === 0) {
      if (!mainWindow || mainWindow.isDestroyed()) {
        mainWindow = createWindow();
        // Process initial URL if activate recreates window and URL was pending
        if (initialDeepLinkUrl && mainWindow) {
          handleDeepLinkUrl(initialDeepLinkUrl);
          initialDeepLinkUrl = undefined;
        }
      } else {
        mainWindow.show();
      }
    }
  });
}
