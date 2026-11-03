/* Catálogo: búsqueda normalizada, acordeones y estado de los botones de alta. */
import { GROUPS, TOTAL_ITEMS, TYPE_META } from '../data/catalog.js';
import { state } from '../core/state.js';
import { els } from '../core/dom.js';
import { escapeHTML, icon, normalizeSearch } from '../core/format.js';
import { SEARCH_INDEX, getItem } from '../core/items.js';

function renderCatalogItem(item) {
  const meta = TYPE_META[item.type];
  const added = state.selected.includes(item.id);
  const label = added
    ? `${item.title} ya está en el combo. Ir al bloque.`
    : `Añadir ${item.title} al combo`;
  const libraryBadge = item.source === 'library'
    ? `<span class="catalog-status catalog-status-${escapeHTML(item.status || 'experimental')}" title="Recurso de biblioteca · ${escapeHTML(item.status || 'experimental')}">${escapeHTML(item.status || 'experimental')}</span>`
    : '';

  return `<li class="catalog-item ${meta.className}${added ? ' is-added' : ''}" data-item-id="${escapeHTML(item.id)}">
    <span class="catalog-glyph" aria-hidden="true">${escapeHTML(item.short || '')}</span>
    <div class="catalog-copy">
      <div class="catalog-title-row">
        <button class="catalog-title" type="button" data-detail="${escapeHTML(item.id)}" title="Ver ficha de ${escapeHTML(item.title)}">${escapeHTML(item.title)}</button>
        ${libraryBadge}
      </div>
      <p class="catalog-desc">${escapeHTML(item.tagline || '')}</p>
    </div>
    <button class="add-btn${added ? ' is-added' : ''}" type="button" data-add="${escapeHTML(item.id)}" aria-label="${escapeHTML(label)}" title="${added ? 'Ya en el combo' : 'Añadir al combo'}">
      ${icon(added ? 'check' : 'plus')}
    </button>
  </li>`;
}

export function renderCatalog() {
  const query = normalizeSearch(state.query);
  const previousScroll = els.catalogScroll.scrollTop;
  let visibleCount = 0;
  const sections = [];

  for (const group of GROUPS) {
    const matches = query
      ? group.items.filter((item) => SEARCH_INDEX.get(item.id).includes(query))
      : group.items;

    if (query && matches.length === 0) continue;

    visibleCount += matches.length;
    const isOpen = query ? true : Boolean(state.openGroups[group.key]);
    const groupCount = query ? `${matches.length}/${group.items.length}` : String(group.items.length);

    sections.push(`<details class="catalog-group" data-group="${escapeHTML(group.key)}"${isOpen ? ' open' : ''}>
      <summary>
        <span class="group-index" aria-hidden="true">${escapeHTML(group.index)}</span>
        <span class="group-title">${escapeHTML(group.title)}</span>
        <span class="group-count">${escapeHTML(groupCount)}</span>
        <svg class="icon group-chevron" aria-hidden="true"><use href="#i-chevron"></use></svg>
      </summary>
      <ul class="catalog-list">${matches.map(renderCatalogItem).join('')}</ul>
    </details>`);
  }

  els.catalogGroups.innerHTML = sections.join('');
  els.catalogGroups.hidden = visibleCount === 0;
  els.noResults.hidden = visibleCount !== 0;
  els.catalogCount.textContent = String(visibleCount);
  els.catalogFooterMeta.textContent = query
    ? `${visibleCount} de ${TOTAL_ITEMS} módulos · filtro activo`
    : `${TOTAL_ITEMS} módulos indexados · sesión local`;
  els.clearSearchBtn.hidden = state.query.length === 0;
  els.catalogSearch.value = state.query;

  if (!query) {
    for (const details of els.catalogGroups.querySelectorAll('.catalog-group')) {
      const groupKey = details.dataset.group;
      details.addEventListener('toggle', () => {
        if (!state.query) state.openGroups[groupKey] = details.open;
      });
    }
  }

  syncCatalogAddState();
  els.catalogScroll.scrollTop = Math.min(previousScroll, els.catalogScroll.scrollHeight);
}

export function syncCatalogAddState() {
  const selectedSet = new Set(state.selected);

  for (const itemNode of els.catalogGroups.querySelectorAll('.catalog-item')) {
    const id = itemNode.dataset.itemId;
    const button = itemNode.querySelector('[data-add]');
    if (!button) continue;

    const added = selectedSet.has(id);
    itemNode.classList.toggle('is-added', added);
    button.classList.toggle('is-added', added);
    button.innerHTML = icon(added ? 'check' : 'plus');
    button.title = added ? 'Ya en el combo' : 'Añadir al combo';
    button.setAttribute('aria-label', added
      ? `${getItem(id)?.title || 'Módulo'} ya está en el combo. Ir al bloque.`
      : `Añadir ${getItem(id)?.title || 'módulo'} al combo`);
  }
}

export function setSearchQuery(query) {
  state.query = query;
  renderCatalog();
}

export function clearSearch({ focus = true } = {}) {
  state.query = '';
  renderCatalog();
  if (focus) els.catalogSearch.focus();
}

export function focusCatalogSearch() {
  els.catalogSearch.focus();
  els.catalogSearch.select();
}
