// Leonida Trophy Guide — the program that hands the entry in (Node 22,
// standard library only). It copies this folder's app/ and screenshots/
// into the output directory and writes /output/dossier.json with the
// vendored make.fun library, which is the summary the judge reads: the
// screenshots, the files a first load fetches, and the app's own source.
//
// The output directory is /output inside the grader; outside it, set
// MAKEFUN_OUTPUT_DIR to a folder of your own:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Copy a directory tree by hand, so the result is exactly the files in
// the source tree and nothing else (no symlinks, no extra entries).
function copyTree(from, to) {
  mkdirSync(to, { recursive: true });
  for (const name of readdirSync(from)) {
    const src = join(from, name);
    const dst = join(to, name);
    if (statSync(src).isDirectory()) copyTree(src, dst);
    else copyFileSync(src, dst);
  }
}

mkdirSync(outDir, { recursive: true });
copyTree(join(here, 'app'), join(outDir, 'app'));
if (existsSync(join(here, 'screenshots'))) {
  copyTree(join(here, 'screenshots'), join(outDir, 'screenshots'));
}

// The scorer's own caps for this bounty (from its gate.json). Only
// text_max_bytes shapes the dossier's bytes; the others refuse an entry
// the scorer would refuse — more than 4 screenshots, one over 256 KiB,
// more than 993 files and directories in app/, or 48 MiB of app files.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
