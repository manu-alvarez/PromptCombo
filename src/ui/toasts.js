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

  const actions = Array.isArray(options.actions)
    ? options.actions
    : options.actionLabel && typeof options.onAction === 'function'
      ? [{ label: options.actionLabel, onAction: options.onAction }]
      : [];

  for (const action of actions) {
    if (!action?.label || typeof action.onAction !== 'function') continue;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'toast-action';
    button.textContent = action.label;
    button.addEventListener('click', () => {
      if (dismissed) return;
      dismiss();
      action.onAction();
    });
    element.append(button);
  }

  els.toastRegion.append(element);
  window.requestAnimationFrame(() => element.classList.add('is-visible'));

  const duration = options.duration ?? (actions.length > 0 ? 5000 : 2600);
  timer = window.setTimeout(dismiss, duration);
}
