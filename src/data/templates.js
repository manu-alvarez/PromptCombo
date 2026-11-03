/* Plantillas de archivos */
export const templates = [
  {
    id: 'template-html',
    code: 'T-01',
    short: 'HT',
    title: 'index.html · base PWA',
    filename: 'index.html',
    language: 'html',
    tagline: 'Documento HTML semántico y mínimo, sin dependencias externas.',
    usage: 'Punto de partida para una interfaz instalable servida por HTTP/HTTPS. Sustituye [NOMBRE] y [DESCRIPCIÓN].',
    text: `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0a0a0f">
  <meta name="description" content="[DESCRIPCIÓN]">
  <title>[NOMBRE]</title>
  <link rel="manifest" href="./manifest.json">
  <link rel="stylesheet" href="./styles.css">
</head>
<body>
  <main class="shell">
    <header class="topline">
      <p class="kicker">[NOMBRE]</p>
      <span class="status-dot" aria-hidden="true"></span>
    </header>

    <h1>[NOMBRE]</h1>
    <p class="lead">[DESCRIPCIÓN]</p>

    <form class="entry-form" id="item-form">
      <label class="sr-only" for="item-input">Nuevo elemento</label>
      <input id="item-input" name="item" type="text" maxlength="120" autocomplete="off" placeholder="Escribe un elemento…" required>
      <button type="submit">Añadir</button>
    </form>

    <p id="status" class="status" role="status">Listo.</p>
    <ul id="item-list" class="item-list" aria-live="polite"></ul>
  </main>
  <script src="./app.js" defer><\/script>
</body>
</html>`
  },
  {
    id: 'template-css',
    code: 'T-02',
    short: 'CS',
    title: 'styles.css · tokens neón',
    filename: 'styles.css',
    language: 'css',
    tagline: 'Variables de diseño, layout responsive y foco visible.',
    usage: 'Base visual consistente con la paleta cyberpunk. Adapta tokens y tipografía al producto.',
    text: `:root {
  color-scheme: dark;
  --bg: #0a0a0f;
  --panel: #151520;
  --line: rgba(224, 224, 224, 0.1);
  --cyan: #00f3ff;
  --magenta: #ff00ff;
  --acid: #39ff14;
  --text: #e0e0e0;
  --muted: #9999ad;
  --danger: #ff5d7a;
  --sans: system-ui, -apple-system, "Segoe UI", sans-serif;
  --mono: ui-monospace, "SFMono-Regular", Consolas, monospace;
  --radius: 14px;
}

*, *::before, *::after { box-sizing: border-box; }

html, body { min-height: 100%; }

body {
  margin: 0;
  background:
    radial-gradient(circle at 15% 0%, rgba(0, 243, 255, 0.1), transparent 35%),
    radial-gradient(circle at 100% 100%, rgba(255, 0, 255, 0.08), transparent 32%),
    var(--bg);
  color: var(--text);
  font-family: var(--sans);
  line-height: 1.6;
}

button, input { font: inherit; }

:focus-visible {
  outline: 2px solid var(--cyan);
  outline-offset: 3px;
}

.shell {
  width: min(720px, calc(100% - 32px));
  margin: 0 auto;
  padding: 64px 0;
}

.topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 36px;
}

.kicker {
  margin: 0;
  color: var(--cyan);
  font: 600 11px/1 var(--mono);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--acid);
  box-shadow: 0 0 12px var(--acid);
}

h1 {
  margin: 0;
  font-size: clamp(36px, 7vw, 68px);
  line-height: 1;
  letter-spacing: -0.05em;
}

.lead {
  max-width: 58ch;
  margin: 16px 0 40px;
  color: var(--muted);
}

.entry-form {
  display: flex;
  gap: 8px;
  padding: 8px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--panel);
}

.entry-form input {
  min-width: 0;
  flex: 1;
  padding: 10px 12px;
  border: 0;
  border-radius: 8px;
  outline: none;
  background: transparent;
  color: var(--text);
}

.entry-form button {
  padding: 10px 18px;
  border: 1px solid rgba(0, 243, 255, 0.4);
  border-radius: 8px;
  background: rgba(0, 243, 255, 0.1);
  color: var(--cyan);
  cursor: pointer;
}

.entry-form button:hover { background: rgba(0, 243, 255, 0.18); }

.status { min-height: 24px; margin: 16px 0 0; color: var(--muted); font-size: 13px; }

.item-list {
  display: grid;
  gap: 8px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: rgba(21, 21, 32, 0.72);
}

.item button {
  border: 0;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
}

.item button:hover { color: var(--danger); }

.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0);
  white-space: nowrap; border: 0;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}`
  },
  {
    id: 'template-js',
    code: 'T-03',
    short: 'JS',
    title: 'app.js · patrón módulo',
    filename: 'app.js',
    language: 'javascript',
    tagline: 'Estado local encapsulado, render seguro y delegación de eventos.',
    usage: 'Extiende este módulo con servicios pequeños. Mantén el DOM como salida del estado, no como fuente de verdad.',
    text: `(() => {
  'use strict';

  const state = {
    items: [],
    status: 'Listo.'
  };

  const refs = {
    form: null,
    input: null,
    list: null,
    status: null
  };

  function setStatus(message) {
    state.status = message;
    refs.status.textContent = message;
  }

  function addItem(rawValue) {
    const text = String(rawValue).trim();

    if (!text) {
      setStatus('El texto está vacío.');
      return false;
    }

    if (text.length > 120) {
      setStatus('El texto supera el límite de 120 caracteres.');
      return false;
    }

    state.items.push({
      id: String(Date.now()) + '-' + Math.random().toString(36).slice(2, 7),
      text: text
    });

    setStatus('Elemento añadido.');
    return true;
  }

  function removeItem(id) {
    const before = state.items.length;
    state.items = state.items.filter((item) => item.id !== id);
    setStatus(state.items.length < before ? 'Elemento eliminado.' : 'No se encontró el elemento.');
  }

  function render() {
    refs.list.replaceChildren();

    for (const item of state.items) {
      const row = document.createElement('li');
      row.className = 'item';

      const label = document.createElement('span');
      label.textContent = item.text;

      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.id = item.id;
      button.setAttribute('aria-label', 'Eliminar ' + item.text);
      button.textContent = '×';

      row.append(label, button);
      refs.list.append(row);
    }

    refs.status.textContent = state.status;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const added = addItem(refs.input.value);
    if (!added) return;
    refs.input.value = '';
    refs.input.focus();
    render();
  }

  function handleListClick(event) {
    const button = event.target.closest('button[data-id]');
    if (!button) return;
    removeItem(button.dataset.id);
    render();
  }

  function init() {
    refs.form = document.querySelector('#item-form');
    refs.input = document.querySelector('#item-input');
    refs.list = document.querySelector('#item-list');
    refs.status = document.querySelector('#status');

    if (!refs.form || !refs.input || !refs.list || !refs.status) {
      console.error('Faltan elementos requeridos en el DOM.');
      return;
    }

    refs.form.addEventListener('submit', handleSubmit);
    refs.list.addEventListener('click', handleListClick);
    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();`
  },
  {
    id: 'template-manifest',
    code: 'T-04',
    short: 'MF',
    title: 'manifest.json · instalación',
    filename: 'manifest.json',
    language: 'json',
    tagline: 'Metadatos mínimos para una PWA servida por HTTPS.',
    usage: 'Requiere un service worker y un icono real para que los navegadores consideren la instalación. Verifica con Lighthouse.',
    text: `{
  "name": "[NOMBRE]",
  "short_name": "[NOMBRE CORTO]",
  "description": "[DESCRIPCIÓN]",
  "lang": "es",
  "start_url": "./index.html",
  "scope": "./",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#0a0a0f",
  "theme_color": "#0a0a0f",
  "icons": [
    {
      "src": "./assets/icon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}`
  },
  {
    id: 'template-sw',
    code: 'T-05',
    short: 'SW',
    title: 'sw.js · app shell offline',
    filename: 'sw.js',
    language: 'javascript',
    tagline: 'Cache versionada del shell con estrategia cache-first controlada.',
    usage: 'Debe servirse desde el mismo origen sobre HTTPS o localhost. Ajusta ASSETS y la versión al publicar cambios.',
    text: `const CACHE_NAME = 'app-shell-v1';
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});`
  }
];
