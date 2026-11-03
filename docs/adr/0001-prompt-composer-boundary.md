# ADR 0001 · PromptCombo es un compositor de prompts, no un runtime de agentes

- **Estado:** Aceptada
- **Fecha:** 2026-11-03
- **Ámbito:** producto, arquitectura y documentación

## Contexto

El ecosistema de IA distingue entre instrucciones, prompts reutilizables,
skills, agentes, herramientas, permisos, orquestación y ejecución. Un archivo de
instrucciones no crea herramientas, no impone aislamiento y no garantiza que un
modelo respete una política.

PromptCombo combina un generador guiado de proyectos y un modo de composición
manual que ordena bloques y compila un prompt maestro. Sin una frontera
explícita, sus módulos `agent`, `subagent` y `skill` podrían interpretarse
erróneamente como agentes ejecutables, paquetes de habilidades con permisos o
procesos aislados.

## Decisión

PromptCombo no implementa un **runtime de agentes**. Genera texto de forma
determinista en sus dos modos:

1. No llama a modelos ni ejecuta herramientas.
2. No aplica permisos, credenciales, aislamiento ni aprobaciones.
3. No implementa MCP, sesiones de modelo, checkpoints ni trazas de ejecución.
4. Los módulos `agent`, `subagent` y `skill` son contratos y procedimientos
   textuales, no artefactos ejecutables.
5. El prompt compilado incluye límites de ejecución, autorización, tratamiento
   de datos no confiables y evidencia; su cumplimiento depende del runtime.
6. Cualquier runtime, integración MCP o sistema de evaluación de modelos será
   un proyecto o una fase separada, con su propio modelo de permisos y pruebas.

`AGENTS.md` queda como instrucción para agentes que modifican el repositorio,
no como definición del producto.

## Consecuencias

- La aplicación mantiene su simplicidad, su naturaleza offline y su build
  reproducible.
- La documentación debe evitar afirmaciones de seguridad que dependan solo de
  texto.
- La UI debe indicar que los módulos son contratos textuales.
- Las pruebas verifican datos, compilador, persistencia, servidor y build; no
  evalúan el comportamiento de modelos externos.
- Si se añade ejecución real, habrá que diseñar permisos, aprobaciones,
  idempotencia, observabilidad y recuperación antes de presentarla como agente.

## Verificación

- `npm run check` valida el catálogo y el contrato del compilador.
- Los tests comprueban que el prompt incluye los límites de ejecución y el
  cierre con estado, evidencia y autorizaciones pendientes.
- La revisión de UI comprueba que las fichas aclaran el alcance textual.
- `docs/CONTRACTS.md` documenta la frontera y los criterios de integración.

## Referencias

- `AGENTS.md`
- `docs/CONTRACTS.md`
- `docs/ARCHITECTURE.md`
- `SECURITY.md`
