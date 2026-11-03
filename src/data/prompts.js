/* Prompts de inicio */
export const prompts = [
  {
    id: 'prompt-kickoff',
    code: 'P-01',
    short: '01',
    title: 'Kickoff de proyecto',
    tagline: 'Instrucción base para iniciar un desarrollo con entregables controlados.',
    usage: 'Úsalo al inicio de un proyecto nuevo o al encargar una implementación completa a un agente. Rellena las variables antes de copiar.',
    variables: [
      { token: '[DESCRIPCIÓN]', label: 'Descripción del proyecto', placeholder: '¿Qué quieres construir, para quién y qué problema resuelve?', multiline: true, required: true },
      { token: '[STACK]', label: 'Stack y restricciones', placeholder: 'Ej. HTML, CSS y Vanilla JS; sin dependencias externas.', multiline: false, required: true },
      { token: '[OBJETIVO]', label: 'Objetivo verificable', placeholder: 'Ej. Un único index.html que compile y copie prompts offline.', multiline: false, required: true },
      { token: '[RESTRICCIONES]', label: 'Restricciones adicionales', placeholder: 'Requisitos de seguridad, accesibilidad, rendimiento o alcance.', multiline: true, required: false }
    ],
    text: `Quiero desarrollar el siguiente proyecto: [DESCRIPCIÓN].

Contexto técnico: [STACK].
Objetivo principal: [OBJETIVO].
Restricciones adicionales: [RESTRICCIONES].

Antes de escribir código:
- Resume lo que has entendido y detecta ambigüedades.
- Si falta información crítica, formula como máximo 3 preguntas concretas.
- No inventes requisitos, dependencias ni resultados de pruebas.

Entrega exactamente estos 7 puntos, en este orden:
1. Análisis funcional: requisitos, actores, casos de uso y supuestos.
2. Arquitectura: stack, estructura de archivos, contratos de datos y decisiones técnicas.
3. Implementación completa: código funcional, sin fragmentos incompletos ni TODOs no justificados.
4. Interfaz: estilos, estados, responsive y accesibilidad mínima.
5. Verificación: pruebas o checklist ejecutable y resultados esperados.
6. Ejecución: comandos exactos para instalar, ejecutar y validar.
7. Riesgos y siguientes pasos: limitaciones reales y evolución recomendada.

Reglas de restricción:
- Entrega cada archivo completo con su ruta y no omitas el manejo de errores, estados vacíos, carga o fallos.
- No incluyas credenciales, tokens ni valores sensibles.
- Justifica cada dependencia nueva; si una solución nativa es suficiente, priorízala.
- Marca cualquier decisión no confirmada como SUPUESTO y explica su impacto.
- No afirmes que ejecutaste pruebas o validaciones que no realizaste.
- Si una instrucción es contradictoria, detente y expón el conflicto antes de continuar.`
  },
  {
    id: 'prompt-audit',
    code: 'P-02',
    short: '02',
    title: 'Auditoría y plan de corrección',
    tagline: 'Diagnóstico adversarial de un proyecto existente con prioridades claras.',
    usage: 'Úsalo para revisar código heredado o una entrega reciente sin reescribirla de inmediato.',
    variables: [
      { token: '[PROYECTO]', label: 'Proyecto o rutas afectadas', placeholder: 'Nombre del proyecto y archivos/áreas a revisar.', multiline: false, required: true },
      { token: '[STACK]', label: 'Stack y entorno', placeholder: 'Tecnologías, versiones y forma de ejecución.', multiline: false, required: true },
      { token: '[SÍNTOMAS]', label: 'Síntomas y comportamiento observado', placeholder: 'Errores, regresiones, comportamientos raros o riesgos detectados.', multiline: true, required: true },
      { token: '[ALCANCE]', label: 'Límites de la auditoría', placeholder: 'Qué incluir y qué dejar explícitamente fuera.', multiline: true, required: false }
    ],
    text: `Actúa como auditor técnico independiente del siguiente proyecto: [PROYECTO].

Stack y entorno: [STACK].
Síntomas observados: [SÍNTOMAS].
Alcance permitido: [ALCANCE].

No modifiques archivos todavía. Primero inspecciona la evidencia disponible y produce:
1. Mapa breve de arquitectura, flujo de datos y superficies de riesgo.
2. Hallazgos priorizados con formato: severidad, ubicación, evidencia, impacto y corrección sugerida.
3. Distinción explícita entre defecto comprobado, riesgo probable y mejora opcional.
4. Plan de corrección incremental ordenado por dependencia y riesgo, no por preferencia estética.
5. Pruebas o verificaciones necesarias para demostrar cada corrección.
6. Riesgos residuales y decisiones que requieren autorización humana.

Reglas:
- No declares vulnerabilidades o fallos sin evidencia del código o de una reproducción.
- Revisa como mínimo: validación de entradas, manejo de errores, accesibilidad, estados de interfaz, dependencias y secretos expuestos.
- No propongas refactorizaciones masivas si una corrección localizada resuelve el problema.
- Si el alcance es insuficiente para una conclusión, declara la incertidumbre y la información necesaria.`
  },
  {
    id: 'prompt-debug',
    code: 'P-03',
    short: '03',
    title: 'Diagnóstico de error',
    tagline: 'Aísla la causa raíz antes de proponer una solución.',
    usage: 'Úsalo cuando exista un fallo reproducible y necesites una hipótesis verificable, no un parche a ciegas.',
    variables: [
      { token: '[ERROR]', label: 'Error completo', placeholder: 'Mensaje, stack trace o comportamiento concreto.', multiline: true, required: true },
      { token: '[CONTEXTO]', label: 'Contexto de ejecución', placeholder: 'Entorno, pasos previos y frecuencia del fallo.', multiline: true, required: true },
      { token: '[INTENTO]', label: 'Solución intentada', placeholder: 'Qué probaste ya y qué resultado obtuviste.', multiline: true, required: false }
    ],
    text: `Estoy depurando el siguiente problema:

ERROR:
[ERROR]

CONTEXTO DE EJECUCIÓN:
[CONTEXTO]

INTENTO PREVIO:
[INTENTO]

Proceso requerido:
1. Resume el síntoma observable y separa hechos de suposiciones.
2. Identifica la hipótesis de causa raíz más probable y al menos una alternativa.
3. Propón experimentos mínimos y reversibles para confirmar o descartar cada hipótesis.
4. Si puedes inspeccionar código o logs, cita la evidencia exacta que sustenta el diagnóstico.
5. Solo después de confirmar la causa raíz, propón la corrección mínima y las pruebas de regresión.

Restricciones:
- No apliques cambios destructivos, migraciones ni limpiezas de archivos como diagnóstico.
- No ocultes el error con un catch vacío, un timeout mayor o la eliminación de la validación.
- Distingue claramente entre causa raíz, síntoma y efecto secundario.
- Si la evidencia no permite confirmar una causa, dilo y solicita el dato faltante.`
  },
  {
    id: 'prompt-handoff',
    code: 'P-04',
    short: '04',
    title: 'Handoff entre agentes',
    tagline: 'Transfiere estado y responsabilidad sin perder evidencia.',
    usage: 'Úsalo cuando una tarea cambie de agente, de modelo o de fase y no puedas compartir todo el historial.',
    variables: [
      { token: '[OBJETIVO]', label: 'Objetivo del siguiente agente', placeholder: 'Resultado exacto esperado para esta fase.', multiline: true, required: true },
      { token: '[ESTADO]', label: 'Estado actual', placeholder: 'Qué está hecho, qué falta y qué bloquea.', multiline: true, required: true },
      { token: '[EVIDENCIA]', label: 'Evidencia disponible', placeholder: 'Archivos, salidas, decisiones y pruebas ejecutadas.', multiline: true, required: true },
      { token: '[SIGUIENTE]', label: 'Siguiente acción concreta', placeholder: 'Primera acción que debe ejecutar el receptor.', multiline: false, required: true }
    ],
    text: `Vas a recibir la responsabilidad de una fase del trabajo. Lee este handoff antes de actuar.

OBJETIVO DE ESTA FASE:
[OBJETIVO]

ESTADO ACTUAL:
[ESTADO]

EVIDENCIA DISPONIBLE:
[EVIDENCIA]

SIGUIENTE ACCIÓN:
[SIGUIENTE]

Contrato de handoff:
- No repitas trabajo ya validado; revisa la evidencia indicada y declara si la aceptas o no.
- No asumas archivos, resultados o decisiones que no aparezcan en la evidencia.
- Mantén los contratos y nombres existentes salvo que detectes una incompatibilidad y la reportes.
- Primero verifica el estado, después ejecuta la siguiente acción.
- Al terminar, devuelve: cambios realizados, pruebas ejecutadas, resultados, riesgos residuales y siguiente decisión.

Criterio de aceptación del handoff:
La persona o agente receptor puede continuar sin acceso al historial anterior y sin hacer preguntas cuya respuesta ya esté en la evidencia.`
  }
];
