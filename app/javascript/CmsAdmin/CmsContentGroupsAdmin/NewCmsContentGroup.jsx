import React, { useState } from 'react';
import PropTypes from 'prop-types';

import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import { CmsContentGroupsAdminQuery, SearchCmsContentQuery } from './queries.gql';
import { CreateContentGroup } from './mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';
import FormGroupWithLabel from '../../BuiltInFormControls/FormGroupWithLabel';
import { getPermissionNamesForModelType, buildPermissionInput } from '../../Permissions/PermissionUtils';
import GraphQLAsyncSelect from '../../BuiltInFormControls/GraphQLAsyncSelect';
import PermissionsTableInput from '../../Permissions/PermissionsTableInput';
import SelectWithLabel from '../../BuiltInFormControls/SelectWithLabel';
import { UpdateStaffPositionPermissions } from '../../StaffPositionAdmin/mutations.gql';
import useAsyncFunction from '../../useAsyncFunction';
import { useChangeSet } from '../../ChangeSet';
import { useCreateMutation } from '../../MutationUtils';
import { useMutation } from 'react-apollo-hooks';
import useQuerySuspended from '../../useQuerySuspended';

const ContentGroupPermissionNames = getPermissionNamesForModelType('CmsContentGroup');

function NewCmsContentGroup({ history }) {
  const { data, error } = useQuerySuspended(CmsContentGroupsAdminQuery);
  const mutate = useCreateMutation(CreateContentGroup, {
    query: CmsContentGroupsAdminQuery,
    arrayPath: ['cmsContentGroups'],
    newObjectPath: ['createCmsContentGroup', 'cms_content_group'],
  });
  const [updateStaffPositionsMutate] = useMutation(UpdateStaffPositionPermissions);
  const [createCmsContentGroup, createError, createInProgress] = useAsyncFunction(mutate);
  const [contentGroup, setContentGroup] = useState({
    name: '',
    contents: [],
    permissions: [],
  });
  const [staffPositions, setStaffPositions] = useState([]);
  const [permissionsChangeSet, addPermission, removePermission] = useChangeSet();

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
      },
    });

    const permissionUpdatePromises = staffPositions.map(async (staffPosition) => {
      const grantPermissions = permissionsChangeSet.getAddValues().filter(permission => permission.role.id === staffPosition.id);
      const existingPermissions = contentGroup.permissions.filter(permission => permission.role.id === staffPosition.id);
      const revokePermissions = existingPermissions.filter(permission => permissionsChangeSet.getRemoveIds().includes(permission.id));

      if (grantPermissions.length === 0 && revokePermissions.length === 0) {
        return;
      }

      await updateStaffPositionsMutate({
        variables: {
          staff_position_id: staffPosition.id,
          grantPermissions: grantPermissions.map(buildPermissionInput),
          revokePermissions: revokePermissions.map(buildPermissionInput),
        },
      });
    });

    await Promise.all(permissionUpdatePromises);

    history.push('/cms_content_groups');
  };

  const addStaffPosition = (staffPosition) => {
    setStaffPositions(prevStaffPositions => [...prevStaffPositions, staffPosition]);
  }

  const removeStaffPosition = (staffPosition) => {
    setStaffPositions(prevStaffPositions => prevStaffPositions.filter(pos => pos.id !== staffPosition.id));
  }

  return (
    <form onSubmit={formSubmitted}>
      <h3 className="mb-4">New content group</h3>

      <BootstrapFormInput
        label="Name"
        value={contentGroup.name}
        onTextChange={(name) => setContentGroup({ ...contentGroup, name })}
        disabled={createInProgress}
      />

      <FormGroupWithLabel label="Contents" name="contents">
        {(id) => (
          <GraphQLAsyncSelect
            isMulti
            value={contentGroup.contents}
            inputId={id}
            onChange={(contents) => setContentGroup({ ...contentGroup, contents })}
            getOptions={(data) => data.searchCmsContent}
            getVariables={(inputValue) => ({ name: inputValue })}
            getOptionValue={({ id: optionId, __typename }) => `${__typename}-${optionId}`}
            formatOptionLabel={(option) => (
              <>
                {option.name}
                {' '}
                <small className="badge badge-light">
                  {option.__typename.replace('Cms', '')}
                </small>
              </>
            )}
            query={SearchCmsContentQuery}
            disabled={createInProgress}
          />
        )}
      </FormGroupWithLabel>

      <section className="my-4 card">
        <div className="card-header">
          Permissions
        </div>

        <div className="card-body">
          {staffPositions.length > 0 && (
            <PermissionsTableInput
              permissionNames={ContentGroupPermissionNames}
              initialPermissions={[]}
              models={staffPositions}
              changeSet={permissionsChangeSet}
              add={addPermission}
              remove={removePermission}
              formatModelHeader={staffPosition => staffPosition.name}
              removeModel={removeStaffPosition}
            />
          )}

          <SelectWithLabel
            label="Add staff position"
            options={data.convention.staff_positions}
            getOptionValue={staffPosition => staffPosition.id}
            getOptionLabel={staffPosition => staffPosition.name}
            onChange={addStaffPosition}
          />
        </div>
      </section>

      <ErrorDisplay graphQLError={createError} />

      <input
        type="submit"
        value="Create content group"
        className="btn btn-primary"
        disabled={createInProgress}
      />
    </form>
  );
}

NewCmsContentGroup.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default NewCmsContentGroup;
