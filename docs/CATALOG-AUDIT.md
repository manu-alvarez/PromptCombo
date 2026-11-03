# Auditoría del catálogo existente

## Alcance

Se auditaron los 56 módulos y las 30 skills del catálogo original antes de
introducir el generador guiado. La validación automática comprueba cantidades,
IDs, códigos, campos, tokens y compilación.

## Mapa de uso

| Tipo | Necesidad que cubre | Entrada | Salida | Uso actual |
|---|---|---|---|---|
| `prompt` | Iniciar una tarea con contexto | Variables | Prompt textual | Modo avanzado; el generador tiene plantillas propias |
| `role` | Definir responsabilidad y límites | Misión y criterios | Contrato de rol | Modo avanzado |
| `flow` | Ordenar fases y puertas | Fases | Secuencia | Modo avanzado |
| `agent` | Contrato de decisión y handoff | Misión y límites | Especificación | Modo avanzado |
| `subagent` | Delimitar una tarea | Entradas y salidas | Especificación | Modo avanzado |
| `skill` | Procedimiento reutilizable | Entradas y pasos | Procedimiento textual | Modo avanzado |
| `template` | Base de archivo | Variables y contenido | Archivo de referencia | Modo avanzado |
| `scaffold` | Estructura de proyecto | Reglas y árbol | Referencia de estructura | Modo avanzado |

## Relación con las recetas nuevas

Las 21 recetas del generador son independientes del catálogo avanzado para
mantener compatibilidad y evitar que una edición de una skill antigua rompa un
paquete nuevo. Hay solapamiento conceptual en prompts, skills y estructuras:

- El prompt profesional del generador sustituye al prompt maestro como entrada
  guiada, pero no elimina los 4 prompts existentes.
- El paquete `SKILL.md` del generador no es uno de los 30 módulos `skill`; es un
  artefacto de formato Agent Skills.
- La estructura de proyecto del generador no reutiliza literalmente los 3
  scaffoldings; produce documentación y configuración verificable.

## Duplicaciones y límites

- No se eliminaron módulos para reducir el catálogo: siguen siendo útiles en el
  modo avanzado y mantienen la compatibilidad de la sesión persistida.
- Los módulos `agent`, `subagent` y `skill` son texto; no crean procesos,
  permisos ni herramientas.
- Las plantillas y scaffoldings son contenido de referencia; no instalan
  dependencias.
- No se detectaron promesas de ejecución real dentro del catálogo que hayan
  pasado al generador como capacidades.

## Decisión

Conservar el catálogo y añadir el generador como una capa de producto separada.
Cualquier cambio futuro de campos o cantidades debe actualizar
`scripts/validate-data.mjs`, los tests, las recetas y la documentación.
