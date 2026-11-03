/* Skills 21–25 */
export const skillsBatch5 = [
  {
    id: 'skill-subagent-orchestration',
    code: 'S-21',
    short: 'OR',
    title: 'Orquestación de Subagentes',
    tagline: 'Descompón, contrata handoffs y controla el ciclo completo.',
    purpose: 'Coordinar varios subagentes con responsabilidades delimitadas, contratos explícitos, dependencias resueltas y presupuestos de ejecución, manteniendo una única fuente de decisión y evidencia verificable.',
    when: 'Cuando una tarea excede el contexto o la especialidad de un solo agente, o cuando varias unidades pueden trabajar en paralelo sin compartir estado mutable.',
    inputs: [
      'Objetivo global y criterios de aceptación.',
      'Tareas descomponibles y dependencias entre ellas.',
      'Capacidades y permisos de cada subagente.',
      'Límites de tiempo, herramientas, reintentos y coste.'
    ],
    procedure: [
      'Construir un grafo acíclico de tareas con entrada, salida y criterio de cierre.',
      'Asignar cada tarea a un rol adecuado con contrato de handoff y contexto mínimo.',
      'Definir qué tareas pueden ejecutarse en paralelo y qué estado comparten.',
      'Establecer límites de reintentos, timeouts y condiciones de escalado.',
      'Validar cada resultado antes de integrarlo; nunca aceptar por confianza.',
      'Consolidar evidencia, conflictos y riesgos en una respuesta final única.'
    ],
    restrictions: [
      'No crear bucles de delegación sin condición de salida.',
      'No conceder herramientas sensibles o destructivas sin justificación y autorización.',
      'No compartir contexto de usuario más allá de lo necesario para la tarea.',
      'No aceptar la salida de un subagente si contradice el contrato global.'
    ],
    output: 'Plan de orquestación con DAG, asignaciones, contratos de handoff, permisos, límites, criterios de validación y protocolo de error.',
    acceptance: [
      'Cada tarea tiene un responsable y un resultado verificable.',
      'Las dependencias y el paralelismo están justificados.',
      'Existe un mecanismo de timeout, fallo y escalado por tarea.',
      'Ningún agente puede ejecutar acciones externas sin autorización explícita.'
    ],
    example: 'UI y Lógica trabajan en paralelo con contratos separados; el coordinador valida que los nombres de eventos coincidan, luego encarga Integración y finalmente Revisión. Si una tarea falla dos veces, no reintenta indefinidamente: escala con evidencia.'
  },
  {
    id: 'skill-file-templates',
    code: 'S-22',
    short: 'FT',
    title: 'Generación de Plantillas de Archivos',
    tagline: 'Archivos completos, rutas claras y variables explícitas.',
    purpose: 'Producir plantillas de archivo completas y ejecutables que permitan arrancar un proyecto sin huecos, diferenciando contenido fijo de variables sustituibles y validando sintaxis y rutas.',
    when: 'Al crear scaffoldings, entregar bases reutilizables o estandarizar archivos iniciales para varios proyectos.',
    inputs: [
      'Convenciones de nombre, estructura y lenguaje del proyecto.',
      'Variables permitidas y sus valores esperados.',
      'Requisitos mínimos de ejecución y seguridad.',
      'Comandos o verificaciones que debe soportar la plantilla.'
    ],
    procedure: [
      'Definir el propósito, la ruta y los consumidores de cada archivo.',
      'Marcar variables con delimitadores consistentes y documentar su sustitución.',
      'Escribir el archivo completo, sin fragmentos truncados ni dependencias implícitas.',
      'Validar sintaxis y ejecución en un entorno mínimo.',
      'Añadir comentarios solo donde la intención no sea evidente.',
      'Registrar qué partes se personalizan y cuáles deben permanecer estables.'
    ],
    restrictions: [
      'No incluir secretos, credenciales ni rutas absolutas de una máquina.',
      'No entregar archivos a medias con comentarios como resto del código.',
      'No mezclar delimitadores de plantilla con sintaxis del lenguaje sin escape.',
      'No usar una plantilla sin comprobar que arranca en el entorno objetivo.'
    ],
    output: 'Conjunto de archivos completos con rutas, variables, instrucciones de sustitución y evidencia de validación.',
    acceptance: [
      'Todos los archivos indicados están completos y tienen una ubicación coherente.',
      'El proyecto base arranca o se valida siguiendo los pasos documentados.',
      'Las variables están inventariadas y no se confunden con sintaxis del lenguaje.',
      'La plantilla no contiene datos locales ni secretos.'
    ],
    example: 'Para una PWA vanilla: index.html con etiqueta manifest, styles.css con tokens, app.js en patrón módulo, manifest.json válido, sw.js cacheado y README con instrucciones. Se valida que index.html carga sin errores en un servidor local.'
  },
  {
    id: 'skill-accessibility-audit',
    code: 'S-23',
    short: 'A11Y',
    title: 'Auditoría de Accesibilidad (a11y)',
    tagline: 'Semántica, teclado, foco, contraste y movimiento.',
    purpose: 'Evaluar una interfaz contra criterios de accesibilidad aplicables, detectar barreras reales para personas con distintas capacidades y documentar correcciones priorizadas.',
    when: 'Antes de publicar una interfaz, después de un rediseño o al recibir quejas de navegación por teclado, lectores de pantalla o contraste.',
    inputs: [
      'Pantallas y flujos representativos.',
      'Requisitos aplicables, idealmente WCAG 2.2 AA.',
      'Resultados de teclado, lector de pantalla y zoom.',
      'Herramientas automáticas disponibles y limitaciones conocidas.'
    ],
    procedure: [
      'Revisar estructura semántica, encabezados, landmarks y orden de lectura.',
      'Recorrer todos los flujos solo con teclado y comprobar foco visible.',
      'Verificar nombres accesibles, estados, mensajes y relaciones de formularios.',
      'Comprobar contraste de texto y componentes interactivos; no confiar solo en color.',
      'Probar zoom, reflow, texto ampliado y prefers-reduced-motion.',
      'Registrar barreras con impacto y criterio, y priorizar correcciones.'
    ],
    restrictions: [
      'No declarar conformidad total con una herramienta automática.',
      'No añadir ARIA que sustituya semántica nativa correcta.',
      'No ocultar el foco ni eliminar el outline sin una alternativa visible.',
      'No usar animaciones parpadeantes o movimiento esencial sin control.'
    ],
    output: 'Informe de accesibilidad con barreras, criterios afectados, severidad, evidencia y recomendaciones verificables.',
    acceptance: [
      'Los flujos principales se completan con teclado sin trampas de foco.',
      'Los controles tienen nombres accesibles y estados perceptibles.',
      'El contraste y el reflow son adecuados en los puntos evaluados.',
      'Las animaciones respetan la preferencia de movimiento reducido.'
    ],
    example: 'Recorrido del catálogo: desplegar grupos con Enter, añadir con foco visible, abrir detalle con teclado, cerrar con Escape y devolver el foco al origen. Se corrige un icono sin nombre accesible y se restaura el outline del botón.'
  },
  {
    id: 'skill-version-control',
    code: 'S-24',
    short: 'VC',
    title: 'Gestión de Control de Versiones',
    tagline: 'Cambios pequeños, atribuibles y revisables.',
    purpose: 'Mantener un historial de cambios claro y reversible mediante inspección previa, diffs enfocados, mensajes convencionales y validaciones antes de confirmar una modificación.',
    when: 'Al iniciar trabajo en un repositorio existente, agrupar cambios, corregir un error o preparar una revisión.',
    inputs: [
      'Estado actual del árbol de trabajo y rama.',
      'Cambios propios y cambios previos del usuario.',
      'Convención de commits del proyecto.',
      'Pruebas o verificaciones exigidas.'
    ],
    procedure: [
      'Ejecutar git status y revisar diffs antes de editar o confirmar.',
      'Separar cambios propios de trabajo previo no relacionado.',
      'Agrupar cambios coherentes y excluir archivos generados si no corresponde.',
      'Revisar el diff final y ejecutar las validaciones aplicables.',
      'Escribir un commit siguiendo Conventional Commits y autorización del usuario.',
      'No reescribir historia compartida sin coordinación.'
    ],
    restrictions: [
      'No usar git add . sin revisar qué se incluye.',
      'No hacer commit, push, tag o release sin autorización.',
      'No deshacer ni sobrescribir cambios del usuario.',
      'No mezclar correcciones, refactorizaciones y funcionalidades en un commit opaco.'
    ],
    output: 'Historial de cambios con estado inicial documentado, diff revisado, commits convencionales y verificaciones asociadas.',
    acceptance: [
      'Cada commit describe un cambio coherente y puede revertirse de forma aislada.',
      'El commit no incluye secretos ni archivos accidentales.',
      'Las verificaciones ejecutadas se mencionan en la descripción o en la entrega.',
      'El trabajo del usuario no se modifica sin autorización.'
    ],
    example: 'Antes: rama main con cambios locales ajenos. Se revisa diff, se guardan sin tocar, se implementa solo el motor de combos en un commit feat(promptcombo): add deterministic prompt compiler, y se ejecutan las pruebas pertinentes con autorización.'
  },
  {
    id: 'skill-database-structure',
    code: 'S-25',
    short: 'DB',
    title: 'Estructuración de Base de Datos',
    tagline: 'Integridad primero; rendimiento con evidencia.',
    purpose: 'Estructurar datos persistentes con claves, restricciones, relaciones, índices y estrategias de migración que preserven la integridad y permitan consultas eficientes.',
    when: 'Al persistir datos más allá de una sesión efímera, diseñar NoSQL o SQL, o corregir duplicaciones y consultas lentas.',
    inputs: [
      'Modelo de dominio y operaciones de lectura/escritura.',
      'Requisitos de volumen, concurrencia y retención.',
      'Motor y versión de base de datos.',
      'Políticas de privacidad y respaldo.'
    ],
    procedure: [
      'Definir entidades, claves primarias y relaciones antes de añadir índices.',
      'Aplicar restricciones de unicidad, obligatoriedad e integridad referencial.',
      'Normalizar hasta eliminar anomalías; desnormalizar solo con evidencia de lectura.',
      'Diseñar índices a partir de consultas reales y medir su coste de escritura.',
      'Definir transacciones, migraciones, respaldo y recuperación.',
      'Validar con datos representativos y consultas de borde.'
    ],
    restrictions: [
      'No almacenar listas no acotadas en un campo si se consultan con frecuencia.',
      'No crear índices sin una consulta que los justifique.',
      'No aplicar migraciones destructivas sin respaldo y rollback.',
      'No guardar datos sensibles sin cifrado o política de acceso definida.'
    ],
    output: 'Esquema con tablas/colecciones, claves, restricciones, relaciones, índices, migraciones y criterios de integridad.',
    acceptance: [
      'Las restricciones impiden estados inválidos del dominio.',
      'Las consultas críticas tienen un plan de acceso y un índice justificado.',
      'Las migraciones son reproducibles y reversibles o tienen plan de recuperación.',
      'El modelo soporta los volúmenes y operaciones acordados.'
    ],
    example: 'Para combos: Combo(id PK, name, created_at), Block(id PK, combo_id FK, position, type, ref_id) con UNIQUE(combo_id, position) y ON DELETE CASCADE. Índice en combo_id, position para recuperar secuencias completas en una sola consulta.'
  }
];
