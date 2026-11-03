/* Generador guiado: creación, proyecto, archivos, validación y exportación. */
import { FAMILIES, RECIPES, TARGETS, getRecipe } from '../data/studio-recipes.js';
import { buildArtifacts } from '../core/generator.js';
import {
  artifactFileName,
  changeRecipe,
  createProject,
  markArtifactsStale,
  parseProjectJson,
  projectFileName,
  serializeProject,
  summarizeValidation,
  touchProject,
  validateProject
} from '../core/project.js';
import { loadStudioState, saveStudioState } from '../core/project-store.js';
import { getStorage } from '../core/persistence.js';
import { copyText } from '../core/clipboard.js';
import { downloadBlob, downloadText } from '../core/download.js';
import { createZip } from '../core/zip.js';
import { escapeHTML, formatCount, normalizeSearch, slugify } from '../core/format.js';
import { interpretGoal } from '../core/studio-intent.js';
import { showToast } from './toasts.js';

const EXAMPLES = [
  ['Quiero un AGENTS.md para un proyecto Python.', 'AGENTS.md Python'],
  ['Necesito una skill para revisar pull requests.', 'Skill de revisión'],
  ['Quiero un prompt para investigar competidores.', 'Prompt de investigación'],
  ['Necesito el brief y las pantallas de un dashboard.', 'Dashboard'],
  ['Quiero la estructura de una app con frontend y API.', 'Estructura fullstack'],
  ['Quiero un paquete con prompt, esquema JSON y casos de prueba.', 'Prompt + JSON']
];

const state = {
  project: null,
  saved: [],
  view: 'create',
  goal: '',
  templateQuery: '',
  familyFilter: 'all',
  selectedArtifact: null,
  saveTimer: null,
  storageWarned: false
};

function byId(id) {
  const node = document.getElementById(id);
  if (!node) throw new Error(`[PromptCombo] Falta el nodo #${id} del generador.`);
  return node;
}

const els = {
  studio: byId('studio'),
  workspace: document.querySelector('.workspace'),
  studioGoal: byId('studioGoal'),
  studioExamples: byId('studioExamples'),
  analyzeGoalBtn: byId('analyzeGoalBtn'),
  goalSuggestion: byId('goalSuggestion'),
  familyGrid: byId('familyGrid'),
  templateSearch: byId('templateSearch'),
  templateSearchClear: byId('templateSearchClear'),
  templateFilters: byId('templateFilters'),
  templateGrid: byId('templateGrid'),
  templateEmpty: byId('templateEmpty'),
  templateResetBtn: byId('templateResetBtn'),
  projectEmpty: byId('projectEmpty'),
  projectWorkspace: byId('projectWorkspace'),
  projectFamily: byId('projectFamily'),
  projectHeading: byId('projectHeading'),
  projectTitle: byId('projectTitle'),
  projectRecipe: byId('projectRecipe'),
  recipeSelect: byId('recipeSelect'),
  newProjectBtn: byId('newProjectBtn'),
  saveProjectBtn: byId('saveProjectBtn'),
  projectProgress: byId('projectProgress'),
  projectMissing: byId('projectMissing'),
  projectQuestions: byId('projectQuestions'),
  projectTargets: byId('projectTargets'),
  generateBtn: byId('generateBtn'),
  regenerateAllBtn: byId('regenerateAllBtn'),
  validationSummary: byId('validationSummary'),
  validationList: byId('validationList'),
  downloadZipBtn: byId('downloadZipBtn'),
  exportProjectBtn: byId('exportProjectBtn'),
  artifactCount: byId('artifactCount'),
  artifactList: byId('artifactList'),
  artifactEmpty: byId('artifactEmpty'),
  artifactPane: byId('artifactPane'),
  artifactPath: byId('artifactPath'),
  artifactBadges: byId('artifactBadges'),
  artifactEditor: byId('artifactEditor'),
  copyArtifactBtn: byId('copyArtifactBtn'),
  downloadArtifactBtn: byId('downloadArtifactBtn'),
  regenerateArtifactBtn: byId('regenerateArtifactBtn'),
  restoreArtifactBtn: byId('restoreArtifactBtn'),
  artifactValidation: byId('artifactValidation'),
  savedProjects: byId('savedProjects'),
  savedEmpty: byId('savedEmpty'),
  importProjectBtn: byId('importProjectBtn'),
  importProjectInput: byId('importProjectInput'),
  sessionMeta: document.getElementById('sessionMeta')
};

const navButtons = [...document.querySelectorAll('.mode-tab')];
const panels = [...document.querySelectorAll('[data-studio-panel]')];

function familyTitle(id) {
  return FAMILIES.find((family) => family.id === id)?.title || id;
}

function targetLabel(id) {
  return TARGETS[id]?.label || id;
}

function targetNote(id) {
  return TARGETS[id]?.note || '';
}

function formatDate(timestamp) {
  if (!Number.isFinite(timestamp)) return 'Sin fecha';
  try {
    return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(timestamp));
  } catch {
    return 'Sin fecha';
  }
}

