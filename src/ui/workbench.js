/* Mesa de trabajo: secuencia, variables, preview, copia y descarga. */
import { TYPE_META, getItem } from '../data/catalog.js';
import { EMPTY_PREVIEW } from '../data/recipes.js';
import { state } from '../core/state.js';
import { els } from '../core/dom.js';
import { escapeHTML, formatCount, icon, padSequence } from '../core/format.js';
import { getActiveVariables, getComboDescription } from '../core/items.js';
import { compilePrompt } from '../core/compiler.js';
import { syncCatalogAddState } from './catalog.js';
import { syncDetailAddState } from './detail.js';
import { showToast } from './toasts.js';

let currentOutput = '';
let copyResetTimer = null;

export function renderCombo(newId = null) {
  const items = state.selected.map(getItem).filter(Boolean);
  const hasItems = items.length > 0;

  els.emptyState.hidden = hasItems;
  els.comboList.hidden = !hasItems;
  els.clearComboBtn.disabled = !hasItems;
  els.builderCount.textContent = String(items.length);
  els.sessionMeta.textContent = formatCount(items.length, 'bloque', 'bloques');
  els.builderStatus.classList.toggle('is-active', hasItems);
  els.builderStatusText.textContent = hasItems
    ? `${items.length === 1 ? '1 BLOQUE' : `${items.length} BLOQUES`} EN SECUENCIA`
    : 'ESPERANDO MÓDULOS';

  els.comboList.innerHTML = items.map((item, index) => {
    const meta = TYPE_META[item.type];
    const isFirst = index === 0;
    const isLast = index === items.length - 1;
    const isNew = item.id === newId;

    return `<li class="combo-item ${meta.className}${isNew ? ' is-new' : ''}" draggable="true" data-id="${escapeHTML(item.id)}" data-type="${escapeHTML(item.type)}">
      <div class="combo-rail">
        <span class="combo-index" aria-hidden="true">${padSequence(index + 1)}</span>
        <span class="combo-grip" aria-hidden="true" title="Arrastra para reordenar">${icon('grip')}</span>
      </div>
      <div class="combo-body">
        <div class="combo-meta">
          <span class="type-badge">${escapeHTML(meta.label)}</span>
          <span class="combo-code">${escapeHTML(item.code || '')}</span>
        </div>
        <button class="combo-title" type="button" data-detail="${escapeHTML(item.id)}" title="Ver ficha de ${escapeHTML(item.title)}">${escapeHTML(item.title)}</button>
        <span class="combo-desc">${escapeHTML(getComboDescription(item))}</span>
      </div>
      <div class="combo-actions" role="group" aria-label="Acciones para ${escapeHTML(item.title)}">
        <button class="action-btn" type="button" data-action="move-up" data-id="${escapeHTML(item.id)}" aria-label="Subir ${escapeHTML(item.title)}" title="Subir"${isFirst ? ' disabled' : ''}>${icon('arrow-up')}</button>
        <button class="action-btn" type="button" data-action="move-down" data-id="${escapeHTML(item.id)}" aria-label="Bajar ${escapeHTML(item.title)}" title="Bajar"${isLast ? ' disabled' : ''}>${icon('arrow-down')}</button>
        <button class="action-btn" type="button" data-action="remove" data-id="${escapeHTML(item.id)}" aria-label="Quitar ${escapeHTML(item.title)} del combo" title="Quitar">${icon('trash')}</button>
      </div>
    </li>`;
  }).join('');

  if (newId) {
    window.requestAnimationFrame(() => {
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      els.sequenceArea.scrollTo({ top: els.sequenceArea.scrollHeight, behavior });
    });
  }
}

export function renderVariables() {
  const variables = getActiveVariables(state.selected);

  if (variables.length === 0) {
    els.variablesSection.hidden = true;
    els.variablesGrid.innerHTML = '';
    els.variableCount.textContent = '0';
    updateVariableWarning();
    return;
  }

  els.variablesSection.hidden = false;
  els.variableCount.textContent = String(variables.length);

  els.variablesGrid.innerHTML = variables.map((variable, index) => {
    const inputId = `variable-${index}`;
    const value = state.vars[variable.token] ?? '';
    const fullClass = variable.multiline ? ' is-full' : '';
    const label = escapeHTML(variable.label);
    const token = escapeHTML(variable.token);
    const placeholder = escapeHTML(variable.placeholder || '');
    const field = variable.multiline
      ? `<textarea class="variable-input" id="${inputId}" rows="2" maxlength="4000" data-var-token="${token}" placeholder="${placeholder}" aria-required="${variable.required ? 'true' : 'false'}">${escapeHTML(value)}</textarea>`
      : `<input class="variable-input" id="${inputId}" type="text" maxlength="1000" data-var-token="${token}" placeholder="${placeholder}" value="${escapeHTML(value)}" aria-required="${variable.required ? 'true' : 'false'}">`;

    return `<div class="variable-field${fullClass}">
      <div class="variable-label-row">
        <label class="variable-label" for="${inputId}">${label}</label>
        <span class="variable-token" title="Token sustituido en el prompt">${token}</span>
      </div>
      ${field}
    </div>`;
  }).join('');

  updateVariableWarning();
}

