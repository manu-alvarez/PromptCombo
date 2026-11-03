#!/usr/bin/env node
/**
 * Servidor estático sin dependencias para desarrollo y producción.
 * - Producción: sirve dist/index.html en 127.0.0.1:8282.
 * - Desarrollo: sirve src/ con módulos ES nativos.
 * - Acepta el prefijo /promptcombo usado por Tailscale Serve.
 */
import { createReadStream } from 'node:fs';
import { access, stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_PORT = 8282;
const DEFAULT_BASE_PATH = '/promptcombo';

const MIME_TYPES = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.ico', 'image/x-icon'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.woff2', 'font/woff2']
]);

function sendText(response, statusCode, message, extraHeaders = {}) {
  const body = `${message}\n`;
  response.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    ...extraHeaders
  });
  response.end(body);
}

function sendJson(response, statusCode, payload) {
  const body = `${JSON.stringify(payload)}\n`;
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer'
  });
  response.end(body);
}

function securityHeaders(dev) {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cache-Control': dev ? 'no-store' : 'no-cache'
  };
}

function stripBasePath(pathname, basePath) {
  if (!basePath || basePath === '/') return pathname;
  if (pathname === basePath || pathname === `${basePath}/`) return '/';
  if (pathname.startsWith(`${basePath}/`)) return pathname.slice(basePath.length) || '/';
  return pathname;
}

/**
 * Crea el servidor sin escuchar. Exportado para tests de integración.
 */
export function createStaticServer({
  root,
  dev = false,
  basePath = DEFAULT_BASE_PATH,
  log = true
} = {}) {
  if (!root) throw new Error('createStaticServer requiere un directorio raíz.');

  const rootAbsolute = path.resolve(root);

  return http.createServer(async (request, response) => {
    const started = performance.now();
    let pathname = '/';

    const finish = (status) => {
      if (!log) return;
      const elapsed = Math.round(performance.now() - started);
      console.log(`${request.method} ${status} ${pathname} · ${elapsed} ms`);
    };

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      sendText(response, 405, 'Método no permitido.', { Allow: 'GET, HEAD' });
      finish(405);
      return;
    }

    try {
      const url = new URL(request.url || '/', 'http://localhost');
      pathname = decodeURIComponent(url.pathname);
      pathname = pathname.replace(/\/{2,}/g, '/');
      pathname = stripBasePath(pathname, basePath);

      if (pathname === '/healthz') {
        sendJson(response, 200, {
          status: 'ok',
          app: 'PromptCombo',
          mode: dev ? 'development' : 'production',
          uptime: Math.round(process.uptime())
        });
        finish(200);
        return;
      }

      if (pathname === '/' || pathname === '') pathname = '/index.html';

      const target = path.resolve(rootAbsolute, `.${pathname}`);
      if (target !== rootAbsolute && !target.startsWith(`${rootAbsolute}${path.sep}`)) {
        sendText(response, 403, 'Ruta no permitida.');
        finish(403);
        return;
      }

      let fileStat;
      try {
        fileStat = await stat(target);
      } catch {
        sendText(response, 404, 'Recurso no encontrado.');
        finish(404);
        return;
      }

      if (!fileStat.isFile()) {
        sendText(response, 404, 'Recurso no encontrado.');
        finish(404);
        return;
      }

      const extension = path.extname(target).toLowerCase();
      const contentType = MIME_TYPES.get(extension) || 'application/octet-stream';

      response.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': fileStat.size,
        ...securityHeaders(dev)
      });
      finish(200);

      if (request.method === 'HEAD') {
        response.end();
        return;
      }

      const stream = createReadStream(target);
      stream.on('error', () => {
        if (!response.headersSent) sendText(response, 500, 'Error leyendo el recurso.');
        else response.destroy();
      });
      stream.pipe(response);
    } catch (error) {
      if (!response.headersSent) sendText(response, 400, 'Solicitud inválida.');
      else response.destroy();
      finish(400);
    }
  });
}

function parseArgs(argv) {
  const options = {
    dev: false,
    port: Number(process.env.PORT) || DEFAULT_PORT,
    host: process.env.HOST || '127.0.0.1',
    root: process.env.ROOT || null,
    help: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === '--dev') {
      options.dev = true;
    } else if (argument === '--help' || argument === '-h') {
      options.help = true;
    } else if (argument === '--port' || argument === '--host' || argument === '--root') {
      const value = argv[index + 1];
      if (!value) throw new Error(`Falta el valor de ${argument}.`);
      options[argument.slice(2)] = argument === '--port' ? Number(value) : value;
      index += 1;
    } else if (argument.startsWith('--port=') || argument.startsWith('--host=') || argument.startsWith('--root=')) {
      const [key, ...rest] = argument.slice(2).split('=');
      const value = rest.join('=');
      options[key] = key === 'port' ? Number(value) : value;
    } else {
      throw new Error(`Argumento no reconocido: ${argument}`);
    }
  }

  if (!Number.isInteger(options.port) || options.port < 1 || options.port > 65535) {
    throw new Error('El puerto debe ser un entero entre 1 y 65535.');
  }

  return options;
}

function printHelp() {
  console.log(`Uso: node scripts/serve.mjs [opciones]

Opciones:
  --dev             Sirve src/ con módulos ES nativos.
  --port <número>   Puerto local. Por defecto 8282.
  --host <host>     Interfaz de escucha. Por defecto 127.0.0.1.
  --root <ruta>     Directorio a servir. Por defecto dist/ o src/ en modo dev.
  -h, --help        Muestra esta ayuda.

Ejemplos:
  npm start
  npm run dev
  PORT=8282 npm start

Tailscale Serve:
  tailscale serve --bg --set-path /promptcombo http://127.0.0.1:8282
`);
}

async function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
    return;
  }

  if (options.help) {
    printHelp();
    return;
  }

  const root = options.root
    ? path.resolve(process.cwd(), options.root)
    : path.join(projectRoot, options.dev ? 'src' : 'dist');

  try {
    await access(path.join(root, 'index.html'));
  } catch {
    console.error(`No se encontró ${path.join(root, 'index.html')}.`);
    if (!options.dev) console.error('Ejecuta primero: npm run build');
    process.exitCode = 1;
    return;
  }

  const server = createStaticServer({ root, dev: options.dev });
  const mode = options.dev ? 'desarrollo' : 'producción';

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`El puerto ${options.port} ya está ocupado. Usa --port <otro> o libera el puerto.`);
    } else {
      console.error(error.message);
    }
    process.exitCode = 1;
  });

  server.listen(options.port, options.host, () => {
    const displayHost = options.host === '0.0.0.0' ? '127.0.0.1' : options.host;
    console.log(`PromptCombo · ${mode}`);
    console.log(`local:     http://${displayHost}:${options.port}/`);
    console.log(`tailnet:   https://<host>.ts.net/promptcombo/ (con Tailscale Serve)`);
    console.log(`health:    http://${displayHost}:${options.port}/healthz`);
    console.log('Ctrl+C para detener.');
  });

  let shuttingDown = false;
  const shutdown = (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`\n${signal} recibido. Cerrando servidor…`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 5000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

const isMain = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
  main().catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  });
}
