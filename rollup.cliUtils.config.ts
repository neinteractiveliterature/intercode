import { defineConfig } from 'rollup';
import swc from '@rollup/plugin-swc';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

export default defineConfig({
  plugins: [commonjs(), nodeResolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }), swc()],
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
