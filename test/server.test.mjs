import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStaticServer } from '../scripts/serve.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let server;
let baseUrl;

before(async () => {
  server = createStaticServer({
    root: path.join(root, 'src'),
    dev: true,
    log: false
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  if (!server) return;
  server.close();
  await once(server, 'close');
});

test('sirve el shell de desarrollo y sus módulos ES', async () => {
  const response = await fetch(`${baseUrl}/`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
  const html = await response.text();
  assert.match(html, /src="\.\/main\.js"/);

  const moduleResponse = await fetch(`${baseUrl}/main.js`);
  assert.equal(moduleResponse.status, 200);
  assert.match(moduleResponse.headers.get('content-type'), /text\/javascript/);
  assert.match(await moduleResponse.text(), /renderCatalog/);
});

test('acepta el prefijo /promptcombo de Tailscale Serve', async () => {
  const response = await fetch(`${baseUrl}/promptcombo/`);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /PromptCombo/);

  const css = await fetch(`${baseUrl}/promptcombo/styles/index.css`);
  assert.equal(css.status, 200);
  assert.match(css.headers.get('content-type'), /text\/css/);
});

test('expone healthz y cabeceras defensivas', async () => {
  const response = await fetch(`${baseUrl}/promptcombo/healthz`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('x-frame-options'), 'DENY');
  const payload = await response.json();
  assert.equal(payload.status, 'ok');
  assert.equal(payload.app, 'PromptCombo');
  assert.equal(payload.mode, 'development');
});

test('responde 404, 405 y HEAD correctamente', async () => {
  const missing = await fetch(`${baseUrl}/no-existe.js`);
  assert.equal(missing.status, 404);

  const post = await fetch(`${baseUrl}/`, { method: 'POST' });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('allow'), 'GET, HEAD');

  const head = await fetch(`${baseUrl}/main.js`, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
});

test('no permite escapar del directorio servido', async () => {
  const response = await fetch(`${baseUrl}/%2e%2e/package.json`);
  assert.ok(response.status === 403 || response.status === 404);
  assert.ok(!(await response.text()).includes('"name": "promptcombo"'));
});
