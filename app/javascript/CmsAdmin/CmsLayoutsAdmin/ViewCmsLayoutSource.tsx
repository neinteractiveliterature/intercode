import CmsLayoutForm from './CmsLayoutForm';
import usePageTitle from '../../usePageTitle';
import { singleCmsLayoutAdminLoader, SingleCmsLayoutAdminLoaderResult } from './loaders';
import { useLoaderData } from 'react-router';

export const loader = singleCmsLayoutAdminLoader;

function ViewCmsLayoutSource() {
  const { layout: value } = useLoaderData() as SingleCmsLayoutAdminLoaderResult;
  usePageTitle(`View “${value.name}” Source`);
  return <CmsLayoutForm layout={value} readOnly />;
}

export const Component = ViewCmsLayoutSource;
