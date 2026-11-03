# Despliegue de PromptCombo

## GitHub Pages

El workflow `.github/workflows/pages.yml` publica el artefacto estático en
<https://manu-alvarez.github.io/PromptCombo/>. Se ejecuta en cada push a `main`
o manualmente desde Actions.

## 1. Topología

```text
macOS
└── launchd · com.promptcombo.server
    └── node scripts/serve.mjs --port 8282
        └── 127.0.0.1:8282 · dist/index.html
```

- El servidor escucha solo en `127.0.0.1`.
- No hay proxy inverso, túnel ni servicio de exposición remota configurado.
- El puerto local es `8282`; no se publica en la red.
- La aplicación sigue siendo un único `dist/index.html` offline.

## 2. Preparación

Requisitos:

- macOS para el servicio `launchd`.
- Node.js 20+ (`node --version`).
- Puerto `8282` libre (`lsof -nP -iTCP:8282 -sTCP:LISTEN`).

```bash
cd "/Users/manu/Desktop/PROMPT COMBO"
npm ci
npm run check
```

`npm run check` valida los 108 módulos, ejecuta los tests y regenera `dist/index.html`.

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

La salida de `lsof` debe mostrar únicamente `127.0.0.1:8282`, no `0.0.0.0` ni una interfaz externa.

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

## 4. Actualización

```bash
cd "/Users/manu/Desktop/PROMPT COMBO"
git pull --ff-only
npm ci
npm run check
npm run service:restart
```

El servicio sirve el `dist/index.html` recién generado. No hay ninguna ruta remota que actualizar.

## 5. Diagnóstico

### El puerto está ocupado

```bash
lsof -nP -iTCP:8282 -sTCP:LISTEN
```

Detén el proceso que lo ocupa o cambia el puerto en `scripts/service.mjs`.

### El servicio no arranca

```bash
launchctl print gui/$(id -u)/com.promptcombo.server
tail -n 80 ~/Library/Logs/PromptCombo/server.error.log
tail -n 80 ~/Library/Logs/PromptCombo/server.log
```

### La app carga pero el portapapeles falla

Es una restricción del navegador. PromptCombo usa `navigator.clipboard` y, si falla, `document.execCommand('copy')`; como último recurso selecciona el texto para copia manual.

### Comprobar que no hay exposición externa

```bash
lsof -nP -iTCP:8282 -sTCP:LISTEN
```

La salida debe mostrar `127.0.0.1:8282` y no una dirección `0.0.0.0` ni una interfaz de red externa.

## 6. Alternativa manual

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
