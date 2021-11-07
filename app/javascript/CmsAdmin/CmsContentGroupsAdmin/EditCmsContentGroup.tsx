import { useState } from 'react';
import * as React from 'react';
import { useApolloClient, ApolloError } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { ErrorDisplay, notEmpty } from '@neinteractiveliterature/litform';

import { buildPermissionInput } from '../../Permissions/PermissionUtils';
import useAsyncFunction from '../../useAsyncFunction';
import { useChangeSet } from '../../ChangeSet';
import CmsContentGroupFormFields from './CmsContentGroupFormFields';
import { CmsContentGroupsAdminQueryData, useCmsContentGroupsAdminQuery } from './queries.generated';
import { useUpdateContentGroupMutation } from './mutations.generated';
import { CmsContentTypeIndicator } from '../../graphqlTypes.generated';
import { LoadSingleValueFromCollectionWrapper } from '../../GraphqlLoadingWrappers';

export default LoadSingleValueFromCollectionWrapper(
  useCmsContentGroupsAdminQuery,
  (data, id) => data.cmsParent.cmsContentGroups.find((contentGroup) => contentGroup.id.toString() === id),

  function EditCmsContentGroupForm({ data: { convention }, value: initialContentGroup }) {
    const history = useHistory();
    const [updateCmsContentGroup] = useUpdateContentGroupMutation();
    const [contentGroup, setContentGroup] = useState(initialContentGroup);
    const [permissionsChangeSet, addPermission, removePermission] =
      useChangeSet<CmsContentGroupsAdminQueryData['cmsParent']['cmsContentGroups'][0]['permissions'][0]>();
    const apolloClient = useApolloClient();

    const formSubmitted = async (event: React.FormEvent) => {
      event.preventDefault();

      await updateCmsContentGroup({
        variables: {
          id: initialContentGroup.id,
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
        },
      });

      await apolloClient.resetStore();
      history.push('/cms_content_groups');
    };

    const [submit, submitError, submitInProgress] = useAsyncFunction(formSubmitted);

    return (
      <form onSubmit={submit}>
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
  },
);
