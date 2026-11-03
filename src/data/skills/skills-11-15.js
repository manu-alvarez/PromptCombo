/* Skills 11–15 */
export const skillsBatch3 = [
  {
    id: 'skill-performance-optimization',
    code: 'S-11',
    short: 'PF',
    title: 'Optimización de Rendimiento (Minificación offline)',
    tagline: 'Optimiza con medidas antes y después, no con intuiciones.',
    purpose: 'Reducir tiempo de carga, trabajo de render y peso transferido de una aplicación offline, preservando funcionalidad y legibilidad del código fuente mediante un proceso de build reproducible.',
    when: 'Cuando exista una métrica por debajo del objetivo, una interfaz perceptiblemente lenta o una entrega con tamaño o consumo de memoria excesivos.',
    inputs: [
      'Métricas base de carga, interacción, CPU y tamaño de artefactos.',
      'Perfil de uso y dispositivos objetivo.',
      'Restricciones de dependencias, red y compatibilidad.',
      'Código y proceso de build actuales.'
    ],
    procedure: [
      'Medir una línea base reproducible con el mismo entorno y datos.',
      'Identificar el cuello de botella dominante: red, parseo, render, CPU o memoria.',
      'Aplicar primero cambios de bajo riesgo y alto impacto, como eliminar recursos no usados.',
      'Minificar CSS/JS, agrupar operaciones DOM y evitar recálculos repetidos.',
      'Repetir la medición y comparar resultados sin cambiar más de una variable crítica.',
      'Documentar mejora, coste de mantenimiento y riesgos de regresión.'
    ],
    restrictions: [
      'No optimizar sin una línea base y una hipótesis medible.',
      'No introducir CDNs o dependencias externas en una aplicación que debe funcionar offline.',
      'No degradar accesibilidad, legibilidad o mantenibilidad para obtener mejoras marginales.',
      'No presentar como medición un resultado estimado o no ejecutado.'
    ],
    output: 'Informe con línea base, cuello de botella, cambios aplicados, métricas posteriores, regresiones comprobadas y proceso de build actualizado.',
    acceptance: [
      'Existe una comparación antes/después con el mismo escenario.',
      'La mejora es perceptible o medible y no rompe funcionalidad.',
      'El artefacto final sigue funcionando sin conexión cuando ese es el requisito.',
      'El proceso de minificación o empaquetado es reproducible y documentado.'
    ],
    example: 'Antes: CSS de 38 KB y render inicial de 120 ms. Después: tokens sin duplicados, CSS de 22 KB y render de 74 ms en el mismo dispositivo. El código fuente conserva comentarios y el build genera el archivo final.'
  },
  {
    id: 'skill-refactoring',
    code: 'S-12',
    short: 'RF',
    title: 'Refactorización de Código',
    tagline: 'Mejora la estructura sin cambiar el comportamiento observable.',
    purpose: 'Reorganizar código para reducir duplicación, acoplamiento y complejidad accidental, preservando el comportamiento acordado y sin introducir funcionalidad nueva.',
    when: 'Antes de extender una zona frágil, después de repetir lógica en varios lugares o cuando una revisión detecta complejidad que dificulta pruebas y mantenimiento.',
    inputs: [
      'Comportamiento actual y pruebas existentes.',
      'Zonas de duplicación, acoplamiento o baja cohesión.',
      'Convenciones del proyecto y límites arquitectónicos.',
      'Riesgos y áreas que no deben modificarse.'
    ],
    procedure: [
      'Fijar el comportamiento con pruebas o una verificación reproducible antes de tocar código.',
      'Identificar el cambio estructural mínimo que reduzca el problema actual.',
      'Aplicar pasos pequeños y verificar después de cada paso.',
      'Extraer funciones o módulos con nombres del dominio, no con nombres genéricos.',
      'Eliminar código muerto solo cuando exista evidencia de que no se usa.',
      'Comparar diff final y confirmar que no hay cambios funcionales no declarados.'
    ],
    restrictions: [
      'No mezclar refactorización con nuevas funcionalidades en el mismo cambio.',
      'No reescribir todo un archivo si una extracción localizada resuelve el problema.',
      'No eliminar código del usuario sin confirmar su propósito.',
      'No refactorizar sin pruebas o una verificación equivalente antes y después.'
    ],
    output: 'Diff enfocado, justificación del cambio estructural, pruebas ejecutadas y lista de comportamientos que permanecen invariables.',
    acceptance: [
      'El comportamiento observable no cambia fuera de lo acordado.',
      'Las pruebas existentes pasan o se documenta el motivo verificable de un cambio.',
      'El diff reduce complejidad y no introduce dependencias innecesarias.',
      'Los nombres reflejan intención y responsabilidad del dominio.'
    ],
    example: 'Antes: tres bloques repetían la sustitución de variables. Salida: una función única applyVariables(text, values) con pruebas para valor vacío, token repetido y token sin reemplazo, sin modificar el formato de salida.'
  },
  {
    id: 'skill-input-security',
    code: 'S-13',
    short: 'SC',
    title: 'Revisión de Seguridad de Entradas',
    tagline: 'Valida en el límite y trata todo texto externo como no confiable.',
    purpose: 'Reducir la superficie de ataque mediante validación de tipo, longitud y formato, normalización controlada, escape contextual y aplicación del mínimo privilegio sobre los datos que entran al sistema.',
    when: 'Al recibir datos de usuarios, URLs, APIs, archivos, portapapeles o cualquier fuente que no controle la aplicación.',
    inputs: [
      'Mapa de entradas y transformaciones de datos.',
      'Contextos de salida: HTML, atributo, URL, CSS, logs o comandos.',
      'Reglas de negocio para formatos válidos.',
      'Superficie de confianza y permisos disponibles.'
    ],
    procedure: [
      'Inventariar entradas, origen, consumidor y contexto de salida.',
      'Aplicar allowlist de formato y rechazar lo que no cumpla el contrato.',
      'Normalizar de forma explícita y limitar longitud, profundidad y frecuencia.',
      'Escapar según el contexto de salida o construir DOM con APIs seguras.',
      'No concatenar entradas en SQL, HTML, URLs o comandos sin parámetros.',
      'Probar payloads maliciosos, límites y fallos de validación.'
    ],
    restrictions: [
      'No confiar en validación solo del cliente.',
      'No usar eval, Function o expresiones dinámicas sobre datos externos.',
      'No mostrar stack traces o detalles internos en mensajes al usuario.',
      'No registrar secretos ni valores sensibles completos.'
    ],
    output: 'Informe de entradas con validadores, puntos de escape, casos de abuso, cambios aplicados y pruebas negativas.',
    acceptance: [
      'Toda entrada externa tiene una política de aceptación explícita.',
      'Las pruebas maliciosas no alteran el DOM, el estado ni la lógica de autorización.',
      'Los errores no exponen información sensible ni detalles internos innecesarios.',
      'La validación puede ejecutarse también en el límite del servidor o proceso equivalente.'
    ],
    example: 'En un campo de búsqueda: limitar a 120 caracteres, normalizar espacios, no inyectarlo en innerHTML, renderizarlo con textContent y escapar cualquier atributo data usado para filtros. Probar etiquetas script, comillas y cadenas muy largas.'
  },
  {
    id: 'skill-unit-testing',
    code: 'S-14',
    short: 'UT',
    title: 'Creación de Pruebas Unitarias',
    tagline: 'Aísla una unidad y verifica su contrato, no su implementación.',
    purpose: 'Comprobar de forma automática el comportamiento de funciones y módulos pequeños con casos representativos, límites y errores, manteniendo pruebas rápidas, deterministas y legibles.',
    when: 'Al implementar lógica de negocio, validadores, parsers, transformaciones o correcciones de defectos que no deben reaparecer.',
    inputs: [
      'Contrato de la unidad y criterios de aceptación.',
      'Casos representativos, límites y errores esperados.',
      'Dependencias externas a aislar.',
      'Comando y framework de pruebas del proyecto.'
    ],
    procedure: [
      'Identificar la unidad real y su responsabilidad observable.',
      'Preparar datos mínimos y controlar tiempo, azar o red cuando afecten al resultado.',
      'Aplicar Arrange, Act, Assert con una sola acción principal por prueba.',
      'Cubrir caso feliz, bordes, errores y regresiones conocidas.',
      'Comprobar que una prueba falla por la razón correcta cuando se altera la unidad.',
      'Registrar el comando ejecutado y el resultado real.'
    ],
    restrictions: [
      'No verificar detalles internos que impidan refactorizar.',
      'No usar mocks para todo; prueba lógica real cuando sea determinista.',
      'No escribir pruebas dependientes del orden de ejecución o del reloj real.',
      'No declarar una suite exitosa sin ejecutarla.'
    ],
    output: 'Suite de pruebas unitarias con nombres descriptivos, datos de ejemplo, cobertura de límites y evidencia de ejecución.',
    acceptance: [
      'Cada prueba falla si el comportamiento esperado se rompe.',
      'Las pruebas son deterministas y no dependen de servicios externos.',
      'Los casos límite y de error importantes están cubiertos.',
      'La ejecución completa puede reproducirse con un comando documentado.'
    ],
    example: 'applyVariables("Hola [NOMBRE]", { "[NOMBRE]": "Ana" }) devuelve "Hola Ana"; con valor vacío conserva el token; con token repetido sustituye todas las apariciones; y no interpreta tokens que no existan en el mapa.'
  },
  {
    id: 'skill-integration-testing',
    code: 'S-15',
    short: 'IT',
    title: 'Pruebas de Integración de Módulos',
    tagline: 'Verifica contratos reales y fallos entre piezas.',
    purpose: 'Comprobar que dos o más módulos colaboran correctamente en un flujo realista, detectando incompatibilidades de formato, lifecycle, errores y estado compartido que las pruebas unitarias no revelan.',
    when: 'Después de conectar módulos, antes de una entrega y siempre que cambie un contrato de interfaz o el orden del flujo.',
    inputs: [
      'Contratos de los módulos y flujo esperado.',
      'Fixtures o datos representativos.',
      'Puntos de integración: eventos, almacenamiento, red o DOM.',
      'Criterios de aceptación del recorrido completo.'
    ],
    procedure: [
      'Dibujar el flujo y marcar cada frontera entre módulos.',
      'Seleccionar el contexto mínimo real: navegador, DOM, almacenamiento o API local.',
      'Probar el recorrido principal con datos representativos, no solo con un mock perfecto.',
      'Cubrir fallos de contrato, respuestas tardías, datos corruptos y errores propagados.',
      'Limpiar estado, temporizadores y listeners entre ejecuciones.',
      'Registrar resultados y distinguir fallos del producto, entorno o fixture.'
    ],
    restrictions: [
      'No simular todas las dependencias si eso elimina la integración que se quiere probar.',
      'No usar datos de producción sensibles en fixtures.',
      'No dejar estado global que haga que una prueba dependa de otra.',
      'No ignorar fallos intermitentes sin registrar evidencia.'
    ],
    output: 'Matriz de integración con flujos, contratos, datos de prueba, resultados y defectos encontrados.',
    acceptance: [
      'El flujo extremo a extremo definido se ejecuta con los módulos reales o dobles justificados.',
      'Los errores de contrato y fallos de integración se reproducen de forma estable.',
      'Cada prueba limpia su estado y puede ejecutarse en cualquier orden.',
      'Los fallos se clasifican y enlazan con una evidencia concreta.'
    ],
    example: 'Integración catálogo → estado → compilador → preview: añadir dos bloques, reordenarlos, editar una variable y comprobar que el preview contiene el nuevo orden y el valor; luego simular portapapeles bloqueado y verificar el estado de error.'
  }
];
