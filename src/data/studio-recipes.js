/* Catálogo de recetas del generador guiado. Datos puros, sin DOM. */

export const FAMILIES = [
  {
    id: 'prompts',
    title: 'Prompts',
    description: 'Instrucciones para tareas, investigación, programación, revisión y extracción.',
    example: 'Quiero un prompt para investigar competidores.'
  },
  {
    id: 'instructions',
    title: 'Instrucciones de repositorio',
    description: 'AGENTS.md, Cursor, Claude Code y GitHub Copilot.',
    example: 'Necesito un AGENTS.md para un proyecto Python.'
  },
  {
    id: 'skills',
    title: 'Skills',
    description: 'Procedimientos y paquetes con SKILL.md, referencias y plantillas.',
    example: 'Necesito una skill para revisar pull requests.'
  },
  {
    id: 'agents',
    title: 'Agentes',
    description: 'Contratos de misión, herramientas, límites, delegación y evaluación.',
    example: 'Quiero el contrato de un agente coordinador.'
  },
  {
    id: 'commands',
    title: 'Comandos',
    description: 'Procedimientos reutilizables para planificar, implementar y revisar.',
    example: 'Quiero un paquete de comandos para mi equipo.'
  },
  {
    id: 'projects',
    title: 'Proyectos',
    description: 'Árbol, README, configuración, arquitectura y ADR coherentes.',
    example: 'Quiero la estructura de una app con frontend y API.'
  },
  {
    id: 'design',
    title: 'Diseño y frontend',
    description: 'Brief, arquitectura de información, pantallas, componentes y tokens.',
    example: 'Necesito el brief y las pantallas de un dashboard.'
  },
  {
    id: 'validation',
    title: 'Validación',
    description: 'Testing, criterios de aceptación, esquemas JSON y casos de prueba.',
    example: 'Quiero un paquete con prompt, esquema JSON y casos de prueba.'
  }
];

export const TARGETS = {
  markdown: { id: 'markdown', label: 'Markdown genérico', note: 'Archivos .md sin frontmatter de cliente.' },
  agents: { id: 'agents', label: 'AGENTS.md', note: 'Convención abierta para agentes de código.' },
  cursor: { id: 'cursor', label: 'Cursor · .mdc', note: 'Reglas de proyecto en .cursor/rules/*.mdc.' },
  claude: { id: 'claude', label: 'Claude Code · CLAUDE.md', note: 'Contexto de proyecto en CLAUDE.md.' },
  copilot: { id: 'copilot', label: 'GitHub Copilot', note: 'Instrucciones generales y por ruta.' },
  skill: { id: 'skill', label: 'Agent Skills', note: 'Paquete con SKILL.md y recursos.' },
  'json-schema': { id: 'json-schema', label: 'JSON Schema', note: 'Esquema y ejemplos validables.' }
};

const common = () => [
  {
    id: 'goal',
    label: 'Objetivo',
    type: 'textarea',
    required: true,
    rows: 3,
    example: 'Permitir que el equipo gestione inventario sin hojas de cálculo.',
    help: 'Describe el resultado observable, no la tecnología.'
  },
  {
    id: 'audience',
    label: 'Audiencia',
    type: 'text',
    default: 'Equipo de desarrollo',
    example: 'Equipo de operaciones y desarrollo',
    help: 'Quién usará o mantendrá el resultado.'
  },
  {
    id: 'stack',
    label: 'Stack o entorno',
    type: 'text',
    default: 'Tecnologías del proyecto',
    example: 'Python 3.12, FastAPI, PostgreSQL',
    help: 'Lenguajes, frameworks y restricciones técnicas relevantes.'
  },
  {
    id: 'constraints',
    label: 'Restricciones',
    type: 'textarea',
    rows: 2,
    default: 'Sin restricciones adicionales.',
    example: 'Sin dependencias externas; accesibilidad AA; sin datos personales.',
    help: 'Incluye límites de alcance, seguridad o compatibilidad.'
  }
];

const promptSpecific = () => [
  {
    id: 'promptType',
    label: 'Tipo de prompt',
    type: 'select',
    default: 'task',
    options: [
      ['task', 'Tarea general'],
      ['system', 'Sistema o instrucciones'],
      ['coding', 'Programación'],
      ['debugging', 'Debugging'],
      ['refactoring', 'Refactorización'],
      ['testing', 'Testing'],
      ['review', 'Revisión'],
      ['docs', 'Documentación'],
      ['design', 'Diseño y UX'],
      ['extraction', 'Extracción estructurada']
    ],
    help: 'Cambia el énfasis del prompt sin crear recetas distintas.'
  },
  {
    id: 'role',
    label: 'Rol del destinatario',
    type: 'text',
    default: 'Asistente técnico senior',
    example: 'Arquitecto de software con experiencia en accesibilidad',
    help: 'El rol orienta el lenguaje; no concede capacidades.'
  },
  {
    id: 'task',
    label: 'Tarea concreta',
    type: 'textarea',
    required: true,
    rows: 3,
    example: 'Compara tres alternativas y entrega una recomendación con evidencias.',
    help: 'Una sola tarea principal y un resultado esperado.'
  },
  {
    id: 'context',
    label: 'Contexto autorizado',
    type: 'textarea',
    rows: 2,
    example: 'Documentación adjunta, código del repositorio y resultados de pruebas.',
    help: 'Indica qué fuentes puede usar. No presupongas acceso a otras.'
  },
  {
    id: 'outputFormat',
    label: 'Formato de salida',
    type: 'text',
    default: 'Markdown con secciones claras y una tabla de evidencias.',
    example: 'JSON válido según el esquema adjunto',
    help: 'Formato que debe producir el destinatario.'
  },
  {
    id: 'acceptance',
    label: 'Criterios de aceptación',
    type: 'textarea',
    rows: 2,
    default: 'El resultado es verificable, cita evidencias y declara limitaciones.',
    example: 'Incluye tres opciones, criterios ponderados y una recomendación.',
    help: 'Criterios observables para saber si la tarea terminó.'
  }
];

