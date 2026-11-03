# Notas de versión · PromptCombo 2.4.1

Fecha: 2026-11-04.

## Objetivo

Corregir la cohesión del modo de composición manual después del cierre 2.4.0.
No se amplía el catálogo, no se añaden paquetes, no se implementa runtime de
agentes, MCP, modelos, cuentas, sincronización ni marketplace.

## Cambios

- La sección **Avanzado** pasa a llamarse **Composición**.
- Se presenta como un modo manual del mismo producto, con una cabecera que
  explica su relación con el generador, la biblioteca y las plantillas.
- La cabecera enlaza con **Crear**, **Plantillas guiadas · 21** y
  **Biblioteca · 221**.
- El estado global muestra los bloques de la composición y deja de mezclar los
  archivos del proyecto abierto.
- El catálogo muestra el estado editorial de los 52 bloques derivados de la
  biblioteca: `stable` o `experimental`.
- La ficha de un módulo derivado indica procedencia y estado.
- El panel del prompt maestro declara que es texto revisable, no ejecutable.
- Los ejemplos del compositor se identifican como composiciones manuales, no
  como las 21 plantillas guiadas.
- Se corrigen y amplían las pruebas de compilación de los módulos derivados.

## Decisión sobre la sección

Se mantiene el compositor manual porque cubre una capacidad distinta de la
generación guiada: ordenar roles, skills y flujos en un único prompt maestro.
Además, incluye flujos, agentes y subagentes que no forman parte de la
biblioteca de recursos. Eliminarlo habría supuesto retirar funcionalidad válida
y dejar esos tipos sin interfaz.

La corrección no consiste en disimular la diferencia, sino en declararla:
**Crear** y **Plantillas** producen paquetes de proyecto; **Composición**
produce un prompt maestro manual. Comparten catálogo, biblioteca, límites y
lenguaje visual, pero no el mismo resultado.

## Verificación

- `npm test`: 49/49.
- `npm run check`: correcto.
- Compilación de los 108 bloques y de los 52 módulos derivados.
- Sin errores de consola en el modo de composición.
- Estado global y metadatos coherentes con la composición.
- Responsive sin desbordamiento en 320, 390, 768 y 1440 px.
- Lighthouse: 100 en accesibilidad, buenas prácticas y SEO.

## Límites

- La composición manual sigue siendo local y textual.
- No crea un proyecto, no genera ZIP, no instala recursos y no ejecuta el
  prompt.
- La compatibilidad con clientes externos y el comportamiento de modelos siguen
  como `not_tested`.
- Los 172 recursos nuevos de la biblioteca siguen en `experimental`.

## Compatibilidad

Probado:

- Chromium/Electron con la aplicación local y GitHub Pages.
- Generación, validación, ZIP, JSON y persistencia en navegador.
- Extracción ZIP con `unzip`, `zipfile` de Python y `ditto` en macOS.

No probado:

- Carga de paquetes en Cursor, GitHub Copilot, Claude Code o Agent Skills.
- Comportamiento de modelos externos.
- Validación completa de JSON Schema.
- Extracción ZIP en Windows.
- Navegadores distintos de Chromium y uso táctil real.

## Problemas conocidos

- La compatibilidad con clientes externos sigue como `not_tested`.
- La validación de JSON Schema es parcial y la de OpenAPI es estructural.
- No hay pruebas de interfaz automatizadas.
- Los conflictos entre pestañas se resuelven manualmente.
- Los 172 recursos nuevos de la biblioteca siguen en `experimental`.

## Distribución

- Versión visible: `V2.4.1`.
- `package.json`: `2.4.1`.
- Artefacto: `dist/index.html`, generado con `npm run build`.
- Tamaño: 448.980 bytes.
- SHA-256: `954af90118bce9c815c9ac5f63345afd916f208f1357a3679ae1f05da51742df`.
- Publicación: GitHub Pages desde `.github/workflows/pages.yml`; cada push a `main` publica `dist/`.

## Historial

- [Notas de versión 2.4.0](RELEASE-NOTES-2.4.0.md)
