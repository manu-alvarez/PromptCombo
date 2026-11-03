/* Skills 16–20 */
export const skillsBatch4 = [
  {
    id: 'skill-deployment-prep',
    code: 'S-16',
    short: 'DP',
    title: 'Preparación de Despliegue',
    tagline: 'Salida reproducible, verificable y reversible.',
    purpose: 'Preparar un artefacto verificable y un procedimiento de publicación reproducible, con configuración separada por entorno, validaciones previas y un plan de rollback explícito.',
    when: 'Antes de publicar una versión, entregar un build a otra persona o mover una aplicación de local a un entorno compartido.',
    inputs: [
      'Artefacto y comando de build.',
      'Requisitos de entorno, hosting y HTTPS.',
      'Variables de configuración y política de secretos.',
      'Criterios de humo y plan de recuperación.'
    ],
    procedure: [
      'Construir el artefacto desde un entorno limpio con versiones fijadas.',
      'Separar configuración por entorno y validar que no haya secretos en el bundle.',
      'Ejecutar validaciones pre-publicación: tests, revisión de dependencias y checklist funcional.',
      'Definir pasos exactos de publicación, migraciones y invalidación de caché.',
      'Preparar verificación posterior y criterios de rollback.',
      'Documentar la release con versión, cambios, riesgos y responsables.'
    ],
    restrictions: [
      'No publicar con credenciales o configuración de desarrollo.',
      'No ejecutar migraciones destructivas sin backup o rollback verificado.',
      'No realizar despliegues en producción sin autorización explícita.',
      'No omitir la validación posterior asumiendo que el build correcto equivale a servicio correcto.'
    ],
    output: 'Checklist de release, artefacto reproducible, configuración por entorno, pasos de despliegue, prueba de humo y rollback documentado.',
    acceptance: [
      'El artefacto se genera desde cero con un comando documentado.',
      'No contiene secretos ni referencias a recursos no disponibles offline.',
      'Existe una verificación posterior con criterios de éxito claros.',
      'El rollback puede ejecutarse sin improvisación.'
    ],
    example: 'Para un index.html offline: comprobar que se abre con file://, que no hace peticiones externas, que el portapapeles tiene fallback y que los datos sensibles no se registran. Archivar versión, hash y fecha de entrega.'
  },
  {
    id: 'skill-service-workers',
    code: 'S-17',
    short: 'SW',
    title: 'Configuración de Service Workers (Offline)',
    tagline: 'Cachea el shell correcto y controla la actualización.',
    purpose: 'Implementar una capa offline fiable con precache del app shell, estrategias diferenciadas por tipo de recurso, versionado de caché y procedimientos de actualización y limpieza.',
    when: 'Cuando una aplicación servida por HTTPS o localhost debe abrirse sin red o mantener recursos disponibles tras la primera visita.',
    inputs: [
      'Lista de recursos del app shell.',
      'Estrategia de actualización y frecuencia de cambios.',
      'Política de datos sensibles y requisitos de cache.',
      'Navegadores objetivo y requisitos de instalación.'
    ],
    procedure: [
      'Confirmar HTTPS o localhost; un service worker no se registra desde file:// ni desde una URL blob.',
      'Definir APP_SHELL y versión de caché incremental.',
      'Implementar install, activate, limpieza de cachés antiguas y claim si corresponde.',
      'Elegir estrategia por ruta: cache-first para shell estático, network-first para datos mutables.',
      'Implementar fallback offline y comportamiento ante actualización disponible.',
      'Verificar primera carga, segunda carga offline, actualización y borrado de caché.'
    ],
    restrictions: [
      'No cachear respuestas autenticadas o información sensible sin política explícita.',
      'No usar cache-first indiscriminado para APIs mutables.',
      'No prometer instalación PWA solo por registrar un service worker.',
      'No dejar versiones antiguas de caché activas indefinidamente.'
    ],
    output: 'Archivo de service worker con versión, precache, estrategias, limpieza, fallback y un protocolo de prueba offline documentado.',
    acceptance: [
      'La segunda visita funciona sin red en las rutas incluidas en el alcance.',
      'Una nueva versión activa los recursos correctos y elimina cachés obsoletas.',
      'Las operaciones no idempotentes no se sirven desde caché.',
      'El equipo comprende que file:// y PWA instalable son escenarios distintos.'
    ],
    example: 'APP_SHELL contiene sí index.html, styles.css, app.js, manifest.json e iconos. Cache name app-shell-v3. Activación elimina v2 y anteriores. Una API de datos usa network-first con timeout y responde desde caché solo si existe una copia no sensible.'
  },
  {
    id: 'skill-log-analysis',
    code: 'S-18',
    short: 'LG',
    title: 'Análisis de Logs y Diagnóstico',
    tagline: 'Convierte síntomas dispersos en una hipótesis comprobable.',
    purpose: 'Reconstruir qué ocurrió a partir de logs y evidencia del sistema, separar correlación de causa y producir un diagnóstico reproducible sin exponer datos sensibles.',
    when: 'Ante errores intermitentes, fallos en producción, comportamiento distinto entre entornos o un incidente que necesita causa raíz.',
    inputs: [
      'Logs con timestamp, nivel, contexto y correlación.',
      'Pasos de reproducción y versión del sistema.',
      'Métricas, trazas o estado del entorno.',
      'Cambios recientes y configuración afectada.'
    ],
    procedure: [
      'Acotar la ventana temporal y el identificador de correlación del incidente.',
      'Ordenar los eventos y separar ruido esperado de anomalías.',
      'Formular una línea temporal con causa, efecto y sincronización de relojes.',
      'Comprobar hipótesis con una reproducción mínima o una consulta verificable.',
      'Identificar el punto de fallo más temprano, no solo el último error visible.',
      'Documentar causa, impacto, corrección y prevención.'
    ],
    restrictions: [
      'No incluir tokens, contraseñas, datos personales o payloads completos en el análisis.',
      'No confundir correlación temporal con causalidad.',
      'No modificar logs de forma destructiva para ocultar evidencia.',
      'No afirmar una causa raíz sin una comprobación independiente.'
    ],
    output: 'Informe de incidente con línea temporal, evidencia citada, hipótesis, causa raíz confirmada o pendiente, impacto y acciones preventivas.',
    acceptance: [
      'Cada conclusión se vincula a una evidencia concreta.',
      'La reproducción permite observar el fallo o confirmar su ausencia.',
      'Los datos sensibles están redactados o excluidos.',
      'Las acciones correctivas incluyen verificación y prevención.'
    ],
    example: 'Síntoma: copia fallida de forma intermitente. Logs muestran permiso de portapapeles denegado solo tras determinadas interacciones. Se aísla contexto inseguro y se verifica el fallback de selección en un entorno reproducible.'
  },
  {
    id: 'skill-doc-functions',
    code: 'S-19',
    short: 'DC',
    title: 'Documentación de Funciones',
    tagline: 'Explica contrato, efectos y errores relevantes.',
    purpose: 'Documentar funciones y módulos de forma que otra persona pueda usarlos correctamente sin leer toda la implementación, manteniendo la documentación cerca del contrato y actualizada.',
    when: 'En APIs internas, utilidades compartidas, módulos con efectos secundarios o funciones cuya firma no explica todas sus restricciones.',
    inputs: [
      'Firma, tipos y contrato de la función.',
      'Efectos secundarios, errores y condiciones de uso.',
      'Ejemplos reales de entrada y salida.',
      'Convenciones de documentación del proyecto.'
    ],
    procedure: [
      'Documentar propósito y responsabilidad en una frase concreta.',
      'Describir parámetros, tipos, valores por defecto y restricciones no evidentes.',
      'Indicar retorno, errores posibles y efectos secundarios.',
      'Añadir un ejemplo mínimo que se pueda ejecutar o comprender sin contexto extra.',
      'Eliminar detalles internos que puedan cambiar sin afectar al contrato.',
      'Actualizar la documentación en el mismo cambio que la firma.'
    ],
    restrictions: [
      'No documentar comportamiento que el código no garantiza.',
      'No repetir literalmente el nombre de la función sin aportar información.',
      'No incluir ejemplos con datos sensibles o credenciales.',
      'No usar documentación para justificar una interfaz confusa.'
    ],
    output: 'Bloques de documentación por función o módulo, ejemplos válidos, errores documentados y notas de integración.',
    acceptance: [
      'Una persona puede invocar la función sin leer su cuerpo interno.',
      'Los parámetros obligatorios, opcionales y errores están claramente indicados.',
      'La documentación coincide con la firma y el comportamiento probado.',
      'El ejemplo es correcto y no depende de estado oculto.'
    ],
    example: 'compilePrompt({ blocks, variables }) devuelve un string y no muta la entrada. Lanza TypeError si blocks no es un array. Los valores vacíos conservan el token original. El ejemplo incluye un bloque de rol y una variable sustituida.'
  },
  {
    id: 'skill-prompt-design',
    code: 'S-20',
    short: 'PD',
    title: 'Diseño de Prompts (Prompt Engineering)',
    tagline: 'Instrucciones explícitas, contexto suficiente y salida evaluable.',
    purpose: 'Diseñar prompts que permitan a un modelo producir resultados correctos y verificables, separando objetivos, contexto, restricciones, formato de salida y criterios de aceptación.',
    when: 'Al automatizar una tarea con un LLM, refactorizar un prompt inestable o convertir una instrucción informal en un contrato de trabajo.',
    inputs: [
      'Objetivo concreto y usuario del resultado.',
      'Contexto verificable y datos de entrada.',
      'Restricciones, exclusiones y formato requerido.',
      'Criterios de aceptación y ejemplos de referencia.'
    ],
    procedure: [
      'Definir una tarea principal y una salida observable, no una personalidad genérica.',
      'Incluir solo el contexto necesario para la tarea y marcar lagunas.',
      'Separar instrucciones, datos no confiables y formato de salida.',
      'Especificar restricciones, supuestos y comportamiento ante información faltante.',
      'Añadir un ejemplo mínimo o una rúbrica de calidad si el criterio es ambiguo.',
      'Probar el prompt con casos normales, límites y entradas adversariales.'
    ],
    restrictions: [
      'No pedir resultados imposibles con el contexto proporcionado.',
      'No mezclar instrucciones contradictorias o requisitos ocultos.',
      'No usar datos personales o confidenciales sin justificación.',
      'No aceptar como válido un resultado que no cumple el formato o los criterios definidos.'
    ],
    output: 'Prompt versionado con objetivo, contexto, entradas, restricciones, formato de salida, criterios de aceptación y casos de prueba.',
    acceptance: [
      'La salida solicitada puede verificarse sin interpretaciones ambiguas.',
      'El prompt indica qué hacer ante datos faltantes o contradictorios.',
      'Los ejemplos no contradicen las reglas generales.',
      'Los casos de prueba revelan cómo falla el prompt y qué se debe ajustar.'
    ],
    example: 'En lugar de «actúa como experto y escribe buen código», especificar rol técnico, objetivo, stack, siete entregables, reglas de verificación, formato de archivos y criterios de aceptación. Añadir una prueba con alcance ambiguo para comprobar que pregunta antes de inventar.'
  }
];