const researchSpecific = () => [
  {
    id: 'topic',
    label: 'Tema de investigación',
    type: 'text',
    required: true,
    example: 'Herramientas de gestión de inventario para equipos pequeños',
    help: 'Delimita el tema y el contexto de la comparación.'
  },
  {
    id: 'questions',
    label: 'Preguntas de investigación',
    type: 'list',
    rows: 4,
    required: true,
    example: '¿Qué opciones existen?\n¿Qué coste y mantenimiento tienen?\n¿Qué riesgos de dependencia presentan?',
    help: 'Una pregunta por línea.'
  },
  {
    id: 'sourcePolicy',
    label: 'Política de fuentes',
    type: 'textarea',
    rows: 2,
    default: 'Prioriza documentación primaria. Indica fecha, versión y conflicto entre fuentes. No presentes inferencias como citas.',
    help: 'Cómo distinguir hechos, afirmaciones de proveedores e inferencias.'
  },
  {
    id: 'deliverable',
    label: 'Entregable esperado',
    type: 'text',
    default: 'Informe comparativo con recomendación condicionada y evidencia.',
    help: 'Resultado que debe producir la investigación.'
  }
];

const repoSpecific = () => [
  {
    id: 'language',
    label: 'Lenguaje principal',
    type: 'text',
    default: 'JavaScript',
    example: 'Python 3.12',
    help: 'Influye en comandos y convenciones del archivo generado.'
  },
  {
    id: 'packageManager',
    label: 'Gestor de paquetes',
    type: 'text',
    default: 'npm',
    example: 'uv, pnpm, cargo',
    help: 'Se usa en los comandos documentados.'
  },
  {
    id: 'commands',
    label: 'Comandos verificados',
    type: 'textarea',
    rows: 4,
    default: 'install: npm ci\ntest: npm test\nlint: npm run lint\nbuild: npm run build',
    help: 'Formato «nombre: comando». Solo comandos reales.'
  },
  {
    id: 'paths',
    label: 'Rutas principales',
    type: 'text',
    default: 'src/**, tests/**',
    help: 'Rutas a las que aplican las reglas; sepáralas con comas.'
  },
  {
    id: 'conventions',
    label: 'Convenciones',
    type: 'textarea',
    rows: 2,
    default: 'Cambios pequeños, pruebas para el comportamiento nuevo y documentación actualizada.',
    help: 'Reglas de trabajo que deben conocer los asistentes.'
  }
];

const skillSpecific = () => [
  {
    id: 'skillName',
    label: 'Nombre de la skill',
    type: 'text',
    default: 'review-pull-request',
    example: 'review-pull-request',
    help: 'Minúsculas, números y guiones; se usa como nombre de directorio.'
  },
  {
    id: 'purpose',
    label: 'Propósito',
    type: 'textarea',
    required: true,
    rows: 2,
    example: 'Revisar un diff para detectar regresiones y riesgos antes de integrar.',
    help: 'Qué problema resuelve y para qué se usa.'
  },
  {
    id: 'when',
    label: 'Cuándo usarla',
    type: 'text',
    default: 'Al revisar un diff, una pull request o un cambio antes de integrarlo.',
    help: 'Disparador concreto, no una categoría genérica.'
  },
  {
    id: 'inputs',
    label: 'Entradas',
    type: 'list',
    rows: 3,
    default: 'Diff o pull request\nCriterios de aceptación\nPruebas o logs disponibles',
    help: 'Una entrada por línea.'
  },
  {
    id: 'procedure',
    label: 'Procedimiento',
    type: 'list',
    rows: 5,
    default: 'Leer las instrucciones aplicables\nInspeccionar el diff y el contexto\nBuscar regresiones y casos límite\nClasificar hallazgos con evidencia',
    help: 'Pasos ordenados, uno por línea.'
  },
  {
    id: 'restrictions',
    label: 'Restricciones',
    type: 'list',
    rows: 3,
    default: 'No modificar archivos durante la revisión\nNo declarar vulnerabilidades sin condiciones de explotación\nNo convertir estilo en defecto funcional',
    help: 'Qué no debe hacer la skill.'
  },
  {
    id: 'output',
    label: 'Salida',
    type: 'text',
    default: 'Hallazgos priorizados con severidad, ubicación, evidencia y corrección sugerida.',
    help: 'Artefacto que devuelve.'
  },
  {
    id: 'acceptance',
    label: 'Criterios de aceptación',
    type: 'list',
    rows: 3,
    default: 'Cada hallazgo tiene evidencia\nLos riesgos no verificados se declaran\nLa recomendación final es explícita',
    help: 'Uno por línea.'
  },
  {
    id: 'example',
    label: 'Ejemplo breve',
    type: 'textarea',
    rows: 2,
    default: 'Un cambio en la validación de entrada omite un caso límite; se reporta con reproducción y prueba recomendada.',
    help: 'Ejemplo realista y breve.'
  }
];