function mimeForFormat(format) {
  if (format === 'json') return 'application/json;charset=utf-8';
  if (format === 'mdc' || format === 'markdown') return 'text/markdown;charset=utf-8';
  return 'text/plain;charset=utf-8';
}

function updateSessionMeta() {
  if (!els.sessionMeta) return;
  if (state.view === 'advanced') return;
  els.sessionMeta.textContent = state.project
    ? `${formatCount(state.project.artifacts.length, 'archivo', 'archivos')} · proyecto`
    : 'Sin proyecto';
}

function setView(view) {
  if (!['create', 'templates', 'project', 'saved', 'advanced'].includes(view)) return;
  state.view = view;

  for (const button of navButtons) {
    button.classList.toggle('is-active', button.dataset.view === view);
    button.setAttribute('aria-current', button.dataset.view === view ? 'page' : 'false');
  }

  const advanced = view === 'advanced';
  els.studio.hidden = advanced;
  els.workspace.hidden = !advanced;

  for (const panel of panels) {
    panel.hidden = panel.dataset.studioPanel !== view;
  }

  if (advanced) {
    document.body.dataset.view = 'advanced';
    return;
  }

  document.body.dataset.view = 'studio';
  updateSessionMeta();

  if (view === 'templates') renderTemplates();
  if (view === 'project') renderProject();
  if (view === 'saved') renderSaved();
  if (view === 'create') {
    renderExamples();
    renderFamilies();
  }
}

export function showStudioView(view) {
  setView(view);
}

export function initStudio() {
  renderExamples();
  renderFamilies();
  renderFilters();
  renderRecipeSelect();
  bindStudioEvents();

  const loaded = loadStudioState();
  state.project = loaded.currentProject;
  state.saved = loaded.savedProjects;

  setView(state.project ? 'project' : 'create');

  if (!getStorage()) {
    showToast('El almacenamiento local no está disponible. Los proyectos no se guardarán al cerrar.', {
      tone: 'error',
      duration: 6000
    });
  }
}

function renderExamples() {
  els.studioExamples.innerHTML = EXAMPLES.map(([text, label]) =>
    `<button class="example-chip" type="button" data-example="${escapeHTML(text)}">${escapeHTML(label)}</button>`
  ).join('');
}

function renderFamilies() {
  els.familyGrid.innerHTML = FAMILIES.map((family) => {
    const count = RECIPES.filter((recipe) => recipe.family === family.id).length;
    return `<button class="family-card" type="button" data-family="${escapeHTML(family.id)}">
      <span class="family-count">${count} ${count === 1 ? 'receta' : 'recetas'}</span>
      <span class="family-title">${escapeHTML(family.title)}</span>
      <span class="family-copy">${escapeHTML(family.description)}</span>
    </button>`;
  }).join('');
}

function renderFilters() {
  const options = [['all', 'Todas'], ...FAMILIES.map((family) => [family.id, family.title])];
  els.templateFilters.innerHTML = options.map(([value, label]) =>
    `<button class="chip-button${state.familyFilter === value ? ' is-active' : ''}" type="button" data-filter-family="${escapeHTML(value)}">${escapeHTML(label)}</button>`
  ).join('');
}

function renderTemplates() {
  const query = normalizeSearch(state.templateQuery);
  const filtered = RECIPES.filter((recipe) => {
    if (state.familyFilter !== 'all' && recipe.family !== state.familyFilter) return false;
    if (!query) return true;
    const searchable = normalizeSearch([
      recipe.title,
      recipe.summary,
      recipe.description,
      recipe.example,
      recipe.keywords.join(' '),
      familyTitle(recipe.family),
      recipe.targets.map(targetLabel).join(' ')
    ].join(' '));
    return searchable.includes(query);
  });

  els.templateGrid.innerHTML = filtered.map((recipe) =>
    `<button class="template-card" type="button" data-start="${escapeHTML(recipe.id)}">
      <span class="template-family">${escapeHTML(familyTitle(recipe.family))}</span>
      <span class="template-title">${escapeHTML(recipe.title)}</span>
      <span class="template-copy">${escapeHTML(recipe.summary)}</span>
      <span class="template-targets">${recipe.targets.map((target) => `<span class="target-tag">${escapeHTML(targetLabel(target))}</span>`).join('')}</span>
      <span class="template-example">${escapeHTML(recipe.example)}</span>
    </button>`
  ).join('');

  els.templateEmpty.hidden = filtered.length !== 0;
  els.templateSearchClear.hidden = state.templateQuery.length === 0;
  if (document.activeElement !== els.templateSearch) els.templateSearch.value = state.templateQuery;
}

function renderRecipeSelect() {
  els.recipeSelect.innerHTML = RECIPES.map((recipe) =>
    `<option value="${escapeHTML(recipe.id)}">${escapeHTML(recipe.title)}</option>`
  ).join('');
}

