import { MiddlewareFunction } from 'react-router';
import { apolloClientContext, appRootDataContext } from 'AppContexts';
import { AppRootLayoutQueryDocument, AppRootQueryDocument } from './appRootQueries.generated';
import { normalizePathForLayout } from './normalizePathForLayout';

// Loads the data every page needs and puts it in the router context for the other middleware and loaders.
export const appRootMiddleware: MiddlewareFunction = async ({ context, request }) => {
  const client = context.get(apolloClientContext);

  // AppRootLayout's loader needs only the URL path, not the app root data, but the router runs all middleware before it
  // starts any loader. Start its query now so it overlaps with AppRootQuery instead of waiting for it. The loader's own
  // request for the same query joins this one (or reads the cache), and any failure here is left for the loader to report.
  client
    .query({
      query: AppRootLayoutQueryDocument,
      variables: { path: normalizePathForLayout(new URL(request.url).pathname) },
    })
    .catch(() => {});

  const { data } = await client.query({ query: AppRootQueryDocument });
  if (data) {
    context.set(appRootDataContext, data);
  }
};