const agentSpecific = () => [
  {
    id: 'agentName',
    label: 'Nombre del agente',
    type: 'text',
    default: 'coordinador',
    example: 'coordinador',
    help: 'Se usa en el archivo y en el nombre del contrato.'
  },
  {
    id: 'mission',
    label: 'Misión',
    type: 'textarea',
    required: true,
    rows: 2,
    example: 'Descomponer una tarea, delegar en subagentes y validar la evidencia antes de consolidar.',
    help: 'Responsabilidad principal y resultado esperado.'
  },
  {
    id: 'inputs',
    label: 'Entradas',
    type: 'list',
    rows: 3,
    default: 'Objetivo y criterios de aceptación\nContexto del proyecto\nEvidencia disponible',
    help: 'Una por línea.'
  },
  {
    id: 'outputs',
    label: 'Salidas',
    type: 'list',
    rows: 3,
    default: 'Plan de tareas\nResultado consolidado\nRiesgos y evidencia',
    help: 'Una por línea.'
  },
  {
    id: 'tools',
    label: 'Herramientas requeridas (declarativas)',
    type: 'list',
    rows: 3,
    default: 'Lectura de repositorio\nEjecución de pruebas\nConsulta de documentación',
    help: 'El contrato no concede estas herramientas; solo las declara.'
  },
  {
    id: 'boundaries',
    label: 'Límites',
    type: 'list',
    rows: 3,
    default: 'No ejecutar acciones externas sin autorización\nNo delegar la responsabilidad de sus decisiones\nNo aceptar resultados sin evidencia',
    help: 'Prohibiciones y condiciones de parada.'
  },
  {
    id: 'delegation',
    label: 'Delegación',
    type: 'textarea',
    rows: 2,
    default: 'Asigna una tarea delimitada por subagente, con contexto mínimo, salida y criterio de aceptación.',
    help: 'Cómo reparte trabajo y valida handoffs.'
  },
  {
    id: 'completion',
    label: 'Condiciones de finalización',
    type: 'list',
    rows: 2,
    default: 'Criterios globales verificados\nEvidencia revisada\nRiesgos abiertos declarados',
    help: 'Cuándo puede darse por terminado.'
  },
  {
    id: 'subagents',
    label: 'Subagentes',
    type: 'list',
    rows: 2,
    default: 'revision',
    help: 'Un nombre por línea; se genera un contrato por subagente.'
  },
  {
    id: 'evaluationCases',
    label: 'Casos de evaluación',
    type: 'list',
    rows: 3,
    default: 'Tarea normal con dependencias\nPermiso denegado\nEvidencia contradictoria',
    help: 'Escenarios que deben probarse, no resultados inventados.'
  }
];

const commandSpecific = () => [
  {
    id: 'commandList',
    label: 'Comandos incluidos',
    type: 'list',
    rows: 5,
    default: 'plan\nimplement\nreview\nhandoff',
    help: 'Uno por línea. Se generan archivos .prompt.md independientes.'
  }
];

const projectSpecific = () => [
  {
    id: 'projectType',
    label: 'Tipo de proyecto',
    type: 'select',
    default: 'fullstack',
    options: [
      ['frontend', 'Frontend'],
      ['api', 'API'],
      ['fullstack', 'Frontend + API'],
      ['cli', 'CLI'],
      ['library', 'Librería']
    ],
    help: 'Ajusta el árbol, los comandos y la configuración inicial.'
  },
  {
    id: 'modules',
    label: 'Módulos o áreas',
    type: 'list',
    rows: 3,
    default: 'auth\ninventory\nreporting',
    help: 'Una por línea; se reflejan en la arquitectura.'
  },
  {
    id: 'features',
    label: 'Funciones iniciales',
    type: 'list',
    rows: 3,
    default: 'Autenticación\nCRUD de inventario\nPanel de métricas',
    help: 'Una por línea; no se genera código de negocio no solicitado.'
  }
];

const designSpecific = () => [
  {
    id: 'productType',
    label: 'Tipo de producto',
    type: 'text',
    default: 'Dashboard web',
    example: 'Panel de inventario para operaciones',
    help: 'Describe la superficie y su contexto de uso.'
  },
  {
    id: 'screens',
    label: 'Pantallas',
    type: 'list',
    rows: 4,
    default: 'Acceso\nResumen\nInventario\nDetalle de artículo',
    help: 'Una pantalla por línea.'
  },
  {
    id: 'flows',
    label: 'Flujos principales',
    type: 'list',
    rows: 3,
    default: 'Entrar y ver el resumen\nBuscar y editar un artículo\nRegistrar un movimiento',
    help: 'Un flujo por línea.'
  },
  {
    id: 'style',
    label: 'Dirección visual',
    type: 'text',
    default: 'Interfaz sobria, oscura, con acentos neón y alta legibilidad.',
    help: 'Principios visuales, no una promesa de implementación.'
  }
];