function analyzeGoal() {
  const text = els.studioGoal.value.trim();
  state.goal = text;

  if (!text) {
    showToast('Describe qué quieres crear para recibir una sugerencia.', { duration: 2400 });
    els.studioGoal.focus();
    return;
  }

  const { matches } = interpretGoal(text);
  els.goalSuggestion.hidden = false;

  if (matches.length === 0) {
    els.goalSuggestion.innerHTML = `<p class="suggestion-title">No hay una coincidencia clara</p>
      <p class="suggestion-copy">No voy a inventar una interpretación. Revisa las plantillas o elige una familia de entregables.</p>
      <div class="suggestion-actions">
        <button class="ui-button ghost" type="button" data-view="templates">Ver plantillas</button>
        <button class="text-button" type="button" data-view="create">Cambiar la descripción</button>
      </div>`;
    return;
  }

  const [best, ...alternatives] = matches;
  const alternativeButtons = alternatives.map(({ recipe }) =>
    `<button class="chip-button" type="button" data-start="${escapeHTML(recipe.id)}">${escapeHTML(recipe.title)}</button>`
  ).join('');

  els.goalSuggestion.innerHTML = `<p class="suggestion-title">Sugerencia: ${escapeHTML(best.recipe.title)}</p>
    <p class="suggestion-copy">${escapeHTML(best.recipe.summary)} Coincidencia orientativa por palabras clave; puedes cambiarla.</p>
    <div class="suggestion-actions">
      <button class="ui-button primary" type="button" data-start="${escapeHTML(best.recipe.id)}">Usar esta plantilla</button>
      ${alternativeButtons}
      <button class="text-button" type="button" data-view="templates">Ver todas</button>
    </div>`;
}

function startRecipe(recipeId) {
  const recipe = getRecipe(recipeId);
  if (!recipe) return;

  if (state.project && (state.project.artifacts.length > 0 || state.project.values?.goal)) {
    saveCurrentToSaved(false);
  }

  state.project = createProject({
    recipeId,
    description: els.studioGoal.value.trim() || state.goal
  });
  state.selectedArtifact = null;
  setView('project');
  window.requestAnimationFrame(() => els.projectTitle.focus({ preventScroll: true }));
  scheduleSave();
  showToast(`Plantilla cargada: ${recipe.title}`, { duration: 1800 });
}

function saveCurrentToSaved(notify = true) {
  if (!state.project) return false;
  touchProject(state.project);

  const copy = JSON.parse(serializeProject(state.project));
  state.saved = [copy, ...state.saved.filter((project) => project.id !== copy.id)].slice(0, 50);
  const saved = persistNow();

  if (notify) {
    showToast(saved ? 'Proyecto guardado en este navegador' : 'No se pudo guardar el proyecto', {
      tone: saved ? 'success' : 'error',
      duration: 2200
    });
  }

  renderSaved();
  return saved;
}

function persistNow() {
  const saved = saveStudioState({ currentProject: state.project, savedProjects: state.saved });
  if (!saved && !state.storageWarned) {
    state.storageWarned = true;
    showToast('No se pudo escribir en el almacenamiento local. El proyecto sigue en memoria.', {
      tone: 'error',
      duration: 5200
    });
  }
  return saved;
}

function scheduleSave() {
  if (state.saveTimer) window.clearTimeout(state.saveTimer);
  state.saveTimer = window.setTimeout(() => {
    state.saveTimer = null;
    persistNow();
  }, 350);
}

function flushSave() {
  if (state.saveTimer) {
    window.clearTimeout(state.saveTimer);
    state.saveTimer = null;
  }
  if (state.project) persistNow();
}

function renderProject() {
  if (!state.project) {
    els.projectEmpty.hidden = false;
    els.projectWorkspace.hidden = true;
    updateSessionMeta();
    return;
  }

  els.projectEmpty.hidden = true;
  els.projectWorkspace.hidden = false;

  const recipe = getRecipe(state.project.recipeId);
  els.projectFamily.textContent = recipe ? familyTitle(recipe.family) : 'PROYECTO';
  els.projectRecipe.textContent = recipe ? `${recipe.title} · v${recipe.version}` : 'Plantilla no encontrada';
  els.projectTitle.value = state.project.title || '';
  els.projectHeading.textContent = `Proyecto: ${state.project.title || 'sin título'}`;
  els.recipeSelect.value = state.project.recipeId;

  renderQuestions();
  renderTargets();
  refreshProjectDerived();
  updateSessionMeta();
}

function questionError(question) {
  if (!state.project) return null;
  return validateProject(state.project).find((validation) =>
    validation.code === 'missing-variable' && validation.path === question.id
  );
}

