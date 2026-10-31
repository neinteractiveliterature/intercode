#!/usr/bin/env node
// Checks the gzip size of all JS/CSS assets in the initial page load against a
// budget. The initial page load is whatever the shell (index.html in the
// framework-mode build) preloads or links, so we read that.
//
// Without a large eagerly-loaded dependency like Monaco editor, the initial
// payload is well under the budget. With Monaco in the initial bundle (the
// regression this guards against), it is far over. The threshold is
// intentionally set between those two states with headroom on each side.
//
// Run after `yarn build:framework`.

import { readFileSync } from 'fs';
import { createGzip } from 'zlib';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BUILD_DIR = join(ROOT, 'build', 'framework', 'client');
const INDEX_FILE = join(BUILD_DIR, 'index.html');
const THRESHOLD_BYTES = 700_000;

const indexSource = readFileSync(INDEX_FILE, 'utf8');

// The files the shell preloads, links as stylesheets or loads as scripts. Their URLs are built against a placeholder
// asset host (see vite.framework.config.mts), which stands for the root of the build directory.
const assetPaths = [
  ...new Set(
    [...indexSource.matchAll(/<(?:link|script)\b[^>]*?\b(?:href|src)="[^"]*?\/(assets\/[^"#?]+)/g)].map((m) => m[1]),
  ),
];

if (assetPaths.length === 0) {
  console.error('ERROR: No asset paths found in index.html — has the build format changed?');
  process.exit(1);
}

async function gzippedSize(filePath) {
  const content = readFileSync(filePath);
  let bytes = 0;
  await pipeline(Readable.from(content), createGzip(), async function* (source) {
    for await (const chunk of source) bytes += chunk.length;
  });
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
  const size = await gzippedSize(join(BUILD_DIR, asset));
  totalBytes += size;
  results.push({ asset, size });
}

results.sort((a, b) => b.size - a.size);

console.log(`Initial load files (${results.length} total):`);
for (const { asset, size } of results.slice(0, 15)) {
  console.log(`  ${humanBytes(size).padStart(10)}  ${asset}`);
}
if (results.length > 15) console.log(`  ... and ${results.length - 15} smaller files`);

console.log(`\nTotal compressed: ${humanBytes(totalBytes)} (limit: ${humanBytes(THRESHOLD_BYTES)})`);

if (totalBytes > THRESHOLD_BYTES) {
  console.error(`\nFAIL: Initial JS + CSS payload is ${humanBytes(totalBytes - THRESHOLD_BYTES)} over budget.`);
  console.error('A large dependency may have snuck into the initial bundle.');
  process.exit(1);
} else {
  console.log(`PASS (${humanBytes(THRESHOLD_BYTES - totalBytes)} headroom)`);
}
