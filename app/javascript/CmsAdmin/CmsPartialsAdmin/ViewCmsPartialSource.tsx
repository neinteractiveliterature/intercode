import CmsPartialForm from './CmsPartialForm';
import usePageTitle from '../../usePageTitle';
import { LoadSingleValueFromCollectionWrapper } from '../../GraphqlLoadingWrappers';
import { useCmsPartialsAdminQuery } from './queries.generated';

export default LoadSingleValueFromCollectionWrapper(
  useCmsPartialsAdminQuery,
  (data, id) => data.cmsParent.cmsPartials.find((p) => id === p.id.toString()),

  function ViewCmsPartialSource({ value: partial }) {
    usePageTitle(`Viewing “${partial.name}” Source`);
    return <CmsPartialForm partial={partial} readOnly />;
  },
);
