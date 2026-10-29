import { useState } from 'react';
import * as React from 'react';
import { redirect, useActionData, useLoaderData, useNavigation, useSubmit } from 'react-router';
import { ErrorDisplay, notEmpty } from '@neinteractiveliterature/litform';

import { buildPermissionInput } from '../../Permissions/PermissionUtils';
import { useChangeSet } from '../../ChangeSet';
import CmsContentGroupFormFields, { CmsContentGroupFormFieldsProps } from './CmsContentGroupFormFields';
import { CmsContentGroupsAdminQueryData } from './queries.generated';
import { CmsContentTypeIndicator } from '../../graphqlTypes.generated';
import { singleCmsContentGroupAdminLoader } from './loaders';
import { apolloClientContext } from '../../AppContexts';
import { UpdateContentGroupDocument, UpdateContentGroupMutationVariables } from './mutations.generated';
import type { Route } from './+types/EditCmsContentGroup';

export const clientAction = async ({ params: { id }, request, context }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  const variables = (await request.json()) as Omit<UpdateContentGroupMutationVariables, 'id'>;

  try {
    await client.mutate({
      mutation: UpdateContentGroupDocument,
      variables: {
        id: id ?? '',
        ...variables,
      },
    });
  } catch (e) {
    return e;
  }
  await client.resetStore();

  return redirect('/cms_content_groups');
};

export const clientLoader = singleCmsContentGroupAdminLoader;

function EditCmsContentGroupForm() {
  const {
    data: { convention },
    contentGroup: initialContentGroup,
  } = useLoaderData<typeof clientLoader>();
  const [contentGroup, setContentGroup] = useState(initialContentGroup);
  const [permissionsChangeSet, addPermission, removePermission] =
    useChangeSet<CmsContentGroupsAdminQueryData['cmsParent']['cmsContentGroups'][0]['permissions'][0]>();
  const submit = useSubmit();
  const navigation = useNavigation();
  const submitError = useActionData<typeof clientAction>();
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
        addPermission={addPermission as unknown as CmsContentGroupFormFieldsProps['addPermission']}
        removePermission={removePermission}
      />

      <ErrorDisplay graphQLError={submitError} />

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

export default EditCmsContentGroupForm;
