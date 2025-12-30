import { LoaderFunction, RouterContextProvider } from 'react-router';
import { apolloClientContext } from '~/AppContexts';
import { conventionDayLoader } from '../conventionDayUrls';

export const clientLoader: LoaderFunction<RouterContextProvider> = async ({ params, request, context }) => {
  const client = context.get(apolloClientContext);
  return conventionDayLoader(client, { params, request });
};
