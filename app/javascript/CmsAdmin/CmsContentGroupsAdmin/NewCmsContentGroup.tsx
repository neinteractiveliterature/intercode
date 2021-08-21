import { useState } from 'react';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import { CmsContentGroupsAdminQuery } from './queries';
import { CreateContentGroup } from './mutations';
import { buildPermissionInput } from '../../Permissions/PermissionUtils';
import useAsyncFunction from '../../useAsyncFunction';
import { useChangeSet } from '../../ChangeSet';
import { useCreateMutation } from '../../MutationUtils';
import usePageTitle from '../../usePageTitle';
import CmsContentGroupFormFields from './CmsContentGroupFormFields';
import { CmsContentGroupsAdminQueryData, useCmsContentGroupsAdminQuery } from './queries.generated';

function NewCmsContentGroup() {
  const history = useHistory();
  const { data, loading, error } = useCmsContentGroupsAdminQuery();
  const mutate = useCreateMutation(CreateContentGroup, {
    query: CmsContentGroupsAdminQuery,
    arrayPath: ['cmsContentGroups'],
    newObjectPath: ['createCmsContentGroup', 'cms_content_group'],
  });
  const [createCmsContentGroup, createError, createInProgress] = useAsyncFunction(mutate);
  const [contentGroup, setContentGroup] = useState<
    Omit<CmsContentGroupsAdminQueryData['cmsContentGroups'][0], 'id'>
  >({
    __typename: 'CmsContentGroup',
    name: '',
    contents: [],
    permissions: [],
    current_ability_can_delete: true,
    current_ability_can_update: true,
  });
  const [permissionsChangeSet, addPermission, removePermission] =
    useChangeSet<CmsContentGroupsAdminQueryData['cmsContentGroups'][0]['permissions'][0]>();

  usePageTitle('New Content Group');

  if (loading) {
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const formSubmitted = async (event: React.FormEvent) => {
    event.preventDefault();

    await createCmsContentGroup({
      variables: {
        cmsContentGroup: {
          name: contentGroup.name,
          contents: contentGroup.contents.map(({ id, __typename }) => ({
            id,
            content_type: __typename,
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
        convention={data!.convention}
        permissionsChangeSet={permissionsChangeSet}
        addPermission={addPermission}
        removePermission={removePermission}
      />

      <ErrorDisplay graphQLError={createError as ApolloError} />

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
