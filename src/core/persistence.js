/* Persistencia local versionada y tolerante a fallos del almacenamiento. */
const SESSION_KEY = 'promptcombo.session.v1';
const PREFS_KEY = 'promptcombo.prefs.v1';
const SESSION_VERSION = 1;
const MAX_SELECTED = 200;
const MAX_VARS = 120;
const MAX_VALUE_LENGTH = 4000;
const MAX_TOKEN_LENGTH = 66;
const ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,79}$/;
const TOKEN_PATTERN = /^\[[^\]\r\n]{1,64}\]$/;
const SAVE_DELAY_MS = 300;

let enabled = false;
let activeStorage = null;
let saveArmed = false;
let pendingSnapshot = null;
let flushTimer = null;

function usableStorage(storage) {
  if (!storage) return null;

  try {
    const probe = `${SESSION_KEY}.probe`;
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    return storage;
  } catch {
    return null;
  }
}

/**
 * Devuelve el almacenamiento local si está disponible y permite una escritura
 * de prueba. En algunos contextos (file://, modo privado, políticas del
 * navegador) el acceso lanza una excepción o falla silenciosamente.
 */
export function getStorage() {
  try {
    return usableStorage(globalThis.localStorage);
  } catch {
    return null;
  }
}

export function isPersistenceSupported(storage = getStorage()) {
  return usableStorage(storage) !== null;
}

function normalizeSelected(value) {
  if (!Array.isArray(value)) return [];

  const selected = [];
  const seen = new Set();

  for (const id of value) {
    if (selected.length >= MAX_SELECTED) break;
    if (typeof id !== 'string' || !ID_PATTERN.test(id) || seen.has(id)) continue;
    seen.add(id);
    selected.push(id);
  }

  return selected;
}

function normalizeVars(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  const vars = {};
  let count = 0;

  for (const [token, raw] of Object.entries(value)) {
    if (count >= MAX_VARS) break;
    if (token.length > MAX_TOKEN_LENGTH || !TOKEN_PATTERN.test(token)) continue;
    if (typeof raw !== 'string') continue;
    vars[token] = raw.slice(0, MAX_VALUE_LENGTH);
    count += 1;
  }

  return vars;
}

/**
 * Valida y normaliza un payload leído de localStorage. Devuelve null si la
 * versión no coincide o si la forma base no es un objeto.
 */
export function sanitizeSession(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  if (raw.version !== SESSION_VERSION) return null;

  return {
    selected: normalizeSelected(raw.selected),
    vars: normalizeVars(raw.vars)
  };
}

export function loadStoredSession(storage = getStorage()) {
  if (!storage) return null;

  try {
    const serialized = storage.getItem(SESSION_KEY);
    if (!serialized) return null;
    return sanitizeSession(JSON.parse(serialized));
  } catch {
    return null;
  }
}

export function saveStoredSession(snapshot, storage = getStorage()) {
  if (!storage || !snapshot) return false;

  try {
    const payload = {
      version: SESSION_VERSION,
      updatedAt: Date.now(),
      selected: normalizeSelected(snapshot.selected),
      vars: normalizeVars(snapshot.vars)
    };
    storage.setItem(SESSION_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function clearStoredSession(storage = getStorage()) {
  if (!storage) return false;

  try {
    storage.removeItem(SESSION_KEY);
    return true;
  } catch {
    return false;
  }
}

export function loadPreferences(storage = getStorage()) {
  if (!storage) return { persist: false };

  try {
    const serialized = storage.getItem(PREFS_KEY);
    if (!serialized) return { persist: true };
    const raw = JSON.parse(serialized);
    return { persist: !raw || raw.persist !== false };
  } catch {
    return { persist: true };
  }
}

export function savePreferences(preferences, storage = getStorage()) {
  if (!storage) return false;

  try {
    storage.setItem(PREFS_KEY, JSON.stringify({ persist: preferences?.persist !== false }));
    return true;
  } catch {
    return false;
  }
}

/**
 * Activa o desactiva el guardado automático. Al desactivarlo se borra la copia
 * local para no dejar datos de la composición en el navegador.
 */
export function initPersistence(storage = getStorage()) {
  const usable = usableStorage(storage);
  if (!usable) {
    activeStorage = null;
    enabled = false;
    return false;
  }

  activeStorage = usable;
  const preferences = loadPreferences(usable);
  enabled = preferences.persist;

  if (!enabled) {
    pendingSnapshot = null;
    if (flushTimer) {
      globalThis.clearTimeout(flushTimer);
      flushTimer = null;
    }
  }

  return enabled;
}

export function isPersistenceEnabled() {
  return enabled;
}

/**
 * Evita que el primer render guarde un estado vacío antes de restaurar la
 * sesión. Se activa cuando la inicialización ha terminado.
 */
export function armSessionSave() {
  saveArmed = true;
}

export function setPersistenceEnabled(value, storage = activeStorage || getStorage()) {
  const next = Boolean(value);

  if (next) {
    const usable = usableStorage(storage);
    if (!usable || !savePreferences({ persist: true }, usable)) return false;
    activeStorage = usable;
    enabled = true;
    return true;
  }

  enabled = false;
  savePreferences({ persist: false }, storage);
  clearStoredSession(storage);
  pendingSnapshot = null;
  if (flushTimer) {
    globalThis.clearTimeout(flushTimer);
    flushTimer = null;
  }

  return true;
}

function flushSnapshot() {
  if (!pendingSnapshot) return true;

  const snapshot = pendingSnapshot;
  pendingSnapshot = null;
  const saved = saveStoredSession(snapshot, activeStorage);

  if (!saved) {
    enabled = false;
    activeStorage = null;
    try {
      globalThis.window?.dispatchEvent(new CustomEvent('promptcombo:persistence-error'));
    } catch {
      // Sin DOM (pruebas en Node) no hay interfaz que notificar.
    }
  }

  return saved;
}

export function scheduleSessionSave(snapshot) {
  if (!enabled || !activeStorage || !saveArmed || !snapshot) return;

  pendingSnapshot = snapshot;
  if (flushTimer) return;

  flushTimer = globalThis.setTimeout(() => {
    flushTimer = null;
    flushSnapshot();
  }, SAVE_DELAY_MS);
}

export function flushSessionSave() {
  if (flushTimer) {
    globalThis.clearTimeout(flushTimer);
    flushTimer = null;
  }

  if (!enabled) return true;
  return flushSnapshot();
}
