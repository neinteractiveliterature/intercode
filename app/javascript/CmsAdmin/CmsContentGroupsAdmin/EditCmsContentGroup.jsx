import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useApolloClient, useQuery } from 'react-apollo-hooks';
import { useParams, useHistory } from 'react-router-dom';

import { CmsContentGroupsAdminQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import { buildPermissionInput } from '../../Permissions/PermissionUtils';
import { UpdateContentGroup } from './mutations.gql';
import useAsyncFunction from '../../useAsyncFunction';
import { useChangeSet } from '../../ChangeSet';
import usePageTitle from '../../usePageTitle';
import CmsContentGroupFormFields from './CmsContentGroupFormFields';
import PageLoadingIndicator from '../../PageLoadingIndicator';

function EditCmsContentGroupForm({ convention, initialContentGroup }) {
  const history = useHistory();
  const [updateCmsContentGroup] = useMutation(UpdateContentGroup);
  const [contentGroup, setContentGroup] = useState({
    name: '',
    contents: [],
    permissions: [],
    ...(initialContentGroup || {}),
  });
  const [permissionsChangeSet, addPermission, removePermission] = useChangeSet();
  const apolloClient = useApolloClient();

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

  const [submit, submitError, submitInProgress] = useAsyncFunction(formSubmitted);

  return (
    <form onSubmit={submit}>
      <h3 className="mb-4">
        Editing
        {' '}
        {initialContentGroup.name}
      </h3>

      <CmsContentGroupFormFields
        contentGroup={contentGroup}
        setContentGroup={setContentGroup}
        disabled={submitInProgress}
        convention={convention}
        permissionsChangeSet={permissionsChangeSet}
        addPermission={addPermission}
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

EditCmsContentGroupForm.propTypes = {
  convention: PropTypes.shape({}).isRequired,
  initialContentGroup: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    permissions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })).isRequired,
  }).isRequired,
};

function EditCmsContentGroup() {
  const params = useParams();
  const { data, loading, error } = useQuery(CmsContentGroupsAdminQuery);
  const initialContentGroup = useMemo(
    () => {
      if (loading || error) {
        return null;
      }

      return data.cmsContentGroups.find((contentGroup) => contentGroup.id.toString() === params.id);
    },
    [data, loading, error, params.id],
  );

  usePageTitle(`Editing “${(initialContentGroup || {}).name}”`);

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <EditCmsContentGroupForm
      initialContentGroup={initialContentGroup}
      convention={data.convention}
    />
  );
}

export default EditCmsContentGroup;
