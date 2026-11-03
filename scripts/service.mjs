#!/usr/bin/env node
/**
 * Servicio de usuario para macOS mediante launchd.
 * Mantiene `npm start` equivalente activo en 127.0.0.1:8282.
 *
 * Uso:
 *   node scripts/service.mjs install
 *   node scripts/service.mjs status
 *   node scripts/service.mjs restart
 *   node scripts/service.mjs uninstall
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const LABEL = 'com.promptcombo.server';
const PORT = 8282;
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plistPath = path.join(os.homedir(), 'Library', 'LaunchAgents', `${LABEL}.plist`);
const logDir = path.join(os.homedir(), 'Library', 'Logs', 'PromptCombo');
const serveScript = path.join(projectRoot, 'scripts', 'serve.mjs');
const distFile = path.join(projectRoot, 'dist', 'index.html');
const domain = `gui/${process.getuid()}`;
const NODE_FALLBACKS = ['/usr/local/bin/node', '/opt/homebrew/bin/node'];

/**
 * Prioriza rutas estables (symlinks de Homebrew) frente a la ruta versionada
 * de la Cellar, que desaparece al actualizar o limpiar Node.
 */
function resolveNodeBinary() {
  for (const candidate of NODE_FALLBACKS) {
    if (existsSync(candidate)) return candidate;
  }

  for (const directory of (process.env.PATH || '').split(path.delimiter)) {
    if (!directory) continue;
    const candidate = path.join(directory, 'node');
    if (existsSync(candidate)) return candidate;
  }

  return process.execPath;
}

const nodeBinary = resolveNodeBinary();
const nodePath = [
  path.dirname(nodeBinary),
  '/usr/local/bin',
  '/opt/homebrew/bin',
  '/usr/bin',
  '/bin',
  '/usr/sbin',
  '/sbin'
].filter((entry, index, entries) => entries.indexOf(entry) === index).join(':');

function listeningPids() {
  try {
    const output = execFileSync('lsof', ['-nP', `-iTCP:${PORT}`, '-sTCP:LISTEN', '-t'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
    if (!output) return [];
    return [...new Set(output.split(/\s+/).map(Number).filter(Number.isInteger))];
  } catch {
    // lsof devuelve código 1 cuando no hay ningún proceso escuchando.
    return [];
  }
}

function launchdPid() {
  const output = launchctl(['print', `${domain}/${LABEL}`], { ignoreError: true });
  const match = output?.match(/\bpid = (\d+)/);
  return match ? Number(match[1]) : null;
}

async function waitForPortFree({ timeoutMs = 5000 } = {}) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (listeningPids().length === 0) return;
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  const pids = listeningPids();
  throw new Error(`El puerto ${PORT} sigue ocupado${pids.length ? ` por los PID ${pids.join(', ')}` : ''}. Detén esos procesos y vuelve a intentarlo.`);
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function launchctl(args, { ignoreError = false } = {}) {
  try {
    return execFileSync('launchctl', args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    }).trim();
  } catch (error) {
    if (ignoreError) return null;
    throw new Error(`launchctl ${args.join(' ')} falló: ${error.stderr?.trim() || error.message}`);
  }
}

function buildPlist() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${escapeXml(LABEL)}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${escapeXml(nodeBinary)}</string>
    <string>${escapeXml(serveScript)}</string>
    <string>--port</string>
    <string>${PORT}</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>${escapeXml(nodePath)}</string>
  </dict>
  <key>WorkingDirectory</key>
  <string>${escapeXml(projectRoot)}</string>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>ThrottleInterval</key>
  <integer>5</integer>
  <key>ProcessType</key>
  <string>Background</string>
  <key>StandardOutPath</key>
  <string>${escapeXml(path.join(logDir, 'server.log'))}</string>
  <key>StandardErrorPath</key>
  <string>${escapeXml(path.join(logDir, 'server.error.log'))}</string>
</dict>
</plist>
`;
}

async function waitForHealth({ timeoutMs = 6000 } = {}) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/healthz`, {
        signal: AbortSignal.timeout(800)
      });
      if (response.ok) {
        const payload = await response.json();
        if (payload.app === 'PromptCombo') return payload;
      }
    } catch {
      // El servicio todavía está arrancando.
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`El servicio no respondió en http://127.0.0.1:${PORT}/healthz.`);
}