const reviewSpecific = () => [
  {
    id: 'scope',
    label: 'Alcance de la revisión',
    type: 'textarea',
    required: true,
    rows: 2,
    example: 'Cambios en el flujo de autenticación y validación de formularios.',
    help: 'Qué se revisa y qué queda fuera.'
  },
  {
    id: 'testFramework',
    label: 'Framework de pruebas',
    type: 'text',
    default: 'node:test',
    example: 'pytest, vitest, playwright',
    help: 'Solo si existe realmente en el proyecto.'
  },
  {
    id: 'commands',
    label: 'Comandos de verificación',
    type: 'textarea',
    rows: 3,
    default: 'npm test\nnpm run lint\nnpm run build',
    help: 'Comandos reales que debe ejecutar el equipo.'
  },
  {
    id: 'risks',
    label: 'Riesgos conocidos',
    type: 'list',
    rows: 3,
    default: 'Regresiones en autenticación\nErrores de validación\nFalta de cobertura de estados',
    help: 'Uno por línea.'
  }
];

const structuredSpecific = () => [
  {
    id: 'schemaName',
    label: 'Nombre del esquema',
    type: 'text',
    default: 'respuesta-estructurada',
    example: 'resultado-investigacion',
    help: 'Se usa como nombre de archivo y title del esquema.'
  },
  {
    id: 'fields',
    label: 'Campos del esquema',
    type: 'list',
    rows: 5,
    default: 'title:string*\nsummary:string*\nstatus:string\nitems:array\nscore:number',
    help: 'Formato «nombre:tipo», con * para obligatorio. Tipos: string, number, boolean, array, object.'
  },
  {
    id: 'sampleInput',
    label: 'Entrada de ejemplo',
    type: 'textarea',
    rows: 3,
    default: 'Documento o petición que se quiere transformar en la salida estructurada.',
    help: 'Ejemplo textual; no se ejecuta.'
  },
  {
    id: 'outputDescription',
    label: 'Descripción de la salida',
    type: 'text',
    default: 'Resultado validado según el esquema, con campos obligatorios y sin propiedades adicionales.',
    help: 'Qué representa la salida, no cómo se evalúa un modelo.'
  }
];

const withCommon = (specific) => [...common(), ...specific];

const ideaSpecific = () => [
  { id: 'problem', label: 'Problema', type: 'textarea', rows: 2, default: 'Problema pendiente de validar.', help: 'Describe el dolor o la oportunidad, no la solución.' },
  { id: 'outcome', label: 'Resultado esperado', type: 'textarea', rows: 2, default: 'Resultado observable pendiente de definir.', help: 'Qué cambia para el usuario cuando el producto funcione.' },
  { id: 'successMetric', label: 'Criterio de éxito', type: 'text', default: 'Criterio medible pendiente.', help: 'Evita métricas inventadas o vanidad.' },
  { id: 'exclusions', label: 'Exclusiones', type: 'list', rows: 2, default: 'Fuera de alcance inicial', help: 'Una exclusión por línea.' },
  { id: 'pendingDecisions', label: 'Decisiones pendientes', type: 'list', rows: 2, default: 'Validar usuario principal', help: 'Una decisión por línea.' }
];

const featureSpecific = () => [
  { id: 'featureName', label: 'Funcionalidad', type: 'text', required: true, example: 'Exportar inventario a CSV', help: 'Nombre corto y específico.' },
  { id: 'featureGoal', label: 'Comportamiento esperado', type: 'textarea', rows: 2, required: true, example: 'El usuario descarga un CSV con los filtros actuales.', help: 'Resultado observable.' },
  { id: 'acceptance', label: 'Criterios de aceptación', type: 'list', rows: 3, default: 'El archivo respeta los filtros\nLos errores se muestran junto a la acción', help: 'Uno por línea.' },
  { id: 'testPlan', label: 'Pruebas previstas', type: 'list', rows: 2, default: 'Camino normal\nFiltro vacío\nError de generación', help: 'Uno por línea.' },
  { id: 'risk', label: 'Riesgo principal', type: 'text', default: 'Regresión en la consulta de datos.', help: 'Riesgo concreto, no genérico.' }
];

const debugSpecific = () => [
  { id: 'symptom', label: 'Síntoma', type: 'textarea', rows: 2, required: true, example: 'El guardado falla solo tras cambiar de pestaña.', help: 'Comportamiento observado, no causa supuesta.' },
  { id: 'reproduction', label: 'Pasos de reproducción', type: 'list', rows: 3, default: 'Abrir la app\nEditar un campo\nCambiar de pestaña y guardar', help: 'Uno por línea.' },
  { id: 'environment', label: 'Entorno', type: 'text', default: 'Navegador actual y build local.', help: 'Versión y condiciones relevantes.' },
  { id: 'evidence', label: 'Evidencia disponible', type: 'list', rows: 2, default: 'Mensaje de error\nLog de consola', help: 'Una evidencia por línea.' },
  { id: 'impact', label: 'Impacto', type: 'text', default: 'Pérdida de cambios no guardados.', help: 'Qué se pierde o bloquea.' }
];

