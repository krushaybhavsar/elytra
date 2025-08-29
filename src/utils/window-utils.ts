import { renameWindow } from '@/helpers/window-helpers';
import { AppMap, AppScreens } from '@/types/navigation';

export const DEEP_LINK_PROTOCOL = 'elytra://';

export const extractPathnamefromDeepLink = (url: string): string => {
  url = url.replace(DEEP_LINK_PROTOCOL, DEEP_LINK_PROTOCOL + 'elytralabs.ai/');
  const urlObj = new URL(url);
  return urlObj.pathname;
};

export const extractQueryParamsfromDeepLink = (url: string): URLSearchParams => {
  url = url.replace(DEEP_LINK_PROTOCOL, DEEP_LINK_PROTOCOL + 'elytralabs.ai/');
  const urlObj = new URL(url);
  return urlObj.searchParams;
};

export const updateScreenTitleBar = async (screen: AppScreens) => {
  const mapRoute = AppMap[screen];
  const windowTitleBar = document.getElementsByClassName('titlebar');
  if (windowTitleBar) {
    windowTitleBar[0].className = `titlebar ${mapRoute.titleBarSettings?.showTitleBar ? 'flex' : 'hidden'} bg-${mapRoute.titleBarSettings?.titleBarColor} ${mapRoute.titleBarSettings?.additionalStyles}`;
  }
  const windowTitle = document.getElementById('titlebar-title');
  if (windowTitle) {
    windowTitle.innerText = mapRoute.windowTitle;
    windowTitle.className = `${mapRoute.titleBarSettings?.showTitleText ? 'flex' : 'hidden'} !text-${mapRoute.titleBarSettings?.titleTextColor}`;
  }
  await renameWindow(mapRoute.windowTitle);
};
