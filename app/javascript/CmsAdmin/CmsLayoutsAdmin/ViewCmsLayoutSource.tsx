import CmsLayoutForm from './CmsLayoutForm';
import usePageTitle from '../../usePageTitle';
import { Route } from './+types/ViewCmsLayoutSource';
import { CmsLayoutAdminQueryDocument } from './queries.generated';
import { apolloClientContext } from 'AppContexts';

export async function loader({ context, params: { id } }: Route.LoaderArgs) {
  const { data } = await context
    .get(apolloClientContext)
    .query({ query: CmsLayoutAdminQueryDocument, variables: { id } });
  return data;
}

function ViewCmsLayoutSource({
  loaderData: {
    cmsParent: { cmsLayout },
  },
}: Route.ComponentProps) {
  usePageTitle(`View “${cmsLayout.name}” Source`);
  return <CmsLayoutForm layout={cmsLayout} readOnly />;
}

export default ViewCmsLayoutSource;
