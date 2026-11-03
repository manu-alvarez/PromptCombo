import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clearStoredSession,
  flushSessionSave,
  initPersistence,
  isPersistenceEnabled,
  loadPreferences,
  loadStoredSession,
  sanitizeSession,
  savePreferences,
  saveStoredSession,
  scheduleSessionSave,
  setPersistenceEnabled
} from '../src/core/persistence.js';

function createStorage() {
  const data = new Map();
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
    clear: () => data.clear()
  };
}

const brokenStorage = {
  getItem() { throw new Error('blocked'); },
  setItem() { throw new Error('blocked'); },
  removeItem() { throw new Error('blocked'); }
};

test('sanitiza sesiones corruptas, duplicadas y fuera de contrato', () => {
  const clean = sanitizeSession({
    version: 1,
    selected: ['role-analyst', 'role-analyst', 'bad id', '../escape', 'skill-1'],
    vars: {
      '[A]': 'valor',
      '[B]': 42,
      '__proto__': 'contaminado',
      '[C]': 'x'.repeat(5000)
    }
  });

  assert.deepEqual(clean.selected, ['role-analyst', 'skill-1']);
  assert.equal(clean.vars['[A]'], 'valor');
  assert.equal(Object.hasOwn(clean.vars, '[B]'), false);
  assert.equal(Object.hasOwn(clean.vars, '__proto__'), false);
  assert.equal(clean.vars['[C]'].length, 4000);
  assert.equal(sanitizeSession({ version: 2, selected: [], vars: {} }), null);
  assert.equal(sanitizeSession(null), null);
});

test('guarda y recupera una sesión con almacenamiento válido', () => {
  const storage = createStorage();
  const saved = saveStoredSession({ selected: ['role-analyst'], vars: { '[X]': 'y' } }, storage);

  assert.equal(saved, true);
  assert.deepEqual(loadStoredSession(storage), {
    selected: ['role-analyst'],
    vars: { '[X]': 'y' }
  });

  assert.equal(clearStoredSession(storage), true);
  assert.equal(loadStoredSession(storage), null);
});

test('tolera JSON corrupto y almacenamiento bloqueado', () => {
  const storage = createStorage();
  storage.setItem('promptcombo.session.v1', '{no-json');

  assert.equal(loadStoredSession(storage), null);
  assert.equal(loadStoredSession(brokenStorage), null);
  assert.equal(saveStoredSession({ selected: [], vars: {} }, brokenStorage), false);
  assert.equal(clearStoredSession(brokenStorage), false);
});

test('persiste la preferencia de guardado y borra la sesión al desactivarla', () => {
  const storage = createStorage();

  assert.equal(loadPreferences(storage).persist, true);
  assert.equal(initPersistence(storage), true);
  assert.equal(isPersistenceEnabled(), true);

  saveStoredSession({ selected: ['role-analyst'], vars: {} }, storage);
  assert.equal(setPersistenceEnabled(false, storage), true);
  assert.equal(isPersistenceEnabled(), false);
  assert.equal(loadStoredSession(storage), null);
  assert.equal(loadPreferences(storage).persist, false);

  assert.equal(setPersistenceEnabled(true, storage), true);
  assert.equal(isPersistenceEnabled(), true);
  assert.equal(loadPreferences(storage).persist, true);
});

test('no habilita la persistencia si el almacenamiento está bloqueado', () => {
  assert.equal(initPersistence(brokenStorage), false);
  assert.equal(isPersistenceEnabled(), false);
  assert.equal(setPersistenceEnabled(true, brokenStorage), false);
  assert.equal(savePreferences({ persist: true }, brokenStorage), false);
});

test('agrupa escrituras y vuelca la instantánea pendiente', () => {
  const storage = createStorage();
  initPersistence(storage);

  scheduleSessionSave({ selected: ['role-analyst'], vars: { '[X]': '1' } });
  scheduleSessionSave({ selected: ['role-analyst', 'skill-1'], vars: { '[X]': '2' } });
  assert.equal(flushSessionSave(), true);
  assert.deepEqual(loadStoredSession(storage), {
    selected: ['role-analyst', 'skill-1'],
    vars: { '[X]': '2' }
  });
});