const migrationSpecific = () => [
  { id: 'fromState', label: 'Estado actual', type: 'textarea', rows: 2, required: true, example: 'Esquema v1 en localStorage.', help: 'Datos, contratos y consumidores actuales.' },
  { id: 'toState', label: 'Estado objetivo', type: 'textarea', rows: 2, required: true, example: 'Esquema v2 con migración automática.', help: 'Resultado y compatibilidad requerida.' },
  { id: 'consumers', label: 'Consumidores afectados', type: 'list', rows: 2, default: 'Aplicación local\nProyectos exportados', help: 'Uno por línea.' },
  { id: 'window', label: 'Ventana y fases', type: 'text', default: 'Migración gradual con lectura compatible.', help: 'No inventes fechas; describe fases.' },
  { id: 'rollback', label: 'Plan de reversión', type: 'textarea', rows: 2, default: 'Conservar copia recuperable y readmitir el formato anterior.', help: 'Cómo volver sin pérdida silenciosa.' }
];

const releaseSpecific = () => [
  { id: 'version', label: 'Versión candidata', type: 'text', required: true, example: '2.4.0', help: 'Versión real del proyecto.' },
  { id: 'changes', label: 'Cambios incluidos', type: 'list', rows: 3, default: 'Biblioteca ampliada\nNuevos paquetes', help: 'Uno por línea.' },
  { id: 'checks', label: 'Controles ejecutados', type: 'list', rows: 3, default: 'npm run check\nPrueba en navegador', help: 'Uno por línea; no inventes resultados.' },
  { id: 'rollback', label: 'Reversión', type: 'textarea', rows: 2, default: 'Volver al artefacto anterior y conservar datos compatibles.', help: 'Procedimiento concreto.' },
  { id: 'migration', label: 'Migración', type: 'text', default: 'Sin migración de datos.', help: 'Indica si hay cambios incompatibles.' }
];

const handoffSpecific = () => [
  { id: 'currentState', label: 'Estado actual', type: 'textarea', rows: 3, required: true, example: 'Funcionalidad implementada; falta prueba en cliente real.', help: 'Qué está hecho y qué falta.' },
  { id: 'nextAction', label: 'Siguiente acción', type: 'text', required: true, example: 'Probar el paquete en Cursor y registrar el resultado.', help: 'Una acción concreta y verificable.' },
  { id: 'decisions', label: 'Decisiones tomadas', type: 'list', rows: 2, default: 'Mantener compatibilidad con proyectos guardados', help: 'Una por línea.' },
  { id: 'risks', label: 'Riesgos abiertos', type: 'list', rows: 2, default: 'Compatibilidad externa no verificada', help: 'Uno por línea.' },
  { id: 'evidence', label: 'Evidencia', type: 'list', rows: 2, default: 'npm run check\nPruebas manuales', help: 'Una por línea.' }
];

const securitySpecific = () => [
  { id: 'assets', label: 'Activos', type: 'list', rows: 2, default: 'Datos de inventario\nCredenciales de integración', help: 'Qué debe protegerse.' },
  { id: 'actors', label: 'Actores', type: 'list', rows: 2, default: 'Usuario autenticado\nAdministrador\nProceso externo', help: 'Uno por línea.' },
  { id: 'boundaries', label: 'Límites de confianza', type: 'list', rows: 2, default: 'Navegador\nAPI\nAlmacenamiento local', help: 'Dónde cambia la confianza.' },
  { id: 'sensitiveActions', label: 'Acciones sensibles', type: 'list', rows: 2, default: 'Exportar datos\nEliminar registros', help: 'Acciones que requieren control.' },
  { id: 'knownRisks', label: 'Riesgos conocidos', type: 'list', rows: 2, default: 'Importación de archivos no confiables', help: 'Uno por línea.' }
];

const apiSpecific = () => [
  { id: 'apiName', label: 'Nombre de la API', type: 'text', required: true, example: 'Inventory API', help: 'Identificador del contrato.' },
  { id: 'resources', label: 'Recursos', type: 'list', rows: 3, default: 'items\nmovements', help: 'Uno por línea.' },
  { id: 'operations', label: 'Operaciones', type: 'list', rows: 3, default: 'GET /items\nPOST /items\nPATCH /items/{id}', help: 'Una por línea.' },
  { id: 'auth', label: 'Autorización', type: 'text', default: 'Token de sesión y permisos por recurso.', help: 'Modelo declarado, no implementado.' },
  { id: 'versioning', label: 'Versionado y compatibilidad', type: 'text', default: 'v1 con cambios aditivos y migración documentada.', help: 'Cómo evoluciona el contrato.' }
];

