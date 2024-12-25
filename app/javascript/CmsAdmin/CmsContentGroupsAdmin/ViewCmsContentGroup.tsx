import usePageTitle from '../../usePageTitle';
import CmsContentGroupFormFields from './CmsContentGroupFormFields';
import { Route } from './+types/ViewCmsContentGroup';
import { CmsContentGroupAdminQueryDocument } from './queries.generated';

export async function loader({ context, params: { id } }: Route.LoaderArgs) {
  const { data } = await context.client.query({ query: CmsContentGroupAdminQueryDocument, variables: { id } });
  return data;
}

function ViewCmsContentGroup({ loaderData: data }: Route.ComponentProps): JSX.Element {
  const contentGroup = data.cmsParent.cmsContentGroup;
  usePageTitle(contentGroup.name);

  return (
    <>
      <h3 className="mb-4">{contentGroup.name}</h3>

      <CmsContentGroupFormFields contentGroup={contentGroup} convention={data.convention} readOnly />
    </>
  );
}

export default ViewCmsContentGroup;
