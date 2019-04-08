import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import buildFormStateFromData from './buildFormStateFromData';
import ErrorDisplay from '../ErrorDisplay';
import UserConProfileForm from './UserConProfileForm';
import { UserConProfileQuery, UserConProfileAdminQuery } from './queries.gql';
import { UpdateUserConProfile } from './mutations.gql';
import useQuerySuspended from '../useQuerySuspended';
import useAsyncFunction from '../useAsyncFunction';
import useMutationCallback from '../useMutationCallback';

function EditUserConProfile({ history, id }) {
  const { data, error } = useQuerySuspended(UserConProfileQuery, { variables: { id } });

  const {
    userConProfile: initialUserConProfile, convention, form,
  } = buildFormStateFromData(data.userConProfile, data.convention);

  const [userConProfile, setUserConProfile] = useState(initialUserConProfile);

  const mutate = useMutationCallback(UpdateUserConProfile, {
    update: useCallback(
      (cache, { data: { updateUserConProfile: { user_con_profile: updatedUserConProfile } } }) => {
        const variables = { id };
        const query = cache.readQuery({ query: UserConProfileAdminQuery, variables });
        cache.writeQuery({
          query: UserConProfileAdminQuery,
          variables,
          data: {
            ...query,
            userConProfile: {
              ...query.userConProfile,
              ...updatedUserConProfile,
            },
          },
        });
      },
      [id],
    ),
  });

  const canUpdatePrivileges = (
    error ? false : data.currentAbility.can_update_privileges_user_con_profile
  );

  const [updateUserConProfile, updateError, updateInProgress] = useAsyncFunction(
    useCallback(
      async () => {
        await mutate({
          variables: {
            input: {
              id: userConProfile.id,
              user_con_profile: {
                ...(canUpdatePrivileges ? { privileges: userConProfile.privileges } : {}),
                form_response_attrs_json: JSON.stringify(userConProfile.form_response_attrs),
              },
            },
          },
        });

        history.push(`/${userConProfile.id}`);
      },
      [mutate, history, userConProfile, canUpdatePrivileges],
    ),
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <div>
      <h1 className="mb-4">
        Editing
        {' '}
        {userConProfile.name}
      </h1>
      <UserConProfileForm
        canUpdatePrivileges={canUpdatePrivileges}
        userConProfile={userConProfile}
        regularPrivilegeNames={data.convention.privilege_names
          .filter(priv => priv !== 'site_admin' && !data.convention.mail_privilege_names.includes(priv))}
        mailPrivilegeNames={data.convention.mail_privilege_names}
        onChange={setUserConProfile}
        footerContent={(
          <button className="btn btn-primary" type="button" onClick={updateUserConProfile} disabled={updateInProgress}>
            Save changes
          </button>
        )}
        form={form}
        convention={convention}
      />
      <ErrorDisplay graphQLError={updateError} />
    </div>
  );
}

EditUserConProfile.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  id: PropTypes.number.isRequired,
};

export default withRouter(EditUserConProfile);
