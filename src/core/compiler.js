/* Compilador determinista: transforma módulos ordenados en un prompt maestro. */
import { TYPE_META } from '../data/catalog.js';
import { padSequence } from './format.js';

function numbered(items) {
  return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
}

function bulleted(items) {
  return items.map((item) => `- ${item}`).join('\n');
}

function getVariablesForItems(items) {
  const variables = [];
  const seen = new Set();

  for (const item of items) {
    if (item.type !== 'prompt' || !Array.isArray(item.variables)) continue;

    for (const variable of item.variables) {
      if (seen.has(variable.token)) continue;
      seen.add(variable.token);
      variables.push(variable);
    }
  }

  return variables;
}

export function applyVariables(text, variables, values) {
  let output = String(text);

  for (const variable of variables) {
    const value = values[variable.token];
    if (typeof value !== 'string' || value.trim() === '') continue;
    output = output.split(variable.token).join(value);
  }

  return output;
}

export function compileBlock(item, index) {
  const meta = TYPE_META[item.type];
  const heading = `[${padSequence(index + 1)}] ${meta.label} · ${item.title.toUpperCase()}`;
  const sections = [];

  if (item.type === 'role') {
    sections.push('Adopta este rol durante la ejecución de este bloque y no asumas responsabilidades de otros roles.');
    sections.push(`Misión: ${item.mission}`);
    sections.push(`Responsabilidades:\n${bulleted(item.responsibilities)}`);
    sections.push(`Entregables:\n${bulleted(item.deliverables)}`);
    sections.push(`Límites:\n${bulleted(item.boundaries)}`);
    sections.push(`Criterios de salida:\n${bulleted(item.exitCriteria)}`);
  }

  if (item.type === 'agent') {
    sections.push('Actúa como agente de decisión. Decide, delega y valida resultados dentro de los límites indicados.');
    sections.push(`Misión: ${item.mission}`);
    if (Array.isArray(item.protocol) && item.protocol.length > 0) {
      sections.push(`Protocolo de decisión:\n${numbered(item.protocol)}`);
    }
    sections.push(`Responsabilidades:\n${bulleted(item.responsibilities)}`);
    sections.push(`Entradas:\n${bulleted(item.inputs)}`);
    sections.push(`Salidas:\n${bulleted(item.outputs)}`);
    sections.push(`Límites:\n${bulleted(item.boundaries)}`);
    sections.push(`Handoff: ${item.handoff}`);
  }

  if (item.type === 'subagent') {
    sections.push('Ejecuta una tarea delimitada. Devuelve el artefacto y la evidencia solicitada; no amplíes el alcance.');
    sections.push(`Misión: ${item.mission}`);
    sections.push(`Responsabilidades:\n${bulleted(item.responsibilities)}`);
    sections.push(`Entradas:\n${bulleted(item.inputs)}`);
    sections.push(`Salidas:\n${bulleted(item.outputs)}`);
    sections.push(`Límites:\n${bulleted(item.boundaries)}`);
    sections.push(`Handoff: ${item.handoff}`);
  }

  if (item.type === 'flow') {
    if (item.when) sections.push(`Aplicar cuando: ${item.when}`);
    const phases = item.steps.map((step, stepIndex) => {
      const lines = [
        `${stepIndex + 1}. ${step.name}`,
        `   Objetivo: ${step.goal}`,
        `   Salida: ${step.output}`
      ];
      if (step.gate) lines.push(`   Puerta de calidad: ${step.gate}`);
      return lines.join('\n');
    }).join('\n\n');
    sections.push(`Fases en orden estricto:\n${phases}`);
    sections.push(`Criterios de cierre:\n${bulleted(item.exitCriteria)}`);
  }

  if (item.type === 'skill') {
    sections.push(`Propósito: ${item.purpose}`);
    sections.push(`Aplicar cuando: ${item.when}`);
    sections.push(`Entradas requeridas:\n${bulleted(item.inputs)}`);
    sections.push(`Procedimiento:\n${numbered(item.procedure)}`);
    sections.push(`Restricciones:\n${bulleted(item.restrictions)}`);
    sections.push(`Salida esperada: ${item.output}`);
    sections.push(`Criterios de aceptación:\n${bulleted(item.acceptance)}`);
  }

  if (item.type === 'prompt') {
    sections.push(`Instrucción de inicio:\n\n${item.text}`);
  }

  if (item.type === 'template') {
    const fence = '```';
    sections.push(`Archivo objetivo: ${item.filename}\nLenguaje: ${item.language}\nUso: ${item.usage}`);
    sections.push(`${fence}${item.language}\n${item.text}\n${fence}`);
  }

  if (item.type === 'scaffold') {
    const fence = '```';
    sections.push(`Estructura de referencia:\n\n${fence}text\n${item.tree}\n${fence}`);
    sections.push(`Uso: ${item.usage}`);
    sections.push(`Reglas de ubicación:\n${bulleted(item.rules)}`);
  }

  return `${heading}\n\n${sections.filter(Boolean).join('\n\n')}`;
}

export function compilePrompt(items, values = {}) {
  if (!Array.isArray(items) || items.length === 0) return '';

  const blocks = items.map(compileBlock);
  const protocol = [
    '# PROMPT MAESTRO · PROMPTCOMBO',
    '',
    '## PROTOCOLO DE ORQUESTACIÓN',
    '',
    'Ejecuta el siguiente trabajo respetando el orden de los bloques. Cada bloque define una responsabilidad, un procedimiento o una fase. No omitas sus criterios de aceptación.',
    '',
    'Reglas globales:',
    '1. Mantén la secuencia indicada y completa cada puerta de calidad antes de avanzar.',
    '2. No inventes requisitos, archivos, dependencias ni resultados de pruebas.',
    '3. Si falta información crítica, formula preguntas concretas y declara el impacto del bloqueo.',
    '4. Distingue hechos verificables, supuestos y riesgos en todas tus conclusiones.',
    '5. Entrega evidencia de lo que ejecutaste y no declares éxito sin verificación.',
    '',
    '---',
    '',
    blocks.join('\n\n---\n\n'),
    '',
    '---',
    '',
    '## CIERRE OBLIGATORIO',
    '',
    'Antes de finalizar, entrega un checklist con:',
    '- Resultado producido y ubicación de cada entregable.',
    '- Criterios de aceptación verificados y evidencia asociada.',
    '- Supuestos aplicados y preguntas que siguen abiertas.',
    '- Riesgos residuales y siguientes pasos recomendados.'
  ];

  return applyVariables(protocol.join('\n'), getVariablesForItems(items), values);
}
