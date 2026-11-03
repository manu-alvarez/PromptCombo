/* Conexión de eventos: catálogo, secuencia, variables, teclado y drag & drop. */
import { state } from '../core/state.js';
import { els } from '../core/dom.js';
import { clearSearch, focusCatalogSearch, setSearchQuery } from './catalog.js';
import {
  addItem,
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

let dragSourceId = null;

function isEditableTarget(target) {
  return target instanceof HTMLElement && (
    target.matches('input, textarea, select') ||
    target.isContentEditable
  );
}

export function bindEvents() {
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

  els.loadDemoBtn.addEventListener('click', () => loadRecipe('pwa'));

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
}
