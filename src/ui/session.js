/* Recetas de sesión y reinicio reversible del lienzo. */
import { GROUPS, ITEM_MAP } from '../data/catalog.js';
import { RECIPES } from '../data/recipes.js';
import { state } from '../core/state.js';
import { els } from '../core/dom.js';
import { formatCount } from '../core/format.js';
import { renderCatalog } from './catalog.js';
import { captureSession, renderAll, restoreSession } from './workbench.js';
import { showToast } from './toasts.js';

export function loadRecipe(key) {
  const recipe = RECIPES[key];
  if (!recipe) return;

  const previous = captureSession();
  const validIds = recipe.ids.filter((id) => ITEM_MAP.has(id));

  state.selected = validIds;
  state.vars = { ...recipe.vars };
  renderAll();
  els.sequenceArea.scrollTop = 0;

  showToast(`${recipe.title} cargada · ${formatCount(validIds.length, 'bloque', 'bloques')}`, {
    actionLabel: 'Deshacer',
    duration: 5200,
    onAction: () => {
      restoreSession(previous);
      showToast('Composición anterior restaurada', { tone: 'success', duration: 1700 });
    }
  });
}

export function resetSession({ resetCatalog = false, message = 'Secuencia vaciada' } = {}) {
  const hasContent = state.selected.length > 0 || Object.keys(state.vars).length > 0;
  const hasFilter = state.query.length > 0;

  if (!hasContent && !(resetCatalog && hasFilter)) {
    showToast('La sesión ya está vacía', { duration: 1700 });
    return;
  }

  const previous = captureSession();
  state.selected = [];
  state.vars = {};

  if (resetCatalog) {
    state.query = '';
    state.openGroups = Object.fromEntries(GROUPS.map((group) => [group.key, group.defaultOpen]));
    renderCatalog();
  }

  renderAll();
  els.catalogSearch.focus({ preventScroll: true });

  showToast(message, {
    actionLabel: 'Deshacer',
    duration: 5200,
    onAction: () => {
      restoreSession(previous);
      showToast('Sesión restaurada', { tone: 'success', duration: 1700 });
    }
  });
}