function updateVariableWarning() {
  const variables = getActiveVariables(state.selected);
  const missing = variables.filter((variable) => !String(state.vars[variable.token] || '').trim());
  const hasValues = variables.some((variable) => String(state.vars[variable.token] || '').length > 0);

  els.resetVarsBtn.disabled = !hasValues;
  els.variableWarning.hidden = missing.length === 0;

  if (missing.length > 0) {
    els.variableWarning.textContent = missing.length === 1
      ? '1 variable sin completar'
      : `${missing.length} variables sin completar`;
    els.variableWarning.title = `Pendientes: ${missing.map((variable) => variable.label).join(', ')}`;
  } else {
    els.variableWarning.textContent = '';
    els.variableWarning.removeAttribute('title');
  }
}

function resetCopyFeedback() {
  if (copyResetTimer) {
    window.clearTimeout(copyResetTimer);
    copyResetTimer = null;
  }

  const label = els.copyBtn.querySelector('.copy-label');
  const use = els.copyBtn.querySelector('use');
  els.copyBtn.classList.remove('is-copied');
  if (label) label.textContent = 'Copiar prompt maestro';
  if (use) use.setAttribute('href', '#i-copy');
}

export function updateOutput() {
  const items = state.selected.map(getItem).filter(Boolean);
  currentOutput = items.length > 0 ? compilePrompt(items, state.vars) : '';
  const hasOutput = currentOutput.length > 0;
  const previousScroll = els.previewOutput.scrollTop;

  resetCopyFeedback();
  els.previewOutput.textContent = hasOutput ? currentOutput : EMPTY_PREVIEW;

  if (hasOutput) {
    els.previewOutput.scrollTop = previousScroll;
  } else {
    els.previewOutput.scrollTop = 0;
  }

  els.copyBtn.disabled = !hasOutput;
  els.downloadBtn.disabled = !hasOutput;
  els.copyBtn.title = hasOutput ? 'Copiar el prompt maestro compilado' : 'Añade módulos para compilar el prompt';
  els.downloadBtn.title = hasOutput ? 'Descargar prompt como Markdown' : 'Añade módulos para descargar el prompt';
  els.charCount.textContent = formatCount(currentOutput.length, 'carácter', 'caracteres');
  els.previewLines.textContent = currentOutput
    ? formatCount(currentOutput.split('\n').length, 'línea', 'líneas')
    : '0 líneas';
  els.blockCount.textContent = formatCount(state.selected.length, 'bloque', 'bloques');
  updateVariableWarning();
}

export function renderAll(newId = null) {
  renderCombo(newId);
  syncCatalogAddState();
  renderVariables();
  updateOutput();
  syncDetailAddState();
}

export function addItem(id, { silent = false } = {}) {
  const item = getItem(id);
  if (!item) return false;

  if (state.selected.includes(id)) {
    revealComboItem(id, true);
    return false;
  }

  state.selected.push(id);
  renderAll(id);

  if (!silent) {
    showToast(`Añadido: ${item.title}`, { duration: 1600 });
  }

  return true;
}

export function revealComboItem(id, focus = false) {
  const node = Array.from(els.comboList.querySelectorAll('.combo-item')).find((element) => element.dataset.id === id);
  if (!node) return;

  node.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  node.classList.remove('is-new');
  void node.offsetWidth;
  node.classList.add('is-new');

  if (focus) {
    const title = node.querySelector('.combo-title');
    if (title) title.focus({ preventScroll: true });
  }
}

function focusComboAction(id, action) {
  window.requestAnimationFrame(() => {
    const node = Array.from(els.comboList.querySelectorAll('.combo-item')).find((element) => element.dataset.id === id);
    if (!node) return;

    const button = node.querySelector(`[data-action="${action}"]:not(:disabled)`) || node.querySelector('.combo-title');
    if (button) button.focus({ preventScroll: true });
  });
}

