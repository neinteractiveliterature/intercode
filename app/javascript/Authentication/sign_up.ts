import { Route } from './+types/sign_up';
import { data } from 'react-router';
import humanize from 'humanize';
import arrayToSentence from 'array-to-sentence';
import { getBackendBaseUrl } from 'getBackendBaseUrl';

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const tokens = await context.authenticityTokensManager.getTokens();

  const response = await context.fetch(new URL('/users', getBackendBaseUrl()), {
    method: 'POST',
    body: formData,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'X-CSRF-Token': tokens.signUp ?? '',
    },
  });

  if (!response.ok) {
    const responseJson = await response.json();
    if (responseJson.errors) {
      throw new Error(
        Object.entries(responseJson.errors)
          .map(([key, errors]) => `${humanize(key)} ${Array.isArray(errors) ? arrayToSentence(errors) : errors}`)
          .join(', '),
      );
    } else if (responseJson.error) {
      throw new Error((await response.json()).error);
    }

    throw new Error(response.statusText);
  }

  await context.authenticityTokensManager.refresh();
  await context.client.clearStore();

  return data(null);
}
