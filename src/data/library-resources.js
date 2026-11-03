/* Biblioteca curada de recursos del generador. Datos puros, sin DOM. */
import { COMMAND_DEFS } from './command-defs.js';
import { roles as catalogRoles } from './roles.js';
import { skills as catalogSkills } from './skills/index.js';
import { prompts as catalogPrompts } from './prompts.js';
import { templates as catalogTemplates } from './templates.js';
import { scaffolds } from './scaffolds.js';
import { RECIPES } from './studio-recipes.js';

export const RESOURCE_TYPES = [
  ['role', 'Roles'],
  ['skill', 'Skills'],
  ['prompt', 'Prompts'],
  ['template', 'Plantillas'],
  ['file', 'Archivos'],
  ['command', 'Comandos'],
  ['register', 'Registros'],
  ['recipe', 'Recetas'],
  ['package', 'Paquetes'],
  ['adapter', 'Adaptadores'],
  ['validator', 'Validadores']
];

export const EDITORIAL_STATUSES = ['draft', 'experimental', 'stable', 'deprecated'];
export const VERIFICATION_STATES = ['passed', 'failed', 'not_tested', 'not_applicable'];

const COMPAT_ALL = ['markdown', 'agents', 'cursor', 'claude', 'copilot', 'skill'];

function verification(overrides = {}) {
  return {
    structural: 'passed',
    examples: 'not_tested',
    generator: 'passed',
    target: 'not_tested',
    model: 'not_tested',
    ...overrides
  };
}

function meta(data) {
  return {
    version: '1.0.0',
    locale: 'es',
    status: 'stable',
    compatibility: COMPAT_ALL,
    related: [],
    tags: [],
    provenance: { origin: 'PromptCombo library', sources: [], license: 'MIT' },
    lastReviewed: '2026-11-03',
    verification: verification(),
    ...data
  };
}

function skill(data) {
  return meta({
    type: 'skill',
    category: 'engineering',
    objective: data.objective || data.purpose || data.summary,
    inputs: [],
    restrictions: [
      'No inventes datos, evidencias ni resultados de herramientas.',
      'Declara limitaciones y preguntas abiertas.'
    ],
    acceptance: [
      'La salida responde al objetivo declarado.',
      'Las limitaciones y evidencias están separadas.'
    ],
    compatibility: ['markdown', 'agents', 'cursor', 'claude', 'copilot', 'skill'],
    ...data,
    content: {
      purpose: data.purpose,
      when: data.when,
      inputs: data.inputs || ['Contexto y criterios de la tarea'],
      procedure: data.procedure || ['Inspeccionar el contexto', 'Aplicar el procedimiento', 'Declarar evidencia y límites'],
      restrictions: data.restrictions || ['No inventes datos ni evidencias.', 'Declara las limitaciones.'],
      output: data.output,
      acceptance: data.acceptance || ['La salida responde al objetivo.', 'Los límites están declarados.'],
      example: data.example || 'Ejemplo pendiente de concretar con datos verificables.'
    },
    outputs: [data.output]
  });
}

function role(data) {
  return meta({
    type: 'role',
    category: 'engineering',
    objective: data.objective || data.mission || data.summary,
    decisions: [],
    evidence: [],
    boundaries: [],
    relatedSkills: [],
    outputs: [data.output],
    ...data,
    content: {
      mission: data.mission,
      responsibilities: data.responsibilities || [],
      decisions: data.decisions || [],
      inputs: data.inputs || ['Contexto y criterios'],
      evidence: data.evidence || ['Evidencia verificable'],
      boundaries: data.boundaries || ['No inventes datos ni permisos.'],
      output: data.output || 'Resultado verificable',
      relatedSkills: data.relatedSkills || []
    }
  });
}

