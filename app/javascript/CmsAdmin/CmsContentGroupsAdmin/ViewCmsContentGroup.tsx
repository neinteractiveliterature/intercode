import usePageTitle from '../../usePageTitle';
import CmsContentGroupFormFields from './CmsContentGroupFormFields';
import { useCmsContentGroupsAdminQuery } from './queries.generated';
import { LoadSingleValueFromCollectionWrapper } from '../../GraphqlLoadingWrappers';

export default LoadSingleValueFromCollectionWrapper(
  useCmsContentGroupsAdminQuery,
  (data, id) => data.cmsParent.cmsContentGroups.find((group) => group.id.toString() === id),
  function ViewCmsContentGroup({ data, value: contentGroup }): JSX.Element {
    usePageTitle(contentGroup.name);

    return (
      <>
        <h3 className="mb-4">{contentGroup.name}</h3>

        <CmsContentGroupFormFields
          contentGroup={contentGroup}
          convention={data.convention}
          readOnly
        />
      </>
    );
  },
);
