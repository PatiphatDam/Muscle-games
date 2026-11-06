// tiny static server: / -> this folder, /nm/ -> main-site node_modules, /models/ -> main-site public/models
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = 'C:/Users/dam23/Seminar_Projest-sync';
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.glb': 'model/gltf-binary', '.wasm': 'application/wasm' };
createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let file;
  if (url.startsWith('/nm/')) file = join(SITE, 'node_modules', url.slice(4));
  else if (url.startsWith('/models/')) file = join(SITE, 'public', url);
  else file = join(HERE, url === '/' ? 'render.html' : url);
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404); res.end('not found');
  }
}).listen(+process.argv[2] || 5199);
