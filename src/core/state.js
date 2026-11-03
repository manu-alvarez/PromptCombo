/* Estado efímero de la sesión. No se persiste fuera de la pestaña. */
import { GROUPS } from '../data/catalog.js';

export const state = {
  selected: [],
  vars: {},
  query: '',
  openGroups: Object.fromEntries(GROUPS.map((group) => [group.key, group.defaultOpen]))
};
