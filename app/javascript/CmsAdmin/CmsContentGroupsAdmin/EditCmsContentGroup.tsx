import React, { useState, useMemo } from 'react';
import { useApolloClient, ApolloError } from '@apollo/client';
import { useParams, useHistory } from 'react-router-dom';

import ErrorDisplay from '../../ErrorDisplay';
import { buildPermissionInput } from '../../Permissions/PermissionUtils';
import useAsyncFunction from '../../useAsyncFunction';
import { useChangeSet } from '../../ChangeSet';
import usePageTitle from '../../usePageTitle';
import CmsContentGroupFormFields from './CmsContentGroupFormFields';
import PageLoadingIndicator from '../../PageLoadingIndicator';
import {
  CmsContentGroupsAdminQueryQuery,
  useCmsContentGroupsAdminQueryQuery,
} from './queries.generated';
import { notEmpty } from '../../ValueUtils';
import FourOhFourPage from '../../FourOhFourPage';
import { useUpdateContentGroupMutation } from './mutations.generated';
import { CmsContentTypeIndicator } from '../../graphqlTypes.generated';

type EditCmsContentGroupFormProps = {
  convention: CmsContentGroupsAdminQueryQuery['convention'];
  initialContentGroup: CmsContentGroupsAdminQueryQuery['cmsContentGroups'][0];
};

function EditCmsContentGroupForm({
  convention,
  initialContentGroup,
}: EditCmsContentGroupFormProps) {
  const history = useHistory();
  const [updateCmsContentGroup] = useUpdateContentGroupMutation();
  const [contentGroup, setContentGroup] = useState(initialContentGroup);
  const [permissionsChangeSet, addPermission, removePermission] = useChangeSet<
    CmsContentGroupsAdminQueryQuery['cmsContentGroups'][0]['permissions'][0]
  >();
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
        setContentGroup={(newValue) =>
          setContentGroup((prevValue) => ({ ...prevValue, ...newValue }))
        }
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

function EditCmsContentGroup() {
  const params = useParams<{ id: string }>();
  const { data, loading, error } = useCmsContentGroupsAdminQueryQuery();
  const initialContentGroup = useMemo(() => {
    if (loading || error || !data) {
      return null;
    }

    return data.cmsContentGroups.find((contentGroup) => contentGroup.id.toString() === params.id);
  }, [data, loading, error, params.id]);

  usePageTitle(`Editing “${(initialContentGroup || {}).name}”`);

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (!initialContentGroup) {
    return <FourOhFourPage />;
  }

  return (
    <EditCmsContentGroupForm
      initialContentGroup={initialContentGroup}
      convention={data!.convention}
    />
  );
}

export default EditCmsContentGroup;
