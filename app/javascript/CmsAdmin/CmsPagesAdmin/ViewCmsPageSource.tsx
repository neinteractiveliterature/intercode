import CmsPageForm from './CmsPageForm';
import usePageTitle from '../../usePageTitle';
import { singleCmsPageAdminLoader } from './loaders';
import { useLoaderData } from 'react-router';

export const clientLoader = singleCmsPageAdminLoader;

function ViewCmsPageSource() {
  const { page, data } = useLoaderData<typeof clientLoader>();
  usePageTitle(`View “${page.name}” Source`);

  return <CmsPageForm page={page} cmsLayouts={data.cmsParent.cmsLayouts} cmsParent={data.cmsParent} readOnly />;
}

export default ViewCmsPageSource;