const NEW_SKILLS = [
  skill({
    id: 'skill-ambiguity-review',
    title: 'Detectar ambigüedades',
    category: 'product',
    tags: ['requirements', 'questions', 'risk'],
    summary: 'Convierte términos vagos en preguntas y supuestos verificables.',
    purpose: 'Detectar ambigüedades que impiden decidir, implementar o verificar un requisito.',
    when: 'Al recibir una idea, brief o requisito con términos interpretables de más de una forma.',
    inputs: ['Texto de la necesidad', 'Contexto y restricciones conocidas', 'Decisiones pendientes'],
    procedure: [
      'Marca términos sin definición observable.',
      'Distingue bloqueos de decisiones que pueden posponerse.',
      'Formula preguntas concretas con impacto y opciones.',
      'Propón supuestos reversibles y cómo verificarlos.'
    ],
    output: 'Lista priorizada de ambigüedades, preguntas y supuestos.',
    acceptance: ['Cada pregunta desbloquea una decisión.', 'Los supuestos indican cómo verificarse.'],
    example: '«Rápido» se convierte en un objetivo medible con contexto y límite.'
  }),
  skill({
    id: 'skill-scope-definition',
    title: 'Delimitar alcance y MVP',
    category: 'product',
    tags: ['scope', 'mvp', 'prioritization'],
    summary: 'Separa lo imprescindible de lo aplazable con criterios explícitos.',
    purpose: 'Definir un alcance mínimo que entregue valor sin ocultar costes ni exclusiones.',
    when: 'Antes de planificar una entrega o cuando el alcance crece sin control.',
    inputs: ['Objetivo', 'Usuarios', 'Restricciones', 'Capacidades candidatas'],
    procedure: [
      'Identifica el resultado mínimo observable.',
      'Clasifica capacidades en dentro, después y fuera.',
      'Explica el coste o riesgo de cada exclusión.',
      'Define la condición que justificaría ampliar el alcance.'
    ],
    output: 'Alcance, exclusiones y condiciones de revisión.',
    acceptance: ['Cada exclusión tiene motivo.', 'El MVP puede verificarse por separado.'],
    example: 'Una primera versión solo para un equipo interno, sin multitenancy.'
  }),
  skill({
    id: 'skill-acceptance-criteria',
    title: 'Redactar criterios de aceptación',
    category: 'product',
    tags: ['requirements', 'verification'],
    summary: 'Convierte requisitos en condiciones observables y comprobables.',
    purpose: 'Definir cuándo un requisito puede considerarse cumplido con evidencia.',
    when: 'Al cerrar requisitos, historias de usuario o un cambio de comportamiento.',
    inputs: ['Requisito', 'Usuario y contexto', 'Errores y límites esperados'],
    procedure: [
      'Describe el comportamiento esperado sin ambigüedad.',
      'Incluye camino normal, límites y error.',
      'Asocia una evidencia verificable a cada criterio.',
      'Elimina criterios que no puedan probarse.'
    ],
    output: 'Criterios de aceptación con evidencia asociada.',
    acceptance: ['Un tercero puede comprobar cada criterio.', 'Los errores están cubiertos.'],
    example: 'Un usuario sin permiso recibe 403 y no modifica el recurso.'
  }),
  skill({
    id: 'skill-prioritization',
    title: 'Priorizar con criterios explícitos',
    category: 'product',
    tags: ['priority', 'tradeoffs'],
    summary: 'Ordena trabajo por impacto, riesgo, coste y dependencia.',
    purpose: 'Evitar prioridades basadas solo en preferencia o urgencia percibida.',
    when: 'Cuando hay más trabajo que capacidad o intereses en conflicto.',
    inputs: ['Lista de iniciativas', 'Criterios de negocio', 'Esfuerzo y dependencias', 'Riesgos'],
    procedure: [
      'Define criterios y pesos antes de puntuar.',
      'Puntúa cada iniciativa con evidencia disponible.',
      'Haz explícitas dependencias y costes de oportunidad.',
      'Presenta el orden y las sensibilidades del modelo.'
    ],
    output: 'Ranking justificado y decisiones pendientes.',
    acceptance: ['Los criterios son previos al ranking.', 'Las dependencias cambian el orden de forma visible.'],
    example: 'Dos iniciativas con igual valor: prioriza la que desbloquea la otra.'
  }),
  skill({
    id: 'skill-prompt-variables',
    title: 'Diseñar variables de prompt',
    category: 'prompting',
    tags: ['prompt', 'forms', 'variables'],
    summary: 'Define entradas mínimas, tipos y valores por defecto explícitos.',
    purpose: 'Evitar prompts con huecos implícitos o datos que el usuario no puede aportar.',
    when: 'Al convertir una plantilla en un formulario o una composición reutilizable.',
    inputs: ['Objetivo del prompt', 'Datos disponibles', 'Restricciones de longitud'],
    procedure: [
      'Enumera solo los datos que cambian el resultado.',
      'Define tipo, obligatoriedad y ejemplo.',
      'Separa valor predeterminado de respuesta del usuario.',
      'Comprueba placeholders sin sustituir datos ausentes.'
    ],
    output: 'Contrato de variables con validación.',
    acceptance: ['Cada variable tiene propósito y tipo.', 'Los ausentes no se rellenan con supuestos ocultos.'],
    example: 'Un prompt de revisión necesita diff y criterios, no la biografía del usuario.'
  }),
  skill({
    id: 'skill-prompt-contradictions',
    title: 'Revisar contradicciones de prompt',
    category: 'prompting',
    tags: ['prompt', 'consistency'],
    summary: 'Detecta instrucciones que se anulan o compiten entre sí.',
    purpose: 'Reducir comportamiento impredecible causado por requisitos incompatibles.',
    when: 'Antes de publicar un prompt con varias reglas, roles o formatos de salida.',
    inputs: ['Prompt completo', 'Criterios de aceptación', 'Contexto de uso'],
    procedure: [
      'Extrae reglas, excepciones y prioridades.',
      'Busca pares que ordenen cosas incompatibles.',
      'Distingue conflicto real de detalle contextual.',
      'Propón una regla de precedencia o elimina la duplicada.'
    ],
    output: 'Lista de contradicciones y resolución propuesta.',
    acceptance: ['Cada conflicto cita las dos reglas.', 'La resolución no introduce una ambigüedad nueva.'],
    example: '«Responde solo JSON» y «añade una introducción» no pueden coexistir.'
  }),
  skill({
    id: 'skill-context-package',
    title: 'Preparar un paquete de contexto',
    category: 'prompting',
    tags: ['context', 'agents', 'onboarding'],
    summary: 'Selecciona contexto de alta utilidad sin secretos ni ruido.',
    purpose: 'Dar a un asistente la información necesaria para trabajar sin volcar todo el repositorio.',
    when: 'Al preparar un repositorio para asistentes o transferir un proyecto.',
    inputs: ['Objetivo', 'Stack', 'Documentos y comandos disponibles', 'Restricciones de privacidad'],
    procedure: [
      'Identifica decisiones que el asistente no puede deducir.',
      'Selecciona documentos y comandos de alta señal.',
      'Excluye secretos y datos personales.',
      'Define qué debe actualizarse y con qué frecuencia.'
    ],
    output: 'Paquete de contexto con índice y límites.',
    acceptance: ['Cada documento tiene propósito.', 'No hay credenciales ni datos sensibles.'],
    example: 'Incluye arquitectura, comandos y convenciones; excluye volcados de logs.'
  }),
  skill({
    id: 'skill-structured-output',
    title: 'Diseñar salida estructurada',
    category: 'prompting',
    tags: ['json', 'schema', 'validation'],
    summary: 'Define un esquema, ejemplos y límites de validación.',
    purpose: 'Permitir consumo programático sin confundir JSON parseable con contenido correcto.',
    when: 'Cuando otra herramienta consume la respuesta o se necesita un contrato explícito.',
    inputs: ['Campos necesarios', 'Tipos y obligatoriedad', 'Ejemplos válidos e inválidos'],
    procedure: [
      'Define el objeto mínimo y prohíbe propiedades adicionales.',
      'Especifica tipos, enums y límites.',
      'Crea ejemplos válidos e inválidos.',
      'Declara el subconjunto de JSON Schema soportado.'
    ],
    output: 'Esquema, ejemplos y reglas de rechazo.',
    acceptance: ['Los ejemplos válidos parsean.', 'Los inválidos fallan por una razón declarada.'],
    example: 'Un esquema con title, summary y status no acepta campos extra.'
  }),
  skill({
    id: 'skill-evaluation-cases',
    title: 'Crear casos de evaluación',
    category: 'prompting',
    tags: ['evaluation', 'prompt', 'regression'],
    summary: 'Diseña casos que revelan fallos, no que confirman una impresión.',
    purpose: 'Comparar versiones de un prompt o contrato con criterios reproducibles.',
    when: 'Antes de cambiar un prompt o afirmar que una versión mejora.',
    inputs: ['Comportamiento esperado', 'Entradas representativas', 'Modos de fallo'],
    procedure: [
      'Incluye casos normales, límites, errores y adversarios.',
      'Define una expectativa observable por caso.',
      'Fija versión, modelo y condiciones si se ejecuta.',
      'Registra fallos y no los ocultes en una media.'
    ],
    output: 'Dataset de evaluación y rúbrica de aceptación.',
    acceptance: ['Cada caso tiene expectativa verificable.', 'Los resultados no se inventan.'],
    example: 'Un caso de permiso denegado debe comprobar que no se ejecutó la acción.'
  }),
  skill({
    id: 'skill-repo-inspection',
    title: 'Inspeccionar un repositorio',
    category: 'engineering',
    tags: ['repository', 'inspection'],
    summary: 'Construye un mapa fiable antes de modificar código.',
    purpose: 'Identificar estructura, comandos, contratos y riesgos sin depender de suposiciones.',
    when: 'Al entrar en un repositorio desconocido o antes de un cambio transversal.',
    inputs: ['Repositorio', 'Objetivo del cambio', 'Instrucciones del proyecto'],
    procedure: [
      'Lee instrucciones, manifiestos y scripts reales.',
      'Localiza puntos de entrada, datos y pruebas.',
      'Identifica generados, dependencias y límites.',
      'Registra hallazgos con rutas verificables.'
    ],
    output: 'Mapa del repositorio y lista de riesgos.',
    acceptance: ['Los comandos citados existen.', 'Las rutas y contratos son verificables.'],
    example: 'Detecta que el build real está en `scripts/build.mjs`, no en el README.'
  }),
  skill({
    id: 'skill-change-plan',
    title: 'Planificar un cambio',
    category: 'engineering',
    tags: ['planning', 'implementation'],
    summary: 'Define pasos, dependencias y verificaciones antes de editar.',
    purpose: 'Reducir cambios amplios y detectar riesgos antes de implementar.',
    when: 'Antes de una modificación no trivial o con varios archivos.',
    inputs: ['Objetivo', 'Mapa del repositorio', 'Criterios de aceptación'],
    procedure: [
      'Delimita archivos y contratos afectados.',
      'Ordena pasos por dependencia y riesgo.',
      'Define una verificación por paso.',
      'Incluye rollback o alternativa para lo irreversible.'
    ],
    output: 'Plan incremental con verificaciones.',
    acceptance: ['Cada paso tiene salida observable.', 'Los riesgos tienen mitigación o aceptación.'],
    example: 'Separar migración de datos y cambio de interfaz en dos pasos verificables.'
  }),
  skill({
    id: 'skill-debug-reproduction',
    title: 'Crear una reproducción mínima',
    category: 'quality',
    tags: ['debug', 'reproduction'],
    summary: 'Reduce un fallo a pasos y datos mínimos reproducibles.',
    purpose: 'Separar síntomas de causas y permitir una corrección verificable.',
    when: 'Ante un fallo intermitente o un informe difícil de comprobar.',
    inputs: ['Síntoma', 'Entorno', 'Pasos conocidos', 'Datos no sensibles'],
    procedure: [
      'Reduce pasos y entradas al mínimo.',
      'Fija versión, configuración y estado inicial.',
      'Comprueba el fallo y un control que no falla.',
      'Registra evidencia y límites de la reproducción.'
    ],
    output: 'Reproducción mínima con evidencia.',
    acceptance: ['Otra persona puede repetirla.', 'El control descarta una causa alternativa.'],
    example: 'El fallo solo ocurre con una sesión expirada y un formulario vacío.'
  }),
  skill({
    id: 'skill-regression-fix',
    title: 'Corregir con prueba de regresión',
    category: 'quality',
    tags: ['fix', 'regression', 'testing'],
    summary: 'Asegura que el defecto queda cubierto antes de cerrar.',
    purpose: 'Evitar que una corrección local reintroduzca el mismo fallo.',
    when: 'Después de confirmar la causa de un defecto reproducible.',
    inputs: ['Reproducción', 'Comportamiento esperado', 'Pruebas existentes'],
    procedure: [
      'Escribe una prueba que falle por la causa confirmada.',
      'Aplica la corrección mínima.',
      'Comprueba que la prueba pasa y que no rompe la suite.',
      'Declara lo que no se ha probado.'
    ],
    output: 'Corrección y prueba de regresión.',
    acceptance: ['La prueba falla antes y pasa después.', 'La suite relevante se ejecutó.'],
    example: 'Validar espacios en blanco antes de aceptar un campo obligatorio.'
  }),
  skill({
    id: 'skill-migration-plan',
    title: 'Planificar una migración',
    category: 'engineering',
    tags: ['migration', 'compatibility', 'rollback'],
    summary: 'Define fases, compatibilidad y reversión antes de mover datos.',
    purpose: 'Cambiar esquemas o plataformas sin pérdida silenciosa ni ventanas inseguras.',
    when: 'Antes de cambiar contratos, almacenamiento, proveedor o formato persistido.',
    inputs: ['Estado actual', 'Estado objetivo', 'Consumidores', 'Volumen y ventana'],
    procedure: [
      'Inventaría datos, contratos y dependencias.',
      'Define fases compatibles y migración de datos.',
      'Prepara verificación, rollback y criterios de parada.',
      'Documenta riesgos, responsables y decisiones abiertas.'
    ],
    output: 'Plan de migración con compatibilidad y reversión.',
    acceptance: ['Cada fase puede verificarse.', 'Existe un rollback probado o justificado.'],
    example: 'Leer ambos formatos durante una versión antes de retirar el antiguo.'
  }),
  skill({
    id: 'skill-code-review',
    title: 'Revisar cambios de código',
    category: 'quality',
    tags: ['review', 'regression', 'security'],
    summary: 'Encuentra defectos y riesgos con evidencia, no estilo subjetivo.',
    purpose: 'Evaluar un diff antes de integrarlo sin confundir preferencias con fallos.',
    when: 'Al revisar una pull request o un cambio local relevante.',
    inputs: ['Diff', 'Contrato y criterios', 'Pruebas y contexto'],
    procedure: [
      'Lee el diff completo y los contratos afectados.',
      'Busca regresiones, casos límite y superficies de seguridad.',
      'Clasifica hallazgos por impacto y evidencia.',
      'Distingue defecto confirmado, riesgo y observación.'
    ],
    output: 'Hallazgos priorizados y recomendación.',
    acceptance: ['Cada hallazgo tiene ubicación y evidencia.', 'No se inventan defectos para llenar la lista.'],
    example: 'Un cambio de validación no cubre un valor límite documentado.'
  }),
  skill({
    id: 'skill-test-strategy',
    title: 'Diseñar una estrategia de pruebas',
    category: 'quality',
    tags: ['testing', 'strategy'],
    summary: 'Distribuye pruebas según riesgo y contratos críticos.',
    purpose: 'Evitar pirámides dogmáticas y cobertura sin propósito.',
    when: 'Al iniciar una funcionalidad o preparar una entrega.',
    inputs: ['Riesgos', 'Contratos', 'Historial de fallos', 'Coste de ejecución'],
    procedure: [
      'Identifica los comportamientos que no deben romperse.',
      'Elige niveles y tipos de prueba por riesgo.',
      'Define datos, entornos y criterios de salida.',
      'Declara lo que queda fuera y por qué.'
    ],
    output: 'Plan de pruebas proporcionado al riesgo.',
    acceptance: ['Cada prueba responde a un riesgo.', 'Los límites del plan son explícitos.'],
    example: 'Priorizar integración en el parser y unitarias en reglas puras.'
  }),
  skill({
    id: 'skill-edge-cases',
    title: 'Identificar casos límite',
    category: 'quality',
    tags: ['testing', 'edge-cases'],
    summary: 'Explora vacíos, extremos, concurrencia y recuperación.',
    purpose: 'Descubrir fallos que el camino feliz no revela.',
    when: 'Al diseñar pruebas, validaciones o una interfaz.',
    inputs: ['Contratos', 'Tipos de entrada', 'Estados del sistema'],
    procedure: [
      'Enumera vacío, mínimo, máximo y malformado.',
      'Revisa orden, duplicados, concurrencia y cuotas.',
      'Comprueba permisos, expiración y recuperación.',
      'Prioriza por impacto y probabilidad.'
    ],
    output: 'Matriz de casos límite con expectativa.',
    acceptance: ['Cada caso tiene resultado esperado.', 'Los supuestos están marcados.'],
    example: 'Importar un JSON con claves duplicadas y un array vacío.'
  }),
  skill({
    id: 'skill-e2e-flows',
    title: 'Diseñar recorridos end-to-end',
    category: 'quality',
    tags: ['testing', 'e2e'],
    summary: 'Cubre el recorrido real sin convertirlo en una suite frágil.',
    purpose: 'Verificar integración y experiencia completa con datos controlados.',
    when: 'Para flujos críticos de usuario o integraciones entre módulos.',
    inputs: ['Flujo', 'Datos de prueba', 'Entorno', 'Criterios de éxito'],
    procedure: [
      'Define un recorrido de valor, no cada detalle visual.',
      'Prepara datos aislados y limpieza.',
      'Cubre éxito, error y recuperación.',
      'Registra trazas y evita depender de tiempos arbitrarios.'
    ],
    output: 'Casos E2E y evidencia de ejecución.',
    acceptance: ['El recorrido es reproducible.', 'La limpieza no deja estado oculto.'],
    example: 'Alta, edición y cierre de sesión con un usuario de prueba.'
  }),
  skill({
    id: 'skill-verification-report',
    title: 'Elaborar un informe de verificación',
    category: 'quality',
    tags: ['verification', 'evidence'],
    summary: 'Separa lo comprobado de lo no probado.',
    purpose: 'Evitar que una entrega declare éxito sin evidencia.',
    when: 'Al cerrar una tarea, release o revisión.',
    inputs: ['Criterios', 'Comandos ejecutados', 'Resultados', 'Riesgos'],
    procedure: [
      'Enumera criterios y evidencias esperadas.',
      'Registra comandos y resultados reales.',
      'Marca verificado, fallido y no probado.',
      'Añade bloqueos y riesgos residuales.'
    ],
    output: 'Informe de verificación con estados explícitos.',
    acceptance: ['Cada estado tiene evidencia o motivo.', 'No se usa un build como prueba de todo.'],
    example: 'Un test pasa, pero la prueba en un cliente externo queda como no probada.'
  }),
  skill({
    id: 'skill-ux-flow-audit',
    title: 'Auditar un recorrido UX',
    category: 'design',
    tags: ['ux', 'flow', 'friction'],
    summary: 'Detecta fricciones reales en un recorrido concreto.',
    purpose: 'Mejorar claridad y recuperación sin rediseñar por estética.',
    when: 'Antes de un rediseño o al recibir quejas de uso.',
    inputs: ['Recorrido', 'Usuarios', 'Capturas o evidencia', 'Criterios'],
    procedure: [
      'Define objetivo y resultado esperado del recorrido.',
      'Observa puntos de decisión, carga y error.',
      'Comprueba mensajes, foco, teclado y responsive.',
      'Prioriza fricciones por impacto, no por gusto.'
    ],
    output: 'Informe de fricciones y recomendaciones.',
    acceptance: ['Cada hallazgo tiene evidencia.', 'Se distingue defecto de preferencia.'],
    example: 'Un formulario pierde datos al volver desde el paso anterior.'
  }),
  skill({
    id: 'skill-ui-states',
    title: 'Definir estados de interfaz',
    category: 'design',
    tags: ['ui', 'states', 'accessibility'],
    summary: 'Especifica carga, vacío, error, permiso y éxito.',
    purpose: 'Evitar pantallas que solo funcionan con datos perfectos.',
    when: 'Al especificar una pantalla, componente o flujo.',
    inputs: ['Datos', 'Acciones', 'Permisos', 'Errores esperables'],
    procedure: [
      'Enumera estados y transiciones.',
      'Define mensaje y acción de recuperación.',
      'Comprueba foco, anuncio y contraste.',
      'Añade criterios de aceptación por estado.'
    ],
    output: 'Matriz de estados y criterios.',
    acceptance: ['Cada estado tiene salida o recuperación.', 'No depende solo del color.'],
    example: 'El estado vacío explica qué falta y ofrece la acción siguiente.'
  }),
  skill({
    id: 'skill-usability-test',
    title: 'Preparar pruebas de usabilidad',
    category: 'design',
    tags: ['ux', 'research', 'usability'],
    summary: 'Diseña tareas observables sin guiar al participante.',
    purpose: 'Obtener evidencia sobre comprensión y fricción real.',
    when: 'Antes de una decisión de diseño relevante o tras un rediseño.',
    inputs: ['Objetivo', 'Perfil de participante', 'Tareas', 'Entorno'],
    procedure: [
      'Define tareas y señal de éxito.',
      'Evita instrucciones que revelen la solución.',
      'Registra observaciones y bloqueos.',
      'Separa hallazgo de interpretación.'
    ],
    output: 'Guion, métricas y registro de observaciones.',
    acceptance: ['Las tareas son observables.', 'No se inducen respuestas deseadas.'],
    example: 'Pedir encontrar y editar un artículo sin explicar dónde está.'
  }),
  skill({
    id: 'skill-threat-model',
    title: 'Elaborar un modelo de amenazas',
    category: 'security',
    tags: ['security', 'threat-model'],
    summary: 'Relaciona activos, actores, límites y mitigaciones.',
    purpose: 'Priorizar riesgos antes de implementar controles.',
    when: 'Al diseñar una función con datos, permisos o integraciones.',
    inputs: ['Activos', 'Actores', 'Arquitectura', 'Límites de confianza'],
    procedure: [
      'Dibuja flujos y límites de confianza.',
      'Enumera amenazas y condiciones de explotación.',
      'Valora impacto y probabilidad con supuestos.',
      'Propón mitigaciones y evidencia de verificación.'
    ],
    output: 'Modelo de amenazas y riesgos priorizados.',
    acceptance: ['Cada riesgo tiene condición y mitigación.', 'La incertidumbre está declarada.'],
    example: 'Una importación de archivos cruza el límite de confianza del navegador.'
  }),
  skill({
    id: 'skill-authorization-review',
    title: 'Revisar autorización',
    category: 'security',
    tags: ['security', 'authz', 'tenant'],
    summary: 'Comprueba que cada operación verifica identidad y alcance.',
    purpose: 'Evitar accesos entre usuarios, organizaciones o recursos.',
    when: 'En endpoints, acciones administrativas o datos multiusuario.',
    inputs: ['Modelo de actores', 'Operaciones', 'Reglas de acceso', 'Contexto autenticado'],
    procedure: [
      'Enumera operaciones y recursos.',
      'Comprueba autorización en el servidor o límite real.',
      'Verifica aislamiento por usuario u organización.',
      'Prueba denegación y ausencia de contexto.'
    ],
    output: 'Hallazgos de autorización y pruebas negativas.',
    acceptance: ['La denegación está probada.', 'La identidad no se toma del modelo.'],
    example: 'Un ID de otra organización devuelve 404/403 sin filtrar datos.'
  }),
  skill({
    id: 'skill-secrets-logging',
    title: 'Revisar secretos y logs',
    category: 'security',
    tags: ['security', 'secrets', 'logging'],
    summary: 'Reduce exposición de credenciales y datos en registros.',
    purpose: 'Evitar filtraciones por configuración, ejemplos o trazabilidad excesiva.',
    when: 'Antes de publicar una configuración, integración o sistema de logs.',
    inputs: ['Variables de entorno', 'Ejemplos', 'Campos de log', 'Política de retención'],
    procedure: [
      'Localiza secretos reales y placeholders.',
      'Comprueba que no se registran cuerpos sensibles.',
      'Define redacción y retención.',
      'Documenta rotación y revocación.'
    ],
    output: 'Hallazgos y política de secretos/logs.',
    acceptance: ['No hay credenciales reales en ejemplos.', 'Los logs permiten diagnosticar sin exponer datos.'],
    example: 'Un error registra el token completo en lugar de un identificador redactado.'
  }),
  skill({
    id: 'skill-import-export-security',
    title: 'Revisar importaciones y exportaciones',
    category: 'security',
    tags: ['security', 'files', 'paths'],
    summary: 'Valida rutas, tamaño, formato y contenido no confiable.',
    purpose: 'Evitar traversal, colisiones, bombas de tamaño y contenido ejecutable.',
    when: 'Al aceptar archivos o generar paquetes descargables.',
    inputs: ['Formato', 'Límites', 'Rutas', 'Contenido'],
    procedure: [
      'Valida tamaño y forma antes de procesar.',
      'Normaliza rutas y rechaza traversal.',
      'Detecta duplicados y colisiones.',
      'No ejecutes ni renderices contenido importado.'
    ],
    output: 'Reglas de importación/exportación y pruebas negativas.',
    acceptance: ['Las rutas inseguras se rechazan.', 'Un archivo inválido no destruye el estado.'],
    example: 'Un ZIP con `../salida.txt` se rechaza antes de escribir.'
  }),
  skill({
    id: 'skill-approval-design',
    title: 'Diseñar aprobaciones de acciones sensibles',
    category: 'security',
    tags: ['security', 'approval', 'permissions'],
    summary: 'Separa autorización, aprobación y ejecución.',
    purpose: 'Evitar que una confirmación textual se confunda con permiso.',
    when: 'Al proponer acciones con efectos externos o irreversibles.',
    inputs: ['Acción', 'Destino', 'Argumentos', 'Permisos', 'Impacto'],
    procedure: [
      'Define qué acción requiere aprobación.',
      'Muestra destino y argumentos exactos.',
      'Verifica permiso y aprobación por separado.',
      'Invalida la aprobación si cambian los argumentos.'
    ],
    output: 'Diseño de aprobación y criterios de rechazo.',
    acceptance: ['La aprobación está ligada a argumentos.', 'La denegación no ejecuta la acción.'],
    example: 'Un cambio de importe invalida la confirmación anterior.'
  }),
  skill({
    id: 'skill-documentation-quickstart',
    title: 'Crear documentación de inicio rápido',
    category: 'documentation',
    tags: ['docs', 'readme', 'onboarding'],
    summary: 'Permite a una persona nueva ejecutar y entender el proyecto.',
    purpose: 'Reducir preguntas repetidas y comandos inventados.',
    when: 'Al crear un proyecto, cambiar requisitos o detectar onboarding deficiente.',
    inputs: ['Público', 'Requisitos', 'Comandos reales', 'Primer flujo'],
    procedure: [
      'Define qué puede hacer el usuario al terminar.',
      'Documenta requisitos y comandos verificados.',
      'Explica el primer flujo con un ejemplo.',
      'Enlaza documentación profunda y declara límites.'
    ],
    output: 'Guía de inicio rápido verificable.',
    acceptance: ['Los comandos se ejecutaron.', 'El primer flujo funciona en un entorno limpio.'],
    example: 'Instalar, arrancar y generar un paquete en menos de cinco pasos.'
  }),
  skill({
    id: 'skill-runbook',
    title: 'Preparar un runbook',
    category: 'operations',
    tags: ['operations', 'runbook', 'incident'],
    summary: 'Documenta diagnóstico, acción y escalado para una operación.',
    purpose: 'Evitar improvisación en tareas repetibles o incidentes.',
    when: 'Al operar un servicio, proceso periódico o recuperación.',
    inputs: ['Operación', 'Síntomas', 'Comandos', 'Contactos y límites'],
    procedure: [
      'Define cuándo usar y cuándo no.',
      'Enumera comprobaciones en orden y resultado esperado.',
      'Incluye escalado, rollback y comunicación.',
      'Registra evidencia sin secretos.'
    ],
    output: 'Runbook con diagnóstico, acciones y escalado.',
    acceptance: ['Cada paso tiene resultado esperado.', 'El rollback es explícito.'],
    example: 'Recuperar el servicio local sin borrar datos ni reiniciar a ciegas.'
  }),
  skill({
    id: 'skill-incident-report',
    title: 'Redactar un informe de incidente',
    category: 'operations',
    tags: ['incident', 'postmortem', 'evidence'],
    summary: 'Reconstruye una línea temporal y separa causa de impacto.',
    purpose: 'Aprender sin inventar una causa raíz ni ocultar incertidumbre.',
    when: 'Después de un incidente con impacto o riesgo relevante.',
    inputs: ['Cronología', 'Logs', 'Impacto', 'Acciones tomadas'],
    procedure: [
      'Construye una línea temporal con evidencia.',
      'Separa impacto, causa y factores contribuyentes.',
      'Documenta contención, recuperación y comunicación.',
      'Define prevención y seguimiento.'
    ],
    output: 'Informe de incidente con causas y acciones.',
    acceptance: ['Cada conclusión cita evidencia.', 'La causa no confirmada se marca como pendiente.'],
    example: 'El fallo se debió a una migración sin verificación de rollback.'
  }),
  skill({
    id: 'skill-handoff',
    title: 'Preparar un handoff',
    category: 'documentation',
    tags: ['handoff', 'context', 'continuity'],
    summary: 'Transfiere estado, evidencia y siguiente acción.',
    purpose: 'Permitir continuar sin reconstruir el contexto ni confiar en supuestos.',
    when: 'Al cambiar de persona, agente, fase o sesión.',
    inputs: ['Objetivo', 'Estado', 'Archivos', 'Decisiones', 'Evidencia', 'Riesgos'],
    procedure: [
      'Resume objetivo y estado actual.',
      'Enumera decisiones y comandos ejecutados.',
      'Separa verificado, supuesto y pendiente.',
      'Define la siguiente acción concreta.'
    ],
    output: 'Handoff estructurado y verificable.',
    acceptance: ['La siguiente acción es inequívoca.', 'No contiene secretos ni supuestos ocultos.'],
    example: 'Un cambio queda implementado pero pendiente de prueba en cliente real.'
  }),
  skill({
    id: 'skill-research-sources',
    title: 'Investigar con fuentes',
    category: 'research',
    tags: ['research', 'sources', 'evidence'],
    summary: 'Distingue fuente primaria, proveedor e inferencia.',
    purpose: 'Producir conclusiones con fecha, versión y límites.',
    when: 'Al comparar tecnologías, políticas o afirmaciones técnicas.',
    inputs: ['Pregunta', 'Alcance', 'Fuentes disponibles', 'Fecha de consulta'],
    procedure: [
      'Define preguntas y criterios de inclusión.',
      'Prioriza documentación primaria y versiones.',
      'Registra citas, fechas y conflictos.',
      'Separa evidencia de recomendación.'
    ],
    output: 'Informe de fuentes y conclusiones condicionadas.',
    acceptance: ['Cada afirmación importante tiene fuente.', 'La fecha y limitaciones están declaradas.'],
    example: 'Una función documentada para una superficie no se extrapola a todas.'
  }),
  skill({
    id: 'skill-research-conflicts',
    title: 'Contrastar información contradictoria',
    category: 'research',
    tags: ['research', 'conflict', 'sources'],
    summary: 'Explica discrepancias sin elegir la fuente más cómoda.',
    purpose: 'Evitar conclusiones falsas cuando las fuentes no coinciden.',
    when: 'Al comparar versiones, documentación o resultados de pruebas.',
    inputs: ['Fuentes', 'Afirmaciones', 'Fechas y versiones', 'Método'],
    procedure: [
      'Tabula afirmaciones y fuentes.',
      'Comprueba fecha, versión y ámbito.',
      'Distingue conflicto real de diferencia de contexto.',
      'Declara la incertidumbre y la verificación pendiente.'
    ],
    output: 'Matriz de conflictos y resolución justificada.',
    acceptance: ['No se oculta una fuente relevante.', 'La resolución indica qué falta.'],
    example: 'Dos guías describen opciones distintas para versiones distintas.'
  }),
  skill({
    id: 'skill-comparison-matrix',
    title: 'Crear una matriz comparativa',
    category: 'research',
    tags: ['comparison', 'decision'],
    summary: 'Compara opciones con criterios explícitos y evidencia.',
    purpose: 'Facilitar una decisión sin convertir popularidad en prueba.',
    when: 'Al elegir herramienta, arquitectura o proveedor.',
    inputs: ['Opciones', 'Criterios', 'Pesos', 'Evidencia'],
    procedure: [
      'Define criterios antes de puntuar.',
      'Incluye coste, riesgo, mantenimiento y salida.',
      'Cita evidencia y marca datos desconocidos.',
      'Presenta recomendación condicionada al contexto.'
    ],
    output: 'Matriz comparativa y recomendación.',
    acceptance: ['Los criterios son explícitos.', 'Los datos no verificados están marcados.'],
    example: 'Dos opciones empatan en features, pero una tiene mayor coste de salida.'
  }),
  skill({
    id: 'skill-release-readiness',
    title: 'Comprobar preparación de release',
    category: 'operations',
    tags: ['release', 'checklist', 'rollback'],
    summary: 'Verifica entrega, migración y reversión sin publicar.',
    purpose: 'Evitar declarar una versión lista sin evidencia ni plan de vuelta.',
    when: 'Antes de publicar o desplegar una versión.',
    inputs: ['Candidato', 'Criterios', 'Comandos', 'Migraciones', 'Riesgos'],
    procedure: [
      'Comprueba estado de Git y artefactos.',
      'Ejecuta controles documentados.',
      'Revisa migración, compatibilidad y rollback.',
      'Resume bloqueos y evidencias.'
    ],
    output: 'Checklist de release con bloqueos.',
    acceptance: ['Cada control tiene resultado.', 'El rollback es ejecutable o está justificado.'],
    example: 'Build reproducible, tests y despliegue de GH Pages verificado.'
  }),
  skill({
    id: 'skill-release-notes',
    title: 'Redactar notas de versión',
    category: 'documentation',
    tags: ['release', 'changelog', 'migration'],
    summary: 'Explica cambios e impactos para quien actualiza.',
    purpose: 'Evitar notas que solo repiten commits sin decir qué cambia.',
    when: 'Al preparar una release o una actualización relevante.',
    inputs: ['Cambios', 'Versión', 'Impacto', 'Migración'],
    procedure: [
      'Agrupa por impacto para el usuario.',
      'Distingue novedades, correcciones y rupturas.',
      'Incluye migración y riesgos conocidos.',
      'Evita fechas y métricas no verificadas.'
    ],
    output: 'Notas de versión y guía de migración.',
    acceptance: ['Cada cambio importante es comprensible.', 'La migración está indicada.'],
    example: 'La versión 2.3 añade biblioteca y mantiene proyectos v1.'
  }),
  skill({
    id: 'skill-decision-record',
    title: 'Registrar una decisión',
    category: 'documentation',
    tags: ['adr', 'decision', 'context'],
    summary: 'Conserva contexto, alternativas y consecuencias.',
    purpose: 'Evitar decisiones sin memoria y cambios implícitos.',
    when: 'Al adoptar una arquitectura, herramienta o política relevante.',
    inputs: ['Problema', 'Alternativas', 'Criterios', 'Consecuencias'],
    procedure: [
      'Describe contexto y restricciones.',
      'Enumera alternativas reales.',
      'Registra decisión y justificación.',
      'Define consecuencias y revisión.'
    ],
    output: 'ADR o registro de decisión.',
    acceptance: ['La decisión y sus motivos son claros.', 'Las consecuencias y revisión están definidas.'],
    example: 'Elegir persistencia local frente a una API innecesaria.'
  })
];

