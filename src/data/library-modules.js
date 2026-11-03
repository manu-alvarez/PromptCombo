/* Adapta recursos composables de la biblioteca al formato del catálogo avanzado. */
import { LIBRARY_RESOURCES } from './library-resources.js';
import { roles as legacyRoles } from './roles.js';
import { skills as legacySkills } from './skills/index.js';

const legacySkillIds = new Set(legacySkills.map((skill) => skill.id));
const legacyRoleIds = new Set(legacyRoles.map((role) => role.id));

const newSkillResources = LIBRARY_RESOURCES.filter((resource) => resource.type === 'skill' && !legacySkillIds.has(resource.id));
const newRoleResources = LIBRARY_RESOURCES.filter((resource) => resource.type === 'role' && !legacyRoleIds.has(resource.id));

export const librarySkills = newSkillResources.map((resource, index) => {
  const content = resource.content || {};
  return {
    id: resource.id,
    code: `S-${String(31 + index).padStart(2, '0')}`,
    short: `L${String(index + 1).padStart(2, '0')}`,
    title: resource.title,
    tagline: resource.summary,
    purpose: content.purpose || resource.objective,
    when: content.when || resource.useWhen,
    inputs: content.inputs || resource.inputs || [],
    procedure: content.procedure || [],
    restrictions: content.restrictions || [],
    output: content.output || resource.outputs?.[0] || resource.objective,
    acceptance: content.acceptance || [],
    example: content.example || 'Sin ejemplo declarado.'
  };
});

export const libraryRoles = newRoleResources.map((resource, index) => {
  const content = resource.content || {};
  return {
    id: resource.id,
    code: `R-${String(8 + index).padStart(2, '0')}`,
    short: `LR${String(index + 1).padStart(2, '0')}`,
    title: resource.title,
    tagline: resource.summary,
    mission: content.mission || resource.objective,
    responsibilities: content.responsibilities || [],
    deliverables: content.evidence || content.outputs || [resource.objective],
    boundaries: content.boundaries || [],
    exitCriteria: [content.output || resource.outputs?.[0] || resource.objective]
  };
});
