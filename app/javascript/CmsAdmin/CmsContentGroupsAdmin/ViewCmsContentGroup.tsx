import { useMemo } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import usePageTitle from '../../usePageTitle';
import CmsContentGroupFormFields from './CmsContentGroupFormFields';
import { useCmsContentGroupsAdminQuery } from './queries.generated';
import FourOhFourPage from '../../FourOhFourPage';

function ViewCmsContentGroup() {
  const { params } = useRouteMatch<{ id: string }>();
  const { data, loading, error } = useCmsContentGroupsAdminQuery();
  const contentGroup = useMemo(() => {
    if (loading || error || !data) {
      return null;
    }

    return data.cmsContentGroups.find((group) => group.id.toString() === params.id);
  }, [data, loading, error, params.id]);

  usePageTitle(`Editing “${(contentGroup || {}).name}”`);

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (!contentGroup) {
    return <FourOhFourPage />;
  }

  return (
    <>
      <h3 className="mb-4">{contentGroup.name}</h3>

      <CmsContentGroupFormFields
        contentGroup={contentGroup}
        convention={data!.convention}
        readOnly
      />
    </>
  );
}

export default ViewCmsContentGroup;
