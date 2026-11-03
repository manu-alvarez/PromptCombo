/* Sistema de notificaciones efímeras y acciones reversibles. */
import { els } from '../core/dom.js';

export function showToast(message, options = {}) {
  while (els.toastRegion.children.length >= 3) {
    els.toastRegion.firstElementChild.remove();
  }

  const element = document.createElement('div');
  element.className = `toast${options.tone ? ` toast-${options.tone}` : ''}`;

  const messageNode = document.createElement('span');
  messageNode.className = 'toast-message';
  messageNode.textContent = message;
  element.append(messageNode);

  let dismissed = false;
  let timer = null;

  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    if (timer) window.clearTimeout(timer);
    element.classList.remove('is-visible');
    element.classList.add('is-leaving');
    window.setTimeout(() => element.remove(), 180);
  };

  if (options.actionLabel && typeof options.onAction === 'function') {
    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'toast-action';
    action.textContent = options.actionLabel;
    action.addEventListener('click', () => {
      if (dismissed) return;
      dismiss();
      options.onAction();
    });
    element.append(action);
  }

  els.toastRegion.append(element);
  window.requestAnimationFrame(() => element.classList.add('is-visible'));

  const duration = options.duration ?? (options.actionLabel ? 5000 : 2600);
  timer = window.setTimeout(dismiss, duration);
}
