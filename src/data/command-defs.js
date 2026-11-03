/* Definiciones de comandos reutilizables. No son comandos de un cliente concreto. */

export const COMMAND_DEFS = {
  brief: {
    title: 'Brief',
    description: 'Convertir una idea en un brief breve, explícito y accionable.',
    skillId: 'skill-requirements-analysis',
    steps: [
      'Resume el problema, el usuario y el resultado esperado.',
      'Separa hechos, supuestos y preguntas abiertas.',
      'Define alcance, exclusiones y criterios de éxito.',
      'Señala riesgos y dependencias sin inventar datos.'
    ],
    output: 'Brief con problema, usuarios, alcance, supuestos y criterios de éxito.',
    restrictions: ['No inventes usuarios, métricas ni requisitos.'],
    example: '/brief Quiero una herramienta interna para revisar inventario.'
  },
  clarify: {
    title: 'Clarify',
    description: 'Detectar ambigüedades y formular preguntas que desbloqueen la tarea.',
    skillId: 'skill-ambiguity-review',
    steps: [
      'Identifica términos ambiguos y requisitos incompletos.',
      'Distingue lo que bloquea de lo que puede decidirse después.',
      'Formula preguntas concretas con impacto explícito.',
      'Propón supuestos solo si son reversibles.'
    ],
    output: 'Lista priorizada de preguntas, supuestos y bloqueos.',
    restrictions: ['No conviertas preferencias en requisitos.'],
    example: '/clarify Este brief no define qué ocurre cuando falta un dato.'
  },
  requirements: {
    title: 'Requirements',
    description: 'Convertir una necesidad en requisitos verificables.',
    skillId: 'skill-requirements-analysis',
    steps: [
      'Identifica actores, capacidades y restricciones.',
      'Redacta requisitos funcionales y no funcionales.',
      'Asigna un criterio de aceptación a cada requisito.',
      'Marca dependencias, exclusiones y preguntas abiertas.'
    ],
    output: 'Documento de requisitos con identificadores y aceptación.',
    restrictions: ['No inventes prioridades sin criterio explícito.'],
    example: '/requirements Gestión de inventario con roles y auditoría.'
  },
  acceptance: {
    title: 'Acceptance',
    description: 'Definir criterios de aceptación observables.',
    skillId: 'skill-acceptance-criteria',
    steps: [
      'Toma cada requisito y describe el comportamiento esperado.',
      'Incluye caminos normales, límites y errores.',
      'Especifica evidencia verificable por criterio.',
      'Elimina criterios que no puedan comprobarse.'
    ],
    output: 'Criterios de aceptación por requisito con evidencia.',
    restrictions: ['No uses «funciona bien» como criterio.'],
    example: '/acceptance Un usuario sin permiso no puede editar inventario.'
  },
  plan: {
    title: 'Plan',
    description: 'Delimitar un cambio no trivial antes de implementarlo.',
    skillId: 'skill-change-plan',
    steps: [
      'Inspecciona el estado del repositorio y los archivos afectados.',
      'Define objetivo, alcance, dependencias, riesgos y aceptación.',
      'Propón un plan incremental con verificaciones por paso.',
      'No implementes todavía salvo petición explícita.'
    ],
    output: 'Plan, archivos afectados, riesgos y verificaciones.',
    restrictions: ['No planifiques sin inspeccionar el contexto.'],
    example: '/plan Añadir persistencia local de filtros.'
  },
  scope: {
    title: 'Scope',
    description: 'Delimitar un MVP y sus exclusiones.',
    skillId: 'skill-scope-definition',
    steps: [
      'Identifica el resultado mínimo que aporta valor.',
      'Clasifica capacidades en dentro, después y fuera.',
      'Explicita costes y riesgos de cada exclusión.',
      'Define una condición de revisión del alcance.'
    ],
    output: 'Alcance, exclusiones y criterios de revisión.',
    restrictions: ['No amplíes el alcance para evitar decisiones difíciles.'],
    example: '/scope Primera versión solo para un equipo interno.'
  },
  architecture: {
    title: 'Architecture',
    description: 'Proponer una arquitectura mínima y justificada.',
    skillId: 'skill-pwa-architecture',
    steps: [
      'Identifica requisitos, restricciones y fuerzas relevantes.',
      'Propón capas, módulos y contratos.',
      'Explica alternativas y motivos de descarte.',
      'Define límites, riesgos y verificaciones.'
    ],
    output: 'Documento de arquitectura con decisiones y consecuencias.',
    restrictions: ['No introduzcas complejidad sin un problema medible.'],
    example: '/architecture App web offline con API opcional.'
  },
  adr: {
    title: 'ADR',
    description: 'Registrar una decisión arquitectónica con contexto y consecuencias.',
    skillId: 'skill-decision-record',
    steps: [
      'Describe el problema y las restricciones.',
      'Enumera alternativas reales.',
      'Registra la decisión y su justificación.',
      'Define consecuencias, verificación y condiciones de revisión.'
    ],
    output: 'ADR con estado, contexto, decisión y consecuencias.',
    restrictions: ['No reescribas decisiones pasadas sin dejar rastro.'],
    example: '/adr Elegir almacenamiento local frente a una API.'
  },
  implement: {
    title: 'Implement',
    description: 'Implementar una tarea acotada con verificación.',
    skillId: 'skill-refactoring',
    steps: [
      'Lee las instrucciones y el contexto aplicable.',
      'Aplica el cambio mínimo coherente con el objetivo.',
      'Añade o actualiza pruebas del comportamiento.',
      'Ejecuta las comprobaciones y revisa el diff.'
    ],
    output: 'Cambio implementado, pruebas y evidencia.',
    restrictions: ['No mezcles refactorizaciones ajenas.'],
    example: '/implement Añadir validación al formulario de alta.'
  },
  explain: {
    title: 'Explain',
    description: 'Explicar código o una decisión con el contexto necesario.',
    skillId: 'skill-doc-functions',
    steps: [
      'Identifica propósito, entradas, salidas y consumidores.',
      'Describe el flujo y los efectos secundarios.',
      'Señala casos límite y supuestos.',
      'Añade complejidad solo cuando sea pertinente.'
    ],
    output: 'Explicación estructurada con referencias verificables.',
    restrictions: ['No describas comportamiento que el código no garantiza.'],
    example: '/explain src/core/generator.js'
  },
  debug: {
    title: 'Debug',
    description: 'Investigar un fallo con evidencia antes de corregirlo.',
    skillId: 'skill-log-analysis',
    steps: [
      'Resume síntoma, reproducción, entorno y cambios recientes.',
      'Formula hipótesis distinguibles.',
      'Ejecuta comprobaciones mínimas y descarta hipótesis.',
      'Aplica una corrección acotada y añade una regresión.'
    ],
    output: 'Causa confirmada o pendiente, corrección y evidencia.',
    restrictions: ['No presentes una hipótesis como causa confirmada.'],
    example: '/debug El guardado falla solo tras cambiar de pestaña.'
  },
  reproduce: {
    title: 'Reproduce',
    description: 'Crear una reproducción mínima y determinista de un fallo.',
    skillId: 'skill-debug-reproduction',
    steps: [
      'Reduce entradas y pasos al mínimo necesario.',
      'Fija entorno, versión y estado inicial.',
      'Comprueba que el fallo se repite y que el control no falla.',
      'Documenta la reproducción y sus límites.'
    ],
    output: 'Reproducción mínima con evidencia de fallo y control.',
    restrictions: ['No uses datos sensibles en la reproducción.'],
    example: '/reproduce Error al enviar un formulario vacío.'
  },
  fix: {
    title: 'Fix',
    description: 'Corregir un defecto con una prueba de regresión.',
    skillId: 'skill-regression-fix',
    steps: [
      'Delimita comportamiento defectuoso y esperado.',
      'Identifica la causa sin ocultar el error.',
      'Aplica la corrección mínima.',
      'Demuestra el antes/después con una prueba reproducible.'
    ],
    output: 'Parche, prueba de regresión y riesgos residuales.',
    restrictions: ['No silencies la excepción ni elimines la validación.'],
    example: '/fix El campo obligatorio acepta solo espacios.'
  },
  refactor: {
    title: 'Refactor',
    description: 'Mejorar estructura sin cambiar contratos.',
    skillId: 'skill-refactoring',
    steps: [
      'Fija el comportamiento con pruebas o verificación.',
      'Selecciona el cambio estructural mínimo.',
      'Aplica pasos pequeños y verifica cada uno.',
      'Compara el diff y declara invariantes.'
    ],
    output: 'Refactorización, pruebas y comportamientos invariables.',
    restrictions: ['No mezcles funcionalidad nueva.'],
    example: '/refactor Extraer la validación compartida del formulario.'
  },
  migrate: {
    title: 'Migrate',
    description: 'Planificar una migración con compatibilidad y reversión.',
    skillId: 'skill-migration-plan',
    steps: [
      'Inventaría datos, contratos y consumidores.',
      'Define fases, compatibilidad y migración de datos.',
      'Prepara verificación, rollback y criterios de parada.',
      'Documenta riesgos y decisiones pendientes.'
    ],
    output: 'Plan de migración con fases, compatibilidad y reversión.',
    restrictions: ['No planifiques una migración destructiva sin rollback.'],
    example: '/migrate Cambiar el esquema de configuración a la versión 2.'
  },
  dependencies: {
    title: 'Dependencies',
    description: 'Revisar dependencias con evidencia y plan de actualización.',
    skillId: 'skill-dependency-maintenance',
    steps: [
      'Inventaría dependencias directas y relevantes.',
      'Revisa versión, mantenimiento, licencia y vulnerabilidades.',
      'Separa parches, menores y cambios mayores.',
      'Define verificación y rollback.'
    ],
    output: 'Informe de dependencias y plan de actualización.',
    restrictions: ['No actualices todo a ciegas en un solo cambio.'],
    example: '/dependencies Actualizar el bundler sin cambiar la API.'
  },
  review: {
    title: 'Review',
    description: 'Revisar un cambio y devolver hallazgos accionables.',
    skillId: 'skill-code-review',
    steps: [
      'Lee instrucciones y diff completo.',
      'Comprueba contratos, regresiones, seguridad y accesibilidad.',
      'Clasifica hallazgos por impacto y evidencia.',
      'No corrijas el artefacto salvo petición explícita.'
    ],
    output: 'Hallazgos priorizados con ubicación, impacto y corrección.',
    restrictions: ['No declares un fallo sin reproducción o base contractual.'],
    example: '/review Pull request de autenticación.'
  },
  test: {
    title: 'Test',
    description: 'Diseñar o ampliar pruebas relevantes.',
    skillId: 'skill-unit-testing',
    steps: [
      'Identifica contratos, límites y modos de fallo.',
      'Selecciona casos representativos y de borde.',
      'Implementa pruebas deterministas y legibles.',
      'Ejecuta la suite y registra resultados reales.'
    ],
    output: 'Pruebas añadidas y evidencia de ejecución.',
    restrictions: ['No inventes resultados de pruebas.'],
    example: '/test Añadir casos límite al parser de configuración.'
  },
  'test-plan': {
    title: 'Test plan',
    description: 'Diseñar una estrategia de pruebas proporcionada al riesgo.',
    skillId: 'skill-test-strategy',
    steps: [
      'Identifica riesgos y contratos críticos.',
      'Selecciona niveles y tipos de prueba.',
      'Define datos, entornos y criterios de salida.',
      'Declara lo que no se probará y por qué.'
    ],
    output: 'Plan de pruebas con alcance, riesgos y evidencia.',
    restrictions: ['No propongas cobertura total sin justificarla.'],
    example: '/test-plan Cambio en autenticación y sesiones.'
  },
  'edge-cases': {
    title: 'Edge cases',
    description: 'Identificar límites, vacíos y fallos esperables.',
    skillId: 'skill-edge-cases',
    steps: [
      'Enumera entradas vacías, extremas y malformadas.',
      'Revisa concurrencia, orden, tiempo y cuotas.',
      'Comprueba permisos, estados y recuperación.',
      'Prioriza por impacto y probabilidad.'
    ],
    output: 'Matriz de casos límite con resultado esperado.',
    restrictions: ['No conviertas hipótesis en fallos confirmados.'],
    example: '/edge-cases Importación de un JSON de 2 MB.'
  },
  'security-review': {
    title: 'Security review',
    description: 'Revisar una superficie de seguridad sin certificar el sistema.',
    skillId: 'skill-threat-model',
    steps: [
      'Define activos, límites de confianza y actores.',
      'Enumera amenazas y condiciones de explotación.',
      'Revisa autorización, secretos, logs y entradas.',
      'Propón mitigaciones y evidencia de verificación.'
    ],
    output: 'Hallazgos de seguridad priorizados y riesgos residuales.',
    restrictions: ['No declares una auditoría completa ni una certificación.'],
    example: '/security-review Endpoint de importación de archivos.'
  },
  'accessibility-review': {
    title: 'Accessibility review',
    description: 'Revisar barreras de accesibilidad con evidencia.',
    skillId: 'skill-accessibility-audit',
    steps: [
      'Revisa semántica, orden de lectura y landmarks.',
      'Recorre los flujos solo con teclado.',
      'Comprueba nombres, estados, errores y contraste.',
      'Registra barreras con impacto y criterio.'
    ],
    output: 'Informe de barreras y recomendaciones priorizadas.',
    restrictions: ['No declares conformidad total con una herramienta automática.'],
    example: '/accessibility-review Formulario de alta de inventario.'
  },
  'performance-review': {
    title: 'Performance review',
    description: 'Revisar rendimiento con una línea base y una hipótesis.',
    skillId: 'skill-performance-optimization',
    steps: [
      'Define escenario y línea base reproducible.',
      'Identifica el cuello de botella dominante.',
      'Aplica un cambio de bajo riesgo y mide de nuevo.',
      'Documenta mejora, coste y regresiones.'
    ],
    output: 'Informe antes/después con evidencia y riesgos.',
    restrictions: ['No optimices sin medición.'],
    example: '/performance-review Render inicial de 1.200 filas.'
  },
  verify: {
    title: 'Verify',
    description: 'Comprobar una entrega contra sus criterios.',
    skillId: 'skill-verification-report',
    steps: [
      'Recupera criterios y evidencias esperadas.',
      'Ejecuta las comprobaciones disponibles.',
      'Separa verificado, fallido y no probado.',
      'Entrega un informe con bloqueos y riesgos.'
    ],
    output: 'Informe de verificación con evidencia real.',
    restrictions: ['No sustituyas la ejecución por una afirmación.'],
    example: '/verify Candidato a release 2.3.0.'
  },
  docs: {
    title: 'Docs',
    description: 'Actualizar documentación para que refleje el código real.',
    skillId: 'skill-doc-functions',
    steps: [
      'Identifica qué comportamiento o decisión cambió.',
      'Localiza la documentación afectada.',
      'Actualiza ejemplos, comandos y límites.',
      'Comprueba que no quedan afirmaciones obsoletas.'
    ],
    output: 'Documentación actualizada y referencias verificadas.',
    restrictions: ['No documentes funciones que no existen.'],
    example: '/docs Actualizar la guía de generación de paquetes.'
  },
  readme: {
    title: 'README',
    description: 'Crear o revisar un README de inicio rápido.',
    skillId: 'skill-documentation-quickstart',
    steps: [
      'Define público, problema y resultado.',
      'Documenta requisitos, instalación y primer uso.',
      'Añade comandos reales y verificación.',
      'Enlaza documentación profunda sin duplicarla.'
    ],
    output: 'README conciso con inicio rápido y límites.',
    restrictions: ['No inventes comandos ni compatibilidad.'],
    example: '/readme Documentar una herramienta interna de inventario.'
  },
  changelog: {
    title: 'Changelog',
    description: 'Redactar notas de versión comprensibles y verificables.',
    skillId: 'skill-release-notes',
    steps: [
      'Revisa commits, cambios y decisiones.',
      'Agrupa cambios por impacto para el usuario.',
      'Distingue novedades, correcciones y rupturas.',
      'Añade migración y riesgos conocidos.'
    ],
    output: 'Notas de versión con cambios y migración.',
    restrictions: ['No inventes fechas, versiones ni impactos.'],
    example: '/changelog Versión 2.3.0 del generador guiado.'
  },
  'release-check': {
    title: 'Release check',
    description: 'Comprobar si una entrega está preparada sin publicar nada.',
    skillId: 'skill-release-readiness',
    steps: [
      'Revisa estado de Git y cambios pendientes.',
      'Ejecuta los controles documentados.',
      'Comprueba migraciones, documentación y riesgos.',
      'Resume bloqueos; no publiques ni despliegues.'
    ],
    output: 'Checklist de release con bloqueos y evidencia.',
    restrictions: ['No publiques, etiquetes ni despliegues.'],
    example: '/release-check Antes de publicar en GH Pages.'
  },
  handoff: {
    title: 'Handoff',
    description: 'Transferir estado, evidencia y próximos pasos sin secretos.',
    skillId: 'skill-handoff',
    steps: [
      'Resume objetivo y estado actual.',
      'Enumera archivos, decisiones y comandos ejecutados.',
      'Separa evidencia de supuestos y cambios sin verificar.',
      'Indica permisos pendientes y la siguiente acción.'
    ],
    output: 'Traspaso estructurado y verificable.',
    restrictions: ['No incluyas secretos ni conviertas supuestos en hechos.'],
    example: '/handoff Transferir el proyecto a otra persona.'
  },
  context: {
    title: 'Context',
    description: 'Preparar un paquete de contexto mínimo para asistentes.',
    skillId: 'skill-context-package',
    steps: [
      'Identifica objetivo, stack y restricciones.',
      'Selecciona documentos y comandos de alta utilidad.',
      'Excluye secretos y contexto irrelevante.',
      'Define qué debe actualizarse y cuándo.'
    ],
    output: 'Paquete de contexto con instrucciones y referencias.',
    restrictions: ['No incluyas credenciales ni datos personales.'],
    example: '/context Preparar el repositorio para Copilot.'
  },
  'decision-log': {
    title: 'Decision log',
    description: 'Registrar decisiones y su estado.',
    skillId: 'skill-decision-record',
    steps: [
      'Identifica la decisión y la fecha.',
      'Registra contexto, alternativas y motivo.',
      'Declara consecuencias y verificaciones.',
      'Marca estado y condiciones de revisión.'
    ],
    output: 'Registro de decisiones actualizado.',
    restrictions: ['No reescribas decisiones sin dejar rastro.'],
    example: '/decision-log Registrar el cambio de persistencia.'
  },
  'incident-report': {
    title: 'Incident report',
    description: 'Documentar un incidente con evidencia y acciones.',
    skillId: 'skill-incident-report',
    steps: [
      'Construye una línea temporal con evidencia.',
      'Separa impacto, causa y factores contribuyentes.',
      'Documenta acciones de contención y recuperación.',
      'Define prevención y seguimiento.'
    ],
    output: 'Informe de incidente con causa y acciones.',
    restrictions: ['No inventes causa raíz ni datos personales.'],
    example: '/incident-report Fallo de disponibilidad de la API.'
  },
  'ux-audit': {
    title: 'UX audit',
    description: 'Auditar un recorrido de usuario con evidencia.',
    skillId: 'skill-ux-flow-audit',
    steps: [
      'Define usuario, objetivo y recorrido.',
      'Comprueba jerarquía, carga y recuperación.',
      'Revisa teclado, foco y mensajes.',
      'Prioriza fricciones con impacto.'
    ],
    output: 'Informe de fricciones y recomendaciones.',
    restrictions: ['No confundas preferencia estética con defecto.'],
    example: '/ux-audit Alta de inventario en móvil.'
  },
  'user-flow': {
    title: 'User flow',
    description: 'Mapear un recorrido de usuario y sus estados.',
    skillId: 'skill-ux-flow-audit',
    steps: [
      'Define entrada, objetivo y salida.',
      'Identifica decisiones, dependencias y errores.',
      'Incluye carga, vacío, permiso y recuperación.',
      'Señala puntos de validación.'
    ],
    output: 'Flujo con estados y criterios de éxito.',
    restrictions: ['No omitas estados de error.'],
    example: '/user-flow Compra de un artículo con pago fallido.'
  },
  'ui-spec': {
    title: 'UI spec',
    description: 'Especificar pantallas, componentes y estados.',
    skillId: 'skill-ui-states',
    steps: [
      'Define objetivo y acción principal por pantalla.',
      'Especifica datos, componentes y estados.',
      'Incluye accesibilidad y responsive.',
      'Define criterios de aceptación visual.'
    ],
    output: 'Especificación de UI revisable.',
    restrictions: ['No prometas una implementación no realizada.'],
    example: '/ui-spec Panel de resumen de inventario.'
  },
  schema: {
    title: 'Schema',
    description: 'Diseñar un esquema JSON y sus ejemplos.',
    skillId: 'skill-structured-output',
    steps: [
      'Define campos, tipos y obligatoriedad.',
      'Especifica restricciones y valores permitidos.',
      'Crea ejemplos válidos e inválidos.',
      'Declara el subconjunto de JSON Schema soportado.'
    ],
    output: 'Esquema, ejemplos y validación estructural.',
    restrictions: ['No declares validación total si el validador es parcial.'],
    example: '/schema Extracción de datos de una factura.'
  },
  extract: {
    title: 'Extract',
    description: 'Preparar una extracción estructurada.',
    skillId: 'skill-structured-output',
    steps: [
      'Define la entrada y el contrato de salida.',
      'Identifica campos obligatorios y ausencias.',
      'Añade ejemplos y criterios de rechazo.',
      'No evalúes el modelo con este comando.'
    ],
    output: 'Prompt de extracción, esquema y ejemplos.',
    restrictions: ['No simules resultados de un modelo.'],
    example: '/extract Obtener título, fecha e importe de una factura.'
  }
};

export const COMMAND_IDS = Object.keys(COMMAND_DEFS);

export function getCommand(id) {
  return COMMAND_DEFS[id] || null;
}
