/* Generador guiado: creación, proyecto, archivos, validación y exportación. */
import { FAMILIES, RECIPES, TARGETS, getRecipe } from '../data/studio-recipes.js';
import {
  EDITORIAL_STATUSES,
  LIBRARY_RESOURCES,
  RESOURCE_MAP,
  RESOURCE_TYPES,
  getResource
} from '../data/library-resources.js';
import { TOTAL_ITEMS } from '../data/catalog.js';
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
import { state as composerState } from '../core/state.js';
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
  libraryQuery: '',
  libraryType: 'all',
  libraryCategory: 'all',
  libraryStatus: 'all',
  libraryTarget: 'all',
  selectedResource: null,
  externalConflict: null,
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
  librarySearch: byId('librarySearch'),
  librarySearchClear: byId('librarySearchClear'),
  libraryType: byId('libraryType'),
  libraryCategory: byId('libraryCategory'),
  libraryStatus: byId('libraryStatus'),
  libraryTarget: byId('libraryTarget'),
  libraryGrid: byId('libraryGrid'),
  libraryDetail: byId('libraryDetail'),
  libraryDetailType: byId('libraryDetailType'),
  libraryDetailTitle: byId('libraryDetailTitle'),
  libraryDetailContent: byId('libraryDetailContent'),
  libraryAddBtn: byId('libraryAddBtn'),
  libraryRemoveBtn: byId('libraryRemoveBtn'),
  libraryGoProjectBtn: byId('libraryGoProjectBtn'),
  libraryCloseBtn: byId('libraryCloseBtn'),
  libraryEmpty: byId('libraryEmpty'),
  libraryResetBtn: byId('libraryResetBtn'),
  projectResources: byId('projectResources'),
  projectResourceCount: byId('projectResourceCount'),
  studioConflict: byId('studioConflict'),
  studioConflictText: byId('studioConflictText'),
  conflictReloadBtn: byId('conflictReloadBtn'),
  conflictKeepBtn: byId('conflictKeepBtn'),
  conflictExportBtn: byId('conflictExportBtn'),
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
  advancedMeta: byId('advancedMeta'),
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
  if (!['create', 'templates', 'library', 'project', 'saved', 'advanced'].includes(view)) return;
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
    els.sessionMeta.textContent = formatCount(composerState.selected.length, 'bloque', 'bloques');
    return;
  }

  document.body.dataset.view = 'studio';
  updateSessionMeta();

  if (view === 'templates') renderTemplates();
  if (view === 'library') renderLibrary();
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
  const derived = LIBRARY_RESOURCES.filter((resource) => (resource.type === 'skill' || resource.type === 'role') && !resource.sourceModule).length;
  els.advancedMeta.textContent = `${TOTAL_ITEMS} bloques composables · ${derived} derivados de la biblioteca · ${LIBRARY_RESOURCES.length} recursos documentados`;
  renderExamples();
  renderFamilies();
  renderFilters();
  renderRecipeSelect();
  renderLibraryControls();
  bindStudioEvents();

  const loaded = loadStudioState();
  state.project = loaded.currentProject;
  state.saved = loaded.savedProjects;
  updateConflictBanner();

  setView(state.project ? 'project' : 'create');

  if (loaded.corrupted) {
    showToast('No se pudo leer un proyecto guardado. Se conservó una copia de respaldo en el navegador.', {
      tone: 'error',
      duration: 6000
    });
  }

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

function resourceTypeLabel(type) {
  return RESOURCE_TYPES.find(([id]) => id === type)?.[1] || type;
}

function resourceStatusLabel(status) {
  return EDITORIAL_STATUSES.includes(status) ? status : 'sin estado';
}

