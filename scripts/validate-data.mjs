#!/usr/bin/env node
/**
 * Validación del catálogo y del compilador antes de publicar.
 * Exporta validateData() para reutilizarla desde node:test.
 */
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ALL_ITEMS, GROUPS, ITEM_MAP, TOTAL_ITEMS, TYPE_META } from '../src/data/catalog.js';
import { RECIPES } from '../src/data/recipes.js';
import { compilePrompt } from '../src/core/compiler.js';
import { getActiveVariables } from '../src/core/items.js';

const EXPECTED = {
  prompts: 4,
  roles: 7,
  flows: 3,
  agents: 1,
  subagents: 3,
  skills: 30,
  templates: 5,
  scaffolds: 3
};

const STRING_ARRAY_FIELDS = new Set([
  'responsibilities', 'deliverables', 'boundaries', 'exitCriteria',
  'inputs', 'outputs', 'protocol', 'procedure', 'restrictions',
  'acceptance', 'rules'
]);

const REQUIRED_FIELDS = {
  prompt: ['id', 'code', 'short', 'title', 'tagline', 'usage', 'variables', 'text'],
  role: ['id', 'code', 'short', 'title', 'tagline', 'mission', 'responsibilities', 'deliverables', 'boundaries', 'exitCriteria'],
  flow: ['id', 'code', 'short', 'title', 'tagline', 'when', 'steps', 'exitCriteria'],
  agent: ['id', 'code', 'short', 'title', 'tagline', 'mission', 'protocol', 'responsibilities', 'inputs', 'outputs', 'boundaries', 'handoff'],
  subagent: ['id', 'code', 'short', 'title', 'tagline', 'mission', 'responsibilities', 'inputs', 'outputs', 'boundaries', 'handoff'],
  skill: ['id', 'code', 'short', 'title', 'tagline', 'purpose', 'when', 'inputs', 'procedure', 'restrictions', 'output', 'acceptance', 'example'],
  template: ['id', 'code', 'short', 'title', 'filename', 'language', 'tagline', 'usage', 'text'],
  scaffold: ['id', 'code', 'short', 'title', 'tagline', 'usage', 'tree', 'rules']
};

function assertNonEmptyString(value, label) {
  assert.equal(typeof value, 'string', `${label} debe ser string.`);
  assert.ok(value.trim().length > 0, `${label} no puede estar vacío.`);
}

function assertNonEmptyArray(value, label) {
  assert.ok(Array.isArray(value), `${label} debe ser un array.`);
  assert.ok(value.length > 0, `${label} no puede estar vacío.`);
  for (const [index, entry] of value.entries()) {
    assertNonEmptyString(entry, `${label}[${index}]`);
  }
}

