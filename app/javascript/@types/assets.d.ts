declare module '*.svg' {
  const content: string;
  export default content;
}

declare module 'vite/modulepreload-polyfill';
