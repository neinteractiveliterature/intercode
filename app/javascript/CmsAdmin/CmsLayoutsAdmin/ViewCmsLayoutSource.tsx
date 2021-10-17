import CmsLayoutForm from './CmsLayoutForm';
import usePageTitle from '../../usePageTitle';
import { LoadSingleValueFromCollectionWrapper } from '../../GraphqlLoadingWrappers';
import { useCmsLayoutsAdminQuery } from './queries.generated';

export default LoadSingleValueFromCollectionWrapper(
  useCmsLayoutsAdminQuery,
  (data, id) => data.cmsParent.cmsLayouts.find((layout) => layout.id.toString() === id),
  function ViewCmsLayoutSource({ value }) {
    usePageTitle(`View “${value.name}” Source`);
    return <CmsLayoutForm layout={value} readOnly />;
  },
);
