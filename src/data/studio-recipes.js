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
  }
];

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