function renderQuestions() {
  const recipe = getRecipe(state.project?.recipeId);
  if (!recipe) {
    els.projectQuestions.innerHTML = '';
    return;
  }

  els.projectQuestions.innerHTML = recipe.questions.map((question) => {
    const value = state.project.values[question.id] ?? '';
    const defaulted = state.project.defaultedFields?.includes(question.id);
    const error = questionError(question);
    const fieldId = `q-${question.id}`;
    const wide = question.type === 'textarea' || question.type === 'list';
    const helpId = `${fieldId}-help`;
    const errorId = `${fieldId}-error`;
    const describedIds = [question.type === 'boolean' ? '' : helpId, error ? errorId : ''].filter(Boolean).join(' ');
    const describedAttr = describedIds ? ` aria-describedby="${describedIds}"` : '';
    const invalidAttr = error ? ' aria-invalid="true"' : '';
    const requiredAttr = question.required ? ' required aria-required="true"' : '';
    const maxLength = question.type === 'textarea' || question.type === 'list' ? 20_000 : 4_000;
    const required = question.required ? '<span class="field-required" aria-hidden="true">*</span>' : '';
    const defaultBadge = defaulted ? '<span class="field-default">Predeterminado</span>' : '';
    const example = question.example ? ` Ejemplo: ${escapeHTML(question.example)}` : '';
    const help = `<p class="field-help" id="${helpId}">${escapeHTML(question.help || '')}${example}</p>`;
    let field;

    if (question.type === 'select') {
      field = `<select id="${fieldId}" data-question="${escapeHTML(question.id)}"${describedAttr}${invalidAttr}${requiredAttr}>
        ${question.options.map(([optionValue, optionLabel]) =>
          `<option value="${escapeHTML(optionValue)}"${value === optionValue ? ' selected' : ''}>${escapeHTML(optionLabel)}</option>`
        ).join('')}
      </select>`;
    } else if (question.type === 'boolean') {
      field = `<label class="studio-check"><input id="${fieldId}" type="checkbox" data-question="${escapeHTML(question.id)}"${invalidAttr}${value === 'true' ? ' checked' : ''}> ${escapeHTML(question.help || question.label)}</label>`;
    } else if (question.type === 'textarea' || question.type === 'list') {
      field = `<textarea id="${fieldId}" rows="${question.rows || 2}" maxlength="${maxLength}" data-question="${escapeHTML(question.id)}"${describedAttr}${invalidAttr}${requiredAttr}>${escapeHTML(value)}</textarea>`;
    } else {
      field = `<input id="${fieldId}" type="text" maxlength="${maxLength}" data-question="${escapeHTML(question.id)}" value="${escapeHTML(value)}"${describedAttr}${invalidAttr}${requiredAttr}>`;
    }

    return `<div class="studio-field${wide ? ' is-wide' : ''}${error ? ' has-error' : ''}" data-field="${escapeHTML(question.id)}">
      <label for="${fieldId}">${escapeHTML(question.label)}${required}${defaultBadge}</label>
      ${field}
      ${question.type === 'boolean' ? '' : help}
      ${error ? `<p class="field-error" id="${errorId}">${escapeHTML(error.message)}</p>` : ''}
    </div>`;
  }).join('');
}

function renderTargets() {
  const recipe = getRecipe(state.project?.recipeId);
  if (!recipe) {
    els.projectTargets.innerHTML = '';
    return;
  }

  els.projectTargets.innerHTML = recipe.targets.map((target) => {
    const checked = state.project.targets.includes(target);
    return `<label class="target-option">
      <input type="checkbox" data-target="${escapeHTML(target)}"${checked ? ' checked' : ''}>
      <span><strong>${escapeHTML(targetLabel(target))}</strong><small>${escapeHTML(targetNote(target))}</small></span>
    </label>`;
  }).join('');
}

function renderProgress(validations) {
  const recipe = getRecipe(state.project?.recipeId);
  const required = recipe ? recipe.questions.filter((question) => question.required) : [];
  const values = state.project?.values || {};
  const missingRequired = required.filter((question) => !String(values[question.id] || '').trim()).length;
  const needDone = Boolean(String(values.goal || '').trim());
  const contextDone = needDone && missingRequired === 0;
  const artifactsDone = state.project.artifacts.length > 0;
  const errors = validations.filter((validation) => validation.severity === 'error').length;
  const reviewDone = artifactsDone && errors === 0;
  const steps = [
    ['1 · Necesidad', needDone ? 'Objetivo definido' : 'Falta el objetivo'],
    ['2 · Contexto', contextDone ? 'Datos obligatorios completos' : `${missingRequired} ${missingRequired === 1 ? 'campo pendiente' : 'campos pendientes'}`],
    ['3 · Entregables', artifactsDone ? formatCount(state.project.artifacts.length, 'archivo', 'archivos') : 'Sin generar'],
    ['4 · Revisión', reviewDone ? 'Sin errores' : errors > 0 ? `${errors} ${errors === 1 ? 'error' : 'errores'}` : 'Pendiente']
  ];
  const states = [needDone, contextDone, artifactsDone, reviewDone];
  const current = states.findIndex((done) => !done);

  els.projectProgress.innerHTML = steps.map(([title, detail], index) =>
    `<div class="progress-step" data-state="${states[index] ? 'done' : index === current ? 'current' : 'pending'}">
      <strong>${escapeHTML(title)}</strong>
      <span>${escapeHTML(detail)}</span>
    </div>`
  ).join('');

  els.projectMissing.textContent = missingRequired > 0
    ? `${missingRequired} ${missingRequired === 1 ? 'campo pendiente' : 'campos pendientes'}`
    : 'Datos obligatorios completos';
}

