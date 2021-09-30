export default function htmlFetch(
  url: string,
  { headers, ...otherProps }: RequestInit,
): ReturnType<typeof fetch> {
  const csrfToken = document.querySelector<HTMLMetaElement>('meta[name=csrf-token]')?.content;
  return fetch(url, {
    headers: {
      Accept: 'text/html',
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      ...headers,
    },
    ...otherProps,
  });
}
