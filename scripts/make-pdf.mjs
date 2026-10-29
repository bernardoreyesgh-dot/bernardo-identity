// Exports the built guidelines page as one tall PDF page.
// Usage: npm run pdf   (runs the build first)
// Needs Google Chrome. Set CHROME_PATH if it is installed somewhere else.
import { createServer } from 'node:http';
import { readFile, access, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const outDir = join(root, 'exports');
const outFile = join(outDir, 'bernardo-reyes-identity.pdf');
const chrome = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const WIDTH = 1280;

const types = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.json': 'application/json',
};

await access(join(dist, 'index.html')).catch(() => {
  throw new Error('dist/index.html not found. Run `npm run build` first.');
});
await access(chrome).catch(() => {
  throw new Error(`Chrome not found at ${chrome}. Set CHROME_PATH to your Chrome binary.`);
});

const server = createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  let file = join(dist, path.endsWith('/') ? `${path}index.html` : path);
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
  await page.setViewport({ width: WIDTH, height: 900 });
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMediaType('print');
  const height = await page.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
  await mkdir(outDir, { recursive: true });
  await page.pdf({
    path: outFile,
    width: `${WIDTH}px`,
    height: `${height}px`,
    printBackground: true,
    pageRanges: '1',
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  console.log(`Wrote ${outFile} (one page, ${WIDTH} x ${height} px)`);
} finally {
  await browser.close();
  server.close();
}
