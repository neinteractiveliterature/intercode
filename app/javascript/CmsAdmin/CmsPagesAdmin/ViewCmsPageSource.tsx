import CmsPageForm from './CmsPageForm';
import usePageTitle from '../../usePageTitle';
import { singleCmsPageAdminLoader, SingleCmsPageAdminLoaderResult } from './loaders';
import { useLoaderData } from 'react-router';

export const loader = singleCmsPageAdminLoader;

function ViewCmsPageSource() {
  const { page, data } = useLoaderData() as SingleCmsPageAdminLoaderResult;
  usePageTitle(`View “${page.name}” Source`);

  return <CmsPageForm page={page} cmsLayouts={data.cmsParent.cmsLayouts} cmsParent={data.cmsParent} readOnly />;
}

export const Component = ViewCmsPageSource;
