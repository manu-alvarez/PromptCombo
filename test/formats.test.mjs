import test from 'node:test';
import assert from 'node:assert/strict';
import { buildArtifacts } from '../src/core/generator.js';
import { createProject, safeArtifactPath, validateProject } from '../src/core/project.js';

test('OpenAPI generado pasa la comprobación estructural y se marca como borrador', () => {
  const project = createProject({ recipeId: 'api-docs', description: 'API demo', id: 'api-format', now: 1 });
  project.values.goal = 'Documentar una API.';
  project.values.apiName = 'Inventory API';
  project.artifacts = buildArtifacts(project);
  const validations = validateProject(project);
  assert.equal(validations.filter((validation) => validation.severity === 'error').length, 0);
  assert.ok(validations.some((validation) => validation.code === 'openapi-draft'));

  const yaml = project.artifacts.find((artifact) => artifact.path.endsWith('.yaml'));
  yaml.content = 'openapi: 3.1.0\ninfo:\n  title: Demo\n';
  const broken = validateProject(project);
  assert.ok(broken.some((validation) => validation.code === 'openapi-structure'));
});

test('el frontmatter de Cursor detecta un cierre ausente', () => {
  const project = createProject({ recipeId: 'cursor-rules', description: 'Reglas', id: 'frontmatter', now: 1 });
  project.values.goal = 'Reglas del proyecto.';
  project.artifacts = buildArtifacts(project);
  const cursor = project.artifacts.find((artifact) => artifact.path.endsWith('.mdc'));
  assert.match(cursor.content, /^---/);
  assert.equal(validateProject(project).filter((validation) => validation.severity === 'error').length, 0);

  cursor.content = cursor.content.replace(/\n---\n/, '\n');
  assert.ok(validateProject(project).some((validation) => validation.code === 'unclosed-frontmatter'));
});

test('OpenAPI detecta referencias rotas y parámetros de ruta ausentes', () => {
  const project = createProject({ recipeId: 'api-docs', description: 'API demo', id: 'api-refs', now: 1 });
  project.values.goal = 'Documentar una API.';
  project.values.apiName = 'Inventory API';
  project.values.operations = 'GET /items\nPATCH /items/{id}';
  project.artifacts = buildArtifacts(project);
  const yaml = project.artifacts.find((artifact) => artifact.path.endsWith('.yaml'));

  assert.ok(yaml.content.includes('"/items":'));
  assert.ok(yaml.content.includes('    patch:'));
  assert.equal(validateProject(project).filter((validation) => validation.severity === 'error').length, 0);

  yaml.content = yaml.content.replace("$ref: '#/components/schemas/ResourceList'", "$ref: '#/components/schemas/MissingList'");
  assert.ok(validateProject(project).some((validation) => validation.code === 'openapi-broken-ref'));

  yaml.content = yaml.content.replace('        - name: "id"\n', '');
  assert.ok(validateProject(project).some((validation) => validation.code === 'openapi-missing-parameter'));
});

test('las rutas aceptan archivos ocultos seguros y avisan de colisiones por mayúsculas', () => {
  const project = createProject({ recipeId: 'prompt-professional', description: 'Rutas', id: 'paths-hidden', now: 1 });
  project.values.goal = 'Demo';
  project.artifacts = [
    { path: '.gitignore', format: 'text', content: 'node_modules\n' },
    { path: '.env.example', format: 'text', content: 'TOKEN=\n' },
    { path: 'docs/Readme.md', format: 'markdown', content: '# Uno\n' },
    { path: 'docs/README.md', format: 'markdown', content: '# Dos\n' }
  ];
  const validations = validateProject(project);
  assert.equal(validations.filter((validation) => validation.severity === 'error').length, 0);
  assert.ok(validations.some((validation) => validation.code === 'path-case-collision'));
  assert.equal(safeArtifactPath('.env.example'), '.env.example');
  assert.equal(safeArtifactPath('..env'), '..env');
  assert.equal(safeArtifactPath('.hidden/../x'), null);
});
