# Seguridad

## Modelo de amenaza

PromptCombo es una aplicación estática y local. No tiene backend, autenticación, base de datos ni telemetría. Su superficie principal es:

- Renderizado de contenido del catálogo.
- Entrada de variables por parte del usuario.
- Portapapeles y descarga de archivos.
- Generación de artefactos y exportación ZIP/JSON.
- Importación de proyectos JSON.
- Servidor estático local.
- Exposición accidental si se cambia la interfaz de escucha o se añade un proxy.
- Prompt o archivo generado que se reutiliza en un runtime externo con herramientas y permisos.

PromptCombo no ejecuta modelos, herramientas, MCP ni código del usuario ni de los artefactos generados.

## Controles implementados

- Escape HTML de datos y atributos antes de insertarlos en el DOM.
- Sin `eval`, `Function`, `document.write` ni `innerHTML` con entrada externa.
- Persistencia local opcional y versionada; se guardan IDs de módulos, valores de variables y la preferencia de guardado, validados y acotados al cargar.
- Los proyectos del generador se validan y limitan antes de guardar, importar o exportar.
- Rutas de artefactos relativas, sin traversal, duplicados ni colisiones; ZIP con UTF-8 y CRC.
- JSON de proyecto validado antes de sustituir el proyecto actual; límite de 2 MB.
- Sin peticiones de red en tiempo de ejecución.
- El prompt compilado declara que no concede herramientas ni permisos, exige autorización para acciones sensibles y trata documentos externos como datos no confiables.
- Sin ejecución de modelos, herramientas, MCP ni código introducido por el usuario.
- Servidor con raíz fija, resolución de rutas reales y bloqueo de path traversal y enlaces simbólicos fuera de la raíz.
- Solo `GET` y `HEAD`; respuestas `405` para el resto.
- Cabeceras `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer` y `Permissions-Policy` restrictiva.
- Sin secretos ni credenciales en el repositorio.
- Sin exposición remota: el servidor escucha en loopback y no configura proxies, túneles ni servicios de exposición.

## Riesgos residuales

- El catálogo se considera contenido confiable. Si se añade una importación de módulos externos, deberá validarse como dato no confiable.
- Las variables pueden contener instrucciones o datos sensibles. Se insertan textualmente en el prompt compilado y se escapan en la interfaz, pero no se evalúan; el usuario debe revisarlas antes de reutilizar el resultado.
- PromptCombo no puede impedir que el prompt se ejecute en un runtime con permisos amplios. La autorización, el aislamiento y la aprobación deben aplicarse en ese runtime.
- Los artefactos generados son texto revisable: no se instalan ni se ejecutan, pero el usuario puede copiarlos a un sistema con permisos propios.
- Un proyecto importado puede contener rutas o contenido no deseados; se valida la estructura, pero la revisión del contenido sigue siendo humana.
- La aplicación no evalúa la veracidad ni la seguridad del comportamiento de un modelo externo.
- La composición y las variables pueden contener información sensible y se guardan en `localStorage` del navegador si la persistencia está activa. El usuario puede desactivarla y borrar la copia; no se transmiten por red.
- El portapapeles depende de permisos y contexto seguro del navegador.
- El servicio local escucha en `127.0.0.1`; no debe cambiarse a `0.0.0.0` sin una revisión de red y firewall.

## Reportar una vulnerabilidad

No publiques credenciales, datos personales ni detalles explotables en un issue público.

1. Usa **Security → Report a vulnerability** en el repositorio de GitHub.
2. Incluye versión/commit, navegador, sistema, pasos de reproducción e impacto.
3. Si el reporte afecta al sistema operativo o al servicio `launchd`, indica también la versión.

Se acusará recibo y se coordinará la corrección antes de cualquier divulgación pública.