function renderValidation(validations) {
  const summary = summarizeValidation(validations);
  const noArtifacts = !state.project?.artifacts.length;
  els.validationSummary.textContent = noArtifacts && summary.error === 0 && summary.warning === 0
    ? 'Sin generar'
    : summary.error === 0 && summary.warning === 0
      ? 'Sin incidencias'
      : `${summary.error} ${summary.error === 1 ? 'error' : 'errores'} · ${summary.warning} ${summary.warning === 1 ? 'aviso' : 'avisos'}`;

  els.validationList.innerHTML = validations.length === 0
    ? '<li class="validation-item" data-severity="info"><span class="severity">info</span><span>Sin incidencias detectadas.</span></li>'
    : validations.slice(0, 60).map((validation) =>
      `<li class="validation-item" data-severity="${escapeHTML(validation.severity)}">
        <span class="severity">${escapeHTML(validation.severity)}</span>
        <span>${validation.path ? `<code>${escapeHTML(validation.path)}</code> · ` : ''}${escapeHTML(validation.message)}</span>
      </li>`
    ).join('');
}

function currentArtifact() {
  if (!state.project) return null;
  return state.project.artifacts.find((artifact) => artifact.path === state.selectedArtifact) || null;
}

function renderArtifactList() {
  const artifacts = state.project?.artifacts || [];
  els.artifactCount.textContent = String(artifacts.length);

  if (artifacts.length === 0) {
    els.artifactList.innerHTML = '';
    state.selectedArtifact = null;
    return;
  }

  if (!artifacts.some((artifact) => artifact.path === state.selectedArtifact)) {
    state.selectedArtifact = artifacts[0].path;
  }

  els.artifactList.innerHTML = artifacts.map((artifact) => {
    const badges = [
      artifact.editedByUser ? '<span class="state-edited">editado</span>' : '',
      artifact.stale ? '<span class="state-stale">desactualizado</span>' : ''
    ].join('');
    return `<li><button class="artifact-item${artifact.path === state.selectedArtifact ? ' is-active' : ''}" type="button" data-artifact="${escapeHTML(artifact.path)}">
      <code>${escapeHTML(artifact.path)}</code>
      <small>${escapeHTML(artifact.format)} ${badges}</small>
    </button></li>`;
  }).join('');
}

function artifactValidationFor(path) {
  return validateProject(state.project).filter((validation) => validation.path === path);
}

function renderArtifactPane() {
  const artifact = currentArtifact();
  if (!artifact) {
    els.artifactEmpty.hidden = false;
    els.artifactPane.hidden = true;
    return;
  }

  els.artifactEmpty.hidden = true;
  els.artifactPane.hidden = false;
  els.artifactPath.textContent = artifact.path;
  els.artifactEditor.value = artifact.content;
  els.artifactBadges.innerHTML = [
    `<span class="artifact-badge">${escapeHTML(artifact.format)}</span>`,
    artifact.editedByUser ? '<span class="artifact-badge is-edited">editado manualmente</span>' : '',
    artifact.stale ? '<span class="artifact-badge is-stale">desactualizado</span>' : ''
  ].join('');
  els.restoreArtifactBtn.disabled = !artifact.editedByUser;

  const issues = artifactValidationFor(artifact.path);
  els.artifactValidation.textContent = issues.length > 0
    ? issues.map((issue) => `${issue.severity}: ${issue.message}`).join(' · ')
    : 'Sin incidencias en este archivo.';
}

function refreshProjectDerived({ preserveEditor = false } = {}) {
  const validations = validateProject(state.project);
  const errors = validations.filter((validation) => validation.severity === 'error').length;

  renderProgress(validations);
  renderValidation(validations);
  renderArtifactList();

  if (!preserveEditor) renderArtifactPane();

  els.downloadZipBtn.disabled = state.project.artifacts.length === 0 || errors > 0;
  els.exportProjectBtn.disabled = !state.project;
  updateSessionMeta();
}

function updateFieldErrors() {
  if (!state.project) return;
  const validations = validateProject(state.project);

  for (const field of els.projectQuestions.querySelectorAll('[data-field]')) {
    const id = field.dataset.field;
    const error = validations.find((validation) => validation.code === 'missing-variable' && validation.path === id);
    field.classList.toggle('has-error', Boolean(error));
    let node = field.querySelector('.field-error');
    const input = field.querySelector('[data-question]');
    const fieldId = input?.id;
    const helpId = fieldId ? `${fieldId}-help` : '';
    const errorId = fieldId ? `${fieldId}-error` : '';

    if (input && fieldId) {
      input.setAttribute('aria-invalid', error ? 'true' : 'false');
      const ids = [input.type === 'checkbox' ? '' : helpId, error ? errorId : ''].filter(Boolean).join(' ');
      if (ids) input.setAttribute('aria-describedby', ids);
      else input.removeAttribute('aria-describedby');
    }

    if (error) {
      if (!node) {
        node = document.createElement('p');
        node.className = 'field-error';
        if (errorId) node.id = errorId;
        field.append(node);
      }
      node.textContent = error.message;
    } else if (node) {
      node.remove();
    }
  }
}