const NEW_ROLES = [
  role({
    id: 'role-product-owner',
    title: 'Responsable de producto',
    category: 'product',
    tags: ['product', 'priorities'],
    summary: 'Decide prioridades y límites con criterios explícitos.',
    mission: 'Maximizar el valor entregado con un alcance explícito y decisiones reversibles.',
    responsibilities: ['Definir problema y resultado', 'Priorizar con criterios', 'Aceptar alcance y exclusiones'],
    decisions: ['Prioridad', 'MVP', 'Criterio de éxito'],
    inputs: ['Evidencia de usuarios', 'Restricciones', 'Costes'],
    evidence: ['Criterios', 'Decisiones', 'Métricas declaradas'],
    boundaries: ['No inventa demanda', 'No promete fechas sin capacidad'],
    output: 'Decisión de producto con alcance y criterios.',
    relatedSkills: ['skill-prioritization', 'skill-scope-definition', 'skill-acceptance-criteria']
  }),
  role({
    id: 'role-user-researcher',
    title: 'Investigador de usuarios',
    category: 'design',
    tags: ['research', 'users'],
    summary: 'Obtiene evidencia sobre necesidades y fricciones.',
    mission: 'Reducir incertidumbre sobre usuarios con evidencia observable.',
    responsibilities: ['Diseñar preguntas', 'Observar tareas', 'Separar hallazgo de interpretación'],
    decisions: ['Método de investigación', 'Sesgos a controlar'],
    inputs: ['Pregunta de investigación', 'Perfil', 'Contexto'],
    evidence: ['Notas', 'Citas', 'Observaciones'],
    boundaries: ['No generaliza desde una muestra pequeña', 'No manipula participantes'],
    output: 'Hallazgos de investigación con límites.',
    relatedSkills: ['skill-usability-test', 'skill-ux-flow-audit']
  }),
  role({
    id: 'role-ux-designer',
    title: 'Diseñador UX',
    category: 'design',
    tags: ['ux', 'flows'],
    summary: 'Diseña recorridos claros y recuperables.',
    mission: 'Convertir objetivos de usuario en flujos y estados comprensibles.',
    responsibilities: ['Mapear flujos', 'Definir IA', 'Especificar estados'],
    decisions: ['Estructura de navegación', 'Prioridad de acciones'],
    inputs: ['Objetivos', 'Usuarios', 'Restricciones'],
    evidence: ['Flujos', 'Wireframes', 'Criterios de usabilidad'],
    boundaries: ['No sustituye investigación', 'No oculta fricción con estética'],
    output: 'Especificación UX revisable.',
    relatedSkills: ['skill-ux-flow-audit', 'skill-ui-states', 'skill-usability-test']
  }),
  role({
    id: 'role-ui-designer',
    title: 'Diseñador de interfaz',
    category: 'design',
    tags: ['ui', 'visual'],
    summary: 'Define jerarquía, componentes y tokens visuales.',
    mission: 'Crear una interfaz coherente, legible y accesible.',
    responsibilities: ['Jerarquía visual', 'Componentes', 'Tokens'],
    decisions: ['Patrones visuales', 'Adaptación responsive'],
    inputs: ['Flujos', 'Contenido', 'Restricciones'],
    evidence: ['Especificación', 'Estados', 'Contraste'],
    boundaries: ['No sacrifica accesibilidad', 'No inventa componentes inexistentes'],
    output: 'Especificación visual y tokens.',
    relatedSkills: ['skill-ui-states', 'skill-accessibility-audit']
  }),
  role({
    id: 'role-accessibility-specialist',
    title: 'Especialista en accesibilidad',
    category: 'design',
    tags: ['a11y', 'keyboard'],
    summary: 'Evalúa barreras reales con criterios verificables.',
    mission: 'Detectar y priorizar barreras para personas con distintas capacidades.',
    responsibilities: ['Revisar semántica', 'Probar teclado', 'Evaluar contraste y foco'],
    decisions: ['Prioridad de corrección', 'Necesidad de prueba manual'],
    inputs: ['Interfaz', 'Flujos', 'Criterios WCAG aplicables'],
    evidence: ['Hallazgos', 'Reproducción', 'Criterio afectado'],
    boundaries: ['No certifica con una herramienta automática', 'No usa ARIA para sustituir HTML'],
    output: 'Informe de accesibilidad priorizado.',
    relatedSkills: ['skill-accessibility-audit', 'skill-ui-states']
  }),
  role({
    id: 'role-api-designer',
    title: 'Diseñador de APIs',
    category: 'architecture',
    tags: ['api', 'contracts'],
    summary: 'Define contratos estables, errores y compatibilidad.',
    mission: 'Diseñar interfaces de datos que evolucionen sin romper consumidores.',
    responsibilities: ['Definir recursos', 'Contratos', 'Errores', 'Versionado'],
    decisions: ['Forma del contrato', 'Estrategia de compatibilidad'],
    inputs: ['Casos de uso', 'Consumidores', 'Restricciones'],
    evidence: ['OpenAPI', 'Ejemplos', 'Pruebas de contrato'],
    boundaries: ['No confunde REST con requisito universal', 'No rompe contratos sin migración'],
    output: 'Contrato de API y plan de compatibilidad.',
    relatedSkills: ['skill-api-design', 'skill-data-modeling', 'skill-migration-plan']
  }),
  role({
    id: 'role-data-architect',
    title: 'Arquitecto de datos',
    category: 'architecture',
    tags: ['data', 'modeling'],
    summary: 'Define entidades, relaciones, integridad y migración.',
    mission: 'Mantener datos íntegros, consultables y evolucionables.',
    responsibilities: ['Modelo', 'Restricciones', 'Índices', 'Migraciones'],
    decisions: ['Normalización', 'Claves', 'Retención'],
    inputs: ['Dominio', 'Consultas', 'Volumen'],
    evidence: ['Diagramas', 'Esquema', 'Pruebas de integridad'],
    boundaries: ['No crea índices sin consulta', 'No migra sin rollback'],
    output: 'Modelo de datos y plan de evolución.',
    relatedSkills: ['skill-data-modeling', 'skill-database-structure', 'skill-migration-plan']
  }),
  role({
    id: 'role-frontend-developer',
    title: 'Desarrollador frontend',
    category: 'engineering',
    tags: ['frontend', 'ui'],
    summary: 'Implementa interfaces accesibles y verificables.',
    mission: 'Convertir una especificación en interfaz funcional y accesible.',
    responsibilities: ['Componentes', 'Estados', 'Rendimiento', 'Accesibilidad'],
    decisions: ['Composición', 'Tokens', 'Manejo de estado'],
    inputs: ['Especificación', 'Contratos', 'Tokens'],
    evidence: ['Código', 'Pruebas', 'Capturas'],
    boundaries: ['No inventa negocio', 'No rompe accesibilidad por estética'],
    output: 'Interfaz implementada y verificada.',
    relatedSkills: ['skill-frontend-components', 'skill-ui-symmetric', 'skill-accessibility-audit']
  }),
  role({
    id: 'role-backend-developer',
    title: 'Desarrollador backend',
    category: 'engineering',
    tags: ['backend', 'api'],
    summary: 'Implementa lógica, contratos y errores explícitos.',
    mission: 'Entregar servicios correctos, seguros y observables.',
    responsibilities: ['Casos de uso', 'Persistencia', 'Errores', 'Pruebas'],
    decisions: ['Estructura', 'Transacciones', 'Reintentos'],
    inputs: ['Contratos', 'Modelo', 'Requisitos'],
    evidence: ['Código', 'Pruebas', 'Logs redactados'],
    boundaries: ['No confía en validación del cliente', 'No oculta errores'],
    output: 'Servicio implementado con evidencia.',
    relatedSkills: ['skill-business-logic', 'skill-error-handling', 'skill-api-design']
  }),
  role({
    id: 'role-security-reviewer',
    title: 'Revisor de seguridad',
    category: 'security',
    tags: ['security', 'threats'],
    summary: 'Evalúa amenazas y controles con evidencia.',
    mission: 'Reducir riesgo identificando condiciones de explotación y mitigaciones.',
    responsibilities: ['Modelo de amenazas', 'Revisión de entradas', 'Autorización', 'Secretos'],
    decisions: ['Severidad', 'Mitigación prioritaria'],
    inputs: ['Arquitectura', 'Flujos', 'Código'],
    evidence: ['Hallazgos', 'Reproducción', 'Pruebas negativas'],
    boundaries: ['No certifica seguridad', 'No inventa vulnerabilidades'],
    output: 'Hallazgos y riesgos residuales.',
    relatedSkills: ['skill-threat-model', 'skill-input-security', 'skill-authorization-review']
  }),
  role({
    id: 'role-privacy-analyst',
    title: 'Analista de privacidad',
    category: 'security',
    tags: ['privacy', 'data'],
    summary: 'Evalúa datos personales, finalidad y retención.',
    mission: 'Reducir exposición y uso indebido de datos.',
    responsibilities: ['Inventario de datos', 'Finalidad', 'Retención', 'Acceso'],
    decisions: ['Minimización', 'Redacción', 'Borrado'],
    inputs: ['Flujos', 'Datos', 'Requisitos legales'],
    evidence: ['Inventario', 'Riesgos', 'Controles'],
    boundaries: ['No da asesoría legal', 'No promete anonimización total'],
    output: 'Evaluación de privacidad y controles.',
    relatedSkills: ['skill-secrets-logging', 'skill-import-export-security']
  }),
  role({
    id: 'role-platform-engineer',
    title: 'Ingeniero de plataforma',
    category: 'operations',
    tags: ['deployment', 'operations'],
    summary: 'Diseña despliegue, observabilidad y recuperación.',
    mission: 'Mantener una entrega reproducible y operable.',
    responsibilities: ['Build', 'Configuración', 'Salud', 'Rollback'],
    decisions: ['Estrategia de despliegue', 'Alertas'],
    inputs: ['Artefacto', 'Entornos', 'Riesgos'],
    evidence: ['Pipeline', 'Healthchecks', 'Runbook'],
    boundaries: ['No despliega sin autorización', 'No oculta fallos'],
    output: 'Plan de despliegue y operación.',
    relatedSkills: ['skill-deployment-prep', 'skill-runbook', 'skill-release-readiness']
  }),
  role({
    id: 'role-technical-writer',
    title: 'Redactor técnico',
    category: 'documentation',
    tags: ['docs', 'clarity'],
    summary: 'Convierte conocimiento técnico en documentación útil.',
    mission: 'Permitir que otra persona use o mantenga el sistema sin preguntas evitables.',
    responsibilities: ['Estructura', 'Ejemplos', 'Referencias', 'Actualización'],
    decisions: ['Nivel de detalle', 'Ubicación'],
    inputs: ['Código', 'Decisiones', 'Comandos'],
    evidence: ['Documento', 'Ejemplos verificados'],
    boundaries: ['No inventa comandos', 'No duplica sin necesidad'],
    output: 'Documentación verificada.',
    relatedSkills: ['skill-documentation-quickstart', 'skill-doc-functions', 'skill-handoff']
  }),
  role({
    id: 'role-prompt-context-designer',
    title: 'Diseñador de prompts y contexto',
    category: 'ai',
    tags: ['prompt', 'context'],
    summary: 'Diseña contratos de tarea y contexto de alta señal.',
    mission: 'Mejorar claridad y verificabilidad de instrucciones sin prometer calidad de modelo.',
    responsibilities: ['Estructura', 'Variables', 'Contexto', 'Evaluación'],
    decisions: ['Qué incluir', 'Qué omitir'],
    inputs: ['Objetivo', 'Fuentes', 'Restricciones'],
    evidence: ['Prompt', 'Casos', 'Límites'],
    boundaries: ['No confunde prompt con capacidad', 'No declara mejoras sin evaluar'],
    output: 'Prompt y contexto versionados.',
    relatedSkills: ['skill-prompt-design', 'skill-prompt-variables', 'skill-evaluation-cases']
  }),
  role({
    id: 'role-evaluation-owner',
    title: 'Responsable de evaluación',
    category: 'ai',
    tags: ['evaluation', 'quality'],
    summary: 'Define cómo se comprueba un resultado y qué no se ha probado.',
    mission: 'Separar verificación estructural de comportamiento de modelo.',
    responsibilities: ['Casos', 'Criterios', 'Ejecución', 'Registro'],
    decisions: ['Muestra', 'Métrica', 'Umbral'],
    inputs: ['Contrato', 'Dataset', 'Condiciones'],
    evidence: ['Resultados', 'Fallos', 'Limitaciones'],
    boundaries: ['No usa una opinión como métrica única', 'No oculta casos fallidos'],
    output: 'Informe de evaluación con evidencia.',
    relatedSkills: ['skill-evaluation-cases', 'skill-verification-report']
  })
];

