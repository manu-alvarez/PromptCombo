/* ZIP determinista sin compresión para paquetes de artefactos. */
const encoder = new TextEncoder();
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  return table;
})();

export function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function safeZipPath(path) {
  if (typeof path !== 'string' || !path.trim()) return null;
  const normalized = path.replaceAll('\\', '/').trim();
  if (normalized.startsWith('/') || /^[A-Za-z]:/.test(normalized)) return null;
  if (/[\u0000-\u001f\u007f]/.test(normalized)) return null;
  const segments = normalized.split('/');
  if (segments.some((segment) => !segment || segment === '.' || segment === '..')) return null;
  if (segments.some((segment) => /[. ]$/.test(segment) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/i.test(segment))) return null;
  return segments.join('/');
}

function u16(view, offset, value) {
  view.setUint16(offset, value, true);
}

function u32(view, offset, value) {
  view.setUint32(offset, value, true);
}

function concat(parts) {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }
  return output;
}

/**
 * Crea un ZIP con método store (sin compresión). La fecha se fija en
 * 1980-01-01 para que el paquete sea determinista.
 */
export function createZip(entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error('El ZIP necesita al menos un archivo.');
  }
  if (entries.length > 65535) {
    throw new Error('El ZIP supera el número máximo de archivos.');
  }

  const seen = new Set();
  const locals = [];
  const centrals = [];
  let offset = 0;

  for (const entry of entries) {
    const path = safeZipPath(entry?.path);
    if (!path) throw new Error(`Ruta de ZIP no válida: ${entry?.path}`);
    if (seen.has(path.toLowerCase())) throw new Error(`Ruta de ZIP duplicada: ${path}`);
    seen.add(path.toLowerCase());

    const name = encoder.encode(path);
    const data = encoder.encode(String(entry.content ?? ''));
    const crc = crc32(data);

    const local = new Uint8Array(30 + name.length);
    const localView = new DataView(local.buffer);
    u32(localView, 0, 0x04034b50);
    u16(localView, 4, 20);
    u16(localView, 6, 0x0800);
    u16(localView, 8, 0);
    u16(localView, 10, 0);
    u16(localView, 12, 0x0021);
    u32(localView, 14, crc);
    u32(localView, 18, data.length);
    u32(localView, 22, data.length);
    u16(localView, 26, name.length);
    u16(localView, 28, 0);
    local.set(name, 30);
    locals.push(local, data);

    const central = new Uint8Array(46 + name.length);
    const centralView = new DataView(central.buffer);
    u32(centralView, 0, 0x02014b50);
    u16(centralView, 4, 20);
    u16(centralView, 6, 20);
    u16(centralView, 8, 0x0800);
    u16(centralView, 10, 0);
    u16(centralView, 12, 0);
    u16(centralView, 14, 0x0021);
    u32(centralView, 16, crc);
    u32(centralView, 20, data.length);
    u32(centralView, 24, data.length);
    u16(centralView, 28, name.length);
    u16(centralView, 30, 0);
    u16(centralView, 32, 0);
    u16(centralView, 34, 0);
    u16(centralView, 36, 0);
    u32(centralView, 38, 0);
    u32(centralView, 42, offset);
    central.set(name, 46);
    centrals.push(central);

    offset += local.length + data.length;
  }

  const localBytes = concat(locals);
  const centralBytes = concat(centrals);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  u32(endView, 0, 0x06054b50);
  u16(endView, 4, 0);
  u16(endView, 6, 0);
  u16(endView, 8, entries.length);
  u16(endView, 10, entries.length);
  u32(endView, 12, centralBytes.length);
  u32(endView, 16, localBytes.length);
  u16(endView, 20, 0);

  return concat([localBytes, centralBytes, end]);
}
