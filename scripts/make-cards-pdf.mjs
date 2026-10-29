// Exports the business cards as a print PDF: one card per page at 3.5 x 2 in.
// Usage: npm run cards-pdf   (runs the build first)
import { createServer } from 'node:http';
import { readFile, access, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const outFile = join(root, 'exports', 'bernardo-reyes-business-cards.pdf');
const chrome = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = '/bernardo-identity';

const types = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.json': 'application/json',
};

await access(join(dist, 'cards', 'index.html')).catch(() => {
  throw new Error('dist/cards/index.html not found. Run `npm run build` first.');
});
await access(chrome).catch(() => {
  throw new Error(`Chrome not found at ${chrome}. Set CHROME_PATH to your Chrome binary.`);
});

const server = createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (path.startsWith(BASE)) path = path.slice(BASE.length) || '/';
  const file = join(dist, path.endsWith('/') ? `${path}index.html` : path);
  let body;
  try {
    body = await readFile(file);
  } catch {
    res.writeHead(404).end('Not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
  res.end(body);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();

const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}${BASE}/cards/`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMediaType('print');
  await mkdir(join(root, 'exports'), { recursive: true });
  await page.pdf({ path: outFile, preferCSSPageSize: true, printBackground: true });
  console.log(`Wrote ${outFile}`);
} finally {
  await browser.close();
  server.close();
}
