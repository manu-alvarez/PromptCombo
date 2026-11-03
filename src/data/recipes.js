/* Recetas de sesión y estado vacío del preview. */
export const RECIPES = {
  pwa: {
    title: 'PWA desde cero',
    ids: [
      'prompt-kickoff',
      'role-analyst',
      'role-architect',
      'flow-initialization',
      'flow-development',
      'skill-pwa-architecture',
      'skill-ui-symmetric',
      'skill-service-workers'
    ],
    vars: {
      '[DESCRIPCIÓN]': 'PromptCombo: una PWA offline de una sola página para seleccionar roles, agentes, flujos, skills y plantillas, ordenarlos y copiar un prompt maestro verificable.',
      '[STACK]': 'HTML5, CSS3 y Vanilla JS en un único index.html. Sin frameworks ni peticiones de red.',
      '[OBJETIVO]': 'Permitir que una persona componga y copie un prompt maestro completo en menos de un minuto, con una interfaz clara y accesible.',
      '[RESTRICCIONES]': 'Cero dependencias externas, persistencia local opcional, soporte completo de teclado y diseño responsive. Debe funcionar abriendo el archivo en local.'
    }
  },
  audit: {
    title: 'Auditoría exprés',
    ids: [
      'prompt-audit',
      'role-qa',
      'subagent-review',
      'flow-validation',
      'skill-input-security',
      'skill-unit-testing',
      'skill-accessibility-audit',
      'skill-error-handling'
    ],
    vars: {
      '[PROYECTO]': 'PromptCombo · dist/index.html y módulos de src/',
      '[STACK]': 'HTML, CSS y JavaScript vanilla con build determinista a un único archivo. Sin dependencias en el artefacto final.',
      '[SÍNTOMAS]': 'Posible XSS en renderizado dinámico, copia fallida en contextos restringidos y navegación incompleta por teclado.',
      '[ALCANCE]': 'Revisión de seguridad de entradas, accesibilidad de los flujos principales y manejo de errores. Excluye rediseño visual.'
    }
  },
  blueprint: {
    title: 'Blueprint de producto',
    ids: [
      'prompt-kickoff',
      'role-analyst',
      'role-architect',
      'role-planner',
      'skill-requirements-analysis',
      'skill-data-modeling',
      'skill-api-design',
      'scaffold-feature-first'
    ],
    vars: {
      '[DESCRIPCIÓN]': 'Una herramienta para equipos que quieren convertir una idea en un plan técnico con alcance, arquitectura, modelo de datos y API.',
      '[STACK]': 'Decisión pendiente. Priorizar tecnologías mantenidas, despliegue simple y nula dependencia innecesaria.',
      '[OBJETIVO]': 'Producir un blueprint ejecutable y priorizado antes de escribir código.',
      '[RESTRICCIONES]': 'No se permite implementar funcionalidad en esta fase. Toda decisión debe quedar documentada y ser reversible.'
    }
  }
};

export const EMPTY_PREVIEW = `# PROMPT MAESTRO · PENDIENTE

El lienzo está vacío.

1. Empieza con un prompt de inicio o un rol que defina la responsabilidad.
2. Añade skills para aportar procedimientos verificables.
3. Ordena los flujos por fase y revisa las variables.
4. Copia el prompt maestro cuando el orden y la salida estén listos.

El motor compila todos los bloques en una única instrucción determinista.`;
