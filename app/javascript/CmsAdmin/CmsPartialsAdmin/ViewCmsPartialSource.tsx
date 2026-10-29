import CmsPartialForm from './CmsPartialForm';
import usePageTitle from '../../usePageTitle';
import { singleCmsPartialAdminLoader } from './loaders';
import { useLoaderData } from 'react-router';

export const clientLoader = singleCmsPartialAdminLoader;

function ViewCmsPartialSource() {
  const { partial } = useLoaderData<typeof clientLoader>();
  usePageTitle(`Viewing “${partial.name}” Source`);
  return <CmsPartialForm partial={partial} readOnly />;
}

export default ViewCmsPartialSource;