function renderLibraryControls() {
  const categories = [...new Set(LIBRARY_RESOURCES.map((resource) => resource.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));

  els.libraryType.innerHTML = `<option value="all">Todos los tipos</option>${RESOURCE_TYPES.map(([id, label]) =>
    `<option value="${escapeHTML(id)}">${escapeHTML(label)}</option>`
  ).join('')}`;
  els.libraryCategory.innerHTML = `<option value="all">Todas las categorías</option>${categories.map((category) =>
    `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`
  ).join('')}`;
  els.libraryStatus.innerHTML = `<option value="all">Todos los estados</option>${EDITORIAL_STATUSES.map((status) =>
    `<option value="${escapeHTML(status)}">${escapeHTML(resourceStatusLabel(status))}</option>`
  ).join('')}`;
  els.libraryTarget.innerHTML = `<option value="all">Todos los destinos</option>${Object.entries(TARGETS).map(([id, target]) =>
    `<option value="${escapeHTML(id)}">${escapeHTML(target.label)}</option>`
  ).join('')}`;

  els.libraryType.value = state.libraryType;
  els.libraryCategory.value = state.libraryCategory;
  els.libraryStatus.value = state.libraryStatus;
  els.libraryTarget.value = state.libraryTarget;
}

function libraryMatches(resource, query) {
  if (state.libraryType !== 'all' && resource.type !== state.libraryType) return false;
  if (state.libraryCategory !== 'all' && resource.category !== state.libraryCategory) return false;
  if (state.libraryStatus !== 'all' && resource.status !== state.libraryStatus) return false;
  if (state.libraryTarget !== 'all' && !resource.compatibility?.includes(state.libraryTarget)) return false;
  if (!query) return true;

  const normalize = (value) => normalizeSearch(value).replace(/[^a-z0-9]+/g, ' ').trim();
  return normalize([
    resource.title,
    resource.summary,
    resource.objective,
    resource.type,
    resource.category,
    ...(resource.tags || []),
    ...(resource.related || [])
  ].join(' ')).includes(normalize(query));
}

function renderLibrary() {
  const query = normalizeSearch(state.libraryQuery);
  const results = LIBRARY_RESOURCES.filter((resource) => libraryMatches(resource, query));

  els.libraryGrid.innerHTML = results.map((resource) =>
    `<button class="library-card${resource.id === state.selectedResource ? ' is-active' : ''}" type="button" data-resource="${escapeHTML(resource.id)}">
      <span class="library-kind">${escapeHTML(resourceTypeLabel(resource.type))} · ${escapeHTML(resourceStatusLabel(resource.status))}</span>
      <span class="library-title">${escapeHTML(resource.title)}</span>
      <span class="library-summary">${escapeHTML(resource.summary)}</span>
      <span class="library-tags">${(resource.tags || []).slice(0, 4).map((tag) => `<span class="target-tag">${escapeHTML(tag)}</span>`).join('')}</span>
    </button>`
  ).join('');

  els.libraryEmpty.hidden = results.length !== 0;
  els.librarySearchClear.hidden = state.libraryQuery.length === 0;
  if (document.activeElement !== els.librarySearch) els.librarySearch.value = state.libraryQuery;

  if (state.selectedResource && RESOURCE_MAP.has(state.selectedResource)) {
    renderLibraryDetail(RESOURCE_MAP.get(state.selectedResource));
  } else {
    els.libraryDetail.hidden = true;
  }
}

function renderLibraryDetail(resource) {
  const isProjectRecipe = resource.type === 'package' || resource.type === 'recipe';
  const recipeId = resource.type === 'package' ? resource.content?.recipeId : resource.type === 'recipe' ? resource.content?.recipeId : null;
  const canAdd = !isProjectRecipe && !['adapter', 'validator'].includes(resource.type);
  const selected = Boolean(state.project?.resources?.includes(resource.id));

  els.libraryDetailType.textContent = `${resourceTypeLabel(resource.type).toUpperCase()} · ${resourceStatusLabel(resource.status)}`;
  els.libraryDetailTitle.textContent = resource.title;
  els.libraryDetail.hidden = false;

  const list = (items) => Array.isArray(items) && items.length > 0
    ? `<ul>${items.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul>`
    : '<p class="studio-muted">No declarado.</p>';
  const related = (resource.related || []).map((id) => {
    const target = getResource(id);
    return target ? `<button class="chip-button" type="button" data-resource="${escapeHTML(id)}">${escapeHTML(target.title)}</button>` : '';
  }).join('');

  els.libraryDetailContent.innerHTML = `<p class="library-detail-summary">${escapeHTML(resource.summary)}</p>
    <dl class="library-facts">
      <div><dt>Versión</dt><dd>${escapeHTML(resource.version)}</dd></div>
      <div><dt>Objetivo</dt><dd>${escapeHTML(resource.objective || '')}</dd></div>
      <div><dt>Cuándo</dt><dd>${escapeHTML(resource.useWhen || '')}</dd></div>
      <div><dt>Evitar</dt><dd>${escapeHTML(resource.avoidWhen || '')}</dd></div>
      <div><dt>Compatibilidad</dt><dd>${(resource.compatibility || []).map((target) => escapeHTML(targetLabel(target))).join(', ') || 'No declarada'}</dd></div>
      <div><dt>Verificación</dt><dd>${Object.entries(resource.verification || {}).map(([key, value]) => `${escapeHTML(key)}: ${escapeHTML(value)}`).join(' · ')}</dd></div>
    </dl>
    <h4>Entradas</h4>${list(resource.inputs)}
    <h4>Salidas</h4>${list(resource.outputs)}
    ${related ? `<h4>Relacionados</h4><div class="library-related">${related}</div>` : ''}
    <p class="studio-muted">Añadir este recurso genera documentación de referencia; no modifica la composición avanzada ni el prompt maestro.</p>
    <p class="studio-muted">Origen: ${escapeHTML(resource.provenance?.origin || 'no declarado')} · Revisión: ${escapeHTML(resource.lastReviewed || 'pendiente')}</p>`;

  els.libraryAddBtn.hidden = !canAdd && !isProjectRecipe;
  els.libraryRemoveBtn.hidden = !canAdd || !selected;
  els.libraryGoProjectBtn.hidden = !state.project;
  els.libraryAddBtn.disabled = !canAdd && !isProjectRecipe;
  els.libraryAddBtn.textContent = isProjectRecipe
    ? (resource.type === 'package' ? 'Usar este paquete' : 'Usar esta receta')
    : 'Añadir al proyecto';
}

function addResourceToProject(id) {
  const resource = getResource(id);
  if (!resource) return;
  if (!state.project) {
    showToast('Crea o abre un proyecto antes de añadir recursos.', { duration: 2600 });
    return;
  }
  if (['recipe', 'package'].includes(resource.type)) {
    const recipeId = resource.content?.recipeId;
    if (recipeId) startRecipe(recipeId);
    return;
  }
  if (resource.type === 'adapter' || resource.type === 'validator') {
    showToast('Este recurso es informativo y no genera archivos.', { duration: 2200 });
    return;
  }
  if (state.project.resources.includes(id)) {
    showToast('El recurso ya está en el proyecto.', { duration: 1800 });
    return;
  }

  state.project.resources.push(id);
  markArtifactsStale(state.project);
  touchProject(state.project);
  scheduleSave();
  renderProjectResources();
  renderLibraryDetail(resource);
  if (state.view === 'project') refreshAfterEdit();
  showToast(`Referencia añadida: ${resource.title}. No modifica el prompt maestro.`, { tone: 'success', duration: 2400 });
}

function removeResourceFromProject(id) {
  if (!state.project) return;
  const before = state.project.resources.length;
  state.project.resources = state.project.resources.filter((resourceId) => resourceId !== id);
  if (state.project.resources.length === before) return;
  markArtifactsStale(state.project);
  touchProject(state.project);
  scheduleSave();
  renderProjectResources();
  renderLibraryDetail(getResource(id));
  if (state.view === 'project') refreshAfterEdit();
  showToast('Recurso quitado del proyecto', { duration: 1800 });
}

function renderProjectResources() {
  const resources = (state.project?.resources || []).map(getResource).filter(Boolean);
  els.projectResourceCount.textContent = String(resources.length);
  els.projectResources.innerHTML = resources.length === 0
    ? '<p class="studio-muted">Sin recursos adicionales. La receta principal seguirá generando sus archivos.</p>'
    : resources.map((resource) =>
      `<span class="resource-chip">
        <span>${escapeHTML(resource.title)}</span>
        <button type="button" data-remove-resource="${escapeHTML(resource.id)}" aria-label="Quitar ${escapeHTML(resource.title)}">×</button>
      </span>`
    ).join('');
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

function projectHasUserContent(project) {
  if (!project) return false;
  if ((project.artifacts || []).length > 0) return true;
  return Object.entries(project.values || {}).some(([key, value]) => {
    if (key === 'projectName' || !String(value || '').trim()) return false;
    return !(project.defaultedFields || []).includes(key);
  });
}

function startRecipe(recipeId) {
  const recipe = getRecipe(recipeId);
  if (!recipe) return;
  if (state.externalConflict) {
    showToast('Resuelve el conflicto de pestañas antes de abrir otro proyecto.', { tone: 'error', duration: 3200 });
    return;
  }

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
  if (state.externalConflict) {
    updateConflictBanner();
    showToast('Hay un conflicto de pestañas pendiente. Elige qué versión conservar antes de guardar.', {
      tone: 'error',
      duration: 3600
    });
    return false;
  }
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
  if (state.externalConflict) return false;
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

function updateConflictBanner() {
  const conflict = state.externalConflict;
  els.studioConflict.hidden = !conflict;
  if (!conflict) {
    els.studioConflictText.textContent = '';
    return;
  }

  const external = conflict.currentProject;
  els.studioConflictText.textContent = external
    ? `«${external.title}» tiene cambios más recientes en otra pestaña. No se guardará nada hasta que elijas una versión.`
    : 'Otra pestaña vació el proyecto actual. Elige si conservar esta copia o cargar el estado externo.';
}

function handleStudioStorage(event) {
  if (event.key !== 'promptcombo.studio.v1') return;

  const external = loadStudioState();
  const local = state.project;
  const externalProject = external.currentProject;

  if (!local && !externalProject) return;
  if (local && externalProject && local.id === externalProject.id && (externalProject.updatedAt || 0) <= (local.updatedAt || 0)) {
    state.saved = external.savedProjects;
    if (state.externalConflict) {
      state.externalConflict = null;
      updateConflictBanner();
    }
    return;
  }

  state.externalConflict = external;
  updateConflictBanner();
  showToast('Otra pestaña tiene una versión más reciente del proyecto. Revisa el aviso antes de guardar.', {
    tone: 'error',
    duration: 5200
  });
}

function resolveConflictWithExternal() {
  if (!state.externalConflict) return;
  const external = state.externalConflict;
  state.project = external.currentProject;
  state.saved = external.savedProjects;
  state.selectedArtifact = state.project?.artifacts?.[0]?.path || null;
  state.externalConflict = null;
  updateConflictBanner();
  setView(state.project ? 'project' : 'create');
  showToast('Versión externa cargada. Revisa el estado antes de continuar.', { tone: 'success', duration: 2600 });
}

function resolveConflictKeepingMine() {
  if (!state.externalConflict) return;
  state.externalConflict = null;
  updateConflictBanner();
  const saved = persistNow();
  showToast(saved ? 'Tu copia se guardó y sustituyó la versión externa.' : 'No se pudo guardar tu copia.', {
    tone: saved ? 'success' : 'error',
    duration: 2600
  });
}

function exportConflictCopy() {
  if (!state.project) return;
  downloadText(serializeProject(state.project), projectFileName(state.project), 'application/json;charset=utf-8');
  showToast('Copia local exportada; el conflicto sigue pendiente.', { duration: 2600 });
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
  els.projectRecipe.textContent = recipe ? `Generado con plantilla · ${recipe.title} · v${recipe.version}` : 'Plantilla no encontrada';
  els.projectTitle.value = state.project.title || '';
  els.projectHeading.textContent = `Proyecto: ${state.project.title || 'sin título'}`;
  els.recipeSelect.value = state.project.recipeId;

  renderQuestions();
  renderTargets();
  renderProjectResources();
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
  if (state.externalConflict) {
    showToast('Resuelve el conflicto de pestañas antes de importar.', { tone: 'error', duration: 3200 });
    return;
  }
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
  if (state.externalConflict) {
    showToast('Resuelve el conflicto de pestañas antes de crear otro proyecto.', { tone: 'error', duration: 3200 });
    return;
  }
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
  if (state.externalConflict) {
    showToast('Resuelve el conflicto de pestañas antes de abrir otro proyecto.', { tone: 'error', duration: 3200 });
    return;
  }
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
  if (state.externalConflict) {
    showToast('Resuelve el conflicto de pestañas antes de eliminar guardados.', { tone: 'error', duration: 3200 });
    return;
  }
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

    const resourceButton = event.target.closest('[data-resource]');
    if (resourceButton) {
      state.selectedResource = resourceButton.dataset.resource;
      setView('library');
      renderLibrary();
      return;
    }

    const removeResource = event.target.closest('[data-remove-resource]');
    if (removeResource) {
      removeResourceFromProject(removeResource.dataset.removeResource);
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

  els.librarySearch.addEventListener('input', (event) => {
    state.libraryQuery = event.target.value;
    renderLibrary();
  });
  els.librarySearchClear.addEventListener('click', () => {
    state.libraryQuery = '';
    renderLibrary();
  });
  for (const [key, element] of [
    ['libraryType', els.libraryType],
    ['libraryCategory', els.libraryCategory],
    ['libraryStatus', els.libraryStatus],
    ['libraryTarget', els.libraryTarget]
  ]) {
    element.addEventListener('change', (event) => {
      state[key] = event.target.value;
      renderLibrary();
    });
  }
  els.libraryResetBtn.addEventListener('click', () => {
    state.libraryQuery = '';
    state.libraryType = 'all';
    state.libraryCategory = 'all';
    state.libraryStatus = 'all';
    state.libraryTarget = 'all';
    renderLibraryControls();
    renderLibrary();
  });
  els.libraryCloseBtn.addEventListener('click', () => {
    state.selectedResource = null;
    els.libraryDetail.hidden = true;
    renderLibrary();
  });
  els.libraryRemoveBtn.addEventListener('click', () => {
    if (state.selectedResource) removeResourceFromProject(state.selectedResource);
  });
  els.libraryAddBtn.addEventListener('click', () => {
    const resource = state.selectedResource ? getResource(state.selectedResource) : null;
    if (!resource) return;
    if (['recipe', 'package'].includes(resource.type)) {
      const recipeId = resource.content?.recipeId;
      if (recipeId) startRecipe(recipeId);
      return;
    }
    addResourceToProject(resource.id);
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
    if (state.externalConflict) {
      event.target.value = state.project.recipeId;
      showToast('Resuelve el conflicto de pestañas antes de cambiar de plantilla.', { tone: 'error', duration: 3200 });
      return;
    }
    if (projectHasUserContent(state.project)) {
      const editedCount = state.project.artifacts.filter((artifact) => artifact.editedByUser).length;
      const message = editedCount > 0
        ? `Hay ${editedCount} archivo(s) editado(s) manualmente. Cambiar de plantilla conservará solo los campos compatibles y descartará esos cambios. ¿Continuar?`
        : 'Cambiar de plantilla conservará solo los campos compatibles y vaciará los archivos generados. ¿Continuar?';
      if (!window.confirm(message)) {
        event.target.value = state.project.recipeId;
        return;
      }
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

  els.conflictReloadBtn.addEventListener('click', resolveConflictWithExternal);
  els.conflictKeepBtn.addEventListener('click', resolveConflictKeepingMine);
  els.conflictExportBtn.addEventListener('click', exportConflictCopy);
  window.addEventListener('storage', handleStudioStorage);

  window.addEventListener('pagehide', flushSave);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushSave();
  });
}

function stateIsProjectSafe(file) {
  return Boolean(file) && file.size <= 2_000_000;
}
