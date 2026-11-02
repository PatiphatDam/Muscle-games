// Writes src/muscle-games/airship.svg, the raider balloon (AirshipShapes in art.jsx) as one picture file. Balloon Pop
// shows it as an image, so the browser draws it once and reuses it for every balloon instead of rebuilding the
// drawing for each one each round. Run it after changing AirshipShapes:  node scripts/airship-svg.mjs
import { build } from 'esbuild';
import { rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = join(tmpdir(), `airship-${Date.now()}.cjs`);
await build({
  stdin: {
    contents: `
      import { renderToStaticMarkup } from 'react-dom/server';
      import { AirshipShapes } from './src/muscle-games/art.jsx';
      // The drawing spills past its 120 x 172 box (the flag on top, the ribbons and the spike), so the picture's box
      // is taller: 12 units more above and 6 below. BalloonPop's CSS (.mg-air) places it to match.
      module.exports = renderToStaticMarkup(
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -12 120 190"><AirshipShapes /></svg>
      );`,
    loader: 'jsx',
    resolveDir: root,
  },
  bundle: true,
  outfile: out,
  format: 'cjs',
  platform: 'node',
  jsx: 'automatic',
  loader: { '.png': 'empty', '.svg': 'empty', '.css': 'empty' },
  logLevel: 'error',
});
const svg = `${createRequire(import.meta.url)(out)}\n`;
rmSync(out);
writeFileSync(new URL('../src/muscle-games/airship.svg', import.meta.url), svg);
console.log(`airship.svg: ${svg.length} bytes`);
