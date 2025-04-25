import { getBackendBaseUrl } from 'getBackendBaseUrl';
import { Route } from './+types/sign_in';
import { data } from 'react-router';
import { apolloClientContext, authenticityTokensManagerContext, fetchContext } from 'AppContexts';

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const tokens = await context.get(authenticityTokensManagerContext).getTokens();
  const cookie = request.headers.get('cookie');

  const response = await context.get(fetchContext)(new URL('/users/sign_in', getBackendBaseUrl()), {
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

  await context.get(authenticityTokensManagerContext).refresh();
  await context.get(apolloClientContext).clearStore();

  return data(response.headers.get('location') ?? response.url);
}
