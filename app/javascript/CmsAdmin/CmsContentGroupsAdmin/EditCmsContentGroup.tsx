import { useState } from 'react';
import * as React from 'react';
import { ApolloError } from '@apollo/client';
import { redirect, useNavigation, useSubmit } from 'react-router';
import { ErrorDisplay, notEmpty } from '@neinteractiveliterature/litform';

import { buildPermissionInput } from '../../Permissions/PermissionUtils';
import { useChangeSet } from '../../ChangeSet';
import CmsContentGroupFormFields from './CmsContentGroupFormFields';
import { CmsContentGroupAdminQueryDocument, CmsContentGroupsAdminQueryData } from './queries.generated';
import { CmsContentTypeIndicator } from '../../graphqlTypes.generated';
import { UpdateContentGroupDocument, UpdateContentGroupMutationVariables } from './mutations.generated';
import { Route } from './+types/EditCmsContentGroup';

export async function action({ params: { id }, request, context }: Route.ActionArgs) {
  const variables = (await request.json()) as Omit<UpdateContentGroupMutationVariables, 'id'>;

  try {
    await context.client.mutate({
      mutation: UpdateContentGroupDocument,
      variables: {
        id: id ?? '',
        ...variables,
      },
    });
  } catch (e) {
    return e;
  }
  await context.client.resetStore();

  return redirect('/cms_content_groups');
}

export async function loader({ context, params: { id } }: Route.LoaderArgs) {
  const { data } = await context.client.query({ query: CmsContentGroupAdminQueryDocument, variables: { id } });
  return data;
}

function EditCmsContentGroup({
  loaderData: {
    convention,
    cmsParent: { cmsContentGroup: initialContentGroup },
  },
  actionData: submitError,
}: Route.ComponentProps) {
  const [contentGroup, setContentGroup] = useState(initialContentGroup);
  const [permissionsChangeSet, addPermission, removePermission] =
    useChangeSet<CmsContentGroupsAdminQueryData['cmsParent']['cmsContentGroups'][0]['permissions'][0]>();
  const submit = useSubmit();
  const navigation = useNavigation();
  const submitInProgress = navigation.state !== 'idle';

  const formSubmitted = async (event: React.FormEvent) => {
    event.preventDefault();

    const variables: Omit<UpdateContentGroupMutationVariables, 'id'> = {
      cmsContentGroup: {
        name: contentGroup.name,
        contents: contentGroup.contents.map(({ id, __typename }) => ({
          id,
          content_type: __typename as CmsContentTypeIndicator,
        })),
      },
      grantPermissions: permissionsChangeSet.getAddValues().map(buildPermissionInput),
      revokePermissions: permissionsChangeSet
        .getRemoveIds()
        .map((removeId) => {
          const permission = initialContentGroup.permissions.find((perm) => perm.id === removeId);
          return permission ? buildPermissionInput(permission) : undefined;
        })
        .filter(notEmpty),
    };

    submit(variables, { action: '.', method: 'PATCH', encType: 'application/json' });
  };

  return (
    <form onSubmit={formSubmitted}>
      <h3 className="mb-4">Editing {initialContentGroup.name}</h3>

      <CmsContentGroupFormFields
        contentGroup={contentGroup}
        setContentGroup={(newValue) => setContentGroup((prevValue) => ({ ...prevValue, ...newValue }))}
        disabled={submitInProgress}
        convention={convention}
        permissionsChangeSet={permissionsChangeSet}
        addPermission={addPermission}
        removePermission={removePermission}
      />

      <ErrorDisplay graphQLError={submitError as ApolloError} />

      <input
        type="submit"
        value="Update content group"
        className="btn btn-primary"
        disabled={submitInProgress}
        aria-label="Update content group"
      />
    </form>
  );
}

export default EditCmsContentGroup;
