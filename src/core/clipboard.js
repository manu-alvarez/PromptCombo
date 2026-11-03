/* Copia de texto con Clipboard API y fallback para contextos restringidos. */
export async function copyText(text) {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback controlado.
    }
  }

  const activeElement = document.activeElement;
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.setAttribute('aria-hidden', 'true');
  area.style.position = 'fixed';
  area.style.top = '-1000px';
  area.style.left = '-1000px';
  area.style.opacity = '0';
  document.body.append(area);
  area.focus();
  area.select();

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  }

  area.remove();

  if (activeElement && typeof activeElement.focus === 'function' && activeElement.isConnected) {
    activeElement.focus({ preventScroll: true });
  }

  return copied;
}
