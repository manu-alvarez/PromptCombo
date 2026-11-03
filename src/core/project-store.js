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

function normalizeProject(value) {
  if (!value || typeof value !== 'object') return null;
  const parsed = parseProjectJson(JSON.stringify(value));
  return parsed.ok ? parsed.project : null;
}

export function loadStudioState(storage = getStorage()) {
  if (!storage) return { currentProject: null, savedProjects: [] };

  try {
    const raw = storage.getItem(STORE_KEY);
    if (!raw) return { currentProject: null, savedProjects: [] };

    const data = JSON.parse(raw);
    if (!data || data.version !== STORE_VERSION) {
      return { currentProject: null, savedProjects: [] };
    }

    const currentProject = normalizeProject(data.currentProject);
    const savedProjects = Array.isArray(data.savedProjects)
      ? data.savedProjects
        .slice(0, MAX_SAVED_PROJECTS)
        .map(normalizeProject)
        .filter(Boolean)
      : [];

    return { currentProject, savedProjects };
  } catch {
    return { currentProject: null, savedProjects: [] };
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
