import { useState } from 'react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay, useCreateMutationWithReferenceArrayUpdater } from '@neinteractiveliterature/litform';

import { buildPermissionInput } from '../../Permissions/PermissionUtils';
import { useChangeSet } from '../../ChangeSet';
import usePageTitle from '../../usePageTitle';
import CmsContentGroupFormFields from './CmsContentGroupFormFields';
import { CmsContentGroupFieldsFragmentDoc, CmsContentGroupsAdminQueryData } from './queries.generated';
import { useCreateContentGroupMutation } from './mutations.generated';
import { CmsContentTypeIndicator } from '../../graphqlTypes.generated';
import { useCmsContentGroupsAdminLoader } from './loaders';

function NewCmsContentGroup(): JSX.Element {
  const data = useCmsContentGroupsAdminLoader();
  const navigate = useNavigate();
  const [createCmsContentGroup, { error: createError, loading: createInProgress }] =
    useCreateMutationWithReferenceArrayUpdater(
      useCreateContentGroupMutation,
      data.cmsParent,
      'cmsContentGroups',
      (data) => data.createCmsContentGroup.cms_content_group,
      CmsContentGroupFieldsFragmentDoc,
      'CmsContentGroupFields',
    );
  const [contentGroup, setContentGroup] = useState<
    Omit<CmsContentGroupsAdminQueryData['cmsParent']['cmsContentGroups'][0], 'id'>
  >({
    __typename: 'CmsContentGroup',
    name: '',
    contents: [],
    permissions: [],
    current_ability_can_delete: true,
    current_ability_can_update: true,
  });
  const [permissionsChangeSet, addPermission, removePermission] =
    useChangeSet<CmsContentGroupsAdminQueryData['cmsParent']['cmsContentGroups'][0]['permissions'][0]>();

  usePageTitle('New Content Group');

  const formSubmitted = async (event: React.FormEvent) => {
    event.preventDefault();

    await createCmsContentGroup({
      variables: {
        cmsContentGroup: {
          name: contentGroup.name,
          contents: contentGroup.contents.map(({ id, __typename }) => ({
            id,
            content_type: __typename as CmsContentTypeIndicator,
          })),
        },
        permissions: permissionsChangeSet.getAddValues().map(buildPermissionInput),
      },
    });

    navigate('/cms_content_groups');
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

export const Component = NewCmsContentGroup;
