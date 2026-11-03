/* Modelo de proyecto, validación estructural y serialización. */
import { getRecipe } from '../data/studio-recipes.js';
import { getResource } from '../data/library-resources.js';
import { slugify } from './format.js';

export const PROJECT_SCHEMA_VERSION = 1;
export const MAX_ARTIFACTS = 80;
export const MAX_ARTIFACT_BYTES = 500_000;
export const MAX_PROJECT_BYTES = 2_000_000;

function nowValue(now) {
  return typeof now === 'number' ? now : Date.now();
}

function makeId() {
  try {
    if (globalThis.crypto?.randomUUID) return `project-${globalThis.crypto.randomUUID()}`;
  } catch {
    // Fallback para entornos sin crypto.
  }
  return `project-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createProject({ recipeId, description = '', id, now } = {}) {
  const recipe = getRecipe(recipeId);
  if (!recipe) throw new Error(`Receta desconocida: ${recipeId}`);

  const timestamp = nowValue(now);
  const values = {};
  const defaultedFields = [];

  for (const question of recipe.questions) {
    if (question.default !== undefined) {
      values[question.id] = String(question.default);
      defaultedFields.push(question.id);
    } else {
      values[question.id] = '';
    }
  }

  if (description.trim()) {
    values.goal = description.trim();
    const index = defaultedFields.indexOf('goal');
    if (index !== -1) defaultedFields.splice(index, 1);

    const descriptionTargets = {
      'prompt-professional': 'task',
      'prompt-research': 'topic',
      'skill-package': 'purpose',
      'agent-contract': 'mission',
      'review-testing': 'scope'
    };
    const target = descriptionTargets[recipe.id];
    if (target && !values[target]) values[target] = description.trim();
  }

  values.projectName = 'Mi proyecto';

  return {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    id: id || makeId(),
    title: values.projectName || recipe.title,
    description: description.trim(),
    locale: 'es',
    recipeId: recipe.id,
    targets: [...recipe.defaultTargets],
    resources: [...(recipe.defaultResources || [])],
    values,
    defaultedFields,
    artifacts: [],
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

export function touchProject(project, now) {
  project.updatedAt = nowValue(now);
  return project;
}

export function markArtifactsStale(project) {
  for (const artifact of project.artifacts) {
    artifact.stale = true;
  }
  return project;
}

export function changeRecipe(project, recipeId, now) {
  const recipe = getRecipe(recipeId);
  if (!recipe) throw new Error(`Receta desconocida: ${recipeId}`);

  const previousValues = project.values || {};
  const values = {};
  const defaultedFields = [];

  for (const question of recipe.questions) {
    if (Object.hasOwn(previousValues, question.id) && previousValues[question.id] !== '') {
      values[question.id] = previousValues[question.id];
    } else if (question.default !== undefined) {
      values[question.id] = String(question.default);
      defaultedFields.push(question.id);
    } else {
      values[question.id] = '';
    }
  }

  if (previousValues.goal) values.goal = previousValues.goal;
  values.projectName = previousValues.projectName || 'Mi proyecto';

  return {
    ...project,
    title: values.projectName || recipe.title,
    recipeId: recipe.id,
    targets: [...recipe.defaultTargets],
    resources: [...new Set([...(project.resources || []).filter((id) => getResource(id)), ...(recipe.defaultResources || [])])],
    values,
    defaultedFields,
    artifacts: [],
    updatedAt: nowValue(now)
  };
}

export function safeArtifactPath(value) {
  if (typeof value !== 'string') return null;

  const normalized = value.replaceAll('\\', '/').trim();
  if (!normalized || normalized.length > 200) return null;
  if (normalized.startsWith('/') || /^[A-Za-z]:/.test(normalized)) return null;
  if (/[\u0000-\u001f\u007f]/.test(normalized)) return null;

  const segments = normalized.split('/');
  if (segments.some((segment) => !segment || segment === '.' || segment === '..')) return null;
  if (segments.some((segment) => /[. ]$/.test(segment) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/i.test(segment))) return null;

  return segments.join('/');
}

function byteLength(value) {
  return new TextEncoder().encode(String(value)).length;
}

function validateJsonArtifact(artifact, errors) {
  if (artifact.format !== 'json' && !artifact.path.endsWith('.json')) return;

  try {
    JSON.parse(artifact.content);
  } catch {
    errors.push({
      severity: 'error',
      code: 'invalid-json',
      path: artifact.path,
      message: 'El archivo no contiene JSON válido.'
    });
  }
}

function validateFrontmatter(artifact, errors) {
  const isSkill = artifact.path.endsWith('SKILL.md');
  const needsFrontmatter = artifact.path.endsWith('.mdc') || isSkill;
  if (!needsFrontmatter) return;

  const content = artifact.content.trimStart();
  if (!content.startsWith('---')) {
    errors.push({
      severity: 'warning',
      code: 'missing-frontmatter',
      path: artifact.path,
      message: 'El formato esperado usa frontmatter YAML al inicio.'
    });
    return;
  }

  const end = content.indexOf('\n---', 3);
  if (end === -1) {
    errors.push({
      severity: 'error',
      code: 'unclosed-frontmatter',
      path: artifact.path,
      message: 'El frontmatter no tiene cierre.'
    });
    return;
  }

  const block = content.slice(3, end);
  if (isSkill && !/^\s*name\s*:/m.test(block)) {
    errors.push({
      severity: 'warning',
      code: 'missing-name',
      path: artifact.path,
      message: 'El frontmatter no declara name.'
    });
  }
  if (!/^\s*description\s*:/m.test(block)) {
    errors.push({
      severity: 'warning',
      code: 'missing-description',
      path: artifact.path,
      message: 'El frontmatter no declara description.'
    });
  }
}

function validateMarkdownLinks(artifact, artifactPaths, validations) {
  if (artifact.format !== 'markdown' || !artifact.path.endsWith('.md')) return;

  const linkPattern = /\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let match;

  while ((match = linkPattern.exec(artifact.content)) !== null) {
    const target = match[1];
    if (!target || /^(https?:|mailto:|#)/i.test(target)) continue;
    if (target.startsWith('data:')) continue;

    const base = artifact.path.includes('/')
      ? artifact.path.slice(0, artifact.path.lastIndexOf('/'))
      : '';
    const resolved = target.replace(/^\.\//, '').startsWith('../')
      ? target
      : `${base ? `${base}/` : ''}${target.replace(/^\.\//, '')}`;

    const normalized = resolved.replace(/\/+/g, '/').replace(/^\.\//, '');
    if (!artifactPaths.has(normalized)) {
      validations.push({
        severity: 'warning',
        code: 'missing-link-target',
        path: artifact.path,
        message: `El enlace ${target} no coincide con un archivo del paquete.`
      });
    }
  }
}

export function validateProject(project) {
  const validations = [];
  const recipe = getRecipe(project?.recipeId);

  if (!project || typeof project !== 'object') {
    return [{ severity: 'error', code: 'invalid-project', message: 'El proyecto no es válido.' }];
  }

  if (project.schemaVersion !== PROJECT_SCHEMA_VERSION) {
    validations.push({
      severity: 'error',
      code: 'schema-version',
      message: `Versión de esquema no soportada: ${project.schemaVersion}.`
    });
  }

  if (!recipe) {
    validations.push({
      severity: 'error',
      code: 'unknown-recipe',
      message: 'La receta seleccionada no existe.'
    });
  }

  if (!project.title || !String(project.title).trim()) {
    validations.push({ severity: 'error', code: 'missing-title', message: 'El proyecto necesita un título.' });
  }

  if (!project.values || typeof project.values !== 'object' || Array.isArray(project.values)) {
    validations.push({ severity: 'error', code: 'invalid-values', message: 'Los valores del proyecto no son válidos.' });
  } else if (recipe) {
    for (const question of recipe.questions) {
      if (!question.required) continue;
      if (!String(project.values[question.id] || '').trim()) {
        validations.push({
          severity: 'error',
          code: 'missing-variable',
          path: question.id,
          message: `Falta el campo obligatorio: ${question.label}.`
        });
      }
    }
  }

  if (recipe && !Array.isArray(project.targets)) {
    validations.push({ severity: 'error', code: 'invalid-targets', message: 'Los destinos no son una lista válida.' });
  } else if (recipe) {
    const invalidTargets = (project.targets || []).filter((target) => !recipe.targets.includes(target));
    if (invalidTargets.length > 0) {
      validations.push({
        severity: 'error',
        code: 'incompatible-target',
        message: `Destinos incompatibles con la receta: ${invalidTargets.join(', ')}.`
      });
    }
  }

  if (!Array.isArray(project.resources)) {
    validations.push({ severity: 'error', code: 'invalid-resources', message: 'Los recursos no son una lista válida.' });
  } else {
    const seenResources = new Set();
    for (const resourceId of project.resources) {
      if (typeof resourceId !== 'string' || !getResource(resourceId)) {
        validations.push({
          severity: 'error',
          code: 'unknown-resource',
          message: `Recurso desconocido: ${resourceId}.`
        });
      } else if (seenResources.has(resourceId)) {
        validations.push({
          severity: 'warning',
          code: 'duplicate-resource',
          message: `Recurso duplicado: ${resourceId}.`
        });
      }
      seenResources.add(resourceId);
    }
    if (project.resources.length > 80) {
      validations.push({ severity: 'error', code: 'too-many-resources', message: 'El proyecto supera el límite de recursos.' });
    }
  }

  if (!Array.isArray(project.artifacts)) {
    validations.push({ severity: 'error', code: 'invalid-artifacts', message: 'Los artefactos no son una lista válida.' });
    return validations;
  }

  if (project.artifacts.length > MAX_ARTIFACTS) {
    validations.push({
      severity: 'error',
      code: 'too-many-artifacts',
      message: `El proyecto supera el límite de ${MAX_ARTIFACTS} archivos.`
    });
  }

  const paths = new Set();
  const lowerPaths = new Set();
  const missingKeys = new Set(
    validations
      .filter((validation) => validation.code === 'missing-variable')
      .map((validation) => validation.path)
  );
  let totalBytes = 0;

  for (const artifact of project.artifacts) {
    if (!artifact || typeof artifact !== 'object') {
      validations.push({ severity: 'error', code: 'invalid-artifact', message: 'Hay un artefacto inválido.' });
      continue;
    }

    const safePath = safeArtifactPath(artifact.path);
    if (!safePath) {
      validations.push({
        severity: 'error',
        code: 'invalid-path',
        path: artifact.path,
        message: 'La ruta no es relativa, segura o válida.'
      });
      continue;
    }

    if (artifact.path !== safePath) {
      validations.push({
        severity: 'warning',
        code: 'normalized-path',
        path: artifact.path,
        message: `La ruta se normalizará a ${safePath}.`
      });
    }

    if (paths.has(safePath)) {
      validations.push({
        severity: 'error',
        code: 'duplicate-path',
        path: safePath,
        message: 'Hay dos archivos con la misma ruta.'
      });
    }
    const lower = safePath.toLowerCase();
    if (lowerPaths.has(lower) && !paths.has(safePath)) {
      validations.push({
        severity: 'warning',
        code: 'path-case-collision',
        path: safePath,
        message: 'Hay rutas que podrían colisionar en un sistema de archivos insensible a mayúsculas.'
      });
    }
    paths.add(safePath);
    lowerPaths.add(lower);

    if (typeof artifact.content !== 'string') {
      validations.push({
        severity: 'error',
        code: 'invalid-content',
        path: safePath,
        message: 'El contenido no es texto.'
      });
      continue;
    }

    const size = byteLength(artifact.content);
    totalBytes += size;
    if (size > MAX_ARTIFACT_BYTES) {
      validations.push({
        severity: 'error',
        code: 'artifact-too-large',
        path: safePath,
        message: 'El archivo supera el límite de tamaño.'
      });
    }

    if (artifact.stale) {
      validations.push({
        severity: 'warning',
        code: 'stale-artifact',
        path: safePath,
        message: 'El archivo está desactualizado respecto a los requisitos actuales.'
      });
    }

    if (Array.isArray(artifact.pendingVariables) && artifact.pendingVariables.length > 0) {
      const requiredKeys = new Set((recipe?.questions || []).filter((question) => question.required).map((question) => question.id));
      const pending = [...new Set(artifact.pendingVariables)].filter((key) => !missingKeys.has(key));
      const requiredPending = pending.filter((key) => requiredKeys.has(key));
      if (pending.length > 0) {
        validations.push({
          severity: requiredPending.length > 0 ? 'error' : 'warning',
          code: 'pending-placeholder',
          path: safePath,
          message: `Quedan variables pendientes: ${pending.join(', ')}.`
        });
      }
    }

    validateJsonArtifact(artifact, validations);
    validateFrontmatter(artifact, validations);
  }

  if (totalBytes > MAX_PROJECT_BYTES) {
    validations.push({
      severity: 'error',
      code: 'project-too-large',
      message: 'El proyecto supera el límite total de tamaño.'
    });
  }

  for (const artifact of project.artifacts) {
    if (artifact?.content) validateMarkdownLinks(artifact, paths, validations);
  }

  if (project.artifacts.length === 0) {
    validations.push({
      severity: 'info',
      code: 'no-artifacts',
      message: 'Todavía no se han generado archivos.'
    });
  }

  return validations;
}

export function summarizeValidation(validations) {
  return validations.reduce((summary, validation) => {
    summary[validation.severity] += 1;
    return summary;
  }, { error: 0, warning: 0, info: 0 });
}

export function serializeProject(project) {
  return JSON.stringify({
    schemaVersion: PROJECT_SCHEMA_VERSION,
    id: project.id,
    title: project.title || project.values?.projectName || 'Mi proyecto',
    description: project.description,
    locale: project.locale || 'es',
    recipeId: project.recipeId,
    targets: Array.isArray(project.targets) ? project.targets : [],
    resources: Array.isArray(project.resources) ? project.resources : [],
    values: project.values || {},
    defaultedFields: Array.isArray(project.defaultedFields) ? project.defaultedFields : [],
    artifacts: (project.artifacts || []).map((artifact) => ({
      id: artifact.id || artifact.path,
      path: artifact.path,
      format: artifact.format || 'text',
      content: artifact.content,
      sourceTemplate: artifact.sourceTemplate || project.recipeId,
      sourceVersion: artifact.sourceVersion || '1.0',
      editedByUser: Boolean(artifact.editedByUser),
      stale: Boolean(artifact.stale),
      pendingVariables: Array.isArray(artifact.pendingVariables) ? artifact.pendingVariables : []
    })),
    createdAt: project.createdAt,
    updatedAt: project.updatedAt
  }, null, 2);
}

export function parseProjectJson(text) {
  if (typeof text !== 'string' || byteLength(text) > MAX_PROJECT_BYTES) {
    return { ok: false, project: null, errors: ['El archivo es demasiado grande o no es texto.'] };
  }

  let raw;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, project: null, errors: ['El archivo no contiene JSON válido.'] };
  }

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, project: null, errors: ['El proyecto debe ser un objeto JSON.'] };
  }

  if (raw.schemaVersion !== PROJECT_SCHEMA_VERSION) {
    return { ok: false, project: null, errors: ['La versión del proyecto no es compatible.'] };
  }

  const recipe = getRecipe(raw.recipeId);
  if (!recipe) return { ok: false, project: null, errors: ['La receta del proyecto no existe.'] };
  if (typeof raw.title !== 'string' || !raw.title.trim()) {
    return { ok: false, project: null, errors: ['El proyecto no tiene título.'] };
  }
  if (!Array.isArray(raw.artifacts) || raw.artifacts.length > MAX_ARTIFACTS) {
    return { ok: false, project: null, errors: ['La lista de artefactos no es válida.'] };
  }

  const project = {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    id: typeof raw.id === 'string' && raw.id ? raw.id.slice(0, 120) : makeId(),
    title: raw.title.slice(0, 200),
    description: typeof raw.description === 'string' ? raw.description.slice(0, 4000) : '',
    locale: 'es',
    recipeId: recipe.id,
    targets: Array.isArray(raw.targets)
      ? raw.targets.filter((target) => recipe.targets.includes(target))
      : [...recipe.defaultTargets],
    resources: Array.isArray(raw.resources)
      ? [...new Set(raw.resources.filter((id) => typeof id === 'string' && getResource(id)))].slice(0, 80)
      : [],
    values: {},
    defaultedFields: Array.isArray(raw.defaultedFields) ? raw.defaultedFields.filter((field) => typeof field === 'string') : [],
    artifacts: [],
    createdAt: Number.isFinite(raw.createdAt) ? raw.createdAt : Date.now(),
    updatedAt: Number.isFinite(raw.updatedAt) ? raw.updatedAt : Date.now()
  };

  if (project.targets.length === 0) project.targets = [...recipe.defaultTargets];

  if (raw.values && typeof raw.values === 'object' && !Array.isArray(raw.values)) {
    for (const [key, value] of Object.entries(raw.values)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
      if (typeof value === 'string') project.values[key] = value.slice(0, 20_000);
      else if (typeof value === 'number' || typeof value === 'boolean') project.values[key] = String(value);
    }
  }

  if (!project.values.projectName) project.values.projectName = project.title;
  if (!project.values.goal && project.description) project.values.goal = project.description;

  let invalidArtifact = false;

  for (const artifact of raw.artifacts) {
    if (!artifact || typeof artifact !== 'object') {
      invalidArtifact = true;
      continue;
    }
    const safePath = safeArtifactPath(artifact.path);
    if (!safePath || typeof artifact.content !== 'string' || artifact.content.length > MAX_ARTIFACT_BYTES) {
      invalidArtifact = true;
      continue;
    }
    project.artifacts.push({
      id: safePath,
      path: safePath,
      format: typeof artifact.format === 'string' ? artifact.format.slice(0, 30) : 'text',
      content: artifact.content,
      sourceTemplate: typeof artifact.sourceTemplate === 'string' ? artifact.sourceTemplate.slice(0, 80) : recipe.id,
      sourceVersion: typeof artifact.sourceVersion === 'string' ? artifact.sourceVersion.slice(0, 20) : recipe.version,
      editedByUser: Boolean(artifact.editedByUser),
      stale: Boolean(artifact.stale),
      pendingVariables: Array.isArray(artifact.pendingVariables)
        ? artifact.pendingVariables.filter((item) => typeof item === 'string').slice(0, 50)
        : []
    });
  }

  if (invalidArtifact) {
    return { ok: false, project: null, errors: ['El proyecto contiene artefactos con ruta o contenido inválido.'] };
  }

  const validations = validateProject(project);
  return { ok: true, project, errors: [], validations };
}

export function projectFileName(project) {
  return `promptcombo-${slugify(project.title || 'proyecto')}.json`;
}

export function artifactFileName(path) {
  const safe = safeArtifactPath(path) || 'archivo.txt';
  return safe.split('/').pop();
}
