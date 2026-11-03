# Seguridad

## Modelo de amenaza

PromptCombo es una aplicación estática y local. No tiene backend, autenticación, base de datos ni telemetría. Su superficie principal es:

- Renderizado de contenido del catálogo.
- Entrada de variables por parte del usuario.
- Portapapeles y descarga de archivos.
- Servidor estático local.
- Exposición por Tailscale Serve.

## Controles implementados

- Escape HTML de datos y atributos antes de insertarlos en el DOM.
- Sin `eval`, `Function`, `document.write` ni `innerHTML` con entrada externa.
- Persistencia local opcional y versionada; se guardan IDs de módulos, valores de variables y la preferencia de guardado, validados y acotados al cargar.
- Sin peticiones de red en tiempo de ejecución.
- Servidor con raíz fija, resolución de rutas reales y bloqueo de path traversal y enlaces simbólicos fuera de la raíz.
- Solo `GET` y `HEAD`; respuestas `405` para el resto.
- Cabeceras `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer` y `Permissions-Policy` restrictiva.
- Sin secretos ni credenciales en el repositorio.
- Tailscale Serve en lugar de Funnel: acceso limitado a la tailnet.

## Riesgos residuales

- El catálogo se considera contenido confiable. Si se añade una importación de módulos externos, deberá validarse como dato no confiable.
- La composición y las variables pueden contener información sensible y se guardan en `localStorage` del navegador si la persistencia está activa. El usuario puede desactivarla y borrar la copia; no se transmiten por red.
- El portapapeles depende de permisos y contexto seguro del navegador.
- El servicio local escucha en `127.0.0.1`; no debe cambiarse a `0.0.0.0` sin una revisión de red y firewall.
- Tailscale Serve hereda la confianza de la tailnet: cualquier dispositivo autorizado puede acceder a la ruta.

## Reportar una vulnerabilidad

No publiques credenciales, datos personales ni detalles explotables en un issue público.

1. Usa **Security → Report a vulnerability** en el repositorio de GitHub.
2. Incluye versión/commit, navegador, sistema, pasos de reproducción e impacto.
3. Si el reporte afecta a Tailscale o al sistema operativo, indica también la versión.

Se acusará recibo y se coordinará la corrección antes de cualquier divulgación pública.
