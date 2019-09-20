import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useApolloClient } from 'react-apollo-hooks';

import { CmsContentGroupsAdminQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import { buildPermissionInput } from '../../Permissions/PermissionUtils';
import { UpdateContentGroup } from './mutations.gql';
import useAsyncFunction from '../../useAsyncFunction';
import { useChangeSet } from '../../ChangeSet';
import useQuerySuspended from '../../useQuerySuspended';
import usePageTitle from '../../usePageTitle';
import CmsContentGroupFormFields from './CmsContentGroupFormFields';

function EditCmsContentGroup({ match: { params }, history }) {
  const { data, error } = useQuerySuspended(CmsContentGroupsAdminQuery);
  const initialContentGroup = useMemo(
    () => {
      if (error) {
        return null;
      }

      return data.cmsContentGroups.find((contentGroup) => contentGroup.id.toString() === params.id);
    },
    [data, error, params.id],
  );
  const [mutate] = useMutation(UpdateContentGroup);
  const [updateCmsContentGroup, updateError, updateInProgress] = useAsyncFunction(mutate);
  const [contentGroup, setContentGroup] = useState({
    name: '',
    contents: [],
    permissions: [],
    ...(initialContentGroup || {}),
  });
  const [permissionsChangeSet, addPermission, removePermission] = useChangeSet();
  const apolloClient = useApolloClient();

  usePageTitle(`Editing “${(initialContentGroup || {}).name}”`);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const formSubmitted = async (event) => {
    event.preventDefault();

    await updateCmsContentGroup({
      variables: {
        id: initialContentGroup.id,
        cmsContentGroup: {
          name: contentGroup.name,
          contents: contentGroup.contents.map(({ id, __typename }) => ({
            id, content_type: __typename,
          })),
        },
        grantPermissions: permissionsChangeSet.getAddValues().map(buildPermissionInput),
        revokePermissions: permissionsChangeSet.getRemoveIds()
          .map((removeId) => buildPermissionInput(
            initialContentGroup.permissions.find((perm) => perm.id === removeId),
          )),
      },
    });

    await apolloClient.resetStore();
    history.push('/cms_content_groups');
  };

  return (
    <form onSubmit={formSubmitted}>
      <h3 className="mb-4">
        Editing
        {' '}
        {initialContentGroup.name}
      </h3>

      <CmsContentGroupFormFields
        contentGroup={contentGroup}
        setContentGroup={setContentGroup}
        disabled={updateInProgress}
        convention={data.convention}
        permissionsChangeSet={permissionsChangeSet}
        addPermission={addPermission}
        removePermission={removePermission}
      />

      <ErrorDisplay graphQLError={updateError} />

      <input
        type="submit"
        value="Update content group"
        className="btn btn-primary"
        disabled={updateInProgress}
      />
    </form>
  );
}

EditCmsContentGroup.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default EditCmsContentGroup;
