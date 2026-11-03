/* Skills 01–05 */
export const skillsBatch1 = [
  {
    id: 'skill-requirements-analysis',
    code: 'S-01',
    short: 'RQ',
    title: 'Análisis de Requisitos',
    tagline: 'Convierte necesidades ambiguas en un alcance comprobable.',
    purpose: 'Transformar una necesidad de negocio o de usuario en requisitos funcionales y no funcionales atómicos, priorizados y verificables, dejando explícitos los supuestos y las exclusiones.',
    when: 'Al inicio de un proyecto, ante un cambio de alcance, después de una entrevista con usuarios o cuando una petición contiene términos subjetivos como rápido, intuitivo, completo o seguro.',
    inputs: [
      'Brief, transcripción o descripción del problema.',
      'Usuarios, actores y objetivos de negocio.',
      'Restricciones conocidas de tiempo, stack, privacidad o infraestructura.',
      'Sistema existente o entregas previas relevantes.'
    ],
    procedure: [
      'Reformular el objetivo en una frase que describa resultado, usuario y contexto.',
      'Separar hechos confirmados, supuestos y preguntas abiertas sin mezclar categorías.',
      'Identificar actores, permisos y casos de uso principales, alternativos y de error.',
      'Escribir requisitos con identificador único, comportamiento observable y prioridad.',
      'Derivar criterios de aceptación dados los supuestos y las condiciones límite.',
      'Revisar contradicciones, duplicados, dependencias y vacíos de alcance.'
    ],
    restrictions: [
      'No convertir una preferencia de implementación en requisito funcional.',
      'No ocultar una ambigüedad con un supuesto no validado.',
      'No definir arquitectura detallada salvo que el requisito lo exija explícitamente.'
    ],
    output: 'Documento de requisitos con actores, alcance, requisitos funcionales y no funcionales priorizados, supuestos, exclusiones, riesgos y preguntas abiertas.',
    acceptance: [
      'Cada requisito es atómico, rastreable y verificable sin interpretar la intención del autor.',
      'Cada requisito crítico tiene al menos un criterio de aceptación observable.',
      'Los supuestos, exclusiones y preguntas abiertas están separados y tienen impacto declarado.',
      'No existen requisitos duplicados o contradictorios sin resolución explícita.'
    ],
    example: 'Entrada: «Quiero una app rápida para guardar notas». Salida: 7 requisitos funcionales (crear, editar, eliminar, buscar, persistir, exportar y recuperar), 3 no funcionales (funcionamiento offline, accesibilidad AA y latencia objetivo), 2 supuestos, 3 exclusiones y 3 preguntas abiertas priorizadas.'
  },
  {
    id: 'skill-pwa-architecture',
    code: 'S-02',
    short: 'PW',
    title: 'Diseño de Arquitectura de PWA',
    tagline: 'Define shell, datos, caché, actualización y límites de confianza.',
    purpose: 'Diseñar una arquitectura de aplicación web progresiva que funcione con conectividad degradada, tenga un modelo de actualización seguro y mantenga separadas la interfaz, la lógica y la persistencia.',
    when: 'Antes de implementar una PWA o cuando una aplicación existente necesita capacidades offline, instalación o una estrategia de caché explícita.',
    inputs: [
      'Casos de uso y requisitos de disponibilidad offline.',
      'Naturaleza de los datos: públicos, privados, sensibles o volátiles.',
      'Requisitos de instalación, actualización y compatibilidad de navegadores.',
      'Restricciones de hosting, HTTPS y presupuesto de almacenamiento.'
    ],
    procedure: [
      'Confirmar el contexto de ejecución: una URL HTTPS o localhost permite service worker; file:// no lo permite.',
      'Definir el app shell mínimo y qué rutas o vistas pertenecen a él.',
      'Clasificar recursos y datos por estrategia: precache, cache-first, network-first, stale-while-revalidate o sin caché.',
      'Diseñar versionado de caché, activación del nuevo service worker y fallback offline.',
      'Separar almacenamiento de interfaz y lógica; definir IndexedDB, Cache API o memoria según el caso.',
      'Documentar amenazas, datos que nunca se cachean y procedimiento de recuperación.'
    ],
    restrictions: [
      'No prometer instalación si falta service worker, manifest o contexto HTTPS.',
      'No cachear respuestas autenticadas o sensibles sin una política explícita.',
      'No usar cache-first para datos mutables sin versión e invalidación.',
      'No asumir que el entorno single-file puede registrar un service worker.'
    ],
    output: 'Decisión de arquitectura PWA con shell, mapa de rutas, matriz de estrategias de caché, modelo de actualización, almacenamiento y riesgos operativos.',
    acceptance: [
      'El app shell carga después de una primera visita y con la red desconectada, si el alcance lo exige.',
      'Cada recurso tiene una estrategia de caché y una política de invalidación justificadas.',
      'La actualización no mezcla versiones incompatibles de código y datos.',
      'La documentación distingue claramente el modo file:// del modo servido.'
    ],
    example: 'Para una herramienta de prompts offline: single-file con estado en memoria para uso local; si se requiere instalación, servir index.html, manifest.json y sw.js bajo HTTPS, precachear el shell y aplicar network-first solo a datos remotos no críticos.'
  },
  {
    id: 'skill-data-modeling',
    code: 'S-03',
    short: 'DM',
    title: 'Modelado de Datos (JSON/NoSQL)',
    tagline: 'Diseña entidades, invariantes y contratos antes de codificar.',
    purpose: 'Definir estructuras de datos explícitas, estables y validadas que representen el dominio sin duplicación innecesaria y permitan evolucionar mediante versiones claras.',
    when: 'Antes de implementar persistencia, estados complejos, APIs o catálogos; también al rediseñar una estructura que ya muestra duplicaciones o datos huérfanos.',
    inputs: [
      'Requisitos y casos de uso que consumen o producen datos.',
      'Operaciones previstas: crear, leer, actualizar, eliminar, filtrar y exportar.',
      'Restricciones de privacidad, retención y volumen.',
      'Formato de intercambio y consumidores externos.'
    ],
    procedure: [
      'Identificar entidades, atributos, relaciones y ciclos de vida.',
      'Asignar identificadores estables y definir la fuente de verdad de cada dato.',
      'Declarar invariantes, campos obligatorios, tipos y valores permitidos.',
      'Elegir normalización o desnormalización según operaciones de lectura y escritura.',
      'Versionar el esquema y definir migraciones o compatibilidad hacia atrás.',
      'Crear ejemplos válidos e inválidos y validarlos con el mismo contrato usado en producción.'
    ],
    restrictions: [
      'No almacenar datos derivados como fuente de verdad sin una regla de recálculo.',
      'No reutilizar un campo para significados distintos entre versiones.',
      'No guardar fechas como texto libre ni mezclar zonas horarias.',
      'No persistir credenciales, tokens o información sensible en estructuras exportables.'
    ],
    output: 'Esquema documentado con entidades, claves, relaciones, invariantes, ejemplos, validación y estrategia de versionado o migración.',
    acceptance: [
      'Cada campo tiene tipo, obligatoriedad y semántica definidos.',
      'Los ejemplos inválidos son rechazados por la misma validación que usa la aplicación.',
      'Las operaciones principales no requieren recorrer estructuras duplicadas para mantener consistencia.',
      'El esquema puede evolucionar sin romper datos existentes o existe una migración declarada.'
    ],
    example: 'Modelo mínimo: PromptBlock { id, type, title, payload, version }, Combo { id, blocks[], variables{}, updatedAt } y SchemaVersion { current, migrations[] }. Los textos de catálogo son inmutables por id; el combo guarda solo referencias ordenadas y valores de usuario.'
  },
  {
    id: 'skill-scaffolding',
    code: 'S-04',
    short: 'SC',
    title: 'Configuración de Entorno (Scaffolding)',
    tagline: 'Crea una base reproducible antes de añadir funcionalidad.',
    purpose: 'Preparar un entorno de desarrollo mínimo, reproducible y comprensible, con estructura de archivos, scripts de arranque y validaciones base alineadas con la arquitectura.',
    when: 'Al iniciar un proyecto, al incorporar una persona o al reconstruir un entorno que solo funciona en la máquina de otra persona.',
    inputs: [
      'Stack, runtime y gestor de paquetes acordados.',
      'Arquitectura y estructura de carpetas objetivo.',
      'Sistema operativo y requisitos de herramientas externas.',
      'Comandos de test, build y ejecución esperados.'
    ],
    procedure: [
      'Verificar versiones disponibles y documentar prerrequisitos reales.',
      'Crear solo los directorios y archivos que tengan una responsabilidad definida.',
      'Inicializar el manifiesto y fijar el gestor de paquetes y la versión del runtime.',
      'Añadir scripts explícitos para desarrollo, verificación y build.',
      'Configurar archivos de ignorados, editor y variables de entorno de ejemplo sin secretos.',
      'Ejecutar una instalación limpia y comprobar que el comando de arranque funciona.'
    ],
    restrictions: [
      'No instalar dependencias globales como requisito oculto.',
      'No añadir tooling sin rol concreto o sin documentación de uso.',
      'No incluir secretos, rutas personales ni archivos generados innecesarios.',
      'No crear carpetas vacías que sugieran una arquitectura que todavía no existe.'
    ],
    output: 'Árbol de proyecto mínimo, manifiesto reproducible, scripts documentados, configuración de entorno de ejemplo e instrucciones de arranque desde cero.',
    acceptance: [
      'Una persona puede instalar y ejecutar el proyecto siguiendo únicamente el README.',
      'Los comandos de test o verificación base existen y su estado inicial es comprensible.',
      'Las versiones críticas están declaradas y el lockfile es consistente.',
      'No hay secretos ni datos locales versionados.'
    ],
    example: 'Entrada: PWA vanilla sin dependencias. Salida: index.html, styles.css, app.js, manifest.json, sw.js, assets/, tests/ y README con comandos de servidor local; sin package.json si no hay tooling que justificar, y con una lista de prerrequisitos verificada.'
  },
  {
    id: 'skill-ui-symmetric',
    code: 'S-05',
    short: 'UI',
    title: 'Diseño de Interfaz Simétrica (UI)',
    tagline: 'Alineación, jerarquía y ritmo visual con intención.',
    purpose: 'Construir una interfaz equilibrada mediante un sistema de grid, escala de espaciado, jerarquía tipográfica y reglas de alineación que se mantengan coherentes en todos los tamaños.',
    when: 'Al diseñar una pantalla nueva, al unificar componentes existentes o cuando el interfaz se percibe desordenado por alineaciones y espaciados inconsistentes.',
    inputs: [
      'Jerarquía de contenido y tareas principales del usuario.',
      'Sistema de tokens de color, tipografía y espaciado existente.',
      'Breakpoints y dispositivos objetivo.',
      'Restricciones de marca y requisitos de accesibilidad.'
    ],
    procedure: [
      'Definir una retícula base y zonas primarias antes de elegir componentes.',
      'Establecer una escala de espaciado limitada y reutilizable.',
      'Asignar jerarquía tipográfica por nivel, no por decoración.',
      'Construir componentes con alineación interna consistente y estados definidos.',
      'Verificar simetría, densidad y agrupación con contenido real y longitudes extremas.',
      'Probar en los breakpoints definidos y ajustar el flujo, no solo el tamaño.'
    ],
    restrictions: [
      'No usar posicionamiento absoluto para la estructura principal.',
      'No priorizar simetría visual sobre legibilidad o navegación.',
      'No depender solo del color para comunicar estado o jerarquía.',
      'No introducir animaciones o efectos que dificulten la lectura.'
    ],
    output: 'Especificación de layout, tokens, escala espacial, jerarquía tipográfica y estructura de componentes, junto con los criterios de comportamiento responsive.',
    acceptance: [
      'Los elementos comparten márgenes, alineaciones y escala de espaciado en todos los paneles.',
      'Cada breakpoint mantiene jerarquía y evita solapamientos u overflow inesperado.',
      'Los estados interactivos y de foco son visibles y consistentes.',
      'La interfaz conserva claridad con textos vacíos, largos y localizados.'
    ],
    example: 'Layout de tres columnas con grid de 12 unidades: catálogo 3, compositor 5 y salida 4; escala de espaciado de 4, 8, 12, 16, 24 y 32; una única acción primaria por zona y breakpoints que apilan paneles sin romper el orden de lectura.'
  }
];
