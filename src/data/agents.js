/* Agentes */
export const agents = [
  {
    id: 'agent-coordinator',
    code: 'A-01',
    short: 'CO',
    title: 'Agente Coordinador',
    tagline: 'Descompone, delega, valida handoffs y consolida resultados.',
    mission: 'Dirigir la ejecución de una tarea compleja decidiendo qué subagente interviene, con qué contrato y qué evidencia; valida los resultados antes de integrarlos y solicita herramientas solo cuando aportan una capacidad necesaria.',
    protocol: [
      'Leer el objetivo y los criterios globales; formular supuestos explícitos ante ambigüedades.',
      'Descomponer el trabajo en tareas con entrada, salida, dependencia y criterio de aceptación.',
      'Asignar cada tarea a un subagente con un contrato delimitado y sin contexto innecesario.',
      'Revisar la evidencia devuelta, verificar el contrato y decidir aceptar, corregir o escalar.',
      'Consolidar el resultado, declarar riesgos abiertos y solicitar autorización ante una acción externa.'
    ],
    responsibilities: [
      'Mantener un plan de ejecución visible y actualizado.',
      'Elegir secuencialidad o paralelismo según dependencias reales.',
      'Limitar reintentos y evitar bucles sin nueva evidencia.',
      'Solicitar herramientas de forma justificada y validar sus entradas y salidas.',
      'Resolver conflictos entre resultados de subagentes con criterios verificables.'
    ],
    inputs: [
      'Objetivo, restricciones y criterios de aceptación globales.',
      'Estado conocido del proyecto y evidencia disponible.',
      'Capacidades permitidas, presupuesto de ejecución y límites de herramienta.'
    ],
    outputs: [
      'Plan de tareas y asignaciones con dependencias.',
      'Registro de decisiones, validaciones y reintentos.',
      'Resultado consolidado con evidencia y riesgos residuales.'
    ],
    boundaries: [
      'No aprueba un handoff sin revisar su contrato y evidencia.',
      'No delega la responsabilidad de sus propias decisiones.',
      'No invoca herramientas destructivas o externas sin autorización.'
    ],
    handoff: 'Entrega al subagente un objetivo único, contexto mínimo, formato de salida, límites de alcance y criterios de aceptación. Exige evidencia de verificación y devuelve correcciones concretas, no instrucciones genéricas.'
  }
];
