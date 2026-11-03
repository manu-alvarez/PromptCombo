#!/usr/bin/env node
/**
 * Build determinista: fuente modular -> un único dist/index.html.
 * No genera assets externos ni referencias de red.
 */
import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceIndex = path.join(root, 'src', 'index.html');
const outputDir = path.join(root, 'dist');
const outputFile = path.join(outputDir, 'index.html');

function assert(condition, message) {
  if (!condition) throw new Error(`[build] ${message}`);
}

async function bundle({ entry, outfile, format }) {
  const result = await build({
    absWorkingDir: root,
    entryPoints: [entry],
    bundle: true,
    write: false,
    outfile,
    ...(format ? { format } : {}),
    target: ['es2020'],
    minify: true,
    sourcemap: false,
    legalComments: 'none',
    charset: 'utf8',
    treeShaking: true,
    logLevel: 'silent'
  });

  const output = result.outputFiles?.find((file) => file.path.endsWith(outfile));
  assert(output, `esbuild no produjo ${outfile}`);
  return output.text;
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function main() {
  const started = performance.now();
  const [js, css, template] = await Promise.all([
    bundle({ entry: 'src/main.js', outfile: 'app.js', format: 'iife' }),
    bundle({ entry: 'src/styles/index.css', outfile: 'styles.css' }),
    readFile(sourceIndex, 'utf8')
  ]);

  const scriptTag = '<script type="module" src="./main.js"></script>';
  const styleTag = '<link rel="stylesheet" href="./styles/index.css">';
  assert(template.includes(scriptTag), 'src/index.html no contiene el script de entrada esperado.');
  assert(template.includes(styleTag), 'src/index.html no contiene la hoja de estilos esperada.');

  // Evita que una secuencia de cierre de script dentro de una plantilla de datos
  // termine prematuramente el bloque inline del documento final.
  const safeJs = js.replace(/<\/script/gi, '<\\/script');
  const html = template
    .replace(styleTag, `<style>\n${css}\n</style>`)
    .replace(scriptTag, `<script>\n${safeJs}\n</script>`);

  assert(html.startsWith('<!doctype html>'), 'El HTML de salida no es un documento completo.');
  assert(html.trimEnd().endsWith('</html>'), 'El HTML de salida no termina correctamente.');
  assert(!html.includes(scriptTag), 'El HTML final conserva la referencia al script fuente.');
  assert(!html.includes(styleTag), 'El HTML final conserva la referencia a la hoja fuente.');

  const inlineStart = html.indexOf('<script>');
  const inlineEnd = html.lastIndexOf('</script>');
  assert(inlineStart !== -1 && inlineEnd > inlineStart, 'El HTML final no contiene el script inline.');
  assert(html.indexOf('<style>') !== -1, 'El HTML final no contiene el CSS inline.');

  const beforeInlineScript = html.slice(0, inlineStart);
  assert(!/<script[^>]+src=/i.test(beforeInlineScript), 'El HTML final contiene un script externo.');
  assert(!/<link[^>]+rel=["']stylesheet["']/i.test(beforeInlineScript), 'El HTML final contiene una hoja externa.');

  const inlineJs = html.slice(inlineStart + '<script>'.length, inlineEnd);
  assert(!/<\/script/i.test(inlineJs), 'El JS inline contiene una secuencia de cierre insegura.');
  assert((html.match(/<\/script>/gi) || []).length === 1, 'El documento debe contener un único cierre de script real.');
  assert((html.match(/<\/style>/gi) || []).length === 1, 'El documento debe contener un único cierre de style real.');

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputFile, html, 'utf8');

  const info = await stat(outputFile);
  const hash = createHash('sha256').update(html).digest('hex');
  const elapsed = Math.round(performance.now() - started);

  console.log(`PromptCombo build · ${formatBytes(info.size)} · ${elapsed} ms`);
  console.log(`sha256: ${hash}`);
  console.log(`salida: ${path.relative(root, outputFile)}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
