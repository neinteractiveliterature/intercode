import fetch from 'unfetch';

export default function htmlFetch(url, { headers, ...otherProps }) {
  const csrfToken = document.querySelector('meta[name=csrf-token]').content;
  return fetch(url, {
    headers: {
      Accept: 'text/html',
      'X-CSRF-Token': csrfToken,
      ...headers,
    },
    ...otherProps,
  });
}
