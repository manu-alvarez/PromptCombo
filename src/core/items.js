/* Derivaciones sobre el catálogo: variables activas, búsqueda y descripciones. */
import { GROUPS, ITEM_MAP, TYPE_META, getItem } from '../data/catalog.js';
import { formatCount, normalizeSearch } from './format.js';

export { getItem };

export function getActiveVariables(selectedIds) {
  const variables = [];
  const seen = new Set();

  for (const id of selectedIds) {
    const item = getItem(id);
    if (!item || item.type !== 'prompt' || !Array.isArray(item.variables)) continue;

    for (const variable of item.variables) {
      if (seen.has(variable.token)) continue;
      seen.add(variable.token);
      variables.push(variable);
    }
  }

  return variables;
}

function buildSearchText(item, group) {
  const chunks = [
    group.title,
    TYPE_META[item.type].label,
    item.code,
    item.short,
    item.title,
    item.tagline,
    item.purpose,
    item.when,
    item.mission,
    item.usage,
    item.filename,
    item.output
  ].filter(Boolean);

  const arrayFields = [
    item.roles,
    item.responsibilities,
    item.deliverables,
    item.boundaries,
    item.exitCriteria,
    item.inputs,
    item.procedure,
    item.restrictions,
    item.acceptance,
    item.protocol,
    item.rules
  ];

  for (const field of arrayFields) {
    if (Array.isArray(field)) chunks.push(field.join(' '));
  }

  return normalizeSearch(chunks.join(' '));
}

export const SEARCH_INDEX = new Map(
  GROUPS.flatMap((group) => group.items.map((item) => [item.id, buildSearchText(item, group)]))
);

export function getComboDescription(item) {
  if (item.type === 'flow') {
    return item.steps.map((step) => step.name).join(' → ');
  }

  if (item.type === 'prompt') {
    const count = item.variables.length;
    return `${formatCount(count, 'variable', 'variables')} · instrucción de inicio`;
  }

  if (item.type === 'template') {
    return item.filename;
  }

  if (item.type === 'scaffold') {
    return item.tagline;
  }

  return item.tagline;
}
