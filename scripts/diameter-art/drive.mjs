// usage: node drive.mjs probe <model...>   |   node drive.mjs render <cfg.json> <outDir>
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const [mode, ...args] = process.argv.slice(2);
const SPORT = 5199;
const server = spawn(process.execPath, [join(HERE, 'serve.mjs'), String(SPORT)], { stdio: 'ignore' });
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9600 + Math.floor(Math.random() * 50);
const profile = join(process.env.TEMP || '.', 'mg-r3-' + Date.now());
mkdirSync(profile, { recursive: true });
const chrome = spawn(CHROME, [`--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--headless=new', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--window-size=1000,700', '--no-first-run', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) { await sleep(200); try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === 'page'); } catch {} }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => { const m = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (m.result?.exceptionDetails) throw new Error(JSON.stringify(m.result.exceptionDetails).slice(0, 600)); return m.result?.result?.value; };
await send('Runtime.enable');
await send('Page.enable');
await send('Page.navigate', { url: `http://localhost:${SPORT}/` });
for (let i = 0; i < 50; i++) { await sleep(200); if (await ev('window.ready === true').catch(() => false)) break; }
try {
  if (mode === 'probe') {
    for (const m of args) console.log(m, JSON.stringify(await ev(`probe(${JSON.stringify(m)})`), null, 1));
  } else {
    const cfgs = JSON.parse(readFileSync(args[0], 'utf8'));
    const out = args[1]; mkdirSync(out, { recursive: true });
    const meta = {};
    for (const cfg of cfgs) {
      const r = await ev(`renderLevel(${JSON.stringify(cfg)})`);
      const save = (name, url) => writeFileSync(join(out, name), Buffer.from(url.split(',')[1], 'base64'));
      save(`${cfg.id}-full.png`, r.full); save(`${cfg.id}-grey.png`, r.grey);
      meta[cfg.id] = {};
      for (const [pid, p] of Object.entries(r.parts)) { save(`${cfg.id}-${pid}.png`, p.png); meta[cfg.id][pid] = { box: p.box, meshes: p.n }; }
      console.log(cfg.id, JSON.stringify(meta[cfg.id]));
    }
    writeFileSync(join(out, 'meta.json'), JSON.stringify(meta, null, 1));
  }
} finally { ws.close(); chrome.kill(); server.kill(); }
process.exit(0);
