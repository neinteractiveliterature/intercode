import CmsLayoutForm from './CmsLayoutForm';
import usePageTitle from '../../usePageTitle';
import { LoadSingleValueFromCollectionWrapper } from '../../GraphqlLoadingWrappers';
import { useCmsLayoutsAdminQueryQuery } from './queries.generated';

export default LoadSingleValueFromCollectionWrapper(
  useCmsLayoutsAdminQueryQuery,
  (data, id) => data.cmsLayouts.find((layout) => layout.id.toString() === id),
  function ViewCmsLayoutSource({ value }) {
    usePageTitle(`View “${value.name}” Source`);
    return <CmsLayoutForm layout={value} readOnly />;
  },
);
