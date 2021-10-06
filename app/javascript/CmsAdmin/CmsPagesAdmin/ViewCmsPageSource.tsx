import CmsPageForm from './CmsPageForm';
import usePageTitle from '../../usePageTitle';
import { LoadSingleValueFromCollectionWrapper } from '../../GraphqlLoadingWrappers';
import { useCmsPagesAdminQuery } from './queries.generated';

export default LoadSingleValueFromCollectionWrapper(
  useCmsPagesAdminQuery,
  (data, id) => data.cmsParent.cmsPages.find((p) => id === p.id),
  function ViewCmsPageSource({ value: page, data }) {
    usePageTitle(`View “${page.name}” Source`);

    return <CmsPageForm page={page} cmsLayouts={data.cmsParent.cmsLayouts} cmsParent={data.cmsParent} readOnly />;
  },
);
