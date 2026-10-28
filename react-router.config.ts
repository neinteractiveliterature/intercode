import type { Config } from '@react-router/dev/config';

// Framework mode, built as a static single-page app. This is only used by `yarn build:framework`
// (vite.framework.config.mts); the production build is still vite.config.mts.
export default {
  appDirectory: 'app/javascript/framework',
  buildDirectory: 'build/framework',
  ssr: false,
  future: {
    v8_middleware: true,
  },
} satisfies Config;
