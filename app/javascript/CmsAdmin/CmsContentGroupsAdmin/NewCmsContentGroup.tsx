import { useState } from 'react';
import * as React from 'react';
import { ActionFunction, redirect, useActionData, useNavigation, useSubmit } from 'react-router';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { buildPermissionInput } from '../../Permissions/PermissionUtils';
import { useChangeSet } from '../../ChangeSet';
import usePageTitle from '../../usePageTitle';
import CmsContentGroupFormFields from './CmsContentGroupFormFields';
import { CmsContentGroupsAdminQueryData } from './queries.generated';
import { CmsContentTypeIndicator, CreateCmsContentGroupInput } from '../../graphqlTypes.generated';
import { useCmsContentGroupsAdminLoader } from './loaders';
import { CreateContentGroupDocument } from './mutations.generated';
import { client } from '../../useIntercodeApolloClient';

export const action: ActionFunction = async ({ request }) => {
  const variables = (await request.json()) as CreateCmsContentGroupInput;
  try {
    await client.mutate({
      mutation: CreateContentGroupDocument,
      variables: {
        cmsContentGroup: variables.cms_content_group,
        permissions: variables.permissions,
      },
    });
  } catch (e) {
    return e;
  }
  await client.resetStore();

  return redirect('/cms_content_groups');
};

function NewCmsContentGroup(): JSX.Element {
  const data = useCmsContentGroupsAdminLoader();
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
  const navigation = useNavigation();
  const createInProgress = navigation.state !== 'idle';
  const createError = useActionData();
  const submit = useSubmit();

  usePageTitle('New Content Group');

  const formSubmitted = async (event: React.FormEvent) => {
    event.preventDefault();
    const variables: CreateCmsContentGroupInput = {
      cms_content_group: {
        name: contentGroup.name,
        contents: contentGroup.contents.map(({ id, __typename }) => ({
          id,
          content_type: __typename as CmsContentTypeIndicator,
        })),
      },
      permissions: permissionsChangeSet.getAddValues().map(buildPermissionInput),
    };

    submit(variables, { action: '.', method: 'POST', encType: 'application/json' });
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

export default NewCmsContentGroup;