function refreshAfterEdit() {
  const validations = validateProject(state.project);
  renderProgress(validations);
  renderValidation(validations);
  updateFieldErrors();
  renderArtifactList();

  const artifact = currentArtifact();
  if (artifact) {
    els.artifactBadges.innerHTML = [
      `<span class="artifact-badge">${escapeHTML(artifact.format)}</span>`,
      artifact.editedByUser ? '<span class="artifact-badge is-edited">editado manualmente</span>' : '',
      artifact.stale ? '<span class="artifact-badge is-stale">desactualizado</span>' : ''
    ].join('');
    els.restoreArtifactBtn.disabled = !artifact.editedByUser;
    const issues = validations.filter((validation) => validation.path === artifact.path);
    els.artifactValidation.textContent = issues.length > 0
      ? issues.map((issue) => `${issue.severity}: ${issue.message}`).join(' · ')
      : 'Sin incidencias en este archivo.';
  }

  const errors = validations.filter((validation) => validation.severity === 'error').length;
  els.downloadZipBtn.disabled = state.project.artifacts.length === 0 || errors > 0;
  updateSessionMeta();
}

function updateQuestionValue(id, value) {
  if (!state.project) return;
  state.project.values[id] = String(value).slice(0, 20_000);
  const defaultIndex = state.project.defaultedFields?.indexOf(id) ?? -1;
  if (defaultIndex !== -1) state.project.defaultedFields.splice(defaultIndex, 1);
  if (id === 'goal') state.project.description = value;
  markArtifactsStale(state.project);
  touchProject(state.project);
  scheduleSave();
  refreshAfterEdit();
}

function generateProject(force = false) {
  if (!state.project) return;
  const edited = state.project.artifacts.filter((artifact) => artifact.editedByUser);
  if (edited.length > 0 && !force) {
    const ok = window.confirm(`Hay ${edited.length} archivo(s) editado(s) manualmente. Regenerar el paquete perderá esos cambios. ¿Continuar?`);
    if (!ok) return;
  }

  state.project.artifacts = buildArtifacts(state.project);
  state.selectedArtifact = state.project.artifacts[0]?.path || null;
  touchProject(state.project);
  scheduleSave();
  renderProject();

  const pending = state.project.artifacts.reduce((sum, artifact) => sum + (artifact.pendingVariables?.length || 0), 0);
  showToast(
    pending > 0
      ? `Artefactos generados con ${pending} variable(s) pendiente(s)`
      : `Artefactos generados: ${state.project.artifacts.length}`,
    { tone: pending > 0 ? 'error' : 'success', duration: 2400 }
  );
}

function regenerateArtifact(path, restoreOnly = false) {
  const artifact = state.project?.artifacts.find((item) => item.path === path);
  if (!artifact) return;

  if (restoreOnly && !artifact.editedByUser) {
    showToast('Este archivo no tiene cambios manuales que restaurar.', { duration: 2000 });
    return;
  }

  if (artifact.editedByUser && !restoreOnly) {
    const ok = window.confirm(`Se perderán los cambios manuales de ${path}. ¿Continuar?`);
    if (!ok) return;
  }

  const generated = buildArtifacts(state.project).find((item) => item.path === path);
  if (!generated) {
    showToast('La plantilla actual ya no genera ese archivo. Regenera el paquete completo.', { tone: 'error', duration: 3200 });
    return;
  }

  Object.assign(artifact, generated, { editedByUser: false, stale: false });
  touchProject(state.project);
  scheduleSave();
  renderProject();
  showToast(restoreOnly ? 'Archivo restaurado desde la plantilla' : 'Archivo regenerado', { tone: 'success', duration: 1800 });
}

async function copyArtifact() {
  const artifact = currentArtifact();
  if (!artifact) return;
  const ok = await copyText(artifact.content);
  showToast(ok ? 'Archivo copiado al portapapeles' : 'No se pudo copiar el archivo', {
    tone: ok ? 'success' : 'error',
    duration: 2200
  });
}

function downloadArtifact() {
  const artifact = currentArtifact();
  if (!artifact) return;
  downloadText(artifact.content, artifactFileName(artifact.path), mimeForFormat(artifact.format));
  showToast('Archivo descargado', { tone: 'success', duration: 1800 });
}

function downloadZip() {
  if (!state.project) return;
  const validations = validateProject(state.project);
  const errors = validations.filter((validation) => validation.severity === 'error');
  if (state.project.artifacts.length === 0 || errors.length > 0) {
    showToast('Corrige los errores de validación antes de descargar el ZIP.', { tone: 'error', duration: 3200 });
    return;
  }

  try {
    const bytes = createZip(state.project.artifacts.map((artifact) => ({
      path: artifact.path,
      content: artifact.content
    })));
    downloadBlob(new Blob([bytes], { type: 'application/zip' }), `${slugify(state.project.title)}.zip`);
    showToast('Paquete ZIP descargado', { tone: 'success', duration: 2000 });
  } catch (error) {
    showToast(error.message || 'No se pudo crear el ZIP.', { tone: 'error', duration: 3200 });
  }
}

function exportProject() {
  if (!state.project) return;
  downloadText(serializeProject(state.project), projectFileName(state.project), 'application/json;charset=utf-8');
  showToast('Proyecto exportado como JSON', { tone: 'success', duration: 2000 });
}

