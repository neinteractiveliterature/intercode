import { MiddlewareFunction } from 'react-router';
import { apolloClientContext, appRootDataContext } from 'AppContexts';
import { AppRootLayoutQueryDocument, AppRootQueryDocument } from './appRootQueries.generated';
import { normalizePathForLayout } from './normalizePathForLayout';

// Starts loading the data every page needs and puts the promise in the router context, for the guards and loaders that
// need it to await. It doesn't wait for the data itself: the router starts no loader until all middleware has returned,
// so waiting here would put every page's own queries a round trip behind this one.
export const appRootMiddleware: MiddlewareFunction = async ({ context, request }) => {
  const client = context.get(apolloClientContext);

  // Some routes have middleware of their own that waits for data (such as redirectToFirstDayMiddleware), which holds
  // back every loader, so start the layout query here rather than leaving it to AppRootLayout's loader. That loader's
  // request for the same query joins this one (or reads the cache), and any failure here is left for it to report.
  client
    .query({
      query: AppRootLayoutQueryDocument,
      variables: { path: normalizePathForLayout(new URL(request.url).pathname) },
    })
    .catch(() => {});

  const appRootData = client.query({ query: AppRootQueryDocument }).then(({ data }) => data);
  // AppRoot's loader reports a failure; this is for when no guard or loader has awaited the promise yet
  appRootData.catch(() => {});
  context.set(appRootDataContext, appRootData);
};
