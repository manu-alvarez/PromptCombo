/* Fichas de detalle en un diálogo modal nativo. */
import { GROUPS, TYPE_META, getItem } from '../data/catalog.js';
import { state } from '../core/state.js';
import { els } from '../core/dom.js';
import { escapeHTML, icon, padSequence } from '../core/format.js';

let currentDetailId = null;
let detailReturnFocus = null;

export function getCurrentDetailId() {
  return currentDetailId;
}

function renderDetailList(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return '<p class="detail-empty">Sin elementos.</p>';
  }

  return `<ul>${items.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul>`;
}

function renderDetailNumbered(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return '<p class="detail-empty">Sin pasos definidos.</p>';
  }

  return `<ol>${items.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ol>`;
}

function detailBlock(title, content, full = false) {
  return `<section class="detail-block${full ? ' detail-block-full' : ''}">
    <h3>${escapeHTML(title)}</h3>
    ${content}
  </section>`;
}

function renderDetail(item) {
  const lead = `<div class="detail-lead">
    <span class="detail-type-chip">${escapeHTML(TYPE_META[item.type].label)}</span>
    <p class="detail-tagline">${escapeHTML(item.tagline || '')}</p>
  </div>`;

  if (item.type === 'role') {
    return lead + `<div class="detail-grid">
      ${detailBlock('Misión', `<p>${escapeHTML(item.mission)}</p>`, true)}
      ${detailBlock('Responsabilidades', renderDetailList(item.responsibilities))}
      ${detailBlock('Entregables', renderDetailList(item.deliverables))}
      ${detailBlock('Límites', renderDetailList(item.boundaries))}
      ${detailBlock('Criterios de salida', renderDetailList(item.exitCriteria))}
    </div>`;
  }

  if (item.type === 'agent' || item.type === 'subagent') {
    const protocol = Array.isArray(item.protocol)
      ? detailBlock('Protocolo de decisión', renderDetailNumbered(item.protocol), true)
      : '';

    return lead + `<div class="detail-grid">
      ${detailBlock('Misión', `<p>${escapeHTML(item.mission)}</p>`, true)}
      ${protocol}
      ${detailBlock('Responsabilidades', renderDetailList(item.responsibilities))}
      ${detailBlock('Entradas', renderDetailList(item.inputs))}
      ${detailBlock('Salidas', renderDetailList(item.outputs))}
      ${detailBlock('Límites', renderDetailList(item.boundaries))}
      ${detailBlock('Handoff', `<p>${escapeHTML(item.handoff)}</p>`, true)}
    </div>`;
  }

  if (item.type === 'flow') {
    const steps = `<ol class="detail-steps">${item.steps.map((step, index) => `<li class="detail-step">
      <span class="detail-step-index">${padSequence(index + 1)}</span>
      <div>
        <h4>${escapeHTML(step.name)}</h4>
        <p>${escapeHTML(step.goal)}</p>
        <div class="detail-step-meta">
          <span><strong>Salida:</strong> ${escapeHTML(step.output)}</span>
          <span><strong>Puerta:</strong> ${escapeHTML(step.gate || 'No definida')}</span>
        </div>
      </div>
    </li>`).join('')}</ol>`;

    return lead + `<div class="detail-grid">
      ${detailBlock('Cuándo aplicarlo', `<p>${escapeHTML(item.when)}</p>`, true)}
      ${detailBlock('Fases en orden', steps, true)}
      ${detailBlock('Criterios de cierre', renderDetailList(item.exitCriteria), true)}
    </div>`;
  }

  if (item.type === 'skill') {
    return lead + `<div class="detail-grid">
      ${detailBlock('Propósito', `<p>${escapeHTML(item.purpose)}</p>`, true)}
      ${detailBlock('Cuándo usarla', `<p>${escapeHTML(item.when)}</p>`, true)}
      ${detailBlock('Entradas', renderDetailList(item.inputs))}
      ${detailBlock('Restricciones', renderDetailList(item.restrictions))}
      ${detailBlock('Procedimiento', renderDetailNumbered(item.procedure), true)}
      ${detailBlock('Salida', `<p>${escapeHTML(item.output)}</p>`)}
      ${detailBlock('Criterios de Aceptación', renderDetailList(item.acceptance))}
      ${detailBlock('Ejemplo', `<p class="detail-text">${escapeHTML(item.example)}</p>`, true)}
    </div>`;
  }

  if (item.type === 'prompt') {
    const variableChips = item.variables.map((variable) => `<span class="detail-var-chip" title="${escapeHTML(variable.label)}">${escapeHTML(variable.token)}</span>`).join('');
    const variableList = item.variables.map((variable) => `${variable.label} — ${variable.token}`);

    return lead + `${variableChips ? `<div class="detail-vars">${variableChips}</div>` : ''}<div class="detail-grid">
      ${detailBlock('Cuándo usarla', `<p>${escapeHTML(item.usage)}</p>`, true)}
      ${detailBlock('Variables', renderDetailList(variableList), true)}
      ${detailBlock('Plantilla', `<pre class="detail-pre">${escapeHTML(item.text)}</pre>`, true)}
    </div>`;
  }

  if (item.type === 'template') {
    const facts = `<div class="detail-facts">
      <div class="detail-fact"><span class="detail-fact-label">Archivo</span><span class="detail-fact-value">${escapeHTML(item.filename)}</span></div>
      <div class="detail-fact"><span class="detail-fact-label">Lenguaje</span><span class="detail-fact-value">${escapeHTML(item.language)}</span></div>
    </div>`;

    return lead + facts + `<div class="detail-grid">
      ${detailBlock('Uso', `<p>${escapeHTML(item.usage)}</p>`, true)}
      ${detailBlock('Contenido', `<pre class="detail-pre">${escapeHTML(item.text)}</pre>`, true)}
    </div>`;
  }

  if (item.type === 'scaffold') {
    return lead + `<div class="detail-grid">
      ${detailBlock('Uso', `<p>${escapeHTML(item.usage)}</p>`, true)}
      ${detailBlock('Estructura', `<pre class="detail-pre">${escapeHTML(item.tree)}</pre>`, true)}
      ${detailBlock('Reglas de ubicación', renderDetailList(item.rules), true)}
    </div>`;
  }

  return lead;
}

