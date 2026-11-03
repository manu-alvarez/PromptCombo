import test from 'node:test';
import assert from 'node:assert/strict';
import { SUPPORTED_SCHEMA_KEYWORDS, SUPPORTED_SCHEMA_TYPES, validateJsonInstance, validateSchemaDefinition } from '../src/core/json-schema.js';
import { buildArtifacts } from '../src/core/generator.js';
import { createProject, validateProject } from '../src/core/project.js';

const schema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: { type: 'string' },
    score: { type: 'number' },
    tags: { type: 'array', items: { type: 'string' } }
  },
  required: ['title']
};

test('valida el subconjunto de JSON Schema soportado', () => {
  assert.ok(SUPPORTED_SCHEMA_TYPES.includes('string'));
  assert.ok(SUPPORTED_SCHEMA_KEYWORDS.includes('required'));
  assert.equal(validateSchemaDefinition(schema).valid, true);
  assert.equal(validateSchemaDefinition({ type: 'object', properties: [] }).valid, false);
  assert.equal(validateSchemaDefinition({ type: 'unsupported' }).valid, false);
  assert.equal(validateJsonInstance(schema, { title: 'ok', score: 1, tags: ['a'] }).valid, true);
  assert.equal(validateJsonInstance(schema, {}).valid, false);
  assert.equal(validateJsonInstance(schema, { title: 1 }).valid, false);
  assert.equal(validateJsonInstance(schema, { title: 'x', extra: true }).valid, false);
  assert.equal(validateJsonInstance(schema, { title: 'x', tags: [1] }).valid, false);
});

test('la salida válida e inválida de la receta respetan el esquema', () => {
  const project = createProject({ recipeId: 'structured-output', description: 'Extraer', id: 'schema-test', now: 1 });
  for (const question of [['goal', 'Extraer datos'], ['fields', 'title:string*\nsummary:string']]) project.values[question[0]] = question[1];
  project.artifacts = buildArtifacts(project);
  const validations = validateProject(project);
  assert.equal(validations.filter((validation) => validation.severity === 'error').length, 0);
});
