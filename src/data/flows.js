/* Flujos por fases */
export const flows = [
  {
    id: 'flow-initialization',
    code: 'F-01',
    short: 'IN',
    title: 'Flujo de Inicialización',
    tagline: 'Setup → Scaffolding → Dependencias.',
    when: 'Al comenzar un proyecto o preparar un entorno nuevo que debe quedar reproducible antes de escribir funcionalidad.',
    steps: [
      {
        name: 'Setup',
        goal: 'Verificar entorno, prerrequisitos y decisiones de base antes de crear archivos.',
        output: 'Checklist de entorno y stack confirmado.',
        gate: 'Runtime, herramientas y versiones disponibles; supuestos críticos resueltos.'
      },
      {
        name: 'Scaffolding',
        goal: 'Crear la estructura mínima de carpetas y archivos con responsabilidades claras.',
        output: 'Árbol de proyecto y archivos de entrada ejecutables.',
        gate: 'La aplicación base arranca y la estructura no contiene directorios especulativos.'
      },
      {
        name: 'Dependencias',
        goal: 'Instalar solo las dependencias justificadas y fijar versiones reproducibles.',
        output: 'Manifiesto, lockfile y política de actualización.',
        gate: 'Instalación desde cero reproducible; lockfile consistente; licencias revisadas.'
      }
    ],
    exitCriteria: [
      'El entorno se puede reconstruir siguiendo instrucciones exactas.',
      'La estructura base respeta la arquitectura definida.',
      'Las dependencias son mínimas, necesarias y trazables.'
    ]
  },
  {
    id: 'flow-development',
    code: 'F-02',
    short: 'DV',
    title: 'Flujo de Desarrollo',
    tagline: 'Lógica → UI → Integración.',
    when: 'Cuando los requisitos y la arquitectura ya están definidos y existe una base ejecutable para construir una funcionalidad.',
    steps: [
      {
        name: 'Lógica',
        goal: 'Implementar reglas de negocio y flujo de datos como unidades verificables.',
        output: 'Módulos funcionales con contratos y pruebas unitarias.',
        gate: 'Reglas principales y errores esperados cubiertos sin depender de la interfaz.'
      },
      {
        name: 'UI',
        goal: 'Construir la interfaz sobre los contratos de datos existentes, incluyendo todos sus estados.',
        output: 'Vista funcional, accesible y responsive.',
        gate: 'Estados vacío, carga, error y éxito implementados; navegación por teclado viable.'
      },
      {
        name: 'Integración',
        goal: 'Conectar lógica, datos y UI y validar el recorrido completo.',
        output: 'Funcionalidad integrada con prueba de humo.',
        gate: 'El flujo principal y los errores críticos funcionan de extremo a extremo.'
      }
    ],
    exitCriteria: [
      'La funcionalidad Cumple los criterios de aceptación definidos.',
      'Las capas conservan sus límites y no duplican lógica.',
      'La integración tiene evidencia de ejecución, no solo inspección visual.'
    ]
  },
  {
    id: 'flow-validation',
    code: 'F-03',
    short: 'VL',
    title: 'Flujo de Validación',
    tagline: 'Pruebas Unitarias → Revisión de Código → Aceptación.',
    when: 'Antes de fusionar, publicar o declarar terminado un cambio con impacto funcional, de seguridad o de datos.',
    steps: [
      {
        name: 'Pruebas unitarias',
        goal: 'Verificar reglas puras, límites y errores con casos reproducibles.',
        output: 'Suite ejecutada y resultados registrados.',
        gate: 'Casos críticos cubiertos; fallos investigados, no ocultados.'
      },
      {
        name: 'Revisión de código',
        goal: 'Evaluar calidad, seguridad, mantenibilidad e integración del cambio.',
        output: 'Hallazgos priorizados y diff revisado.',
        gate: 'No quedan defectos bloqueantes ni cambios no relacionados sin justificar.'
      },
      {
        name: 'Aceptación',
        goal: 'Contrastar el resultado final con requisitos y criterios del usuario.',
        output: 'Recomendación de entrega y checklist final.',
        gate: 'Criterios críticos verificados; riesgos residuales aceptados explícitamente.'
      }
    ],
    exitCriteria: [
      'Existe trazabilidad entre criterio, prueba y evidencia.',
      'Los hallazgos críticos están resueltos o bloquean la entrega.',
      'La decisión final es explícita y comprensible.'
    ]
  }
];