export function validateData() {
  assert.equal(TOTAL_ITEMS, 56, 'El catálogo debe contener 56 módulos.');
  assert.equal(new Set(ALL_ITEMS.map((item) => item.id)).size, ALL_ITEMS.length, 'Hay IDs duplicados.');
  assert.equal(new Set(ALL_ITEMS.map((item) => item.code)).size, ALL_ITEMS.length, 'Hay códigos duplicados.');

  for (const group of GROUPS) {
    assert.equal(group.items.length, EXPECTED[group.key], `Cantidad inesperada en ${group.key}.`);
    assertNonEmptyString(group.title, `Grupo ${group.key}`);
    assert.ok(TYPE_META[group.type], `Tipo sin metadatos: ${group.type}`);
  }

  for (const item of ALL_ITEMS) {
    const fields = REQUIRED_FIELDS[item.type];
    assert.ok(fields, `Tipo desconocido: ${item.type}`);

    for (const field of fields) {
      assert.ok(Object.hasOwn(item, field), `${item.id} no tiene el campo ${field}.`);
      const value = item[field];
      if (Array.isArray(value)) {
        assert.ok(value.length > 0, `${item.id}.${field} no puede estar vacío.`);
        if (STRING_ARRAY_FIELDS.has(field)) assertNonEmptyArray(value, `${item.id}.${field}`);
      } else if (typeof value === 'string') {
        assertNonEmptyString(value, `${item.id}.${field}`);
      } else {
        assert.ok(value && typeof value === 'object', `${item.id}.${field} tiene un tipo inválido.`);
      }
    }

    assert.match(item.id, /^(prompt|role|flow|agent|subagent|skill|template|scaffold)-[a-z0-9-]+$/, `ID inválido: ${item.id}`);
    assert.ok(ITEM_MAP.get(item.id) === item, `El índice no contiene ${item.id}.`);

    if (item.type === 'prompt') {
      const tokens = new Set();
      for (const variable of item.variables) {
        assert.match(variable.token, /^\[[A-ZÁÉÍÓÚÑ0-9 _-]+\]$/, `Token inválido en ${item.id}: ${variable.token}`);
        assert.ok(!tokens.has(variable.token), `Token duplicado en ${item.id}: ${variable.token}`);
        tokens.add(variable.token);
        assert.ok(item.text.includes(variable.token), `El prompt ${item.id} no usa ${variable.token}.`);
        assertNonEmptyString(variable.label, `${item.id}.${variable.token}.label`);
        assert.equal(typeof variable.required, 'boolean', `${item.id}.${variable.token}.required debe ser booleano.`);
      }
    }

    if (item.type === 'flow') {
      for (const step of item.steps) {
        assertNonEmptyString(step.name, `${item.id}.step.name`);
        assertNonEmptyString(step.goal, `${item.id}.step.goal`);
        assertNonEmptyString(step.output, `${item.id}.step.output`);
        assertNonEmptyString(step.gate, `${item.id}.step.gate`);
      }
    }
  }

  const skillFields = ['purpose', 'when', 'inputs', 'procedure', 'restrictions', 'output', 'acceptance', 'example'];
  const skills = GROUPS.find((group) => group.key === 'skills').items;
  assert.equal(skills.length, 30, 'Deben existir exactamente 30 skills.');
  for (const skill of skills) {
    for (const field of skillFields) {
      assert.ok(Object.hasOwn(skill, field), `La skill ${skill.id} no tiene ${field}.`);
    }
  }

  for (const [key, recipe] of Object.entries(RECIPES)) {
    assertNonEmptyString(recipe.title, `Receta ${key}.title`);
    assert.ok(Array.isArray(recipe.ids) && recipe.ids.length > 0, `Receta ${key} sin módulos.`);
    for (const id of recipe.ids) assert.ok(ITEM_MAP.has(id), `Receta ${key} referencia un ID inexistente: ${id}`);

    const activeVariables = new Set(getActiveVariables(recipe.ids).map((variable) => variable.token));
    for (const token of Object.keys(recipe.vars)) {
      assert.ok(activeVariables.has(token), `Receta ${key} define una variable no activa: ${token}`);
      assertNonEmptyString(recipe.vars[token], `Receta ${key}.${token}`);
    }
  }

  // Compila el catálogo completo con valores sintéticos y verifica que no queden
  // tokens activos sin sustituir ni artefactos de serialización.
  const allValues = {};
  let valueIndex = 0;
  for (const item of ALL_ITEMS) {
    if (item.type !== 'prompt') continue;
    for (const variable of item.variables) {
      valueIndex += 1;
      allValues[variable.token] = `Valor sintético ${valueIndex}`;
    }
  }

  for (const item of ALL_ITEMS) {
    const output = compilePrompt([item], allValues);
    assert.ok(output.length > 0, `El módulo ${item.id} compila vacío.`);
    assert.ok(output.includes(item.title.toUpperCase()), `El compilado de ${item.id} no incluye su título.`);
    assert.ok(!output.includes('undefined'), `El compilado de ${item.id} contiene undefined.`);
    assert.ok(!output.includes('[object Object]'), `El compilado de ${item.id} contiene un objeto serializado.`);
  }

  const allOutput = compilePrompt(ALL_ITEMS, allValues);
  assert.ok(allOutput.startsWith('# PROMPT MAESTRO · PROMPTCOMBO'), 'El prompt global no tiene cabecera.');
  assert.ok(allOutput.includes('## CIERRE OBLIGATORIO'), 'El prompt global no tiene checklist de cierre.');
  for (const item of ALL_ITEMS) {
    assert.ok(allOutput.includes(item.title.toUpperCase()), `El prompt global omite ${item.id}.`);
  }
  for (const token of Object.keys(allValues)) {
    assert.ok(!allOutput.includes(token), `El prompt global conserva el token ${token}.`);
  }

  return {
    modules: TOTAL_ITEMS,
    skills: skills.length,
    groups: GROUPS.map((group) => `${group.key}:${group.items.length}`).join(' · '),
    characters: allOutput.length
  };
}

const isMain = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
  try {
    const summary = validateData();
    console.log(`Datos válidos · ${summary.modules} módulos · ${summary.skills} skills`);
    console.log(summary.groups);
    console.log(`Compilado completo: ${summary.characters.toLocaleString('es-ES')} caracteres`);
  } catch (error) {
    console.error(`Validación fallida: ${error.message}`);
    process.exitCode = 1;
  }
}