// Recursos derivados del catálogo existente.
const skillCategory = (id) => {
  if (id.includes('security')) return 'security';
  if (id.includes('test')) return 'quality';
  if (id.includes('ux') || id.includes('ui') || id.includes('accessibility') || id.includes('css')) return 'design';
  if (id.includes('prompt') || id.includes('context')) return 'prompting';
  if (id.includes('deployment') || id.includes('local-cache')) return 'operations';
  if (id.includes('doc') || id.includes('file')) return 'documentation';
  return 'engineering';
};

const existingSkills = catalogSkills.map((item) => skill({
  id: item.id,
  title: item.title,
  category: skillCategory(item.id),
  summary: item.tagline,
  tags: [item.code, item.short].filter(Boolean),
  purpose: item.purpose,
  when: item.when,
  inputs: item.inputs,
  procedure: item.procedure,
  restrictions: item.restrictions,
  output: item.output,
  acceptance: item.acceptance,
  example: item.example,
  status: 'stable',
  provenance: { origin: 'PromptCombo catalog v1', sources: [], license: 'MIT' },
  sourceModule: item.id
}));

const existingRoles = catalogRoles.map((item) => role({
  id: item.id,
  title: item.title,
  category: 'engineering',
  summary: item.tagline,
  tags: [item.code, item.short].filter(Boolean),
  mission: item.mission,
  responsibilities: item.responsibilities,
  inputs: ['Contexto del proyecto', 'Criterios de aceptación', 'Evidencia disponible'],
  decisions: ['Priorizar dentro de su responsabilidad', 'Proponer cambios acotados'],
  evidence: item.deliverables,
  boundaries: item.boundaries,
  output: item.exitCriteria.join(' · '),
  relatedSkills: [],
  status: 'stable',
  provenance: { origin: 'PromptCombo catalog v1', sources: [], license: 'MIT' },
  sourceModule: item.id
}));

