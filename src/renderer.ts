import '@/App';
import { closeWindow, maximizeWindow, minimizeWindow } from './helpers/window_helpers';

console.log('Renderer script loaded');

document.querySelector('#minimize')?.addEventListener('click', () => {
  minimizeWindow();
});

document.querySelector('#maximize')?.addEventListener('click', () => {
  maximizeWindow();
});

document.querySelector('#close')?.addEventListener('click', () => {
  closeWindow();
});
