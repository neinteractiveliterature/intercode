import { apolloClientContext } from '~/AppContexts';
import { conventionDayLoader } from '../conventionDayUrls';
import { Route } from './+types/index';

export const clientLoader = async ({ params, request, context }: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  return conventionDayLoader(client, { params, request });
};
