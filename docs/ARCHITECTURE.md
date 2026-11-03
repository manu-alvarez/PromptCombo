# Arquitectura de PromptCombo

## 1. Objetivo

PromptCombo permite seleccionar módulos de instrucción, ordenarlos y compilarlos en un prompt maestro verificable. El sistema debe ser:

- **Offline**: el artefacto de distribución no depende de red ni de recursos externos.
- **Determinista**: la misma secuencia y las mismas variables producen exactamente el mismo texto.
- **Auditable**: los datos, el compilador y la interfaz están separados.
- **Mantenible**: el catálogo puede crecer sin modificar la lógica de presentación.
- **Accesible**: operación completa por teclado, foco visible y semántica HTML.

El código fuente es modular; el entregable se compila a un único `dist/index.html`.

## 2. Capas y dirección de dependencias

```text
src/data  ◄──  src/core  ◄──  src/ui  ◄──  src/main.js
```

| Capa | Responsabilidad | Prohibido |
|---|---|---|
| `data` | Contenido canónico, metadatos de tipo, recetas | DOM, estado, efectos |
| `core` | Estado, índices, formato, compilador, referencias DOM | Renderizado de UI |
| `ui` | Render, eventos, diálogos, toasts, sesión | Acceso a red o persistencia |
| `main` | Composición e inicialización | Lógica de negocio |

### Datos

- `src/data/catalog.js` importa los ocho grupos, deriva `GROUPS`, `ALL_ITEMS`, `ITEM_MAP` y `TOTAL_ITEMS`, y define `TYPE_META`.
- Las 30 skills viven en seis lotes de cinco (`src/data/skills/`).
- Las recetas y el estado vacío del preview viven en `src/data/recipes.js`.
- Los datos son objetos inmutables por convención. Añadir un módulo requiere una entrada con ID único, código y los campos de su tipo.

### Core

| Archivo | Responsabilidad |
|---|---|
| `core/dom.js` | Referencias obligatorias al DOM; falla pronto si falta un nodo |
| `core/state.js` | Estado efímero: selección, variables, búsqueda y acordeones |
| `core/format.js` | Escape HTML, normalización, iconos, secuencias y conteos |
| `core/items.js` | Variables activas, índice de búsqueda y descripciones |
| `core/compiler.js` | Compilación pura de módulos a prompt maestro |

### UI

| Archivo | Responsabilidad |
|---|---|
| `ui/catalog.js` | Render del catálogo, búsqueda, acordeones y botones de alta |
| `ui/workbench.js` | Secuencia, variables, preview, copia, descarga y mutaciones |
| `ui/detail.js` | Ficha modal, foco devuelto y estado del botón de alta |
| `ui/session.js` | Recetas, reinicio de sesión y deshacer |
| `ui/toasts.js` | Notificaciones efímeras con acciones |
| `ui/events.js` | Conexión de eventos, teclado y Drag & Drop |

## 3. Modelo de estado

```js
state = {
  selected: string[],          // IDs en el orden de la secuencia
  vars: Record<string, string>,// token -> valor
  query: string,               // filtro normalizado del catálogo
  openGroups: Record<string, boolean>
}
```

El estado vive en memoria y se pierde al recargar. No hay `localStorage` ni cookies. Cada mutación relevante llama a `renderAll()` o a la función de render específica:

```text
mutación
  ├── renderCombo()
  ├── syncCatalogAddState()
  ├── renderVariables()
  ├── updateOutput()
  └── syncDetailAddState()
```

El render se deriva siempre del estado; no se guarda HTML como fuente de verdad.

## 4. Compilador determinista

`compilePrompt(items, values)` es una función pura:

1. Recibe los módulos ya resueltos y un mapa de valores.
2. Genera un bloque por módulo mediante `compileBlock(item, index)`.
3. Deduplica las variables de los prompts en orden de aparición.
4. Aplica sustituciones con `split/join`, sin interpretar patrones de reemplazo.
5. Envuelve los bloques con el protocolo global y el checklist de cierre.

Consecuencias:

- No depende del DOM, del reloj ni de números aleatorios.
- Se puede probar en Node sin navegador.
- Los valores vacíos conservan el token original para que el usuario detecte variables pendientes.
- El orden del array `selected` es el orden del prompt final.

### Contrato de los módulos

Todos los módulos tienen `id`, `code`, `short`, `title` y `tagline`. Los campos específicos se validan en `scripts/validate-data.mjs`:

