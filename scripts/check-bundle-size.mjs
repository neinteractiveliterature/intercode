#!/usr/bin/env node
// Checks the gzip size of all JS/CSS assets in the initial page load against a
// budget. The entry file (application.js) embeds the full preload list in its
// __vite__mapDeps array, so we parse that instead of requiring a Vite manifest.
//
// Without a large eagerly-loaded dependency like Monaco editor, the initial
// payload is well under 500 KB compressed. With Monaco in the initial bundle
// (the regression this guards against), it exceeds 900 KB. The threshold is
// intentionally set between those two states with headroom on each side.

import { readFileSync } from 'fs';
import { createGzip } from 'zlib';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PACKS_DIR = join(ROOT, 'public', 'packs');
const ENTRY_FILE = join(PACKS_DIR, 'application.js');
const THRESHOLD_BYTES = 700_000;

const entrySource = readFileSync(ENTRY_FILE, 'utf8');

// Extract asset paths from the __vite__mapDeps inline array in the entry file.
const assetPaths = [...entrySource.matchAll(/"(assets\/[^"]+)"/g)].map((m) => m[1]);

if (assetPaths.length === 0) {
  console.error('ERROR: No asset paths found in application.js — has the build format changed?');
  process.exit(1);
}

async function gzippedSize(filePath) {
  const content = readFileSync(filePath);
  let bytes = 0;
  await pipeline(
    Readable.from(content),
    createGzip(),
    async function* (source) {
      for await (const chunk of source) bytes += chunk.length;
    },
  );
  return bytes;
}

function humanBytes(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1_048_576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1_048_576).toFixed(2)} MB`;
}

const results = [];
let totalBytes = 0;

for (const asset of assetPaths) {
  const size = await gzippedSize(join(PACKS_DIR, asset));
  totalBytes += size;
  results.push({ asset, size });
}

// Include the entry file itself (tiny, but complete the picture)
const entrySize = await gzippedSize(ENTRY_FILE);
totalBytes += entrySize;
results.push({ asset: 'application.js', size: entrySize });

results.sort((a, b) => b.size - a.size);

console.log(`Initial load files (${results.length} total):`);
for (const { asset, size } of results.slice(0, 15)) {
  console.log(`  ${humanBytes(size).padStart(10)}  ${asset}`);
}
if (results.length > 15) console.log(`  ... and ${results.length - 15} smaller files`);

console.log(`\nTotal compressed: ${humanBytes(totalBytes)} (limit: ${humanBytes(THRESHOLD_BYTES)})`);

if (totalBytes > THRESHOLD_BYTES) {
  console.error(
    `\nFAIL: Initial JS + CSS payload is ${humanBytes(totalBytes - THRESHOLD_BYTES)} over budget.`,
  );
  console.error('A large dependency may have snuck into the initial bundle.');
  process.exit(1);
} else {
  console.log(`PASS (${humanBytes(THRESHOLD_BYTES - totalBytes)} headroom)`);
}
