// Color math for the guidelines page. Values are computed at build time,
// so the page always matches the tokens in tokens/color.json.

export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

// WCAG relative luminance.
export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// WCAG contrast ratio between two colors, from 1 to 21.
export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// WCAG AA: 4.5:1 for normal text, 3:1 for large text (24px, or 18.66px bold, and up).
export function rating(ratio) {
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'Large only';
  return 'Fail';
}

// Simple RGB to CMYK conversion. Approximate: confirm with a printer proof.
export function rgbToCmyk(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const pct = (v) => Math.round(v * 100);
  return {
    c: pct((1 - r - k) / (1 - k)),
    m: pct((1 - g - k) / (1 - k)),
    y: pct((1 - b - k) / (1 - k)),
    k: pct(k),
  };
}
