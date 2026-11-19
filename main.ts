// Leonida Legend — GTA VI trophy guide entry (Node 22, standard library only).
// The guide itself is plain static files under app/ (index.html, style.css,
// app.js and app/data/trophies.json): it opens in a desktop browser with the
// network off and loads nothing from outside app/. This program hands the
// entry in: it copies app/ and screenshots/ from beside this file to /output
// and writes /output/dossier.json with the vendored make.fun library, which
// the scorer rebuilds and compares byte for byte — so vendor/ stays untouched.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// Caps from the competition's gate: at most 4 screenshots, each at most
// 256 KiB; app/ at most 993 files and directories and 48 MiB in all.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
