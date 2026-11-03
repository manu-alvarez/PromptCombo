# Auditoría del catálogo de composición

## Alcance

El catálogo de composición contiene 108 bloques: 56 base y 52 recursos
composables derivados de la biblioteca (15 roles y 37 skills). La validación
automática comprueba cantidades, IDs, códigos, campos, tokens y compilación.

Este documento registra la auditoría del catálogo y su relación con el
generador guiado y la biblioteca. Las cifras y los nombres corresponden al
estado actual del producto.

## Mapa de uso

| Tipo | Necesidad que cubre | Entrada | Salida | Uso actual |
|---|---|---|---|---|
| `prompt` | Iniciar una tarea con contexto | Variables | Prompt textual | Composición manual; el generador tiene plantillas propias |
| `role` | Definir responsabilidad y límites | Misión y criterios | Contrato de rol | Composición manual |
| `flow` | Ordenar fases y puertas | Fases | Secuencia | Composición manual |
| `agent` | Contrato de decisión y handoff | Misión y límites | Especificación | Composición manual |
| `subagent` | Delimitar una tarea | Entradas y salidas | Especificación | Composición manual |
| `skill` | Procedimiento reutilizable | Entradas y pasos | Procedimiento textual | Composición manual |
| `template` | Base de archivo | Variables y contenido | Archivo de referencia | Composición manual |
| `scaffold` | Estructura de proyecto | Reglas y árbol | Referencia de estructura | Composición manual |

## Relación con las recetas

Las 21 recetas del generador son independientes del catálogo de composición
para mantener la separación de responsabilidades y evitar que una edición de un
bloque rompa un paquete de proyecto. Hay solapamiento conceptual en prompts,
skills y estructuras:

- El prompt profesional del generador cubre la entrada guiada; la composición
  manual conserva los 4 prompts como bloques de orquestación.
- El paquete `SKILL.md` del generador no es uno de los 67 bloques `skill` del
  catálogo de composición; es un artefacto de formato Agent Skills.
- La estructura de proyecto del generador no reutiliza literalmente los 3
  scaffoldings; produce documentación y configuración verificable.

## Duplicaciones y límites

- No se eliminaron bloques para reducir el catálogo: siguen siendo útiles en
  Composición y mantienen la compatibilidad de la sesión persistida.
- Los módulos `agent`, `subagent` y `skill` son texto; no crean procesos,
  permisos ni herramientas.
- Las plantillas y scaffoldings son contenido de referencia; no instalan
  dependencias.
- No se detectaron promesas de ejecución real dentro del catálogo que hayan
  pasado al generador como capacidades.

## Decisión

El producto tiene dos modos dentro de la misma aplicación:

- **Generador guiado**: recetas, valores y paquete de archivos.
- **Composición manual**: bloques ordenados y prompt maestro.

El catálogo base y los 52 recursos derivados forman el catálogo de Composición.
La biblioteca alimenta ambos modos. No son capas separadas ni una versión
heredada: son dos formas de trabajo con el mismo contenido y los mismos límites.

Cualquier cambio futuro de campos o cantidades debe actualizar
`scripts/validate-data.mjs`, los tests, las recetas y la documentación.
