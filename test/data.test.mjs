import test from 'node:test';
import assert from 'node:assert/strict';
import { validateData } from '../scripts/validate-data.mjs';

test('el catálogo cumple el contrato de datos y compila completo', () => {
  const summary = validateData();
  assert.equal(summary.modules, 56);
  assert.equal(summary.skills, 30);
  assert.ok(summary.characters > 50_000);
});