const commandResource = (key, definition) => meta({
  id: `command-${key}`,
  type: 'command',
  title: `/${key} · ${definition.title}`,
  category: definition.category || 'commands',
  tags: ['command', key],
  summary: definition.description,
  objective: definition.description,
  useWhen: definition.useWhen || 'Cuando la tarea coincida con el procedimiento del comando.',
  avoidWhen: definition.avoidWhen || 'Cuando no exista contexto suficiente o el comando no esté soportado por el destino.',
  inputs: definition.inputs || ['Contexto de la tarea', 'Criterios de aceptación'],
  outputs: [definition.output],
  related: definition.skillId ? [definition.skillId] : [],
  compatibility: ['markdown', 'copilot'],
  status: 'stable',
  content: {
    description: definition.description,
    usage: definition.usage || `/${key}`,
    arguments: definition.arguments || ['contexto', 'criterios'],
    context: definition.context || 'Repositorio o proyecto donde se ejecuta la tarea.',
    procedure: definition.steps,
    output: definition.output,
    restrictions: definition.restrictions || [],
    example: definition.example || `/${key}`,
    skillId: definition.skillId || null
  },
  provenance: { origin: 'PromptCombo commands', sources: [], license: 'MIT' }
});

const commands = Object.entries(COMMAND_DEFS).map(([key, definition]) => commandResource(key, definition));

