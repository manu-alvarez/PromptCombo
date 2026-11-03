/* Estado de la sesión. La persistencia local es opcional y se gestiona aparte. */
import { GROUPS } from '../data/catalog.js';

export const state = {
  selected: [],
  vars: {},
  query: '',
  openGroups: Object.fromEntries(GROUPS.map((group) => [group.key, group.defaultOpen]))
};
