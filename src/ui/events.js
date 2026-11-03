/* Conexión de eventos: catálogo, secuencia, variables, teclado y drag & drop. */
import { state } from '../core/state.js';
import { els } from '../core/dom.js';
import { clearSearch, focusCatalogSearch, setSearchQuery } from './catalog.js';
import {
  addItem,
  captureSession,
  clearDropIndicators,
  clearVariables,
  handleCopy,
  handleDownload,
  moveItem,
  renderAll,
  revealComboItem,
  removeItem,
  reorderSelected,
  updateOutput
} from './workbench.js';
import { bindDetailDialog, closeDetail, getCurrentDetailId, openDetail } from './detail.js';
import { loadRecipe, resetSession } from './session.js';
import { showToast } from './toasts.js';
import { downloadText } from '../core/download.js';
import { showStudioView } from './studio.js';
import {
  flushSessionSave,
  getSessionSavedAt,
  initPersistence,
  isPersistenceEnabled,
  isPersistenceSupported,
  isSessionConflict,
  scheduleSessionSave,
  setPersistenceEnabled,
  setSessionConflict
} from '../core/persistence.js';

let dragSourceId = null;

function syncPersistenceControl() {
  const supported = isPersistenceSupported();
  const enabled = supported && isPersistenceEnabled();

  els.persistBtn.disabled = !supported;
  els.persistBtn.classList.toggle('is-off', !enabled);
  els.persistBtn.setAttribute('aria-pressed', String(enabled));

  const description = !supported
    ? 'El almacenamiento local no está disponible'
    : enabled
      ? 'Guardado automático activado'
      : 'Guardado automático desactivado';
  const hint = supported ? ' Pulsa para cambiar.' : '';
  els.persistBtn.title = `${description}.${hint}`;
  els.persistBtn.setAttribute('aria-label', `${description}.${hint}`);
  updateSessionConflictBanner();
}

function updateSessionConflictBanner() {
  const conflict = isSessionConflict();
  els.sessionConflict.hidden = !conflict;
  els.sessionConflictText.textContent = conflict
    ? 'El guardado automático está pausado para no sobrescribir la versión externa.'
    : '';
}

function keepLocalSession() {
  setSessionConflict(false);
  scheduleSessionSave(captureSession());
  const saved = flushSessionSave();
  updateSessionConflictBanner();
  showToast(saved ? 'Composición local conservada' : 'No se pudo guardar la composición local', {
    tone: saved ? 'success' : 'error',
    duration: 2600
  });
}

function exportLocalSession() {
  downloadText(
    JSON.stringify({ version: 1, selected: [...state.selected], vars: { ...state.vars }, updatedAt: Date.now() }, null, 2),
    'promptcombo-composicion.json',
    'application/json;charset=utf-8'
  );
  showToast('Composición local exportada; el conflicto sigue pendiente.', { duration: 2600 });
}

function isEditableTarget(target) {
  return target instanceof HTMLElement && (
    target.matches('input, textarea, select') ||
    target.isContentEditable
  );
}