const registers = [
  ['requirements', 'Requisitos', 'product', ['ID', 'Descripción', 'Prioridad', 'Aceptación', 'Estado'], 'Registro de requisitos', 'Una fila por requisito; no inventes prioridades sin criterio.'],
  ['decisions', 'Decisiones', 'documentation', ['ID', 'Decisión', 'Alternativas', 'Motivo', 'Consecuencias', 'Estado'], 'Registro de decisiones', 'Cada decisión debe conservar contexto y revisión.'],
  ['assumptions', 'Supuestos', 'product', ['ID', 'Supuesto', 'Fundamento', 'Impacto', 'Verificación'], 'Registro de supuestos', 'Marca cómo se comprobará cada supuesto.'],
  ['risks', 'Riesgos', 'security', ['ID', 'Riesgo', 'Probabilidad', 'Impacto', 'Mitigación', 'Estado'], 'Registro de riesgos', 'La probabilidad es una estimación, no un hecho.'],
  ['evidence', 'Evidencias', 'research', ['Afirmación', 'Fuente', 'Fecha', 'Alcance', 'Limitaciones'], 'Registro de evidencias', 'No añadas fuentes que no hayas consultado.'],
  ['changes', 'Cambios', 'documentation', ['Cambio', 'Motivo', 'Impacto', 'Migración', 'Verificación'], 'Registro de cambios', 'No repitas commits sin explicar el impacto.'],
  ['experiments', 'Experimentos', 'research', ['Hipótesis', 'Método', 'Resultado', 'Conclusión', 'Límites'], 'Registro de experimentos', 'Distingue resultado observado de interpretación.'],
  ['evaluations', 'Evaluaciones', 'ai', ['Caso', 'Versión', 'Condición', 'Resultado', 'Fallo observado'], 'Registro de evaluaciones', 'No presentes una evaluación parcial como certificación.'],
  ['compatibility', 'Compatibilidad', 'technology', ['Destino', 'Versión', 'Capacidad', 'Verificación', 'Fecha'], 'Registro de compatibilidad', 'No declares compatibilidad por analogía.'],
  ['dependencies', 'Dependencias', 'engineering', ['Elemento', 'Versión', 'Finalidad', 'Licencia', 'Riesgo'], 'Registro de dependencias', 'Revisa mantenimiento y vulnerabilidades.'],
  ['incidents', 'Incidentes', 'operations', ['Cronología', 'Impacto', 'Causa', 'Contención', 'Acciones'], 'Registro de incidentes', 'La causa no confirmada debe quedar marcada.'],
  ['technical-debt', 'Deuda técnica', 'engineering', ['Problema', 'Consecuencia', 'Propuesta', 'Coste', 'Prioridad'], 'Registro de deuda técnica', 'No uses la deuda como excusa para no corregir un defecto.'],
  ['approvals', 'Aprobaciones propuestas', 'security', ['Acción', 'Alcance', 'Argumentos', 'Estado', 'Responsable'], 'Registro documental de aprobaciones', 'No es un mecanismo ejecutable de autorización.'],
  ['delivery', 'Entrega', 'operations', ['Verificación', 'Resultado', 'Evidencia', 'Bloqueo', 'Responsable'], 'Registro de entrega', 'Un registro de entrega no sustituye la ejecución de pruebas.']
].map(([id, title, category, fields, purpose, maintenance]) => meta({
  id: `register-${id}`,
  type: 'register',
  title,
  category,
  tags: ['register', id],
  summary: purpose,
  objective: purpose,
  useWhen: 'Cuando necesites conservar y revisar este tipo de información.',
  avoidWhen: 'Cuando la información sea sensible y no exista una política de acceso.',
  inputs: fields,
  outputs: [purpose],
  compatibility: ['markdown'],
  status: 'stable',
  content: {
    purpose,
    fields: fields.map((name) => ({ name, description: `Campo ${name}` })),
    maintenance,
    example: `| ${fields.join(' | ')} |\n| ${fields.map(() => 'Pendiente').join(' | ')} |`
  },
  provenance: { origin: 'PromptCombo registers', sources: [], license: 'MIT' }
}));

