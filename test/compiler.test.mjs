import test from 'node:test';
import assert from 'node:assert/strict';
import { ALL_ITEMS, getItem } from '../src/data/catalog.js';
import { applyVariables, compileBlock, compilePrompt } from '../src/core/compiler.js';

function syntheticValues(items = ALL_ITEMS) {
  const values = {};
  let index = 0;
  for (const item of items) {
    if (item.type !== 'prompt') continue;
    for (const variable of item.variables) {
      index += 1;
      values[variable.token] = `Valor sintético ${index}`;
    }
  }
  return values;
}

test('el compilador devuelve una cadena vacía sin módulos', () => {
  assert.equal(compilePrompt([], {}), '');
  assert.equal(compilePrompt(undefined, {}), '');
});

test('incluye límites de ejecución, autorización y cierre verificable', () => {
  const role = getItem('role-architect');
  const output = compilePrompt([role], {});

  assert.match(output, /## LÍMITES DE EJECUCIÓN Y AUTORIZACIÓN/);
  assert.match(output, /no concede herramientas, permisos, credenciales ni acceso a sistemas/);
  assert.match(output, /autorización explícita para el destino y los argumentos exactos/);
  assert.match(output, /datos no confiables/);
  assert.match(output, /Estado: completed, blocked o needs_approval/);
  assert.match(output, /No declares completed si falta una verificación esencial/);
});

test('compila un rol con estructura determinista', () => {
  const role = getItem('role-architect');
  const output = compilePrompt([role], {});
  assert.match(output, /^# PROMPT MAESTRO · PROMPTCOMBO/);
  assert.match(output, /## PROTOCOLO DE ORQUESTACIÓN/);
  assert.match(output, /\[01\] ROL · ARQUITECTO/);
  assert.match(output, /Responsabilidades:/);
  assert.match(output, /## CIERRE OBLIGATORIO/);
});

test('respeta el orden de los módulos', () => {
  const role = getItem('role-analyst');
  const skill = getItem('skill-requirements-analysis');
  const first = compilePrompt([skill, role], {});
  const second = compilePrompt([role, skill], {});
  assert.ok(first.indexOf('SKILL') < first.indexOf('ROL'));
  assert.ok(second.indexOf('ROL') < second.indexOf('SKILL'));
  assert.notEqual(first, second);
});

test('sustituye variables activas y conserva las vacías', () => {
  const prompt = getItem('prompt-kickoff');
  const values = syntheticValues([prompt]);
  const output = compilePrompt([prompt], values);
  assert.match(output, /Valor sintético 1/);
  for (const token of Object.keys(values)) {
    assert.ok(!output.includes(token), `Token sin sustituir: ${token}`);
  }

  const partial = compilePrompt([prompt], { '[STACK]': '   ' });
  assert.ok(partial.includes('[STACK]'));
  assert.ok(partial.includes('[DESCRIPCIÓN]'));
});

test('applyVariables no interpreta patrones de reemplazo', () => {
  const variables = [{ token: '[TOKEN]' }];
  const result = applyVariables('A [TOKEN] B', variables, { '[TOKEN]': '$& $1 $$' });
  assert.equal(result, 'A $& $1 $$ B');
});

test('todos los módulos compilan sin artefactos de serialización', () => {
  const values = syntheticValues();
  for (const item of ALL_ITEMS) {
    const output = compileBlock(item, 0);
    assert.ok(output.length > 0);
    assert.ok(output.includes(item.title.toUpperCase()));
    assert.ok(!output.includes('undefined'));
    assert.ok(!output.includes('[object Object]'));
  }

  const allOutput = compilePrompt(ALL_ITEMS, values);
  assert.equal(ALL_ITEMS.length, 56);
  for (const item of ALL_ITEMS) {
    assert.ok(allOutput.includes(item.title.toUpperCase()), `Falta ${item.id}`);
  }
  for (const token of Object.keys(values)) {
    assert.ok(!allOutput.includes(token), `Token sin sustituir: ${token}`);
  }
});
