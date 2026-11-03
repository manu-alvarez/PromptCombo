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

export function slugify(value, fallback = 'proyecto') {
  const slug = normalizeSearch(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

  return slug || fallback;
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