async function importProject(file) {
  if (!stateIsProjectSafe(file)) {
    showToast('El archivo supera el límite de 2 MB o no es válido.', { tone: 'error', duration: 4000 });
    return;
  }

  if (state.project) saveCurrentToSaved(false);

  let text;
  try {
    text = await file.text();
  } catch {
    showToast('No se pudo leer el archivo.', { tone: 'error', duration: 3200 });
    return;
  }

  const parsed = parseProjectJson(text);
  if (!parsed.ok) {
    showToast(`No se pudo importar: ${parsed.errors.join(' ')}`, { tone: 'error', duration: 5000 });
    return;
  }

  state.project = parsed.project;
  state.selectedArtifact = parsed.project.artifacts[0]?.path || null;
  setView('project');
  window.requestAnimationFrame(() => els.projectTitle.focus({ preventScroll: true }));
  scheduleSave();
  const errors = parsed.validations?.filter((validation) => validation.severity === 'error').length || 0;
  showToast(errors > 0 ? `Proyecto importado con ${errors} error(es) de validación` : 'Proyecto importado', {
    tone: errors > 0 ? 'error' : 'success',
    duration: 3200
  });
}

function newProject() {
  if (state.project && (state.project.artifacts.length > 0 || state.project.values?.goal)) {
    saveCurrentToSaved(false);
  }
  state.project = null;
  state.selectedArtifact = null;
  state.goal = '';
  els.studioGoal.value = '';
  persistNow();
  setView('create');
  window.requestAnimationFrame(() => els.studioGoal.focus({ preventScroll: true }));
  showToast('Proyecto guardado. Puedes empezar otro.', { duration: 2200 });
}

function renderSaved() {
  const projects = [...state.saved].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  els.savedEmpty.hidden = projects.length !== 0;
  els.savedProjects.innerHTML = projects.map((project) => {
    const recipe = getRecipe(project.recipeId);
    return `<article class="saved-card">
      <span class="saved-meta">${escapeHTML(familyTitle(recipe?.family || ''))} · ${escapeHTML(recipe?.title || 'Receta')}</span>
      <h3>${escapeHTML(project.title)}</h3>
      <p>${escapeHTML(project.values?.goal || 'Sin objetivo definido.')}</p>
      <span class="saved-meta">${formatCount(project.artifacts?.length || 0, 'archivo', 'archivos')} · ${escapeHTML(formatDate(project.updatedAt))}</span>
      <div class="saved-actions">
        <button class="text-button" type="button" data-saved-open="${escapeHTML(project.id)}">Abrir</button>
        <button class="text-button" type="button" data-saved-export="${escapeHTML(project.id)}">Exportar</button>
        <button class="text-button danger-text" type="button" data-saved-delete="${escapeHTML(project.id)}">Eliminar</button>
      </div>
    </article>`;
  }).join('');
}

function openSaved(id) {
  const project = state.saved.find((item) => item.id === id);
  if (!project) return;
  if (state.project) saveCurrentToSaved(false);
  const parsed = parseProjectJson(serializeProject(project));
  if (!parsed.ok) {
    showToast(`No se pudo abrir el proyecto: ${parsed.errors.join(' ')}`, { tone: 'error', duration: 4000 });
    return;
  }
  state.project = parsed.project;
  state.selectedArtifact = parsed.project.artifacts[0]?.path || null;
  setView('project');
  window.requestAnimationFrame(() => els.projectTitle.focus({ preventScroll: true }));
  scheduleSave();
  showToast('Proyecto abierto', { tone: 'success', duration: 1800 });
}

function deleteSaved(id) {
  const project = state.saved.find((item) => item.id === id);
  if (!project) return;
  if (!window.confirm(`¿Eliminar «${project.title}» de los guardados?`)) return;
  state.saved = state.saved.filter((item) => item.id !== id);
  persistNow();
  renderSaved();
  showToast('Proyecto eliminado de Guardados', { duration: 2000 });
}

