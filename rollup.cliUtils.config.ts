import { defineConfig } from 'rollup';
import swc from '@rollup/plugin-swc';
import commonjs from '@rollup/plugin-commonjs';
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
    swc(),
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
