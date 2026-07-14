import { spawnSync } from 'node:child_process';
import { readFile, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { extname, join, resolve, sep } from 'node:path';
import { brotliCompress, constants, gzip } from 'node:zlib';
import { promisify } from 'node:util';

const port = 1313;
const host = '127.0.0.1';
const outputDir = join(tmpdir(), `wesole-nutki-lighthouse-${process.pid}`);
const compressBrotli = promisify(brotliCompress);
const compressGzip = promisify(gzip);

const build = spawnSync('hugo', [
  '--buildFuture',
  '--environment', 'production',
  '--minify',
  '--baseURL', `http://${host}:${port}/`,
  '--destination', outputDir,
], { stdio: 'inherit' });

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.toml': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
};

const compressible = new Set(['.css', '.html', '.js', '.json', '.svg', '.toml', '.webmanifest', '.xml']);

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url ?? '/', `http://${host}`).pathname);
    const relativePath = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
    const filePath = resolve(outputDir, `.${relativePath}`);

    if (filePath !== outputDir && !filePath.startsWith(`${outputDir}${sep}`)) {
      response.writeHead(403).end('Forbidden');
      return;
    }

    const extension = extname(filePath).toLowerCase();
    let body = await readFile(filePath);
    const headers = {
      'Cache-Control': 'no-store',
      'Content-Type': mimeTypes[extension] ?? 'application/octet-stream',
    };

    if (compressible.has(extension)) {
      const acceptedEncodings = request.headers['accept-encoding'] ?? '';
      if (acceptedEncodings.includes('br')) {
        body = await compressBrotli(body, {
          params: { [constants.BROTLI_PARAM_QUALITY]: 5 },
        });
        headers['Content-Encoding'] = 'br';
        headers.Vary = 'Accept-Encoding';
      } else if (acceptedEncodings.includes('gzip')) {
        body = await compressGzip(body);
        headers['Content-Encoding'] = 'gzip';
        headers.Vary = 'Accept-Encoding';
      }
    }

    headers['Content-Length'] = body.byteLength;
    response.writeHead(200, headers);
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    const status = error?.code === 'ENOENT' ? 404 : 500;
    response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(status === 404 ? 'Not found' : 'Server error');
  }
});

const shutdown = async () => {
  server.close();
  await rm(outputDir, { recursive: true, force: true });
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

server.listen(port, host, () => {
  console.log(`Audit server ready at http://${host}:${port}`);
});
