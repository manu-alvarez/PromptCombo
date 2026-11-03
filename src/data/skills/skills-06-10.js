/* Skills 06–10 */
export const skillsBatch2 = [
  {
    id: 'skill-ux-definition',
    code: 'S-06',
    short: 'UX',
    title: 'Definición de Experiencia de Usuario (UX)',
    tagline: 'Diseña el recorrido completo, incluidos los estados incómodos.',
    purpose: 'Definir cómo una persona entiende, inicia, completa y recupera una tarea, cubriendo decisiones, fricciones, mensajes y estados alternativos antes de construir la interfaz.',
    when: 'Antes de diseñar pantallas, al detectar abandono o confusión, o al introducir un flujo nuevo en un producto existente.',
    inputs: [
      'Objetivos del usuario y del negocio.',
      'Investigación disponible: entrevistas, analítica, soporte o pruebas.',
      'Restricciones funcionales, técnicas y legales.',
      'Flujos actuales y puntos de fricción conocidos.'
    ],
    procedure: [
      'Definir usuarios primarios, tareas y resultado esperado de cada recorrido.',
      'Mapear los pasos, decisiones, dependencias y momentos de espera.',
      'Diseñar estados vacíos, de carga, error, éxito y recuperación para cada paso.',
      'Redactar microcopy claro para acciones, validaciones y confirmaciones.',
      'Identificar fricción evitable sin eliminar protecciones necesarias.',
      'Validar el recorrido con escenarios reales y criterios de éxito observables.'
    ],
    restrictions: [
      'No inventar hallazgos de investigación ni presentarlos como evidencia.',
      'No usar patrones oscuros para aumentar conversión o retención.',
      'No ocultar al usuario el resultado de una acción irreversible.',
      'No diseñar solo el camino feliz.'
    ],
    output: 'Mapa de experiencia con actores, recorridos, estados, mensajes, decisiones, fricciones y criterios de éxito medibles.',
    acceptance: [
      'Cada recorrido principal incluye los estados vacío, carga, error, éxito y recuperación.',
      'Las acciones destructivas o sensibles explican consecuencias y alternativa.',
      'El lenguaje es específico y no depende de jerga interna.',
      'Los criterios de éxito pueden observarse en una prueba o en analítica definida.'
    ],
    example: 'Recorrido para componer un prompt: elegir bloque, entender dónde se añade, reordenarlo, ver variables pendientes, previsualizar y copiar. Cada paso incluye confirmación visual, estado vacío y recuperación si la copia falla.'
  },
  {
    id: 'skill-frontend-components',
    code: 'S-07',
    short: 'FC',
    title: 'Desarrollo de Componentes Frontend',
    tagline: 'Componentes semánticos, encapsulados y predecibles.',
    purpose: 'Construir unidades de interfaz reutilizables con estructura semántica, contrato de datos explícito, estados definidos y estilos predecibles sin acoplarlas a una única pantalla.',
    when: 'Al implementar una interfaz nueva, extraer patrones repetidos o estabilizar un conjunto de componentes antes de escalar.',
    inputs: [
      'Especificación visual y estados del componente.',
      'Contrato de datos y eventos permitidos.',
      'Convenciones de nombres y estructura del proyecto.',
      'Requisitos de accesibilidad y responsive.'
    ],
    procedure: [
      'Elegir primero el elemento HTML nativo adecuado para la semántica.',
      'Definir entradas, salidas, estados internos y eventos con nombres explícitos.',
      'Implementar render y actualización sin mezclar acceso a datos no relacionados.',
      'Añadir estilos encapsulados con tokens y estados de foco visibles.',
      'Probar con contenido vacío, largo, traducido y con teclado.',
      'Documentar uso, límites y ejemplos de integración.'
    ],
    restrictions: [
      'No insertar datos externos o del usuario con innerHTML sin sanitización.',
      'No registrar listeners globales por cada instancia.',
      'No usar ARIA para sustituir una semántica nativa que ya funcionaría.',
      'No dejar código de limpieza de eventos fuera del ciclo de vida del componente.'
    ],
    output: 'Componente completo con contrato, estados, estilos, ejemplos de uso, notas de accesibilidad y evidencia de interacción.',
    acceptance: [
      'Se puede utilizar sin conocer detalles internos de implementación.',
      'Funciona con teclado, foco visible y lector de pantalla en el recorrido previsto.',
      'No modifica elementos fuera de su ámbito ni deja listeners huérfanos.',
      'Los estados vacío, carga, error y contenido extremo no rompen el layout.'
    ],
    example: 'Componente bloque-secuencia: recibe { id, type, title, description }, emite detail, move y remove; usa un artículo con botones nativos, mantiene etiquetas accesibles y actualiza solo su DOM. No conoce el catálogo ni la lógica de compilación.'
  },
  {
    id: 'skill-local-state',
    code: 'S-08',
    short: 'ST',
    title: 'Gestión del Estado Local (Vanilla JS)',
    tagline: 'Un único origen de verdad, transiciones explícitas.',
    purpose: 'Mantener el estado de la aplicación en estructuras explícitas con transiciones controladas y render derivado, evitando que el DOM se convierta en la fuente de verdad.',
    when: 'Cuando la interfaz tiene varias vistas o acciones que modifican datos compartidos, o cuando el estado se vuelve difícil de reconstruir a partir del DOM.',
    inputs: [
      'Modelo de datos y operaciones del usuario.',
      'Eventos que modifican el estado y sus validaciones.',
      'Requisitos de persistencia o sincronización.',
      'Ciclo de vida de la sesión y límites de memoria.'
    ],
    procedure: [
      'Definir la forma inicial del estado y qué datos se consideran derivados.',
      'Escribir funciones o acciones que apliquen una transición única y validada.',
      'Centralizar render y suscripción; evitar actualizaciones parciales divergentes.',
      'Devolver nuevos valores en lugar de mutar estructuras compartidas cuando sea viable.',
      'Separar persistencia y efectos secundarios de los cambios puros.',
      'Probar transiciones, entradas inválidas y restauración de estados clave.'
    ],
    restrictions: [
      'No leer valores críticos directamente del DOM para calcular el estado de negocio.',
      'No persistir secretos ni exponer datos de sesión innecesarios.',
      'No crear listeners de suscripción que nunca se liberen.',
      'No duplicar la misma fuente de verdad en varias variables.'
    ],
    output: 'Módulo de estado con esquema inicial, acciones, selectores, render derivado y política de persistencia opcional.',
    acceptance: [
      'Cada acción produce una transición determinista y documentada.',
      'La interfaz se puede reconstruir desde el estado sin leer datos implícitos del DOM.',
      'Las acciones inválidas no dejan el estado parcial ni inconsistente.',
      'Eliminar o reordenar elementos no duplica datos ni conserva selecciones inválidas.'
    ],
    example: 'Estado: { selectedIds: [], variables: {}, query: "", copied: false }. La acción add valida duplicados, la acción reorder recibe origen/destino y la compilación es un selector derivado. El DOM solo muestra el resultado y no guarda el orden.'
  },
  {
    id: 'skill-api-design',
    code: 'S-09',
    short: 'AP',
    title: 'Diseño e Integración de APIs',
    tagline: 'Contratos explícitos, errores predecibles y límites claros.',
    purpose: 'Diseñar o integrar interfaces de programación con contratos estables, validación en los límites, semántica HTTP coherente, errores estructurados y controles de tiempo y autorización.',
    when: 'Al conectar una aplicación con servicios externos, definir endpoints internos o sustituir una integración frágil basada en supuestos.',
    inputs: [
      'Casos de uso y operaciones necesarias.',
      'Modelo de datos y reglas de autorización.',
      'Requisitos de latencia, disponibilidad y consistencia.',
      'Restricciones de red, versionado y compatibilidad.'
    ],
    procedure: [
      'Modelar recursos, acciones y relaciones antes de elegir rutas.',
      'Definir métodos, códigos de estado, payloads, validaciones y errores.',
      'Establecer autenticación, autorización y límites por operación.',
      'Diseñar timeouts, cancelación y reintentos solo para operaciones idempotentes.',
      'Documentar el contrato con ejemplos válidos e inválidos y versiones.',
      'Implementar un cliente con validación, normalización de errores y observabilidad.'
    ],
    restrictions: [
      'No devolver éxito con un cuerpo que describa un fallo.',
      'No incluir secretos o tokens completos en logs y mensajes.',
      'No reintentar automáticamente operaciones no idempotentes.',
      'No romper consumidores existentes sin versión o migración.'
    ],
    output: 'Contrato de API con recursos, métodos, estados, esquemas, errores, autorización, límites y guía de integración del cliente.',
    acceptance: [
      'Cada respuesta de éxito y error tiene un código y un esquema documentados.',
      'Las entradas inválidas se rechazan antes de ejecutar lógica de negocio.',
      'Los timeouts y fallos de red se traducen en estados de interfaz manejables.',
      'La autorización se valida en el servidor, no solo en el cliente.'
    ],
    example: 'GET /api/combos/{id} devuelve 200 con el combo, 404 si no existe y 401/403 según permisos. El cliente aplica timeout, no reintenta POST y muestra un error recuperable sin exponer el cuerpo de la respuesta sensible en la UI.'
  },
  {
    id: 'skill-business-logic',
    code: 'S-10',
    short: 'BL',
    title: 'Lógica de Negocio',
    tagline: 'Reglas puras, testeables y separadas de la interfaz.',
    purpose: 'Implementar las reglas que determinan el comportamiento del dominio como funciones deterministas y explícitas, manteniéndolas independientes de la presentación y de la infraestructura.',
    when: 'Al modelar validaciones, cálculos, prioridades, estados, permisos o cualquier regla que deba comportarse igual en todas las interfaces.',
    inputs: [
      'Reglas e invariantes del dominio.',
      'Estructuras de entrada y salida.',
      'Casos límite y errores esperados.',
      'Decisiones sobre precisión, orden y zona horaria.'
    ],
    procedure: [
      'Enumerar reglas, invariantes y preguntas de negocio sin ambigüedad.',
      'Definir tipos o validadores para entradas y salidas.',
      'Implementar funciones pequeñas con una sola responsabilidad.',
      'Mantener acceso a red, DOM y almacenamiento fuera de las funciones puras.',
      'Cubrir casos normales, límites y errores con pruebas deterministas.',
      'Documentar decisiones que afecten a redondeo, orden o compatibilidad.'
    ],
    restrictions: [
      'No esconder reglas de negocio dentro de manejadores de UI o adaptadores.',
      'No usar números flotantes para dinero sin una estrategia de precisión.',
      'No modificar objetos de entrada que pertenezcan a otro módulo.',
      'No lanzar errores genéricos sin información útil para la capa que los maneja.'
    ],
    output: 'Módulo de dominio con reglas puras, tipos, errores explícitos, documentación de invariantes y pruebas de casos límite.',
    acceptance: [
      'La misma entrada produce siempre la misma salida sin efectos secundarios.',
      'Cada regla del dominio es localizable en una función o bloque identificable.',
      'Los casos de borde están cubiertos y los errores se pueden distinguir.',
      'La lógica puede probarse sin navegador, red o base de datos.'
    ],
    example: 'compileCombo(blocks, variables) valida que no haya tipos incompatibles, sustituye tokens de forma determinista y devuelve un string junto con advertencias; no toca el DOM, el portapapeles ni el almacenamiento.'
  }
];
