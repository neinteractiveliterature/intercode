/**
 * Verifies that GraphQL document constants from *.generated.ts files are present
 * in the production build output. Run after `yarn build:web`.
 *
 * GraphQL operation names (e.g. "AppRootQuery") are embedded as string literals
 * in the serialized document AST and survive minification, making them a reliable
 * signal for whether a document constant was tree-shaken away.
 *
 * Usage: yarn check-graphql-documents
 */
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

// Operations that are defined in generated files but not reachable from any
// entry point — legitimately absent from the build. Update this list only when
// you intentionally add or remove dead-code operations.
const KNOWN_ABSENT: ReadonlySet<string> = new Set<string>();

async function findFiles(dir: string, suffix: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(suffix))
    .map((e) => join(e.parentPath ?? e.path, e.name));
}

async function main() {
  const root = new URL('..', import.meta.url).pathname;

  // Collect all operation names from generated source files.
  const sourceFiles = await findFiles(join(root, 'app/javascript'), '.generated.ts');
  const sourceOperations = new Set<string>();
  for (const file of sourceFiles) {
    const content = await readFile(file, 'utf-8');
    for (const match of content.matchAll(/"name":\{"kind":"Name","value":"([A-Z]\w+)"\}/g)) {
      sourceOperations.add(match[1]);
    }
  }

  // Combine all built JS chunks into one searchable string.
  const assetsDir = join(root, 'public/packs/assets');
  const builtFiles = await findFiles(assetsDir, '.js');
  if (builtFiles.length === 0) {
    console.error('No built files found in public/packs/assets/. Run yarn build:web first.');
    process.exit(1);
  }
  const builtContent = (await Promise.all(builtFiles.map((f) => readFile(f, 'utf-8')))).join('');

  // An operation name is "present" if it appears as a value in the serialized AST.
  const isPresent = (name: string) =>
    builtContent.includes(`value:\`${name}\``) ||
    builtContent.includes(`value:"${name}"`) ||
    builtContent.includes(`value:'${name}'`);

  const unexpectedlyMissing: string[] = [];
  const unexpectedlyPresent: string[] = [];

  for (const name of [...sourceOperations].sort()) {
    const present = isPresent(name);
    const knownAbsent = KNOWN_ABSENT.has(name);
    if (!present && !knownAbsent) unexpectedlyMissing.push(name);
    if (present && knownAbsent) unexpectedlyPresent.push(name);
  }

  if (unexpectedlyPresent.length > 0) {
    console.warn(
      `\nOperations in KNOWN_ABSENT that are now present (remove from allowlist):\n` +
        unexpectedlyPresent.map((n) => `  ${n}`).join('\n'),
    );
  }

  if (unexpectedlyMissing.length > 0) {
    console.error(
      `\n✗ ${unexpectedlyMissing.length} operation(s) missing from build (possible tree-shaking regression):\n` +
        unexpectedlyMissing.map((n) => `  ${n}`).join('\n'),
    );
    process.exit(1);
  }

  const checkedCount = sourceOperations.size - KNOWN_ABSENT.size;
  console.log(`✓ All ${checkedCount} expected GraphQL operations present in build output.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
