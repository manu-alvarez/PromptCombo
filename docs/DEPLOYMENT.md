# Despliegue de PromptCombo

## 1. Topología

```text
macOS
├── launchd · com.promptcombo.server
│   └── node scripts/serve.mjs --port 8282
│       └── 127.0.0.1:8282 · dist/index.html
│
└── Tailscale Serve
    └── https://<host>.ts.net/promptcombo/
        └── proxy a http://127.0.0.1:8282
```

- El servidor local escucha solo en `127.0.0.1`.
- Tailscale Serve termina TLS y proxyfica la ruta `/promptcombo`.
- No se usa Funnel: el acceso queda limitado a la tailnet.
- El puerto público de Tailscale sigue siendo `443`; el puerto local es `8282`.

## 2. Preparación

Requisitos:

- macOS para el servicio `launchd`.
- Node.js 20+ (`node --version`).
- Tailscale activo (`tailscale status`).
- Puerto `8282` libre (`lsof -nP -iTCP:8282 -sTCP:LISTEN`).

```bash
cd "/Users/manu/Desktop/PROMPT COMBO"
npm ci
npm run check
```

`npm run check` valida los 56 módulos, ejecuta los tests y regenera `dist/index.html`.

## 3. Servicio local persistente

```bash
npm run deploy:local
```

El comando:

1. Reconstruye `dist/index.html`.
2. Escribe `~/Library/LaunchAgents/com.promptcombo.server.plist`.
3. Carga el agente con `launchctl bootstrap`.
4. Espera a que `/healthz` confirme `PromptCombo`.
5. Mantiene el proceso con `KeepAlive`.

Verificación:

```bash
npm run service:status
curl -fsS http://127.0.0.1:8282/healthz
lsof -nP -iTCP:8282 -sTCP:LISTEN
```

Abrir en local:

```text
http://127.0.0.1:8282/
```

Operación:

```bash
npm run service:restart   # aplica un build nuevo
npm run service:logs      # últimas líneas de los logs
npm run service:status    # launchd + healthz
npm run service:uninstall # retira el agente, conserva los logs
```

Rutas:

- Plist: `~/Library/LaunchAgents/com.promptcombo.server.plist`
- Logs: `~/Library/Logs/PromptCombo/server.log` y `server.error.log`

El servicio resuelve una ruta estable de Node (`/usr/local/bin/node` o `/opt/homebrew/bin/node`) y fija un `PATH` explícito en el plist. Si desinstalas Node, cambias de gestor de versiones o mueves el proyecto, vuelve a ejecutar `npm run deploy:local`.

`install` comprueba antes que el puerto `8282` no esté ocupado por un proceso ajeno al servicio. Si lo está, falla con el PID y no deja un falso positivo de salud.

## 4. Tailscale Serve

El host ya tiene servicios en la raíz de `443`. PromptCombo se monta en `/promptcombo` para no sustituirlos.

```bash
tailscale serve --bg --set-path /promptcombo http://127.0.0.1:8282
tailscale serve status
```

La salida debe incluir una entrada similar a:

```text
https://vpn-manu-hackintosh.tailb645cc.ts.net
|-- /promptcombo proxy http://127.0.0.1:8282
|-- / proxy http://127.0.0.1:8082
```

Verificación desde el propio macOS o desde otro dispositivo de la tailnet:

```bash
curl -fsS https://vpn-manu-hackintosh.tailb645cc.ts.net/promptcombo/healthz
curl -fsS https://vpn-manu-hackintosh.tailb645cc.ts.net/promptcombo/ | head
```

URL de la aplicación:

```text
https://vpn-manu-hackintosh.tailb645cc.ts.net/promptcombo/
```

### Retirar solo la ruta de PromptCombo

```bash
tailscale serve --https=443 --set-path=/promptcombo off
tailscale serve status
```

No ejecutes `tailscale serve reset`: eliminaría también la ruta `/` del servicio existente en `8082`.

### Funnel

No está habilitado. Para exponer la aplicación a Internet pública haría falta una decisión explícita y `tailscale funnel`; este proyecto no lo configura por defecto.

## 5. Actualización

```bash
cd "/Users/manu/Desktop/PROMPT COMBO"
git pull --ff-only
npm ci
npm run check
npm run service:restart
```

El servicio sirve el `dist/index.html` recién generado. La ruta de Tailscale no cambia.

## 6. Diagnóstico

### El puerto está ocupado

```bash
lsof -nP -iTCP:8282 -sTCP:LISTEN
```

Detén el proceso que lo ocupa o cambia el puerto en `scripts/service.mjs` y en la ruta de Tailscale.

### El servicio no arranca

```bash
launchctl print gui/$(id -u)/com.promptcombo.server
tail -n 80 ~/Library/Logs/PromptCombo/server.error.log
tail -n 80 ~/Library/Logs/PromptCombo/server.log
```

### Tailscale devuelve 404

Comprueba que el proxy apunta al puerto correcto y que la ruta está registrada:

```bash
tailscale serve status
curl -i http://127.0.0.1:8282/healthz
```

### La app carga pero el portapapeles falla

Es una restricción del navegador. PromptCombo usa `navigator.clipboard` y, si falla, `document.execCommand('copy')`; como último recurso selecciona el texto para copia manual.

## 7. Alternativa manual

Sin `launchd`:

```bash
npm run build
npm start
```

o, para desarrollo con módulos ES nativos:

```bash
npm run dev
```

`npm start` y `npm run dev` ocupan el mismo puerto; no los ejecutes a la vez.