export function bindEvents() {
  els.sessionKeepBtn.addEventListener('click', keepLocalSession);
  els.sessionExportBtn.addEventListener('click', exportLocalSession);

  bindDetailDialog();

  els.catalogSearch.addEventListener('input', (event) => {
    setSearchQuery(event.target.value);
  });

  els.catalogSearch.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.query.length > 0) {
      event.preventDefault();
      clearSearch();
    }
  });

  els.clearSearchBtn.addEventListener('click', () => clearSearch());
  els.clearSearchInline.addEventListener('click', () => clearSearch());
  els.focusSearchBtn.addEventListener('click', focusCatalogSearch);

  els.catalogGroups.addEventListener('click', (event) => {
    const addButton = event.target.closest('[data-add]');
    if (addButton) {
      const id = addButton.dataset.add;
      if (state.selected.includes(id)) {
        revealComboItem(id, true);
        showToast('Ese bloque ya está en el combo', { duration: 1600 });
      } else {
        addItem(id);
      }
      return;
    }

    const detailButton = event.target.closest('[data-detail]');
    if (detailButton) {
      openDetail(detailButton.dataset.detail);
    }
  });

  els.emptyState.addEventListener('click', (event) => {
    const recipeButton = event.target.closest('[data-recipe]');
    if (recipeButton) {
      loadRecipe(recipeButton.dataset.recipe);
    }
  });

  els.loadDemoBtn.addEventListener('click', () => {
    showStudioView('advanced');
    loadRecipe('pwa');
  });

  els.persistBtn.addEventListener('click', () => {
    const next = !isPersistenceEnabled();

    if (!setPersistenceEnabled(next)) {
      syncPersistenceControl();
      showToast('No se pudo activar el guardado local: el almacenamiento no está disponible o está lleno.', {
        tone: 'error',
        duration: 5200
      });
      return;
    }

    if (next) {
      scheduleSessionSave(captureSession());
      flushSessionSave();
      showToast('Guardado automático activado', { tone: 'success', duration: 1800 });
    } else {
      showToast('Guardado automático desactivado · composición local eliminada', { duration: 3200 });
    }

    syncPersistenceControl();
  });

  window.addEventListener('promptcombo:persistence-error', () => {
    syncPersistenceControl();
    showToast('No se pudo guardar la sesión local. El almacenamiento está lleno o bloqueado.', {
      tone: 'error',
      duration: 5200
    });
  });

  window.addEventListener('storage', (event) => {
    if (event.key !== 'promptcombo.session.v1') return;

    const hasLocalContent = state.selected.length > 0 || Object.keys(state.vars).length > 0;
    if (!hasLocalContent) return;

    let externalUpdatedAt = 0;
    if (event.newValue) {
      try {
        const raw = JSON.parse(event.newValue);
        externalUpdatedAt = Number(raw.updatedAt) || 0;
      } catch {
        return;
      }
    }

    if (event.newValue && externalUpdatedAt <= getSessionSavedAt()) {
      if (isSessionConflict()) {
        setSessionConflict(false);
        updateSessionConflictBanner();
      }
      return;
    }

    if (isSessionConflict()) return;

    setSessionConflict(true);
    showToast(
      event.newValue
        ? 'Otra pestaña cambió la composición avanzada. No se guardará esta copia hasta que decidas.'
        : 'Otra pestaña vació la composición avanzada. No se guardará esta copia hasta que decidas.',
      {
        actions: [
          { label: 'Conservar la mía', onAction: keepLocalSession },
          { label: 'Exportar mi copia', onAction: exportLocalSession }
        ],
        duration: 60000
      }
    );
    updateSessionConflictBanner();
  });

  window.addEventListener('storage', (event) => {
    if (event.key !== 'promptcombo.prefs.v1' && event.key !== null) return;

    const wasEnabled = isPersistenceEnabled();
    initPersistence();
    syncPersistenceControl();

    if (wasEnabled !== isPersistenceEnabled()) {
      showToast(
        isPersistenceEnabled()
          ? 'Guardado automático activado en otra pestaña'
          : 'Guardado automático desactivado en otra pestaña',
        { duration: 3200 }
      );
    }
  });

  els.resetBtn.addEventListener('click', () => {
    resetSession({ resetCatalog: true, message: 'Sesión reiniciada' });
  });

  els.clearComboBtn.addEventListener('click', () => {
    resetSession({ resetCatalog: false, message: 'Secuencia vaciada' });
  });

  els.variablesGrid.addEventListener('input', (event) => {
    const field = event.target.closest('[data-var-token]');
    if (!field) return;

    state.vars[field.dataset.varToken] = field.value;
    updateOutput();
  });

  els.resetVarsBtn.addEventListener('click', clearVariables);

  els.comboList.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-action]');
    if (actionButton) {
      const id = actionButton.dataset.id;
      const action = actionButton.dataset.action;

      if (action === 'move-up') moveItem(id, -1);
      if (action === 'move-down') moveItem(id, 1);
      if (action === 'remove') removeItem(id);
      return;
    }

    const detailButton = event.target.closest('[data-detail]');
    if (detailButton) {
      openDetail(detailButton.dataset.detail);
    }
  });

  els.comboList.addEventListener('dragstart', (event) => {
    const item = event.target.closest('.combo-item');
    if (!item) return;

    dragSourceId = item.dataset.id;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      try {
        event.dataTransfer.setData('text/plain', dragSourceId);
      } catch (error) {
        // Algunos navegadores restringen setData; el estado interno ya conserva el origen.
      }
    }

    window.requestAnimationFrame(() => item.classList.add('is-dragging'));
  });

  els.comboList.addEventListener('dragenter', (event) => {
    if (dragSourceId) event.preventDefault();
  });

  els.comboList.addEventListener('dragover', (event) => {
    if (!dragSourceId) return;

    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';

    clearDropIndicators();
    const target = event.target.closest('.combo-item');
    if (!target || target.dataset.id === dragSourceId) return;

    const rect = target.getBoundingClientRect();
    const after = event.clientY > rect.top + rect.height / 2;
    target.classList.add(after ? 'drop-after' : 'drop-before');
  });

  els.comboList.addEventListener('drop', (event) => {
    if (!dragSourceId) return;

    event.preventDefault();
    const target = event.target.closest('.combo-item');
    const sourceId = dragSourceId;

    if (target) {
      const rect = target.getBoundingClientRect();
      const after = event.clientY > rect.top + rect.height / 2;
      const changed = reorderSelected(sourceId, target.dataset.id, after);
      if (changed) renderAll();
    }

    clearDropIndicators();
    const dragging = Array.from(els.comboList.querySelectorAll('.combo-item')).find((node) => node.dataset.id === sourceId);
    if (dragging) dragging.classList.remove('is-dragging');
    dragSourceId = null;
  });

  els.comboList.addEventListener('dragend', () => {
    clearDropIndicators();
    const dragging = els.comboList.querySelector('.is-dragging');
    if (dragging) dragging.classList.remove('is-dragging');
    dragSourceId = null;
  });

  els.copyBtn.addEventListener('click', handleCopy);
  els.downloadBtn.addEventListener('click', handleDownload);
  els.detailClose.addEventListener('click', closeDetail);

  els.detailAdd.addEventListener('click', () => {
    const id = getCurrentDetailId();
    if (!id) return;
    if (!state.selected.includes(id)) addItem(id);
    closeDetail();
  });

  document.addEventListener('keydown', (event) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;

    if (
      event.key === '/' &&
      !isEditableTarget(event.target) &&
      !els.detailDialog.open
    ) {
      event.preventDefault();
      focusCatalogSearch();
    }
  });

  syncPersistenceControl();
}
