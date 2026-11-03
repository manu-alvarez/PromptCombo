/* Catálogo canónico: agrupa todos los módulos y deriva los índices de búsqueda. */
import { prompts } from './prompts.js';
import { roles } from './roles.js';
import { flows } from './flows.js';
import { agents } from './agents.js';
import { subagents } from './subagents.js';
import { skills } from './skills/index.js';
import { libraryRoles, librarySkills } from './library-modules.js';
import { templates } from './templates.js';
import { scaffolds } from './scaffolds.js';

export const TYPE_META = {
  role: { label: 'ROL', className: 'type-role' },
  agent: { label: 'AGENTE', className: 'type-agent' },
  subagent: { label: 'SUBAGENTE', className: 'type-subagent' },
  flow: { label: 'FLUJO', className: 'type-flow' },
  skill: { label: 'SKILL', className: 'type-skill' },
  prompt: { label: 'PROMPT', className: 'type-prompt' },
  template: { label: 'PLANTILLA', className: 'type-template' },
  scaffold: { label: 'SCAFFOLDING', className: 'type-scaffold' }
};

export const GROUP_DEFS = [
  { key: 'prompts', index: '01', title: 'Prompts de inicio', type: 'prompt', items: prompts, defaultOpen: true },
  { key: 'roles', index: '02', title: 'Roles / Asistentes', type: 'role', items: [...roles, ...libraryRoles], defaultOpen: true },
  { key: 'flows', index: '03', title: 'Flujos por fases', type: 'flow', items: flows, defaultOpen: false },
  { key: 'agents', index: '04', title: 'Agentes', type: 'agent', items: agents, defaultOpen: false },
  { key: 'subagents', index: '05', title: 'Subagentes', type: 'subagent', items: subagents, defaultOpen: false },
  { key: 'skills', index: '06', title: 'Skills · procedimientos', type: 'skill', items: [...skills, ...librarySkills], defaultOpen: false },
  { key: 'templates', index: '07', title: 'Plantillas de archivos', type: 'template', items: templates, defaultOpen: false },
  { key: 'scaffolds', index: '08', title: 'Scaffoldings', type: 'scaffold', items: scaffolds, defaultOpen: false }
];

export const GROUPS = GROUP_DEFS.map((group) => ({
  ...group,
  items: group.items.map((item) => ({ ...item, type: group.type, groupKey: group.key }))
}));

export const ALL_ITEMS = GROUPS.flatMap((group) => group.items);
export const ITEM_MAP = new Map(ALL_ITEMS.map((item) => [item.id, item]));
export const TOTAL_ITEMS = ALL_ITEMS.length;

export function getItem(id) {
  return ITEM_MAP.get(id) || null;
}
