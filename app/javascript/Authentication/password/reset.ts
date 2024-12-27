import { data } from 'react-router';
import { Route } from './+types/reset';
import { getBackendBaseUrl } from 'getBackendBaseUrl';
import humanize from 'humanize';

function parseRailsErrorHash(errors: Record<string, string[]> | undefined) {
  if (!errors) {
    return undefined;
  }

  return Object.entries(errors)
    .flatMap(([key, keyErrors]) => keyErrors.map((keyError) => `${humanize(key)} ${keyError}`))
    .join(', ');
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const tokens = await context.authenticityTokensManager.getTokens();

  const response = await context.fetch(new URL('/users/password', getBackendBaseUrl()), {
    method: 'POST',
    body: formData,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'X-CSRF-Token': tokens.resetPassword ?? '',
    },
  });

  const responseJson = await response.json();

  if (!response.ok) {
    throw new Error(responseJson.error ?? parseRailsErrorHash(responseJson.errors) ?? response.statusText);
  }

  await context.client.resetStore();

  return data(responseJson);
}
