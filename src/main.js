/* Punto de entrada de PromptCombo. */
import { ITEM_MAP } from './data/catalog.js';
import { state } from './core/state.js';
import { KNOWN_VARIABLE_TOKENS } from './core/items.js';
import {
  armSessionSave,
  flushSessionSave,
  initPersistence,
  isPersistenceEnabled,
  isPersistenceSupported,
  loadStoredSession
} from './core/persistence.js';
import { renderCatalog } from './ui/catalog.js';
import { renderAll } from './ui/workbench.js';
import { bindEvents } from './ui/events.js';
import { showToast } from './ui/toasts.js';

function restorePersistedSession() {
  if (!isPersistenceEnabled()) return;

  const saved = loadStoredSession();
  if (!saved) return;

  const selected = [];
  const seen = new Set();

  for (const id of saved.selected) {
    if (!ITEM_MAP.has(id) || seen.has(id)) continue;
    seen.add(id);
    selected.push(id);
  }

  const vars = {};
  for (const [token, value] of Object.entries(saved.vars)) {
    if (KNOWN_VARIABLE_TOKENS.has(token)) vars[token] = value;
  }

  state.selected = selected;
  state.vars = vars;
}

function init() {
  initPersistence();
  restorePersistedSession();

  renderCatalog();
  renderAll();
  bindEvents();
  armSessionSave();

  if (!isPersistenceSupported()) {
    showToast('El almacenamiento local no está disponible. La sesión quedará solo en memoria y no se guardará al recargar.', {
      tone: 'error',
      duration: 6400
    });
  }

  window.addEventListener('pagehide', flushSessionSave);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushSessionSave();
  });
}

init();