export function syncDetailAddState() {
  if (!currentDetailId) return;
  const added = state.selected.includes(currentDetailId);
  els.detailAdd.disabled = added;
  els.detailAdd.innerHTML = `${icon(added ? 'check' : 'plus')}<span>${added ? 'Ya en el combo' : 'Añadir al combo'}</span>`;
}

export function openDetail(id) {
  const item = getItem(id);
  if (!item) return;

  const meta = TYPE_META[item.type];
  const group = GROUPS.find((entry) => entry.key === item.groupKey);

  currentDetailId = id;
  detailReturnFocus = document.activeElement;
  document.body.classList.add('dialog-open');
  els.detailDialog.className = `detail-dialog ${meta.className}`;
  els.detailType.textContent = `FICHA · ${meta.label}`;
  els.detailTitle.textContent = item.title;
  els.detailCode.textContent = `${item.code || ''}${group ? ` · ${group.title}` : ''}`;
  els.detailContent.innerHTML = renderDetail(item);
  syncDetailAddState();

  if (typeof els.detailDialog.showModal === 'function') {
    if (!els.detailDialog.open) els.detailDialog.showModal();
  } else {
    els.detailDialog.setAttribute('open', '');
  }

  els.detailContent.scrollTop = 0;
}

export function closeDetail() {
  if (typeof els.detailDialog.close === 'function' && els.detailDialog.open) {
    els.detailDialog.close();
  } else {
    els.detailDialog.removeAttribute('open');
    handleDetailClose();
  }
}

function handleDetailClose() {
  currentDetailId = null;
  document.body.classList.remove('dialog-open');
  if (detailReturnFocus && detailReturnFocus.isConnected) {
    detailReturnFocus.focus({ preventScroll: true });
  }
  detailReturnFocus = null;
}

export function bindDetailDialog() {
  els.detailDialog.addEventListener('click', (event) => {
    if (event.target === els.detailDialog) closeDetail();
  });

  els.detailDialog.addEventListener('close', handleDetailClose);
}
