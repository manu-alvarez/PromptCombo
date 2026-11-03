import test from 'node:test';
import assert from 'node:assert/strict';
import { RECIPES, TARGETS, getRecipe } from '../src/data/studio-recipes.js';
import { buildArtifacts } from '../src/core/generator.js';
import {
  changeRecipe,
  createProject,
  parseProjectJson,
  safeArtifactPath,
  serializeProject,
  validateProject
} from '../src/core/project.js';
import { interpretGoal } from '../src/core/studio-intent.js';
import { createZip, crc32 } from '../src/core/zip.js';
import { loadStudioState, saveStudioState } from '../src/core/project-store.js';

function fillRequired(project) {
  const recipe = getRecipe(project.recipeId);
  for (const question of recipe.questions) {
    if (String(project.values[question.id] || '').trim()) continue;
    project.values[question.id] = question.type === 'list'
      ? 'elemento uno\nelemento dos'
      : 'valor de prueba';
  }
  return project;
}

function createStorage() {
  const data = new Map();
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key)
  };
}

test('el catálogo de recetas declara familias, destinos y preguntas válidas', () => {
  assert.equal(RECIPES.length, 21);
  assert.equal(new Set(RECIPES.map((recipe) => recipe.id)).size, RECIPES.length);
  assert.equal(new Set(RECIPES.map((recipe) => recipe.family)).size, 8);

  for (const recipe of RECIPES) {
    assert.ok(recipe.questions.length > 0, recipe.id);
    assert.equal(new Set(recipe.questions.map((question) => question.id)).size, recipe.questions.length, recipe.id);
    for (const target of recipe.targets) assert.ok(TARGETS[target], `${recipe.id}: ${target}`);
    assert.ok(recipe.defaultTargets.every((target) => recipe.targets.includes(target)));
  }
});

test('todas las recetas generan artefactos deterministas sin errores', () => {
  for (const recipe of RECIPES) {
    const project = fillRequired(createProject({ recipeId: recipe.id, description: 'Objetivo de prueba', id: `test-${recipe.id}`, now: 1 }));
    project.targets = [...recipe.targets];
    project.artifacts = buildArtifacts(project);
    const validations = validateProject(project);
    const errors = validations.filter((validation) => validation.severity === 'error');

    assert.ok(project.artifacts.length > 0, recipe.id);
    assert.deepEqual(errors, [], `${recipe.id}: ${errors.map((error) => error.message).join('; ')}`);

    const again = buildArtifacts(project);
    assert.deepEqual(again.map((artifact) => artifact.path), project.artifacts.map((artifact) => artifact.path));
    assert.deepEqual(again.map((artifact) => artifact.content), project.artifacts.map((artifact) => artifact.content));
  }
});

test('los adaptadores de repositorio producen las rutas declaradas', () => {
  const project = fillRequired(createProject({ recipeId: 'agents-md', description: 'Proyecto demo', id: 'adapters', now: 1 }));
  project.targets = ['agents', 'cursor', 'claude', 'copilot'];
  project.artifacts = buildArtifacts(project);
  const paths = project.artifacts.map((artifact) => artifact.path);

  assert.ok(paths.includes('AGENTS.md'));
  assert.ok(paths.includes('.cursor/rules/project.mdc'));
  assert.ok(paths.includes('CLAUDE.md'));
  assert.ok(paths.includes('.github/copilot-instructions.md'));
  assert.ok(paths.includes('.github/instructions/project.instructions.md'));
  assert.ok(paths.includes('.github/prompts/review.prompt.md'));
  assert.match(project.artifacts.find((artifact) => artifact.path.endsWith('.mdc')).content, /^---\ndescription:/);
});

test('la extracción genera JSON válido y un esquema con required', () => {
  const project = fillRequired(createProject({ recipeId: 'structured-output', description: 'Extraer datos', id: 'structured', now: 1 }));
  project.artifacts = buildArtifacts(project);
  const jsonArtifacts = project.artifacts.filter((artifact) => artifact.path.endsWith('.json'));
  assert.ok(jsonArtifacts.length >= 3);

  for (const artifact of jsonArtifacts) {
    assert.doesNotThrow(() => JSON.parse(artifact.content), artifact.path);
  }

  const schema = JSON.parse(project.artifacts.find((artifact) => artifact.path.endsWith('.schema.json')).content);
  assert.equal(schema.type, 'object');
  assert.equal(schema.additionalProperties, false);
  assert.ok(Array.isArray(schema.required));
});

