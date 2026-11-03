import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EDITORIAL_STATUSES,
  LIBRARY_RESOURCES,
  RESOURCE_MAP,
  RESOURCE_TYPES,
  VERIFICATION_STATES,
  getResource
} from '../src/data/library-resources.js';
import { RECIPES } from '../src/data/studio-recipes.js';
import { buildArtifacts } from '../src/core/generator.js';
import { createProject, validateProject } from '../src/core/project.js';
import { getCommand } from '../src/data/command-defs.js';

function fillRequired(project) {
  const recipe = RECIPES.find((item) => item.id === project.recipeId);
  for (const question of recipe.questions) {
    if (String(project.values[question.id] || '').trim()) continue;
    project.values[question.id] = question.type === 'list' ? 'uno\ndos' : 'valor de prueba';
  }
  return project;
}

test('la biblioteca tiene identificadores únicos, tipos y estados válidos', () => {
  const ids = LIBRARY_RESOURCES.map((resource) => resource.id);
  assert.equal(new Set(ids).size, ids.length);

  for (const resource of LIBRARY_RESOURCES) {
    assert.ok(RESOURCE_TYPES.some(([type]) => type === resource.type), resource.id);
    assert.ok(EDITORIAL_STATUSES.includes(resource.status), resource.id);
    assert.ok(resource.version, resource.id);
    assert.ok(resource.title && resource.summary && resource.objective, resource.id);
    assert.ok(resource.lastReviewed, resource.id);
    assert.ok(resource.provenance?.origin, resource.id);

    for (const state of Object.values(resource.verification || {})) {
      assert.ok(VERIFICATION_STATES.includes(state), `${resource.id}: ${state}`);
    }
  }
});

test('las relaciones, recetas y comandos apuntan a recursos existentes', () => {
  for (const resource of LIBRARY_RESOURCES) {
    for (const related of resource.related || []) {
      assert.ok(RESOURCE_MAP.has(related), `${resource.id} -> ${related}`);
    }
  }

  for (const recipe of RECIPES) {
    for (const resourceId of recipe.defaultResources || []) {
      assert.ok(RESOURCE_MAP.has(resourceId), `${recipe.id} -> ${resourceId}`);
    }
  }

  for (const resource of LIBRARY_RESOURCES.filter((item) => item.type === 'command')) {
    if (resource.content?.skillId) {
      assert.ok(RESOURCE_MAP.has(resource.content.skillId), `${resource.id} -> ${resource.content.skillId}`);
    }
  }

  assert.ok(getCommand('review'));
  assert.ok(getCommand('security-review'));
  assert.equal(typeof getCommand('review').steps.length, 'number');
});

test('las recetas antiguas conservan compatibilidad y las nuevas tienen contenido específico', () => {
  assert.equal(RECIPES.length, 21);
  const oldRecipe = createProject({ recipeId: 'agents-md', description: 'Proyecto', id: 'old', now: 1 });
  assert.deepEqual(oldRecipe.resources, ['skill-context-package', 'skill-repo-inspection', 'command-context']);

  const idea = fillRequired(createProject({ recipeId: 'idea-requirements', description: 'Idea', id: 'idea', now: 1 }));
  const ideaArtifacts = buildArtifacts(idea);
  const ideaText = ideaArtifacts.map((artifact) => artifact.content).join('\n');
  assert.match(ideaText, /Brief/);
  assert.match(ideaText, /Criterios de aceptación/);
  assert.match(ideaText, /Decisiones pendientes/);

  const migration = fillRequired(createProject({ recipeId: 'migration', description: 'Migrar', id: 'migration', now: 1 }));
  const migrationText = buildArtifacts(migration).map((artifact) => artifact.content).join('\n');
  assert.match(migrationText, /Rollback/);
  assert.match(migrationText, /Compatibilidad/);

  const handoff = fillRequired(createProject({ recipeId: 'handoff', description: 'Handoff', id: 'handoff', now: 1 }));
  const handoffText = buildArtifacts(handoff).map((artifact) => artifact.content).join('\n');
  assert.match(handoffText, /Siguiente acción/);
  assert.match(handoffText, /Evidencia/);

  const security = fillRequired(createProject({ recipeId: 'security-review', description: 'Seguridad', id: 'security', now: 1 }));
  const securityText = buildArtifacts(security).map((artifact) => artifact.content).join('\n');
  assert.match(securityText, /no una certificación/);
  assert.match(securityText, /Aprobaciones propuestas/);
});

test('los recursos seleccionados generan referencias y un índice', () => {
  const project = fillRequired(createProject({ recipeId: 'idea-requirements', description: 'Idea', id: 'library', now: 1 }));
  project.artifacts = buildArtifacts(project);
  const paths = project.artifacts.map((artifact) => artifact.path);

  assert.ok(paths.includes('docs/library-index.md'));
  assert.ok(paths.some((path) => path.startsWith('library/skills/')));
  assert.ok(paths.some((path) => path.startsWith('library/registers/')));
  assert.ok(paths.some((path) => path.startsWith('library/templates/')));
  assert.ok(project.artifacts.find((artifact) => artifact.path === 'docs/library-index.md').content.includes('Biblioteca seleccionada'));

  const again = buildArtifacts(project);
  assert.deepEqual(again.map((artifact) => artifact.content), project.artifacts.map((artifact) => artifact.content));
});

test('un archivo de la biblioteca se genera en su ruta declarada', () => {
  const project = fillRequired(createProject({ recipeId: 'prompt-professional', description: 'Demo', id: 'file', now: 1 }));
  project.resources = ['file-env-example'];
  project.artifacts = buildArtifacts(project);
  const file = project.artifacts.find((artifact) => artifact.path === '.env.example');
  assert.ok(file);
  assert.match(file.content, /Proyecto/);
  assert.equal(validateProject(project).filter((validation) => validation.severity === 'error').length, 0);
});

test('un recurso desconocido se rechaza en la validación', () => {
  const project = createProject({ recipeId: 'prompt-professional', description: 'Demo', id: 'bad-resource', now: 1 });
  project.resources = ['resource-inexistente'];
  assert.ok(validateProject(project).some((validation) => validation.code === 'unknown-resource'));
});

test('la biblioteca incluye roles, skills, comandos, registros, paquetes y adaptadores', () => {
  const counts = LIBRARY_RESOURCES.reduce((result, resource) => {
    result[resource.type] = (result[resource.type] || 0) + 1;
    return result;
  }, {});

  assert.ok(counts.role >= 20);
  assert.ok(counts.skill >= 60);
  assert.ok(counts.command >= 35);
  assert.equal(counts.register, 14);
  assert.ok(counts.template >= 15);
  assert.equal(counts.package, 15);
  assert.ok(counts.adapter >= 7);
  assert.ok(counts.validator >= 5);
});
