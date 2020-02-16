import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import { CmsContentGroupsAdminQuery } from './queries.gql';
import { CreateContentGroup } from './mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';
import { buildPermissionInput } from '../../Permissions/PermissionUtils';
import useAsyncFunction from '../../useAsyncFunction';
import { useChangeSet } from '../../ChangeSet';
import { useCreateMutation } from '../../MutationUtils';
import usePageTitle from '../../usePageTitle';
import CmsContentGroupFormFields from './CmsContentGroupFormFields';
import PageLoadingIndicator from '../../PageLoadingIndicator';

function NewCmsContentGroup() {
  const history = useHistory();
  const { data, loading, error } = useQuery(CmsContentGroupsAdminQuery);
  const mutate = useCreateMutation(CreateContentGroup, {
    query: CmsContentGroupsAdminQuery,
    arrayPath: ['cmsContentGroups'],
    newObjectPath: ['createCmsContentGroup', 'cms_content_group'],
  });
  const [createCmsContentGroup, createError, createInProgress] = useAsyncFunction(mutate);
  const [contentGroup, setContentGroup] = useState({
    name: '',
    contents: [],
    permissions: [],
  });
  const [permissionsChangeSet, addPermission, removePermission] = useChangeSet();

  usePageTitle('New Content Group');

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const formSubmitted = async (event) => {
    event.preventDefault();

    await createCmsContentGroup({
      variables: {
        cmsContentGroup: {
          name: contentGroup.name,
          contents: contentGroup.contents.map(({ id, __typename }) => ({
            id, content_type: __typename,
          })),
        },
        permissions: permissionsChangeSet.getAddValues().map(buildPermissionInput),
      },
    });

    history.push('/cms_content_groups');
  };

  return (
    <form onSubmit={formSubmitted}>
      <h3 className="mb-4">New content group</h3>

      <CmsContentGroupFormFields
        contentGroup={contentGroup}
        setContentGroup={setContentGroup}
        disabled={createInProgress}
        convention={data.convention}
        permissionsChangeSet={permissionsChangeSet}
        addPermission={addPermission}
        removePermission={removePermission}
      />

      <ErrorDisplay graphQLError={createError} />

      <input
        type="submit"
        value="Create content group"
        className="btn btn-primary"
        disabled={createInProgress}
        aria-label="Create content group"
      />
    </form>
  );
}

export default NewCmsContentGroup;
