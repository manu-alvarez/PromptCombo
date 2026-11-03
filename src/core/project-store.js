/* Persistencia local de proyectos del generador, separada de la composición. */
import { getStorage } from './persistence.js';
import {
  parseProjectJson,
  serializeProject,
  summarizeValidation
} from './project.js';

const STORE_KEY = 'promptcombo.studio.v1';
const STORE_VERSION = 1;
const MAX_SAVED_PROJECTS = 50;
const BACKUP_KEY = 'promptcombo.studio.v1.backup';

function normalizeProject(value) {
  if (!value || typeof value !== 'object') return null;
  const parsed = parseProjectJson(JSON.stringify(value));
  return parsed.ok ? parsed.project : null;
}

function preserveCorruptedState(raw, storage) {
  if (!raw) return;
  try {
    if (!storage.getItem(BACKUP_KEY)) storage.setItem(BACKUP_KEY, raw);
  } catch {
    // Si no se puede respaldar, no se bloquea la carga.
  }
}

export function loadStudioState(storage = getStorage()) {
  if (!storage) return { currentProject: null, savedProjects: [], corrupted: false };

  try {
    const raw = storage.getItem(STORE_KEY);
    if (!raw) return { currentProject: null, savedProjects: [], corrupted: false };

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      preserveCorruptedState(raw, storage);
      return { currentProject: null, savedProjects: [], corrupted: true };
    }
    if (!data || data.version !== STORE_VERSION) {
      preserveCorruptedState(raw, storage);
      return { currentProject: null, savedProjects: [], corrupted: true };
    }

    const currentProject = normalizeProject(data.currentProject);
    const savedProjects = Array.isArray(data.savedProjects)
      ? data.savedProjects
        .slice(0, MAX_SAVED_PROJECTS)
        .map(normalizeProject)
        .filter(Boolean)
      : [];

    return { currentProject, savedProjects, corrupted: false };
  } catch {
    try {
      preserveCorruptedState(storage.getItem(STORE_KEY), storage);
    } catch {
      // El almacenamiento no permite ni leer para respaldar.
    }
    return { currentProject: null, savedProjects: [], corrupted: true };
  }
}

export function saveStudioState({ currentProject, savedProjects }, storage = getStorage()) {
  if (!storage) return false;

  try {
    const projects = (savedProjects || [])
      .slice(0, MAX_SAVED_PROJECTS)
      .map((project) => JSON.parse(serializeProject(project)));

    const payload = {
      version: STORE_VERSION,
      currentProject: currentProject ? JSON.parse(serializeProject(currentProject)) : null,
      savedProjects: projects
    };

    storage.setItem(STORE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function clearStudioState(storage = getStorage()) {
  if (!storage) return false;
  try {
    storage.removeItem(STORE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function studioStateSummary(project) {
  if (!project) return { artifacts: 0, errors: 0, warnings: 0 };
  const validations = project.artifacts?.flatMap((artifact) => artifact.validationResults || []) || [];
  const summary = summarizeValidation(validations);
  return { artifacts: project.artifacts?.length || 0, errors: summary.error, warnings: summary.warning };
}