const NEW_TEMPLATES = [
  ['brief', 'Brief de producto', ['Problema', 'Usuarios', 'Resultado', 'Alcance', 'Supuestos', 'Criterios de éxito']],
  ['requirements', 'Documento de requisitos', ['Actores', 'Requisitos funcionales', 'Requisitos no funcionales', 'Exclusiones', 'Aceptación']],
  ['acceptance', 'Criterios de aceptación', ['ID', 'Comportamiento', 'Entrada', 'Resultado', 'Evidencia']],
  ['architecture', 'Arquitectura técnica', ['Contexto', 'Capas', 'Módulos', 'Contratos', 'Riesgos', 'Verificación']],
  ['adr', 'ADR', ['Estado', 'Contexto', 'Alternativas', 'Decisión', 'Consecuencias', 'Revisión']],
  ['api-contract', 'Contrato de API', ['Recursos', 'Operaciones', 'Errores', 'Versionado', 'Compatibilidad']],
  ['data-model', 'Modelo de datos', ['Entidades', 'Relaciones', 'Restricciones', 'Índices', 'Migración']],
  ['migration-plan', 'Plan de migración', ['Inventario', 'Fases', 'Compatibilidad', 'Verificación', 'Rollback']],
  ['test-plan', 'Plan de pruebas', ['Riesgos', 'Niveles', 'Datos', 'Criterios de salida', 'Límites']],
  ['threat-model', 'Modelo de amenazas', ['Activos', 'Actores', 'Límites', 'Amenazas', 'Mitigaciones']],
  ['runbook', 'Runbook', ['Disparador', 'Diagnóstico', 'Acciones', 'Escalado', 'Rollback']],
  ['release-notes', 'Notas de versión', ['Novedades', 'Correcciones', 'Rupturas', 'Migración', 'Riesgos']],
  ['handoff', 'Handoff', ['Objetivo', 'Estado', 'Decisiones', 'Evidencia', 'Riesgos', 'Siguiente acción']],
  ['context-package', 'Paquete de contexto', ['Objetivo', 'Stack', 'Documentos', 'Comandos', 'Límites']],
  ['security-checklist', 'Checklist de seguridad', ['Superficie', 'Autorización', 'Secretos', 'Entradas', 'Exportación', 'Aprobaciones']]
].map(([id, title, sections]) => meta({
  id: `template-${id}`,
  type: 'template',
  title,
  category: 'documentation',
  tags: ['template', id],
  summary: `Estructura para ${title.toLowerCase()}.`,
  objective: `Producir un ${title.toLowerCase()} completo y revisable.`,
  useWhen: 'Cuando necesites un documento con secciones explícitas.',
  avoidWhen: 'Cuando el documento deba adaptarse a un formato externo no implementado.',
  inputs: ['Contexto del proyecto', 'Datos verificables'],
  outputs: [`Documento ${title.toLowerCase()}`],
  compatibility: ['markdown'],
  status: 'stable',
  content: {
    sections,
    template: sections.map((section) => `## ${section}\n\n[Completar con datos verificables]`).join('\n\n'),
    maintenance: 'Revisa el documento cuando cambien requisitos, decisiones o evidencias.'
  },
  provenance: { origin: 'PromptCombo templates', sources: [], license: 'MIT' }
}));

const existingTemplates = catalogTemplates.map((item) => meta({
  id: item.id,
  type: 'template',
  title: item.title,
  category: 'documentation',
  tags: [item.code, item.short, item.language],
  summary: item.tagline,
  objective: item.usage,
  useWhen: 'Cuando necesites una base de archivo de este tipo.',
  avoidWhen: 'Cuando el formato del proyecto sea incompatible.',
  inputs: ['Variables del archivo'],
  outputs: [item.filename],
  compatibility: ['markdown'],
  status: 'stable',
  content: { filename: item.filename, language: item.language, usage: item.usage, text: item.text },
  provenance: { origin: 'PromptCombo catalog v1', sources: [], license: 'MIT' },
  sourceModule: item.id
}));

const existingScaffolds = scaffolds.map((item) => meta({
  id: item.id,
  type: 'template',
  title: item.title,
  category: 'project',
  tags: ['scaffold', item.code],
  summary: item.tagline,
  objective: item.usage,
  useWhen: 'Cuando necesites una estructura de proyecto de referencia.',
  avoidWhen: 'Cuando el stack o las restricciones no coincidan.',
  inputs: ['Nombre del proyecto', 'Módulos'],
  outputs: ['Árbol de referencia'],
  compatibility: ['markdown'],
  status: 'stable',
  content: { tree: item.tree, usage: item.usage, rules: item.rules },
  provenance: { origin: 'PromptCombo catalog v1', sources: [], license: 'MIT' },
  sourceModule: item.id
}));

const existingPrompts = catalogPrompts.map((item) => meta({
  id: item.id,
  type: 'prompt',
  title: item.title,
  category: 'prompting',
  tags: [item.code, item.short],
  summary: item.tagline,
  objective: item.usage,
  useWhen: 'Cuando necesites una instrucción de inicio de este tipo.',
  avoidWhen: 'Cuando el objetivo requiera un contrato específico no cubierto.',
  inputs: item.variables.map((variable) => variable.label),
  outputs: ['Prompt compuesto'],
  compatibility: ['markdown'],
  status: 'stable',
  content: { usage: item.usage, variables: item.variables, text: item.text },
  provenance: { origin: 'PromptCombo catalog v1', sources: [], license: 'MIT' },
  sourceModule: item.id
}));

const files = [
  ['agents-md', 'AGENTS.md', 'AGENTS.md', 'Instrucciones de repositorio para agentes de código.'],
  ['claude-md', 'CLAUDE.md', 'CLAUDE.md', 'Contexto de proyecto para Claude Code.'],
  ['cursor-rule', 'Regla de Cursor', '.cursor/rules/project.mdc', 'Regla de proyecto en formato .mdc.'],
  ['copilot-instructions', 'Instrucciones de Copilot', '.github/copilot-instructions.md', 'Instrucciones generales para GitHub Copilot.'],
  ['env-example', 'Ejemplo de entorno', '.env.example', 'Variables de entorno sin secretos reales.'],
  ['gitignore', 'Archivo .gitignore', '.gitignore', 'Exclusiones coherentes con el perfil del proyecto.']
].map(([id, title, fileName, summary]) => meta({
  id: `file-${id}`,
  type: 'file',
  title,
  category: 'instructions',
  tags: ['file', id],
  summary,
  objective: `Generar ${fileName} con contenido revisable.`,
  useWhen: 'Cuando el proyecto necesite este archivo y el destino seleccionado sea compatible.',
  avoidWhen: 'Cuando ya exista un archivo equivalente y no se haya decidido sustituirlo.',
  inputs: ['Nombre del proyecto', 'Convenciones'],
  outputs: [fileName],
  compatibility: ['agents', 'cursor', 'claude', 'copilot', 'markdown'],
  status: 'stable',
  content: {
    fileName,
    template: `# ${title}\n\nProyecto: {{projectName}}\n\n[Completar con instrucciones verificables del proyecto]\n`
  },
  provenance: { origin: 'PromptCombo files', sources: [], license: 'MIT' }
}));

