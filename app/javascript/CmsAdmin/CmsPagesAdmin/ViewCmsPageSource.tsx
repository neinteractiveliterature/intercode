import CmsPageForm from './CmsPageForm';
import usePageTitle from '../../usePageTitle';
import { Route } from './+types/ViewCmsPageSource';
import { CmsPageAdminQueryDocument } from './queries.generated';

export async function loader({ context, params: { id } }: Route.LoaderArgs) {
  const { data } = await context.client.query({ query: CmsPageAdminQueryDocument, variables: { id } });
  return data;
}

function ViewCmsPageSource({ loaderData: data }: Route.ComponentProps) {
  usePageTitle(`View “${data.cmsParent.cmsPage.name}” Source`);

  return (
    <CmsPageForm
      page={data.cmsParent.cmsPage}
      cmsLayouts={data.cmsParent.cmsLayouts}
      defaultLayout={data.cmsParent.defaultLayout}
      readOnly
    />
  );
}

export default ViewCmsPageSource;
