import CmsPartialForm from './CmsPartialForm';
import usePageTitle from '../../usePageTitle';
import { Route } from './+types/ViewCmsPartialSource';
import { CmsPartialAdminQueryDocument } from './queries.generated';
import { apolloClientContext } from 'AppContexts';

export async function loader({ context, params: { id } }: Route.LoaderArgs) {
  const { data } = await context
    .get(apolloClientContext)
    .query({ query: CmsPartialAdminQueryDocument, variables: { id } });
  return data;
}

function ViewCmsPartialSource({
  loaderData: {
    cmsParent: { cmsPartial: partial },
  },
}: Route.ComponentProps) {
  usePageTitle(`Viewing “${partial.name}” Source`);
  return <CmsPartialForm partial={partial} readOnly />;
}

export default ViewCmsPartialSource;