export function removeItem(id) {
  const index = state.selected.indexOf(id);
  const item = getItem(id);
  if (index === -1 || !item) return;

  state.selected.splice(index, 1);
  renderAll();
  showToast(`${item.title} eliminado`, {
    duration: 5000,
    actionLabel: 'Deshacer',
    onAction: () => {
      if (state.selected.includes(id)) return;
      state.selected.splice(Math.min(index, state.selected.length), 0, id);
      renderAll();
      showToast(`${item.title} restaurado`, { tone: 'success', duration: 1600 });
    }
  });

  window.requestAnimationFrame(() => {
    const nextId = state.selected[Math.min(index, state.selected.length - 1)];
    if (nextId) {
      focusComboAction(nextId, 'remove');
    } else {
      els.catalogSearch.focus();
    }
  });
}

export function moveItem(id, direction) {
  const index = state.selected.indexOf(id);
  const newIndex = index + direction;

  if (index === -1 || newIndex < 0 || newIndex >= state.selected.length) return;

  [state.selected[index], state.selected[newIndex]] = [state.selected[newIndex], state.selected[index]];
  renderAll();
  focusComboAction(id, direction < 0 ? 'move-up' : 'move-down');
}

export function reorderSelected(sourceId, targetId, afterTarget) {
  if (sourceId === targetId) return false;

  const filtered = state.selected.filter((id) => id !== sourceId);
  let targetIndex = filtered.indexOf(targetId);
  if (targetIndex === -1) return false;
  if (afterTarget) targetIndex += 1;

  filtered.splice(targetIndex, 0, sourceId);

  const changed = filtered.join('|') !== state.selected.join('|');
  state.selected = filtered;
  return changed;
}

export function clearDropIndicators() {
  for (const node of els.comboList.querySelectorAll('.drop-before, .drop-after')) {
    node.classList.remove('drop-before', 'drop-after');
  }
}

export function captureSession() {
  return {
    selected: [...state.selected],
    vars: { ...state.vars }
  };
}

export function restoreSession(snapshot) {
  state.selected = [...snapshot.selected];
  state.vars = { ...snapshot.vars };
  renderAll();
}

export function clearVariables() {
  const variables = getActiveVariables(state.selected);
  if (variables.length === 0) return;

  for (const variable of variables) {
    delete state.vars[variable.token];
  }

  renderVariables();
  updateOutput();
  showToast('Variables restablecidas', { duration: 1600 });
}

async function copyToClipboard(text) {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fallback controlado para contextos de archivo o permisos restringidos.
    }
  }

  const activeElement = document.activeElement;
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.setAttribute('aria-hidden', 'true');
  area.style.position = 'fixed';
  area.style.top = '-1000px';
  area.style.left = '-1000px';
  area.style.opacity = '0';
  document.body.append(area);
  area.focus();
  area.select();

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch (error) {
    copied = false;
  }

  area.remove();

  if (activeElement && typeof activeElement.focus === 'function' && activeElement.isConnected) {
    activeElement.focus({ preventScroll: true });
  }

  return copied;
}

function setCopiedFeedback() {
  const label = els.copyBtn.querySelector('.copy-label');
  const use = els.copyBtn.querySelector('use');

  els.copyBtn.classList.add('is-copied');
  if (label) label.textContent = 'Prompt copiado';
  if (use) use.setAttribute('href', '#i-check');

  if (copyResetTimer) window.clearTimeout(copyResetTimer);
  copyResetTimer = window.setTimeout(() => {
    resetCopyFeedback();
  }, 2400);
}

export async function handleCopy() {
  if (!currentOutput) return;

  els.copyBtn.setAttribute('aria-busy', 'true');
  const copied = await copyToClipboard(currentOutput);
  els.copyBtn.removeAttribute('aria-busy');

  if (copied) {
    setCopiedFeedback();
    showToast('Prompt maestro copiado al portapapeles', { tone: 'success', duration: 2200 });
    return;
  }

  const selection = window.getSelection();
  if (selection) {
    const range = document.createRange();
    range.selectNodeContents(els.previewOutput);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  els.previewOutput.focus({ preventScroll: true });
  showToast('No se pudo copiar automáticamente. El texto quedó seleccionado para copiarlo manualmente.', {
    tone: 'error',
    duration: 5200
  });
}

export function handleDownload() {
  if (!currentOutput) return;

  const blob = new Blob([`${currentOutput}\n`], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'promptcombo-maestro.md';
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('Prompt descargado como Markdown', { tone: 'success', duration: 2000 });
}
