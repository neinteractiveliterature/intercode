import type { Config } from '@react-router/dev/config';
import type { Future } from 'react-router';
import { fileURLToPath } from 'url';

declare module 'react-router' {
  interface Future {
    unstable_middleware: true; // 👈 Enable middleware types
  }
}

export function absolutePath(relativePath: string) {
  return fileURLToPath(new URL(relativePath, import.meta.url));
}

export default {
  appDirectory: absolutePath('./app/javascript'),
  future: {
    unstable_middleware: true, // 👈 Enable middleware
  },
} satisfies Config;
