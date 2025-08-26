import usePageTitle from '../../usePageTitle';
import CmsContentGroupFormFields from './CmsContentGroupFormFields';
import { useLoaderData } from 'react-router';
import { singleCmsContentGroupAdminLoader, SingleCmsContentGroupAdminLoaderResult } from './loaders';

export const loader = singleCmsContentGroupAdminLoader;

function ViewCmsContentGroup(): React.JSX.Element {
  const { data, contentGroup } = useLoaderData() as SingleCmsContentGroupAdminLoaderResult;
  usePageTitle(contentGroup.name);

  return (
    <>
      <h3 className="mb-4">{contentGroup.name}</h3>

      <CmsContentGroupFormFields contentGroup={contentGroup} convention={data.convention} readOnly />
    </>
  );
}

export const Component = ViewCmsContentGroup;