const adapters = [
  ['agents', 'AGENTS.md', 'instrucciones de repositorio', 'agents'],
  ['cursor', 'Cursor .mdc', 'reglas de proyecto', 'cursor'],
  ['claude', 'Claude Code', 'contexto CLAUDE.md', 'claude'],
  ['copilot', 'GitHub Copilot', 'instrucciones y prompt files', 'copilot'],
  ['skill', 'Agent Skills', 'paquete SKILL.md', 'skill'],
  ['markdown', 'Markdown genérico', 'documentos portables', 'markdown'],
  ['json-schema', 'JSON Schema', 'esquemas y ejemplos', 'json-schema']
].map(([id, title, summary, target]) => meta({
  id: `adapter-${id}`,
  type: 'adapter',
  title,
  category: 'adapters',
  tags: ['adapter', target],
  summary: `Adaptador para ${summary}.`,
  objective: `Traducir recursos al formato de ${title}.`,
  useWhen: 'Cuando el destino esté seleccionado y el formato sea compatible.',
  avoidWhen: 'Cuando no se haya verificado la superficie concreta del cliente.',
  inputs: ['Recursos', 'Versión del destino'],
  outputs: ['Archivos del adaptador'],
  compatibility: [target],
  status: 'stable',
  verification: verification({ target: 'not_tested' }),
  content: { target, note: 'El formato se implementa según documentación pública; no se ha probado en todas las versiones del cliente.' },
  provenance: { origin: 'PromptCombo adapters', sources: [], license: 'MIT' }
}));

const validators = [
  ['paths', 'Rutas seguras', 'Comprueba traversal, rutas absolutas, duplicados y colisiones.'],
  ['json', 'JSON válido', 'Comprueba que el archivo parsea como JSON.'],
  ['frontmatter', 'Frontmatter', 'Comprueba delimitadores, name y description cuando aplica.'],
  ['placeholders', 'Placeholders', 'Comprueba variables pendientes y su obligatoriedad.'],
  ['links', 'Enlaces internos', 'Avisa de enlaces que no coinciden con archivos del paquete.']
].map(([id, title, summary]) => meta({
  id: `validator-${id}`,
  type: 'validator',
  title,
  category: 'validation',
  tags: ['validator', id],
  summary,
  objective: summary,
  useWhen: 'Antes de exportar o importar un proyecto.',
  avoidWhen: 'Cuando se necesite una validación semántica o de modelo que no existe.',
  inputs: ['Proyecto o artefacto'],
  outputs: ['Mensajes de validación'],
  compatibility: ['markdown'],
  status: 'stable',
  verification: verification({ examples: 'not_tested', generator: 'not_tested', target: 'not_applicable' }),
  content: { check: id },
  provenance: { origin: 'PromptCombo validators', sources: [], license: 'MIT' }
}));

const recipeResources = RECIPES.map((recipe) => meta({
  id: `recipe-${recipe.id}`,
  type: 'recipe',
  title: recipe.title,
  category: recipe.family,
  tags: ['recipe', recipe.family, ...recipe.keywords.slice(0, 4)],
  summary: recipe.summary,
  objective: recipe.description,
  useWhen: 'Cuando la necesidad coincida con este recorrido.',
  avoidWhen: 'Cuando la petición no esté relacionada o el alcance sea insuficiente.',
  inputs: recipe.questions.map((question) => question.label),
  outputs: ['Paquete de artefactos'],
  compatibility: recipe.targets,
  status: 'stable',
  content: { recipeId: recipe.id, family: recipe.family, example: recipe.example },
  provenance: { origin: 'PromptCombo recipes', sources: [], license: 'MIT' }
}));

const packages = [
  ['idea-requirements', 'De idea a requisitos', 'idea-requirements', ['skill-ambiguity-review', 'skill-scope-definition', 'skill-acceptance-criteria', 'register-requirements']],
  ['repo-ready', 'Repositorio preparado para asistentes', 'agents-md', ['skill-context-package', 'skill-repo-inspection', 'command-context']],
  ['publishable-skill', 'Skill publicable', 'skill-package', ['skill-prompt-design', 'skill-evaluation-cases']],
  ['agent-spec', 'Agente especificado', 'agent-contract', ['skill-approval-design', 'skill-evaluation-cases', 'register-approvals']],
  ['feature-development', 'Desarrollo de funcionalidad', 'feature-development', ['skill-change-plan', 'skill-regression-fix', 'skill-verification-report']],
  ['debugging', 'Debugging reproducible', 'debugging', ['skill-debug-reproduction', 'skill-log-analysis', 'skill-regression-fix']],
  ['review-changes', 'Revisión de cambios', 'review-testing', ['skill-code-review', 'skill-edge-cases', 'register-evidence']],
  ['interface-design', 'Diseño de interfaz', 'design-package', ['skill-ux-flow-audit', 'skill-ui-states', 'skill-accessibility-audit', 'register-decisions']],
  ['migration', 'Migración planificada', 'migration', ['skill-migration-plan', 'skill-test-strategy', 'register-risks']],
  ['structured-extraction', 'Extracción estructurada', 'structured-output', ['skill-structured-output', 'skill-evaluation-cases']],
  ['research', 'Investigación documentada', 'prompt-research', ['skill-research-sources', 'skill-comparison-matrix', 'register-evidence']],
  ['release', 'Entrega de versión', 'release-check', ['skill-release-readiness', 'skill-release-notes', 'skill-verification-report']],
  ['handoff', 'Continuidad de proyecto', 'handoff', ['skill-handoff', 'register-decisions', 'register-risks']],
  ['security-review', 'Revisión de riesgos de seguridad', 'security-review', ['skill-threat-model', 'skill-authorization-review', 'skill-secrets-logging', 'register-approvals']],
  ['api-docs', 'Documentación de API', 'api-docs', ['skill-api-design', 'skill-documentation-quickstart', 'register-compatibility']]
].map(([id, title, recipeId, resourceIds]) => meta({
  id: `package-${id}`,
  type: 'package',
  title,
  category: 'packages',
  tags: ['package', id],
  summary: `Paquete curado para ${title.toLowerCase()}.`,
  objective: `Coordinar ${recipeId} con recursos relacionados y entregables coherentes.`,
  useWhen: 'Cuando la necesidad coincida con este paquete y sus recursos.',
  avoidWhen: 'Cuando el usuario solo necesite un recurso aislado.',
  inputs: ['Necesidad', 'Contexto', 'Criterios'],
  outputs: ['Paquete de archivos'],
  compatibility: RECIPES.find((recipe) => recipe.id === recipeId)?.targets || ['markdown'],
  status: 'stable',
  content: { recipeId, resourceIds },
  related: resourceIds,
  provenance: { origin: 'PromptCombo packages', sources: [], license: 'MIT' }
}));

export const LIBRARY_RESOURCES = [
  ...existingSkills,
  ...NEW_SKILLS,
  ...existingRoles,
  ...NEW_ROLES,
  ...commands,
  ...registers,
  ...existingPrompts,
  ...existingTemplates,
  ...existingScaffolds,
  ...files,
  ...NEW_TEMPLATES,
  ...adapters,
  ...validators,
  ...recipeResources,
  ...packages
];

// Relaciones inversas: un recurso muestra las recetas y paquetes que lo consumen.
const resourceIndex = new Map(LIBRARY_RESOURCES.map((resource) => [resource.id, resource]));
const linkRelated = (sourceId, targetId) => {
  const source = resourceIndex.get(sourceId);
  const target = resourceIndex.get(targetId);
  if (!source || !target) return;
  source.related = source.related || [];
  if (!source.related.includes(targetId)) source.related.push(targetId);
};

for (const recipe of RECIPES) {
  const recipeId = `recipe-${recipe.id}`;
  for (const resourceId of recipe.defaultResources || []) {
    linkRelated(resourceId, recipeId);
    linkRelated(recipeId, resourceId);
  }
}

for (const role of LIBRARY_RESOURCES.filter((resource) => resource.type === 'role')) {
  for (const skillId of role.content?.relatedSkills || []) linkRelated(role.id, skillId);
}

linkRelated('prompt-kickoff', 'recipe-prompt-professional');
linkRelated('prompt-research', 'recipe-prompt-research');

for (const pkg of LIBRARY_RESOURCES.filter((resource) => resource.type === 'package')) {
  for (const resourceId of pkg.content?.resourceIds || []) linkRelated(resourceId, pkg.id);
}

// Relaciones editoriales explícitas para recursos que no son predeterminados de una receta.
const EXTRA_RELATIONS = {
  'skill-prioritization': ['recipe-idea-requirements', 'package-idea-requirements'],
  'skill-prompt-contradictions': ['recipe-prompt-professional'],
  'skill-e2e-flows': ['recipe-feature-development', 'recipe-review-testing'],
  'skill-usability-test': ['recipe-design-package', 'package-interface-design'],
  'skill-runbook': ['recipe-release-check', 'package-release'],
  'skill-incident-report': ['recipe-debugging', 'package-debugging'],
  'skill-research-conflicts': ['recipe-prompt-research', 'package-research'],
  'skill-decision-record': ['recipe-handoff', 'package-handoff']
};
for (const [resourceId, relatedIds] of Object.entries(EXTRA_RELATIONS)) {
  for (const relatedId of relatedIds) linkRelated(resourceId, relatedId);
}

// Los recursos nuevos no se elevan a stable sin revisión editorial explícita.
for (const resource of LIBRARY_RESOURCES) {
  if (!resource.sourceModule) resource.status = 'experimental';
}

export const RESOURCE_MAP = new Map(LIBRARY_RESOURCES.map((resource) => [resource.id, resource]));

export function getResource(id) {
  return RESOURCE_MAP.get(id) || null;
}