export const RECIPES = [
  {
    id: 'prompt-professional',
    version: '1.0',
    family: 'prompts',
    title: 'Prompt profesional para una tarea',
    summary: 'Instrucción con rol, objetivo, contexto, formato y criterios verificables.',
    description: 'Genera un prompt reutilizable para una tarea concreta. Distingue instrucciones de capacidades y exige evidencia.',
    example: 'Quiero un prompt para revisar la accesibilidad de un formulario.',
    keywords: ['prompt', 'tarea', 'sistema', 'programar', 'debug', 'refactor', 'testing', 'revisión', 'documentación', 'diseño', 'extracción'],
    targets: ['markdown'],
    defaultTargets: ['markdown'],
    questions: withCommon(promptSpecific())
  },
  {
    id: 'prompt-research',
    version: '1.0',
    family: 'prompts',
    title: 'Prompt de investigación con fuentes',
    summary: 'Investigación con preguntas, política de fuentes y recomendación condicionada.',
    description: 'Prepara una investigación que separa hechos, afirmaciones de proveedores, inferencias y datos ausentes.',
    example: 'Quiero un prompt para investigar competidores.',
    keywords: ['investigar', 'investigación', 'competidores', 'competencia', 'fuentes', 'comparar', 'mercado'],
    targets: ['markdown'],
    defaultTargets: ['markdown'],
    questions: withCommon(researchSpecific())
  },
  {
    id: 'agents-md',
    version: '1.0',
    family: 'instructions',
    title: 'AGENTS.md para un repositorio',
    summary: 'Instrucciones de trabajo, comandos, convenciones y límites del proyecto.',
    description: 'Genera un AGENTS.md para el proyecto descrito. Es un archivo de instrucciones, no ejecuta agentes.',
    example: 'Necesito un AGENTS.md para un proyecto Python.',
    keywords: ['agents', 'agents.md', 'agente', 'repositorio', 'instrucciones', 'python', 'proyecto'],
    targets: ['agents', 'cursor', 'claude', 'copilot'],
    defaultTargets: ['agents'],
    questions: withCommon(repoSpecific())
  },
  {
    id: 'cursor-rules',
    version: '1.0',
    family: 'instructions',
    title: 'Reglas de Cursor',
    summary: 'Reglas de proyecto en formato .cursor/rules/*.mdc.',
    description: 'Genera un paquete de reglas .mdc con frontmatter y ámbito. El formato se limita a lo documentado.',
    example: 'Quiero un paquete de instrucciones para Cursor.',
    keywords: ['cursor', 'mdc', 'reglas', 'rules', 'editor'],
    targets: ['cursor', 'agents', 'claude', 'copilot'],
    defaultTargets: ['cursor'],
    questions: withCommon(repoSpecific())
  },
  {
    id: 'copilot-instructions',
    version: '1.0',
    family: 'instructions',
    title: 'Instrucciones para GitHub Copilot',
    summary: 'Instrucciones generales y por ruta para Copilot.',
    description: 'Genera .github/copilot-instructions.md y un archivo .instructions.md con applyTo.',
    example: 'Quiero un paquete de instrucciones para Copilot.',
    keywords: ['copilot', 'github', 'instrucciones', 'instrucciones por ruta', 'applyto'],
    targets: ['copilot', 'agents', 'claude', 'cursor'],
    defaultTargets: ['copilot'],
    questions: withCommon(repoSpecific())
  },
  {
    id: 'claude-context',
    version: '1.0',
    family: 'instructions',
    title: 'Contexto para Claude Code',
    summary: 'CLAUDE.md con contexto, comandos, convenciones y límites.',
    description: 'Genera un CLAUDE.md. No configura permisos ni instala herramientas.',
    example: 'Necesito un paquete de contexto para Claude Code.',
    keywords: ['claude', 'claude code', 'claude.md', 'contexto'],
    targets: ['claude', 'agents', 'cursor', 'copilot'],
    defaultTargets: ['claude'],
    questions: withCommon(repoSpecific())
  },
  {
    id: 'skill-package',
    version: '1.0',
    family: 'skills',
    title: 'Skill con SKILL.md',
    summary: 'Paquete con SKILL.md, plantilla de salida y checklist.',
    description: 'Genera un paquete de procedimiento textual. No instala la skill ni habilita herramientas.',
    example: 'Necesito una skill para revisar pull requests.',
    keywords: ['skill', 'skill.md', 'procedimiento', 'pull request', 'revisión', 'agente'],
    targets: ['skill'],
    defaultTargets: ['skill'],
    questions: withCommon(skillSpecific())
  },
  {
    id: 'agent-contract',
    version: '1.0',
    family: 'agents',
    title: 'Contrato de agente y subagentes',
    summary: 'Misión, entradas, salidas, herramientas declaradas, límites y evaluación.',
    description: 'Genera especificaciones textuales de agente y subagentes. No crea procesos ni concede permisos.',
    example: 'Quiero el contrato de un agente coordinador.',
    keywords: ['agente', 'subagente', 'contrato', 'delegación', 'orquestación', 'handoff'],
    targets: ['markdown'],
    defaultTargets: ['markdown'],
    questions: withCommon(agentSpecific())
  },
  {
    id: 'command-pack',
    version: '1.0',
    family: 'commands',
    title: 'Paquete de comandos',
    summary: 'Procedimientos .prompt.md para planificar, implementar, revisar y entregar.',
    description: 'Genera comandos reutilizables como archivos Markdown. No los registra en ningún cliente.',
    example: 'Quiero un paquete de comandos para mi equipo.',
    keywords: ['comando', 'comandos', 'plan', 'implement', 'review', 'handoff', 'prompt file'],
    targets: ['markdown'],
    defaultTargets: ['markdown'],
    questions: withCommon(commandSpecific())
  },
  {
    id: 'project-structure',
    version: '1.0',
    family: 'projects',
    title: 'Estructura de proyecto documentada',
    summary: 'Árbol, README, configuración, arquitectura y ADR coherentes.',
    description: 'Genera documentación y configuración inicial. No instala dependencias ni crea código de negocio no solicitado.',
    example: 'Quiero la estructura de una app con frontend y API.',
    keywords: ['estructura', 'proyecto', 'árbol', 'readme', 'api', 'frontend', 'configuración', 'scaffold'],
    targets: ['markdown'],
    defaultTargets: ['markdown'],
    questions: withCommon(projectSpecific())
  },
  {
    id: 'design-package',
    version: '1.0',
    family: 'design',
    title: 'Brief y paquete de diseño frontend',
    summary: 'Brief, arquitectura de información, pantallas, componentes, tokens y prompt.',
    description: 'Genera artefactos de diseño revisables. No implementa la interfaz ni valida visualmente un producto real.',
    example: 'Necesito el brief y las pantallas de un dashboard.',
    keywords: ['diseño', 'ux', 'dashboard', 'brief', 'pantallas', 'componentes', 'frontend', 'accesibilidad'],
    targets: ['markdown'],
    defaultTargets: ['markdown'],
    questions: withCommon(designSpecific())
  },
  {
    id: 'review-testing',
    version: '1.0',
    family: 'validation',
    title: 'Paquete de revisión y testing',
    summary: 'Plan, checklist, casos y criterios de aceptación.',
    description: 'Genera un plan de verificación textual. No ejecuta pruebas ni evalúa modelos.',
    example: 'Necesito un paquete de revisión y testing.',
    keywords: ['testing', 'test', 'revisión', 'review', 'checklist', 'casos', 'aceptación', 'qa'],
    targets: ['markdown'],
    defaultTargets: ['markdown'],
    questions: withCommon(reviewSpecific())
  },
  {
    id: 'structured-output',
    version: '1.0',
    family: 'validation',
    title: 'Extracción con JSON Schema',
    summary: 'Prompt, esquema JSON, entrada y salida de ejemplo.',
    description: 'Genera un contrato de extracción y artefactos JSON válidos. No evalúa el comportamiento de un modelo.',
    example: 'Quiero un paquete con prompt, esquema JSON y casos de prueba.',
    keywords: ['json', 'schema', 'esquema', 'extracción', 'estructurada', 'validación', 'datos'],
    targets: ['json-schema'],
    defaultTargets: ['json-schema'],
    questions: withCommon(structuredSpecific())
  },
  {
    id: 'idea-requirements',
    version: '1.0',
    family: 'projects',
    title: 'De idea a requisitos',
    summary: 'Brief, requisitos, alcance y criterios de aceptación.',
    description: 'Convierte una idea en un paquete de producto revisable, con supuestos y exclusiones explícitas.',
    example: 'Quiero convertir una idea en requisitos y criterios de aceptación.',
    keywords: ['idea', 'requisitos', 'brief', 'producto', 'alcance', 'aceptación'],
    targets: ['markdown'],
    defaultTargets: ['markdown'],
    defaultResources: ['skill-ambiguity-review', 'skill-scope-definition', 'skill-acceptance-criteria', 'register-requirements', 'template-brief'],
    questions: withCommon(ideaSpecific())
  },
  {
    id: 'feature-development',
    version: '1.0',
    family: 'commands',
    title: 'Desarrollo de una funcionalidad',
    summary: 'Plan, prompt de implementación, pruebas y verificación.',
    description: 'Coordina un cambio de funcionalidad acotado con criterios y evidencia.',
    example: 'Quiero un paquete para implementar una funcionalidad con pruebas.',
    keywords: ['funcionalidad', 'feature', 'implementación', 'plan', 'pruebas'],
    targets: ['markdown'],
    defaultTargets: ['markdown'],
    defaultResources: ['skill-change-plan', 'skill-regression-fix', 'skill-verification-report', 'register-delivery'],
    questions: withCommon(featureSpecific())
  },
  {
    id: 'debugging',
    version: '1.0',
    family: 'commands',
    title: 'Debugging reproducible',
    summary: 'Informe, reproducción, hipótesis y regresión.',
    description: 'Prepara una investigación de fallo con evidencia y una prueba de regresión.',
    example: 'Quiero investigar un fallo intermitente con una reproducción mínima.',
    keywords: ['debug', 'fallo', 'bug', 'reproducción', 'regresión', 'depurar'],
    targets: ['markdown'],
    defaultTargets: ['markdown'],
    defaultResources: ['skill-debug-reproduction', 'skill-log-analysis', 'skill-regression-fix'],
    questions: withCommon(debugSpecific())
  },
  {
    id: 'migration',
    version: '1.0',
    family: 'projects',
    title: 'Migración planificada',
    summary: 'Inventario, fases, compatibilidad, verificación y rollback.',
    description: 'Documenta una migración de datos o contratos sin asumir que el cambio es seguro.',
    example: 'Quiero planificar la migración del esquema de datos a la versión 2.',
    keywords: ['migración', 'migrate', 'esquema', 'compatibilidad', 'rollback'],
    targets: ['markdown'],
    defaultTargets: ['markdown'],
    defaultResources: ['skill-migration-plan', 'skill-test-strategy', 'register-risks', 'template-migration-plan'],
    questions: withCommon(migrationSpecific())
  },
  {
    id: 'release-check',
    version: '1.0',
    family: 'validation',
    title: 'Preparación de entrega',
    summary: 'Checklist, notas, migración y reversión.',
    description: 'Comprueba una versión candidata y prepara su comunicación sin publicar ni desplegar.',
    example: 'Quiero preparar la entrega de la versión 2.4.0.',
    keywords: ['release', 'entrega', 'versión', 'changelog', 'rollback'],
    targets: ['markdown'],
    defaultTargets: ['markdown'],
    defaultResources: ['skill-release-readiness', 'skill-release-notes', 'skill-verification-report', 'register-delivery'],
    questions: withCommon(releaseSpecific())
  },
  {
    id: 'handoff',
    version: '1.0',
    family: 'commands',
    title: 'Transferencia de proyecto',
    summary: 'Contexto, estado, decisiones, riesgos y siguiente acción.',
    description: 'Prepara un handoff completo para otra persona o sesión sin secretos.',
    example: 'Quiero transferir el proyecto a otra persona con todo el contexto.',
    keywords: ['handoff', 'traspaso', 'continuidad', 'contexto', 'siguiente acción'],
    targets: ['markdown'],
    defaultTargets: ['markdown'],
    defaultResources: ['skill-handoff', 'register-decisions', 'register-risks', 'register-evidence'],
    questions: withCommon(handoffSpecific())
  },
  {
    id: 'security-review',
    version: '1.0',
    family: 'validation',
    title: 'Revisión de riesgos de seguridad',
    summary: 'Modelo de amenazas, autorización, secretos y aprobaciones.',
    description: 'Produce un análisis de seguridad revisable sin certificar el sistema.',
    example: 'Quiero revisar los riesgos de seguridad de una importación de archivos.',
    keywords: ['seguridad', 'security', 'amenaza', 'autorización', 'secretos', 'aprobaciones'],
    targets: ['markdown'],
    defaultTargets: ['markdown'],
    defaultResources: ['skill-threat-model', 'skill-authorization-review', 'skill-secrets-logging', 'skill-import-export-security', 'register-approvals'],
    questions: withCommon(securitySpecific())
  },
  {
    id: 'api-docs',
    version: '1.0',
    family: 'projects',
    title: 'Documentación de API',
    summary: 'Contrato OpenAPI, guía de uso y ejemplos.',
    description: 'Genera documentación de API coherente y un contrato revisable; no implementa el servidor.',
    example: 'Quiero documentar una API de inventario con ejemplos.',
    keywords: ['api', 'openapi', 'documentación', 'contrato', 'endpoint'],
    targets: ['markdown'],
    defaultTargets: ['markdown'],
    defaultResources: ['skill-api-design', 'skill-documentation-quickstart', 'register-compatibility'],
    questions: withCommon(apiSpecific())
  }
];

