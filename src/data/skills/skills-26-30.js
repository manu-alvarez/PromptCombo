/* Skills 26–30 */
export const skillsBatch6 = [
  {
    id: 'skill-error-handling',
    code: 'S-26',
    short: 'EH',
    title: 'Manejo de Errores y Excepciones',
    tagline: 'Falla de forma explícita, recuperable y observable.',
    purpose: 'Diseñar una política de errores que distinga fallos esperados del dominio, errores de infraestructura y defectos de programación, manteniendo al usuario informado y al sistema en un estado consistente.',
    when: 'Al diseñar flujos con entradas externas, red, almacenamiento o acciones irreversibles; al corregir errores silenciosos o mensajes incomprensibles.',
    inputs: [
      'Inventario de operaciones y modos de fallo conocidos.',
      'Contratos de error y expectativas del usuario.',
      'Requisitos de reintento, idempotencia y recuperación.',
      'Política de logs y privacidad.'
    ],
    procedure: [
      'Enumerar fallos esperados, excepcionales y errores de programación.',
      'Definir errores de dominio con códigos y mensajes diferenciados.',
      'Capturar en los límites de integración, no alrededor de cada línea.',
      'Transformar fallos técnicos en estados y mensajes útiles para la interfaz.',
      'Liberar recursos, restaurar estados y ofrecer una acción de recuperación.',
      'Registrar evidencia sin datos sensibles y verificar los caminos de fallo.'
    ],
    restrictions: [
      'No usar catch vacíos ni silenciar errores sin política explícita.',
      'No reintentar operaciones no idempotentes o sin límite.',
      'No mostrar stack traces, rutas internas o secretos al usuario.',
      'No convertir un fallo recuperable en un estado inconsistente de la interfaz.'
    ],
    output: 'Mapa de errores con códigos, mensajes, estrategia de recuperación, logging, límites de reintento y pruebas de fallo.',
    acceptance: [
      'Cada fallo crítico tiene un comportamiento definido y verificable.',
      'El usuario recibe información suficiente para recuperarse o reportar.',
      'Los logs permiten correlacionar el fallo sin exponer datos sensibles.',
      'El estado de la aplicación permanece consistente después del error.'
    ],
    example: 'Copia al portapapeles: si navigator.clipboard falla, se usa el fallback de textarea; si también falla, el botón vuelve a su estado inicial, se muestra un mensaje no técnico y se ofrece seleccionar manualmente el prompt. No se marca como copiado.'
  },
  {
    id: 'skill-css-animations',
    code: 'S-27',
    short: 'AN',
    title: 'Creación de Animaciones CSS (Neón/Fluido)',
    tagline: 'Movimiento con propósito, rendimiento y control.',
    purpose: 'Añadir microinteracciones y ambientes visuales que comuniquen estado o jerarquía sin distraer, usando animaciones eficientes, coherentes y respetuosas con la preferencia de movimiento reducido.',
    when: 'Al reforzar feedback de interacción, transiciones de estado o una identidad visual cyberpunk que necesite movimiento controlado.',
    inputs: [
      'Tokens de duración, easing y color.',
      'Elementos que deben comunicar cambio de estado.',
      'Objetivo de rendimiento y dispositivos de referencia.',
      'Requisitos de accesibilidad y preferencias de movimiento.'
    ],
    procedure: [
      'Definir qué información comunica cada animación y cuándo debe detenerse.',
      'Usar transform y opacity para animar sin forzar layout.',
      'Establecer duraciones y easings consistentes mediante variables.',
      'Evitar animaciones perpetuas salvo para un ambiente sutil y desactivable.',
      'Añadir prefers-reduced-motion y evitar depender del movimiento para operar.',
      'Verificar fluidez, contraste y ausencia de parpadeos molestos.'
    ],
    restrictions: [
      'No animar propiedades que provoquen layout thrashing sin justificación.',
      'No usar flashes, pulsos intensos o movimiento rápido no controlado.',
      'No ocultar estados ni retardar una acción crítica para lucir la animación.',
      'No asumir que una animación es fluida sin observarla en el hardware objetivo.'
    ],
    output: 'CSS de animaciones con nombres, tokens, keyframes, estados y reglas de reducción de movimiento, junto con notas de rendimiento.',
    acceptance: [
      'Cada animación tiene un propósito y un estado final estable.',
      'La interfaz sigue siendo completamente usable con movimiento reducido.',
      'No hay parpadeos de alta frecuencia ni cambios de layout perceptibles.',
      'El efecto visual no reduce legibilidad ni contraste.'
    ],
    example: 'Pulso del botón de copia: box-shadow en ciclo de 3.2 s, desactivado con prefers-reduced-motion; feedback al copiar cambia el color y el texto, por lo que el estado no depende únicamente de la animación.'
  },
  {
    id: 'skill-data-parsing',
    code: 'S-28',
    short: 'PR',
    title: 'Parsing y Formateo de Datos',
    tagline: 'Convierte datos externos en estructuras seguras y estables.',
    purpose: 'Leer, validar y transformar datos de fuentes externas en estructuras internas tipadas, conservando información relevante y produciendo errores claros cuando el formato no cumple el contrato.',
    when: 'Al importar JSON, interpretar fechas, normalizar texto, convertir configuraciones o formatear datos para exportación.',
    inputs: [
      'Formato de entrada y esquema esperado.',
      'Reglas de normalización y campos opcionales.',
      'Localización, zona horaria y precisión requeridas.',
      'Comportamiento esperado ante datos inválidos.'
    ],
    procedure: [
      'Definir el esquema de entrada y los tipos internos de salida.',
      'Parsear dentro de un bloque controlado y rechazar formatos no permitidos.',
      'Validar campos, longitudes, rangos y relaciones antes de transformar.',
      'Normalizar con reglas explícitas y preservar el valor original cuando sea necesario.',
      'Formatear de salida de forma determinista y documentar localización.',
      'Probar entradas válidas, incompletas, maliciosas y con límites.'
    ],
    restrictions: [
      'No usar eval o Function para interpretar datos.',
      'No permitir prototype pollution al fusionar objetos externos.',
      'No interpretar fechas ambiguas sin zona horaria definida.',
      'No perder campos no reconocidos sin declarar que no serán preservados.'
    ],
    output: 'Parser y formateador con esquema documentado, validaciones, errores tipados y pruebas de ida y vuelta cuando aplique.',
    acceptance: [
      'Las entradas inválidas producen un error comprensible y no un valor parcialmente válido.',
      'La transformación es determinista y no muta la fuente.',
      'Los formatos de fecha, número y texto respetan la configuración definida.',
      'Los casos límite y datos maliciosos están probados.'
    ],
    example: 'parseConfig(json): valida objeto, limita claves conocidas, no permite __proto__ ni constructor, normaliza versión semver y devuelve errores con ruta de campo. formatConfig vuelve a producir JSON estable con orden de claves definido.'
  },
  {
    id: 'skill-local-cache',
    code: 'S-29',
    short: 'CA',
    title: 'Implementación de Caché Local',
    tagline: 'Datos disponibles sin red, con caducidad y control.',
    purpose: 'Reducir latencia y habilitar uso offline mediante una caché local con claves versionadas, expiración, invalidación, límites de tamaño y protección de datos sensibles.',
    when: 'Cuando se repiten lecturas costosas o se necesita conservar catálogos, preferencias o respuestas no sensibles entre sesiones.',
    inputs: [
      'Datos que se cachean y frecuencia de cambio.',
      'Requisitos de privacidad y vida útil.',
      'Almacenamiento disponible y cuota aproximada.',
      'Estrategia de invalidación y fallback sin red.'
    ],
    procedure: [
      'Justificar qué datos merecen caché y cuáles no deben persistir.',
      'Elegir almacenamiento: memoria, localStorage, sessionStorage, IndexedDB o Cache API.',
      'Definir clave, versión, TTL y metadatos de origen.',
      'Implementar lectura con validación de forma y caducidad.',
      'Añadir escritura limitada, evicción y limpieza por versión.',
      'Probar hit, miss, expiración, cuota llena, corrupción y borrado.'
    ],
    restrictions: [
      'No almacenar contraseñas, tokens o datos personales sin base y protección.',
      'No cachear respuestas de autorización o datos privados de otro usuario.',
      'No dejar crecer la caché sin límite ni estrategia de limpieza.',
      'No servir datos expirados como si fueran actuales.'
    ],
    output: 'Módulo de caché con almacenamiento elegido, esquema de entrada, TTL, invalidación, evicción, limitaciones y pruebas.',
    acceptance: [
      'La caché se invalida correctamente por versión, TTL o acción explícita.',
      'Un fallo de escritura no bloquea la funcionalidad principal.',
      'Los datos sensibles no se persisten sin una decisión explícita.',
      'La aplicación se comporta de forma predecible si la cuota está llena.'
    ],
    example: 'Catálogo estático cacheado en localStorage bajo promptcombo:catalog:v1 con timestamp y validación de esquema. Si la versión no coincide o han pasado 7 días, se recompila desde el código embebido. El combo en edición permanece solo en memoria.'
  },
  {
    id: 'skill-dependency-maintenance',
    code: 'S-30',
    short: 'DEP',
    title: 'Mantenimiento y Actualización de Dependencias',
    tagline: 'Actualiza con evidencia, aísla el riesgo y mide el impacto.',
    purpose: 'Mantener actualizadas y seguras las dependencias sin introducir regresiones, mediante evaluación de cambios, actualizaciones incrementales, verificación ejecutada y registro de decisiones y rollback.',
    when: 'En una revisión periódica, ante una alerta de seguridad, antes de una release o cuando una dependencia deja de recibir soporte.',
    inputs: [
      'Manifiesto y lockfile actuales.',
      'Informe de vulnerabilidades y licencias.',
      'Changelogs y guías de migración.',
      'Entorno de pruebas y criterios de aceptación.'
    ],
    procedure: [
      'Inventariar dependencias directas y transitivas relevantes.',
      'Revisar vulnerabilidades, mantenimiento, licencia y compatibilidad.',
      'Actualizar primero parches y versiones menores con el lockfile regenerado.',
      'Aislar actualizaciones mayores y leer su guía de migración antes de tocar código.',
      'Ejecutar instalación limpia, tests, build y pruebas de humo.',
      'Documentar versión, motivo, impacto y rollback.'
    ],
    restrictions: [
      'No actualizar todas las dependencias a ciegas en un único cambio.',
      'No editar el lockfile a mano sin comprender su generación.',
      'No mezclar una actualización mayor con nuevas funcionalidades.',
      'No usar opciones destructivas o de fuerza para resolver conflictos sin diagnóstico.'
    ],
    output: 'Informe de dependencias con cambios, justificación, vulnerabilidades, pruebas, riesgos y procedimiento de reversión.',
    acceptance: [
      'La instalación limpia es reproducible con el lockfile actualizado.',
      'Los tests, build y humo aplicables se ejecutaron y sus resultados están registrados.',
      'No quedan vulnerabilidades críticas conocidas sin decisión documentada.',
      'La actualización puede revertirse de forma controlada.'
    ],
    example: 'Actualización de una utilidad menor: revisar changelog, regenerar lockfile, instalar desde cero, ejecutar suite y comprobar el flujo principal. Una actualización mayor queda en un cambio separado con guía de migración y plan de rollback.'
  }
];
