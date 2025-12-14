import '@/App';
import { closeWindow, maximizeWindow, minimizeWindow } from './helpers/window-helpers';

console.log('Renderer script loaded');

(async () => {
  const platform = await window.electronWindow.getPlatform();
  if (platform === 'darwin') {
    const titlebarButtons = document.querySelector('.titlebar-buttons') as HTMLElement | null;
    if (titlebarButtons) {
      titlebarButtons.style.display = 'none';
    }
  }
})();

document.querySelector('#minimize')?.addEventListener('click', () => {
  minimizeWindow();
});

document.querySelector('#maximize')?.addEventListener('click', () => {
  maximizeWindow();
});

document.querySelector('#close')?.addEventListener('click', () => {
  closeWindow();
});