function bindStudioEvents() {
  document.addEventListener('click', (event) => {
    const viewButton = event.target.closest('button[data-view]');
    if (viewButton && !viewButton.disabled) {
      event.preventDefault();
      setView(viewButton.dataset.view);
      return;
    }

    const example = event.target.closest('[data-example]');
    if (example) {
      els.studioGoal.value = example.dataset.example;
      state.goal = example.dataset.example;
      analyzeGoal();
      return;
    }

    const family = event.target.closest('[data-family]');
    if (family) {
      state.familyFilter = family.dataset.family;
      renderFilters();
      setView('templates');
      return;
    }

    const filter = event.target.closest('[data-filter-family]');
    if (filter) {
      state.familyFilter = filter.dataset.filterFamily;
      renderFilters();
      renderTemplates();
      return;
    }

    const start = event.target.closest('[data-start]');
    if (start) {
      startRecipe(start.dataset.start);
      return;
    }

    const artifactButton = event.target.closest('[data-artifact]');
    if (artifactButton) {
      state.selectedArtifact = artifactButton.dataset.artifact;
      renderArtifactList();
      renderArtifactPane();
      return;
    }

    const savedOpen = event.target.closest('[data-saved-open]');
    if (savedOpen) {
      openSaved(savedOpen.dataset.savedOpen);
      return;
    }

    const savedExport = event.target.closest('[data-saved-export]');
    if (savedExport) {
      const project = state.saved.find((item) => item.id === savedExport.dataset.savedExport);
      if (!project) return;
      downloadText(serializeProject(project), projectFileName(project), 'application/json;charset=utf-8');
      showToast('Proyecto exportado', { tone: 'success', duration: 1800 });
      return;
    }

    const savedDelete = event.target.closest('[data-saved-delete]');
    if (savedDelete) {
      deleteSaved(savedDelete.dataset.savedDelete);
    }
  });

  els.analyzeGoalBtn.addEventListener('click', analyzeGoal);
  els.templateSearch.addEventListener('input', (event) => {
    state.templateQuery = event.target.value;
    renderTemplates();
  });
  els.templateSearchClear.addEventListener('click', () => {
    state.templateQuery = '';
    renderTemplates();
  });
  els.templateResetBtn.addEventListener('click', () => {
    state.templateQuery = '';
    state.familyFilter = 'all';
    renderFilters();
    renderTemplates();
  });

  els.projectTitle.addEventListener('input', (event) => {
    if (!state.project) return;
    const value = event.target.value.slice(0, 160);
    state.project.title = value;
    state.project.values.projectName = value || 'Mi proyecto';
    els.projectHeading.textContent = `Proyecto: ${value || 'sin título'}`;
    markArtifactsStale(state.project);
    touchProject(state.project);
    scheduleSave();
    refreshAfterEdit();
  });

  els.projectQuestions.addEventListener('input', (event) => {
    const field = event.target.closest('[data-question]');
    if (!field) return;
    if (field.type === 'checkbox') {
      updateQuestionValue(field.dataset.question, field.checked ? 'true' : 'false');
    } else {
      updateQuestionValue(field.dataset.question, field.value);
    }
  });

  els.projectQuestions.addEventListener('change', (event) => {
    const field = event.target.closest('[data-question]');
    if (!field || field.type !== 'checkbox') return;
    updateQuestionValue(field.dataset.question, field.checked ? 'true' : 'false');
  });

  els.projectTargets.addEventListener('change', (event) => {
    const checkbox = event.target.closest('[data-target]');
    if (!checkbox || !state.project) return;
    const target = checkbox.dataset.target;

    if (checkbox.checked) {
      if (!state.project.targets.includes(target)) state.project.targets.push(target);
    } else {
      state.project.targets = state.project.targets.filter((item) => item !== target);
      if (state.project.targets.length === 0) {
        checkbox.checked = true;
        state.project.targets.push(target);
        showToast('Selecciona al menos un destino.', { duration: 2000 });
        return;
      }
    }

    markArtifactsStale(state.project);
    touchProject(state.project);
    scheduleSave();
    refreshAfterEdit();
  });

  els.recipeSelect.addEventListener('change', (event) => {
    if (!state.project) return;
    const next = event.target.value;
    if (next === state.project.recipeId) return;
    if (state.project.artifacts.length > 0 && !window.confirm('Cambiar de plantilla vaciará los archivos generados. Los campos compatibles se conservarán. ¿Continuar?')) {
      event.target.value = state.project.recipeId;
      return;
    }
    state.project = changeRecipe(state.project, next);
    state.selectedArtifact = null;
    renderProject();
    scheduleSave();
    showToast('Plantilla cambiada', { tone: 'success', duration: 1800 });
  });

  els.generateBtn.addEventListener('click', () => generateProject(false));
  els.regenerateAllBtn.addEventListener('click', () => generateProject(false));
  els.saveProjectBtn.addEventListener('click', () => saveCurrentToSaved(true));
  els.newProjectBtn.addEventListener('click', newProject);
  els.copyArtifactBtn.addEventListener('click', copyArtifact);
  els.downloadArtifactBtn.addEventListener('click', downloadArtifact);
  els.downloadZipBtn.addEventListener('click', downloadZip);
  els.exportProjectBtn.addEventListener('click', exportProject);
  els.regenerateArtifactBtn.addEventListener('click', () => {
    if (state.selectedArtifact) regenerateArtifact(state.selectedArtifact);
  });
  els.restoreArtifactBtn.addEventListener('click', () => {
    if (state.selectedArtifact) regenerateArtifact(state.selectedArtifact, true);
  });

  els.artifactEditor.addEventListener('input', () => {
    const artifact = currentArtifact();
    if (!artifact) return;
    artifact.content = els.artifactEditor.value;
    artifact.editedByUser = true;
    artifact.stale = false;
    touchProject(state.project);
    scheduleSave();
    refreshAfterEdit();
  });

  els.importProjectBtn.addEventListener('click', () => els.importProjectInput.click());
  els.importProjectInput.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    await importProject(file);
  });

  window.addEventListener('pagehide', flushSave);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushSave();
  });
}

function stateIsProjectSafe(file) {
  return Boolean(file) && file.size <= 2_000_000;
}
