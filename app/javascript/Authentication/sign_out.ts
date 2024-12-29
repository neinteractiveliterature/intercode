import { destroySession } from 'sessions';
import { Route } from './+types/sign_out';
import { redirect } from 'react-router';
import { getBackendBaseUrl } from 'getBackendBaseUrl';

export async function action({ request, context }: Route.ActionArgs) {
  console.log(request.method);
  if (request.method !== 'DELETE') {
    throw new Response('Not Found', { status: 404 });
  }

  const tokens = await context.authenticityTokensManager.getTokens();
  const response = await context.fetch(new URL('/users/sign_out', getBackendBaseUrl()), {
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

  await context.client.resetStore();
  const setCookie = await destroySession(context.session);

  return redirect('/', { headers: { 'Set-Cookie': setCookie } });
}
