/* Punto de entrada de PromptCombo. */
import { renderCatalog } from './ui/catalog.js';
import { renderAll } from './ui/workbench.js';
import { bindEvents } from './ui/events.js';

function init() {
  renderCatalog();
  renderAll();
  bindEvents();
}

init();
