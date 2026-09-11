// Optimizes the raster images used by the app: converts them to AVIF and WebP
// and generates screen-size variants so each page can serve the best image for
// the current viewport (responsive images via <picture>/srcset).
//
// Usage:            node scripts/optimize-images.mjs
// Override widths:  node scripts/optimize-images.mjs --widths 640,960,1280,1600
import { mkdir, readFile } from 'node:fs/promises';
import { dirname, parse } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = join(__dirname, '..', 'src', 'assets');

const args = process.argv.slice(2);
const widthsArg = args
  .find((a) => a.startsWith('--widths='))
  ?.split('=')[1];

// Responsive widths (px) generated for full-screen background images.
const RESPONSIVE_WIDTHS = widthsArg
  ? widthsArg.split(',').map(Number)
  : [640, 960, 1280, 1600];

// Files to optimize: skip the originals we keep as fallbacks, avoid re-encoding
// already-converted output, and only touch images actually used in the app.
const TARGETS = [
  {
    file: 'Backgoundimages/bg2.png',
    responsive: true,
    fallback: 'Backgoundimages/bg2.png',
  },
  {
    file: 'Backgoundimages/backgroundlight.jpeg',
    responsive: true,
    fallback: 'Backgoundimages/backgroundlight.jpeg',
  },
  {
    file: 'Backgoundimages/flight.png',
    responsive: false,
    fallback: 'Backgoundimages/flight.png',
  },
  {
    file: 'Backgoundimages/bg1.png',
    responsive: true,
    fallback: 'Backgoundimages/bg1.png',
  },
];

/** Converts one source image into responsive AVIF/WebP variants. */
async function optimize(meta) {
  const source = join(ASSETS_DIR, meta.file);
  const sourceMeta = await sharp(source).metadata();
  const { dir, name } = parse(meta.file);

  const outDir = join(ASSETS_DIR, dir);
  await mkdir(outDir, { recursive: true });

  const widths = meta.responsive
    ? RESPONSIVE_WIDTHS.filter((w) => w < (sourceMeta.width ?? 0)).concat(
        sourceMeta.width ?? 0,
      )
    : [sourceMeta.width ?? 0];

  const produced = [];
  for (const width of new Set(widths)) {
    const suffix = width === sourceMeta.width ? '' : `-${width}w`;
    for (const format of ['avif', 'webp']) {
      const out = join(outDir, `${name}${suffix}.${format}`);
      const before = (await readFile(out).catch(() => null))?.length ?? 0;
      await sharp(source)
        .resize({ width, withoutEnlargement: true })
        [format]({ quality: 75, effort: 6 })
        .toFile(out);
      const sizeKb = (await readFile(out)).length / 1024;
      produced.push({ out, width: `${width}w`, format, sizeKb });
      if (!before) {
        // Log only new/critical outputs; report details at the end.
      }
    }
  }

  const fallback = join(ASSETS_DIR, meta.fallback ?? meta.file);
  const originalKb = (await readFile(source)).length / 1024;
  return { source, fallback, originalKb, produced };
}

const results = [];
for (const meta of TARGETS) {
  results.push(await optimize(meta));
}

// Plain-text report so the savings are easy to scan in CI logs.
console.log('\n=== Image optimization report ===');
for (const r of results) {
  console.log(`\n${r.source}`);
  console.log(
    `  original (${r.fallback.split('/').pop()}): ${r.originalKb.toFixed(
      0,
    )} KB`,
  );
  for (const p of r.produced) {
    const saving = Math.max(0, 1 - p.sizeKb / r.originalKb);
    console.log(
      `  ${p.out.split('/').pop().padEnd(32)} ${p.width.padStart(
        6,
      )}  ${p.format.padEnd(5)} ${p.sizeKb.toFixed(1).padStart(7)} KB  (${(
        saving * 100
      ).toFixed(0)}% smaller)`,
    );
  }
}
console.log(
  `\nTotal optimized bytes: ${(results
    .flatMap((r) => r.produced)
    .reduce((s, p) => s + p.sizeKb, 0) / 1024).toFixed(1)} MB`,
);
console.log(
  `Original bytes: ${(results
    .map((r) => r.originalKb)
    .reduce((add, kb) => add + kb, 0) / 1024).toFixed(1)} MB`,
);