test('la skill conserva frontmatter y los tres archivos del paquete', () => {
  const project = fillRequired(createProject({ recipeId: 'skill-package', description: 'Revisar pull requests', id: 'skill', now: 1 }));
  project.artifacts = buildArtifacts(project);
  const paths = project.artifacts.map((artifact) => artifact.path);

  assert.ok(paths.includes('skills/review-pull-request/SKILL.md'));
  assert.ok(paths.includes('skills/review-pull-request/references/output-template.md'));
  assert.ok(paths.includes('skills/review-pull-request/assets/acceptance-checklist.md'));
  assert.ok(paths.includes('docs/library-index.md'));
  assert.match(project.artifacts[0].content, /^---\nname: review-pull-request\ndescription:/);
  assert.match(project.artifacts[0].content, /## Procedimiento/);
});

test('la interpretación local sugiere recetas y no inventa coincidencias', () => {
  assert.equal(interpretGoal('Necesito un AGENTS.md para Python').matches[0].recipe.id, 'agents-md');
  assert.equal(interpretGoal('Quiero una skill para revisar pull requests').matches[0].recipe.id, 'skill-package');
  assert.equal(interpretGoal('Quiero un dashboard con pantallas').matches[0].recipe.id, 'design-package');
  assert.equal(interpretGoal('Una cosa cualquiera sin términos').matches.length, 0);
});

test('el proyecto exportado se puede importar y conserva artefactos', () => {
  const project = fillRequired(createProject({ recipeId: 'project-structure', description: 'Proyecto demo', id: 'export', now: 1 }));
  project.artifacts = buildArtifacts(project);
  const serialized = serializeProject(project);
  const parsed = parseProjectJson(serialized);

  assert.equal(parsed.ok, true);
  assert.equal(parsed.project.id, 'export');
  assert.equal(parsed.project.artifacts.length, project.artifacts.length);
  assert.equal(parsed.project.values.goal, project.values.goal);
});

test('la importación rechaza JSON corrupto y rutas peligrosas', () => {
  assert.equal(parseProjectJson('{no-json').ok, false);
  assert.equal(parseProjectJson(JSON.stringify({ schemaVersion: 1, recipeId: 'nope', title: 'x', artifacts: [] })).ok, false);

  const project = fillRequired(createProject({ recipeId: 'prompt-professional', description: 'Demo', id: 'paths', now: 1 }));
  project.artifacts = [{ path: '../escape.md', format: 'markdown', content: 'x' }];
  assert.equal(safeArtifactPath('../escape.md'), null);
  assert.ok(validateProject(project).some((validation) => validation.code === 'invalid-path'));

  project.artifacts = [
    { path: 'a.md', format: 'markdown', content: 'x' },
    { path: 'a.md', format: 'markdown', content: 'y' }
  ];
  assert.ok(validateProject(project).some((validation) => validation.code === 'duplicate-path'));
});

test('cambiar de receta conserva valores compatibles y vacía artefactos', () => {
  const project = createProject({ recipeId: 'agents-md', description: 'Proyecto demo', id: 'change', now: 1 });
  project.values.goal = 'Proyecto demo';
  project.values.language = 'Python';
  project.artifacts = buildArtifacts(project);

  const changed = changeRecipe(project, 'skill-package', 2);
  assert.equal(changed.recipeId, 'skill-package');
  assert.equal(changed.values.goal, 'Proyecto demo');
  assert.equal(changed.values.projectName, 'Mi proyecto');
  assert.deepEqual(changed.artifacts, []);
});

test('el ZIP usa firmas válidas, CRC correcto y rechaza rutas duplicadas', () => {
  assert.equal(crc32(new TextEncoder().encode('123456789')), 0xcbf43926);
  const zip = createZip([{ path: 'a.txt', content: 'hola' }]);
  const view = new DataView(zip.buffer, zip.byteOffset, zip.byteLength);
  assert.equal(view.getUint32(0, true), 0x04034b50);
  assert.throws(() => createZip([{ path: '../x.txt', content: 'x' }]), /Ruta de ZIP/);
  assert.throws(() => createZip([
    { path: 'a.txt', content: 'x' },
    { path: 'a.txt', content: 'y' }
  ]), /duplicada/);
});

test('los proyectos se guardan y se recuperan del almacenamiento local', () => {
  const storage = createStorage();
  const project = fillRequired(createProject({ recipeId: 'prompt-professional', description: 'Demo', id: 'store', now: 1 }));
  project.artifacts = buildArtifacts(project);

  assert.equal(saveStudioState({ currentProject: project, savedProjects: [project] }, storage), true);
  const loaded = loadStudioState(storage);
  assert.equal(loaded.currentProject.id, 'store');
  assert.equal(loaded.savedProjects.length, 1);

  const broken = {
    getItem: () => '{bad',
    setItem: () => { throw new Error('blocked'); },
    removeItem: () => { throw new Error('blocked'); }
  };
  assert.deepEqual(loadStudioState(broken), { currentProject: null, savedProjects: [] });
  assert.equal(saveStudioState({ currentProject: project, savedProjects: [] }, broken), false);
});
