import { destroySession } from 'sessions';
import { Route } from './+types/sign_out';
import { redirect } from 'react-router';
import { getBackendBaseUrl } from 'getBackendBaseUrl';
import { apolloClientContext, authenticityTokensManagerContext, fetchContext, sessionContext } from 'AppContexts';

export async function action({ request, context }: Route.ActionArgs) {
  if (request.method !== 'DELETE') {
    throw new Response('Not Found', { status: 404 });
  }

  const tokens = await context.get(authenticityTokensManagerContext).getTokens();
  const response = await context.get(fetchContext)(new URL('/users/sign_out', getBackendBaseUrl()), {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      cookie: request.headers.get('cookie') ?? '',
      'X-CSRF-Token': tokens.signOut ?? '',
    },
  });

  if (!response.ok) {
    const responseJson = await response.json();
    throw new Error(responseJson.error);
  }

  await context.get(apolloClientContext).resetStore();

  const session = context.get(sessionContext);
  const headers: HeadersInit = {};
  if (session) {
    headers['Set-Cookie'] = await destroySession(session);
  }

  return redirect('/', { headers });
}
