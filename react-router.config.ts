import type { Config } from '@react-router/dev/config';

export default {
  appDirectory: 'app/javascript',
  ssr: false,
  future: {
    v8_middleware: true,
  },
} satisfies Config;
