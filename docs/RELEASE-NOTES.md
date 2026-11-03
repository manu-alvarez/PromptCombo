# Notas de versión · PromptCombo 2.4.0

Fecha de cierre: 2026-11-03.

## Alcance

PromptCombo 2.4.0 cierra el generador guiado, el compositor avanzado, la
biblioteca curada y la publicación estática en GitHub Pages. La aplicación
sigue siendo un único `dist/index.html` offline, sin llamadas a modelos, sin
runtime de agentes, sin MCP activo, sin cuentas y sin sincronización remota.

## Cambios principales

- Biblioteca de 221 recursos con ID, versión, tipo, categoría, estado
  editorial, procedencia, relaciones y verificación separada.
- 21 recetas y 15 paquetes curados.
- Catálogo avanzado de 108 módulos: 56 originales y 52 recursos composables
  derivados de la biblioteca.
- Referencias de recursos en `library/` y `docs/library-index.md`.
- Detección de conflictos entre pestañas para proyectos y composición avanzada.
- Validación parcial de JSON Schema y comprobación estructural de OpenAPI.
- Publicación en <https://manu-alvarez.github.io/PromptCombo/>.

## Correcciones de cierre

- Los 172 recursos nuevos quedan en estado `experimental`; solo los 49
  derivados del catálogo original conservan `stable`.
- Añadir un recurso no altera el prompt maestro ni la composición avanzada:
  solo añade documentación de referencia.
- El cambio de plantilla avisa expresamente cuando hay archivos editados.
- La importación y la apertura de proyectos guardan antes el proyecto actual.
- Los conflictos entre pestañas pausan el guardado y ofrecen conservar o
  exportar la copia local.
- Un estado local corrupto se conserva en
  `promptcombo.studio.v1.backup` antes de continuar con un estado vacío.
- La extracción estructurada incluye una salida inválida explícita y documenta
  el subconjunto de esquema soportado.
- OpenAPI se genera a partir de las operaciones declaradas, con parámetros de
  ruta, respuestas, esquemas y ejemplos revisables.

## Formatos y límites

### JSON Schema

Subconjunto soportado: `type` (`string`, `number`, `integer`, `boolean`,
`array`, `object`), `properties`, `required`, `additionalProperties: false`,
`items` y `enum`.

La aplicación comprueba:

1. Que el archivo JSON parsea.
2. Que el esquema usa una estructura soportada.
3. Que la salida de ejemplo cumple el esquema.
4. Que el ejemplo marcado como inválido no lo cumple.

No ejecuta un validador completo de JSON Schema ni evalúa el comportamiento de
un modelo.

### OpenAPI

Se comprueba que el YAML tiene `openapi: 3.x`, `info.title`, `info.version`,
`paths`, indentación básica, referencias internas existentes y parámetros de
ruta declarados. También se contrastan las operaciones introducidas por el
usuario con el YAML generado.

No se ejecuta una validación semántica completa. El archivo es un **borrador
revisable**.

### Frontmatter, rutas y colisiones

Se validan rutas relativas, traversal, rutas absolutas, archivos ocultos,
duplicados y colisiones por mayúsculas. El frontmatter de archivos `.mdc` y
`SKILL.md` comprueba delimitadores, `name` y `description` cuando aplica.

## Protección de datos

- El proyecto actual se guarda en `promptcombo.studio.v1`.
- La composición avanzada se guarda en `promptcombo.session.v1`.
- Los proyectos guardados se limitan a 50; la composición a 200 bloques y 120
  variables.
- Un cambio externo en otra pestaña no se sobrescribe sin decisión explícita.
- Una lectura corrupta conserva una copia de respaldo antes de descartar el
  estado.

## Respaldo e importación

- Exportación de proyecto: JSON con `schemaVersion: 1`.
- Exportación de paquete: ZIP.
- Exportación de composición avanzada: `promptcombo-composicion.json`.
- Importación JSON: máximo 2 MB; se validan esquema, receta, valores,
  artefactos, rutas y recursos.
- No hay sincronización remota ni cuentas.

## Recuperación de errores

- Error de escritura: aviso visible y el proyecto permanece en memoria.
- Conflicto entre pestañas: aviso persistente, guardado pausado y acciones para
  conservar o exportar.
- Proyecto corrupto: aviso y copia de respaldo.
- Archivo editado: se puede regenerar con confirmación o restaurar desde la
  plantilla.
- Importación inválida: se rechaza con mensaje y no sustituye el proyecto
  actual.

## Problemas conocidos

- Cursor, GitHub Copilot, Claude Code y Agent Skills no se han probado en
  clientes reales. Su compatibilidad figura como `not_tested`.
- No se evalúa el comportamiento de modelos externos.
- La validación de JSON Schema es parcial.
- La validación de OpenAPI es estructural, no semántica.
- La extracción ZIP se ha probado en macOS; no en Windows ni en otras
  herramientas.
- La interfaz se ha comprobado en Chromium y en viewports responsive; no hay
  prueba táctil real ni prueba en todos los navegadores.
- No hay pruebas de interfaz automatizadas; los recorridos se verifican en
  navegador.
- La resolución de conflictos no es colaboración en tiempo real.

## Compatibilidad

Probado:

- Chromium con la aplicación local y con GitHub Pages.
- Contexto seguro HTTPS en Pages.
- Generación, validación, ZIP, JSON y persistencia en navegador.
- Extracción ZIP con `unzip` en macOS.

No probado:

- Carga de paquetes en Cursor, Copilot, Claude Code o Agent Skills.
- Comportamiento de modelos.
- Validación completa de JSON Schema.
- Ejecución ZIP en Windows.
- Descargas y portapapeles fuera de Chromium.
- Uso táctil real en dispositivos móviles.

## Distribución

- Versión visible: `V2.4`.
- `package.json`: `2.4.0`.
- Artefacto: `dist/index.html`, generado con `npm run build`.
- Tamaño: 444.624 bytes.
- SHA-256: `aa3c20cd0b66a6e7f9d32afac427e7de437876d677266cc43ae1f239b618f28c`.
- Publicación: GitHub Pages desde `.github/workflows/pages.yml`.
- Tag local preparado: `v2.4.0`. No se publica sin autorización.

## Criterio de cierre

Se cierra si no hay pérdida silenciosa de datos conocida, los seis recorridos
principales están comprobados, las etiquetas editoriales reflejan la revisión
real, los formatos tienen límites precisos y la documentación coincide con el
producto.
