import { defineConfig } from 'rollup';
import swc from '@rollup/plugin-swc';
import commonjs from '@rollup/plugin-commonjs';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { globalDefines } from './globalDefines.mts';

const replaceConfig = Object.entries(globalDefines).reduce<Record<string, string>>(
  (memo, [key, value]) => ({
    ...memo,
    [`import.meta.env.${key}`]: value,
  }),
  {},
);

export default defineConfig({
  plugins: [
    replace({ ...replaceConfig, preventAssignment: true }),
    commonjs(),
    nodeResolve({
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      resolveOnly(module) {
        // commonjs plugin isn't liking the rollbar package, which we don't need in the CLI utils anyway
        return module !== 'rollbar';
      },
    }),
    // Bundle the translations that setupI18Next imports by language name. Left as a runtime import, the path is wrong
    // from ./bin, and every translation key (including the date formats) comes out untranslated.
    // json() has to come before swc, which can't parse JSON
    json(),
    // inputSourceMap: false works around @swc/core 1.15.8 panicking on missing source maps
    // from deps that reference .map files not included in their npm packages.
    // Remove once @swc/core restores the documented "silently discarded" behavior.
    swc({ swc: { inputSourceMap: false } }),
    // Has to come after swc, because it needs JavaScript rather than TypeScript
    dynamicImportVars({ errorWhenNoFilesFound: true }),
  ],
  input: {
    diffTranslations: './script/diffTranslations.ts',
    mergeTranslations: './script/mergeTranslations.ts',
    renderFormResponseChangeGroup: './script/renderFormResponseChangeGroup.tsx',
  },
  output: {
    format: 'cjs',
    entryFileNames: '[name].cjs',
    dir: './bin',
    interop: 'auto',
    chunkFileNames: 'chunks/[name]-[hash].js',
  },
});