| Tipo | Campos específicos |
|---|---|
| `prompt` | `usage`, `variables`, `text` |
| `role` | `mission`, `responsibilities`, `deliverables`, `boundaries`, `exitCriteria` |
| `flow` | `when`, `steps`, `exitCriteria` |
| `agent` | `mission`, `protocol`, `responsibilities`, `inputs`, `outputs`, `boundaries`, `handoff` |
| `subagent` | `mission`, `responsibilities`, `inputs`, `outputs`, `boundaries`, `handoff` |
| `skill` | `purpose`, `when`, `inputs`, `procedure`, `restrictions`, `output`, `acceptance`, `example` |
| `template` | `filename`, `language`, `usage`, `text` |
| `scaffold` | `usage`, `tree`, `rules` |

La validación comprueba cantidades exactas, IDs y códigos únicos, tokens de variables, referencias de recetas y compilación de los 56 módulos.

## 5. Pipeline de build

`scripts/build.mjs`:

1. Bundlea `src/main.js` con esbuild (`iife`, ES2020, minificado).
2. Bundlea `src/styles/index.css` y sus doce secciones.
3. Lee `src/index.html`.
4. Sustituye el `<link>` y el `<script type="module">` por `<style>` y `<script>` inline.
5. Escapa cualquier `</script` que provenga de plantillas de datos.
6. Valida que no queden referencias a los archivos fuente ni cierres de script inseguros.
7. Escribe `dist/index.html` y muestra tamaño, tiempo y SHA-256.

El artefacto se versiona para permitir descarga directa y auditoría del resultado. CI reconstruye y compara con `git diff --exit-code -- dist/index.html`.

## 6. Servidor

`scripts/serve.mjs` es un servidor HTTP nativo de Node:

- Producción: sirve `dist/` en `127.0.0.1:8282`.
- Desarrollo: sirve `src/` con módulos ES nativos.
- Acepta `/promptcombo` como prefijo para Tailscale Serve.
- Resuelve `/` a `index.html`, expone `/healthz` y limita métodos a `GET`/`HEAD`.
- Bloquea path traversal comparando la ruta resuelta con la raíz.
- Añade `nosniff`, `DENY` para framing, `no-referrer` y una `Permissions-Policy` restrictiva.
- No usa dependencias externas ni framework HTTP.

## 7. Accesibilidad

- Skip link a `#sequenceArea` con `tabindex="-1"`.
- Regiones y landmarks semánticos.
- Diálogo nativo con restauración de foco y bloqueo de scroll.
- Botones con etiquetas accesibles y estados `disabled` reales.
- Región de toasts con `aria-live`.
- Atajos `/` para buscar y `Escape` para limpiar el filtro o cerrar el diálogo.
- `prefers-reduced-motion` desactiva desplazamientos suaves.
- `forced-colors` conserva bordes y foco visibles.

## 8. Seguridad

- Todo dato de módulo se escapa antes de entrar en HTML.
- El único HTML generado con `innerHTML` proviene de datos controlados y helpers de escape.
- No hay red, `eval`, `Function`, `localStorage` ni `document.write`.
- El servidor no lista directorios y no refleja el path solicitado en la respuesta.
- Tailscale Serve es la única exposición remota prevista; Funnel no está habilitado.

Riesgos residuales: el contenido del catálogo es confiado por diseño; si en el futuro se importan módulos externos, deberán validarse y sanearse como datos no confiables.

## 9. Decisiones

| Decisión | Motivo | Alternativa descartada |
|---|---|---|
| Single-file build | Offline real y distribución simple | Servir módulos ES en producción |
| esbuild como única devDependency | Build rápido, determinista y con lockfile | Bundler con más configuración |
| Datos en módulos ES | Validación en Node y tree-shaking | JSON cargado por `fetch` |
| Estado en memoria | Privacidad y simplicidad | Persistencia local |
| `launchd` para macOS | Servicio de usuario persistente sin privilegios | `nohup` o proceso de terminal |
| Tailscale Serve con path | No desplaza el servicio existente en la raíz | Sustituir la raíz o abrir un puerto público |

## 10. Extensión

Para añadir un módulo:

1. Añadirlo al archivo de datos correspondiente con ID y código únicos.
2. Ejecutar `npm run validate`.
3. Añadir o ajustar pruebas si cambia el contrato.
4. Ejecutar `npm run check`.
5. Revisar `dist/index.html` y publicar el cambio.

Para añadir un tipo nuevo:

1. Definir su forma en `TYPE_META` y en `ALL_ITEMS`.
2. Implementar su render de ficha y su bloque de compilación.
3. Extender `REQUIRED_FIELDS` y las pruebas.
4. Añadir al menos un módulo de ejemplo.
