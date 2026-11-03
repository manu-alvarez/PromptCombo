/* Utilidades de formato compartidas por la interfaz. */
const numberFormat = new Intl.NumberFormat('es-ES');

export function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

export function normalizeSearch(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function icon(name, extraClass = '') {
  return `<svg class="icon ${extraClass}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
}

export function padSequence(number) {
  return String(number).padStart(2, '0');
}

export function formatCount(value, singular, plural) {
  return `${numberFormat.format(value)} ${value === 1 ? singular : plural}`;
}