function assertMacOS() {
  if (process.platform !== 'darwin') {
    throw new Error('Este servicio launchd está diseñado para macOS.');
  }
}

async function install() {
  assertMacOS();
  if (!existsSync(distFile)) {
    throw new Error('Falta dist/index.html. Ejecuta primero: npm run build');
  }

  const previousPid = launchdPid();
  const foreignPids = listeningPids().filter((pid) => pid !== previousPid);

  if (foreignPids.length > 0) {
    throw new Error(
      `El puerto ${PORT} está ocupado por un proceso ajeno al servicio (PID ${foreignPids.join(', ')}). ` +
      'Detén ese proceso y vuelve a ejecutar npm run deploy:local.'
    );
  }

  await mkdir(path.dirname(plistPath), { recursive: true });
  await mkdir(logDir, { recursive: true });

  launchctl(['bootout', `${domain}/${LABEL}`], { ignoreError: true });
  await waitForPortFree();

  await writeFile(plistPath, buildPlist(), 'utf8');
  launchctl(['bootstrap', domain, plistPath]);
  launchctl(['kickstart', '-k', `${domain}/${LABEL}`]);

  const payload = await waitForHealth({ timeoutMs: 10000 });
  console.log(`Servicio instalado: ${LABEL}`);
  console.log(`plist: ${plistPath}`);
  console.log(`node: ${nodeBinary}`);
  console.log(`estado: ${payload.status} · ${payload.mode}`);
  console.log(`local: http://127.0.0.1:${PORT}/`);
  console.log(`logs: ${logDir}`);
}

async function restart() {
  assertMacOS();
  if (!existsSync(plistPath)) throw new Error('El servicio no está instalado.');
  launchctl(['kickstart', '-k', `${domain}/${LABEL}`]);
  const payload = await waitForHealth();
  console.log(`Servicio reiniciado · ${payload.status} · http://127.0.0.1:${PORT}/`);
}

async function status() {
  assertMacOS();
  const installed = existsSync(plistPath);
  console.log(`plist: ${installed ? plistPath : 'no instalado'}`);

  if (!installed) return;
  const output = launchctl(['print', `${domain}/${LABEL}`], { ignoreError: true });
  if (!output) {
    console.log('launchd: no cargado');
    return;
  }

  const state = output.match(/\bstate = ([^\n]+)/)?.[1] ?? 'desconocido';
  const pid = output.match(/\bpid = (\d+)/)?.[1] ?? 'sin PID';
  console.log(`launchd: ${state} · ${pid}`);

  const pids = listeningPids();
  console.log(`puerto: ${PORT} · ${pids.length ? `PID ${pids.join(', ')}` : 'libre'}`);

  try {
    const response = await fetch(`http://127.0.0.1:${PORT}/healthz`, { signal: AbortSignal.timeout(1000) });
    const payload = await response.json();
    console.log(`http: ${response.status} · ${payload.app} · ${payload.mode}`);
  } catch {
    console.log('http: sin respuesta');
  }
}

async function uninstall() {
  assertMacOS();
  launchctl(['bootout', `${domain}/${LABEL}`], { ignoreError: true });
  await rm(plistPath, { force: true });
  console.log(`Servicio desinstalado: ${LABEL}`);
  console.log(`Los logs permanecen en ${logDir}`);
}

async function logs() {
  for (const file of ['server.log', 'server.error.log']) {
    const target = path.join(logDir, file);
    if (!existsSync(target)) continue;
    console.log(`--- ${file} ---`);
    console.log((await readFile(target, 'utf8')).trim().split('\n').slice(-40).join('\n'));
  }
}

const command = process.argv[2] || 'status';

try {
  if (command === 'install') await install();
  else if (command === 'restart') await restart();
  else if (command === 'status') await status();
  else if (command === 'uninstall') await uninstall();
  else if (command === 'logs') await logs();
  else throw new Error(`Comando no reconocido: ${command}`);
} catch (error) {
  console.error(error.message || error);
  process.exitCode = 1;
}
