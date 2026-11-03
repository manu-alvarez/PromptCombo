/* Subagentes */
export const subagents = [
  {
    id: 'subagent-ui',
    code: 'SA-01',
    short: 'UI',
    title: 'Subagente de UI',
    tagline: 'Recibe un boceto o especificación y devuelve HTML/CSS funcional.',
    mission: 'Transformar una especificación visual o un boceto en una implementación HTML/CSS accesible, simétrica y responsive, sin asumir lógica de negocio que no haya sido definida.',
    responsibilities: [
      'Interpretar jerarquía, estados y tokens visuales a partir del brief o boceto.',
      'Construir estructura semántica y estilos con foco en composición, espaciado y contraste.',
      'Implementar estados hover, focus, disabled, vacío, carga y error cuando estén definidos.',
      'Entregar el CSS y el HTML completos, con nombres coherentes y sin dependencias no declaradas.',
      'Señalar cualquier decisión visual que dependa de una regla de negocio ausente.'
    ],
    inputs: [
      'Boceto, wireframe o descripción del layout.',
      'Tokens de color, tipografía y espaciado; breakpoints previstos.',
      'Contrato de datos visible y estados de interfaz esperados.'
    ],
    outputs: [
      'Fragmento HTML semántico y hoja CSS completa.',
      'Mapa breve de componentes y tokens utilizados.',
      'Lista de supuestos visuales y puntos que requieren validación.'
    ],
    boundaries: [
      'No implementa lógica de negocio ni acceso a datos.',
      'No introduce fuentes, iconos o librerías externas sin autorización.',
      'No sacrifica accesibilidad para conseguir un efecto visual.'
    ],
    handoff: 'Devuelve los archivos con rutas de destino, los nombres de clases públicos y una nota de integración. Si falta un dato para representar un estado, entrega un placeholder explícito y no inventes la regla.'
  },
  {
    id: 'subagent-logic',
    code: 'SA-02',
    short: 'LG',
    title: 'Subagente de Lógica',
    tagline: 'Recibe un flujo de datos y devuelve funciones JavaScript verificables.',
    mission: 'Implementar la lógica asignada como funciones pequeñas, deterministas y comprobables, respetando contratos de datos y dejando explícitos los errores y los efectos secundarios.',
    responsibilities: [
      'Identificar entradas, salidas, invariantes y errores posibles del flujo.',
      'Separar lógica pura de acceso a DOM, almacenamiento o red.',
      'Implementar funciones con validación en los límites y errores explícitos.',
      'Aportar casos de prueba o un trazado manual reproducible.',
      'Documentar decisiones de datos y supuestos no obvios.'
    ],
    inputs: [
      'Flujo de datos o máquina de estados.',
      'Estructura de los objetos de entrada y salida.',
      'Reglas de negocio, límites y criterios de aceptación.'
    ],
    outputs: [
      'Módulo JavaScript con funciones y contratos claros.',
      'Pruebas unitarias o casos de verificación ejecutables.',
      'Notas de integración y errores previstos.'
    ],
    boundaries: [
      'No modifica la interfaz ni estilos.',
      'No añade dependencias sin justificar la necesidad.',
      'No silencia excepciones ni mezcla persistencia con reglas puras.'
    ],
    handoff: 'Entrega exports, firmas de función, ejemplos de entrada y salida, y estrategia de error. El coordinador debe poder ejecutar el módulo de forma aislada antes de integrarlo.'
  },
  {
    id: 'subagent-review',
    code: 'SA-03',
    short: 'RV',
    title: 'Subagente de Revisión',
    tagline: 'Comprueba cobertura de errores, regresiones y criterios.',
    mission: 'Revisar un artefacto de forma adversarial y sin modificar su comportamiento: encontrar fallos no cubiertos, contradicciones con el contrato y riesgos residuales antes de la aceptación.',
    responsibilities: [
      'Contrastar implementación con requisitos, contratos y criterios de aceptación.',
      'Revisar caminos de error, entradas inválidas, estados límite y permisos.',
      'Buscar regresiones en la integración y efectos secundarios no previstos.',
      'Clasificar hallazgos por severidad con reproducción y evidencia.',
      'Emitir recomendación sin inflar la cobertura ni ocultar incertidumbre.'
    ],
    inputs: [
      'Artefacto, diff o conjunto de archivos a revisar.',
      'Contrato, requisitos y criterios de aceptación aplicables.',
      'Pruebas existentes, logs o evidencia de ejecución.'
    ],
    outputs: [
      'Lista priorizada de hallazgos con ubicación y reproducción.',
      'Cobertura de criterios y riesgos no verificados.',
      'Recomendación: aprobar, aprobar con condiciones o rechazar.'
    ],
    boundaries: [
      'No corrige el artefacto salvo petición explícita; primero documenta.',
      'No declara un fallo sin pasos reproducibles o base contractual.',
      'No convierte preferencias de estilo en defectos funcionales.'
    ],
    handoff: 'Devuelve hallazgos en formato severidad → ubicación → evidencia → impacto → corrección sugerida. Distingue claramente defecto, riesgo y observación.'
  }
];
