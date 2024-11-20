import type { Config } from '@react-router/dev/config';
import { fileURLToPath } from 'url';

export function absolutePath(relativePath: string) {
  return fileURLToPath(new URL(relativePath, import.meta.url));
}

export default {
  appDirectory: absolutePath('./app/javascript'),
} satisfies Config;