const DEFAULT_RESOURCES = {
  'prompt-professional': ['skill-prompt-variables', 'template-acceptance'],
  'prompt-research': ['skill-research-sources', 'register-evidence'],
  'agents-md': ['skill-context-package', 'skill-repo-inspection', 'command-context'],
  'cursor-rules': ['skill-context-package', 'skill-repo-inspection'],
  'copilot-instructions': ['skill-context-package', 'skill-repo-inspection'],
  'claude-context': ['skill-context-package', 'skill-repo-inspection'],
  'skill-package': ['skill-evaluation-cases', 'template-handoff'],
  'agent-contract': ['skill-approval-design', 'register-approvals'],
  'command-pack': [],
  'project-structure': ['register-decisions', 'template-architecture'],
  'design-package': ['skill-ui-states', 'skill-accessibility-audit', 'register-decisions'],
  'review-testing': ['skill-code-review', 'skill-edge-cases', 'register-evidence'],
  'structured-output': ['skill-structured-output', 'skill-evaluation-cases'],
  'idea-requirements': ['skill-ambiguity-review', 'skill-scope-definition', 'skill-acceptance-criteria', 'register-requirements', 'template-brief'],
  'feature-development': ['skill-change-plan', 'skill-regression-fix', 'skill-verification-report', 'register-delivery'],
  debugging: ['skill-debug-reproduction', 'skill-log-analysis', 'skill-regression-fix'],
  migration: ['skill-migration-plan', 'skill-test-strategy', 'register-risks', 'template-migration-plan'],
  'release-check': ['skill-release-readiness', 'skill-release-notes', 'skill-verification-report', 'register-delivery'],
  handoff: ['skill-handoff', 'register-decisions', 'register-risks', 'register-evidence'],
  'security-review': ['skill-threat-model', 'skill-authorization-review', 'skill-secrets-logging', 'skill-import-export-security', 'register-approvals'],
  'api-docs': ['skill-api-design', 'skill-documentation-quickstart', 'register-compatibility']
};

for (const recipe of RECIPES) {
  if (!Array.isArray(recipe.defaultResources)) {
    recipe.defaultResources = DEFAULT_RESOURCES[recipe.id] || [];
  }
}

export const RECIPE_MAP = new Map(RECIPES.map((recipe) => [recipe.id, recipe]));

export function getRecipe(id) {
  return RECIPE_MAP.get(id) || null;
}

export function getFamily(id) {
  return FAMILIES.find((family) => family.id === id) || null;
}

export function getRecipesByFamily(family) {
  return RECIPES.filter((recipe) => recipe.family === family);
}
