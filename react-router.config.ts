import type { Config } from '@react-router/dev/config';

// Framework mode, built as a static single-page app.
export default {
  appDirectory: 'app/javascript',
  buildDirectory: 'build/framework',
  ssr: false,
  future: {
    // Has the dev server scan every route module for dependencies when it starts. Otherwise Vite finds them as pages
    // are first visited, and reloads the whole page each time, which loses the navigation in progress.
    unstable_optimizeDeps: true,
  },
} satisfies Config;
