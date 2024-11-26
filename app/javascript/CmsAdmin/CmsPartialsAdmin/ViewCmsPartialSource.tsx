import CmsPartialForm from './CmsPartialForm';
import usePageTitle from '../../usePageTitle';
import { singleCmsPartialAdminLoader, SingleCmsPartialAdminLoaderResult } from './loaders';
import { useLoaderData } from 'react-router';

export const loader = singleCmsPartialAdminLoader;

function ViewCmsPartialSource() {
  const { partial } = useLoaderData() as SingleCmsPartialAdminLoaderResult;
  usePageTitle(`Viewing “${partial.name}” Source`);
  return <CmsPartialForm partial={partial} readOnly />;
}

export default ViewCmsPartialSource;
