import { getBackendBaseUrl } from 'getBackendBaseUrl';
import { Route } from './+types/sign_in';
import { data } from 'react-router';

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const tokens = await context.authenticityTokensManager.getTokens();
  const cookie = request.headers.get('cookie');

  const response = await context.fetch(new URL('/users/sign_in', getBackendBaseUrl()), {
    method: 'POST',
    body: formData,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'X-CSRF-Token': tokens.signIn ?? '',
      ...(cookie ? { cookie } : {}),
    },
  });

  if (!response.ok) {
    if (response.headers.get('Content-type')?.startsWith('application/json')) {
      return new Error((await response.json()).error || response.statusText);
    }

    return new Error((await response.text()) || response.statusText);
  }

  await context.client.resetStore();

  return data(response.headers.get('location') ?? response.url);
}
