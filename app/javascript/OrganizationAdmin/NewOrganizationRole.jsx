import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo-hooks';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import ErrorDisplay from '../ErrorDisplay';
import { OrganizationAdminOrganizationsQuery } from './queries.gql';
import { Transforms, useMutator } from '../ComposableFormUtils';
import { useChangeSetWithSelect } from '../ChangeSet';
import UserSelect from '../BuiltInFormControls/UserSelect';

function NewOrganizationRole({ organizationId }) {
  const { data, error } = useQuery(OrganizationAdminOrganizationsQuery);
  const [organizationRole, organizationRoleMutator] = useMutator(
    { name: '', users: [] },
    {
      name: Transforms.textInputChange,
    },
  );
  const [usersChangeSet, onChangeUsers] = useChangeSetWithSelect();

  if (error) return <ErrorDisplay graphQLError={error} />;

  const organization = data.organizations.find(org => org.id === organizationId);

  return (
    <>
      <h1 className="mb-4">
        New role in
        {' '}
        {organization.name}
      </h1>

      <BootstrapFormInput
        name="name"
        label="Role name"
        value={organizationRole.name}
        onChange={organizationRoleMutator.name}
      />

      <div className="form-group">
        <label htmlFor="users">Users</label>
        <UserSelect
          isMulti
          inputId="users"
          value={usersChangeSet.apply(organizationRole.users)}
          onChange={onChangeUsers}
        />
      </div>
    </>
  );
}

NewOrganizationRole.propTypes = {
  organizationId: PropTypes.number.isRequired,
};

export default NewOrganizationRole;
