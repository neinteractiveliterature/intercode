import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';

import buildFormStateFromData from './buildFormStateFromData';
import ErrorDisplay from '../ErrorDisplay';
import UserConProfileForm from './UserConProfileForm';
import { UserConProfileQuery, UserConProfileAdminQuery } from './queries.gql';
import { UpdateUserConProfile } from './mutations.gql';
import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';

function EditUserConProfileForm({ data }) {
  const history = useHistory();
  const {
    userConProfile: initialUserConProfile, convention, form,
  } = buildFormStateFromData(data.userConProfile, data.convention);

  const [userConProfile, setUserConProfile] = useState(initialUserConProfile);

  const [mutate] = useMutation(UpdateUserConProfile, {
    update: useCallback(
      (cache, { data: { updateUserConProfile: { user_con_profile: updatedUserConProfile } } }) => {
        const variables = { id: initialUserConProfile.id };
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
      [initialUserConProfile.id],
    ),
  });

  const [updateUserConProfile, updateError, updateInProgress] = useAsyncFunction(
    useCallback(
      async () => {
        await mutate({
          variables: {
            input: {
              id: userConProfile.id,
              user_con_profile: {
                form_response_attrs_json: JSON.stringify(userConProfile.form_response_attrs),
              },
            },
          },
        });

        history.push(`/user_con_profiles/${userConProfile.id}`);
      },
      [mutate, history, userConProfile],
    ),
  );

  usePageTitle(`Editing “${initialUserConProfile.name}”`);

  return (
    <div>
      <h1 className="mb-4">
        Editing
        {' '}
        {userConProfile.name}
      </h1>
      <UserConProfileForm
        userConProfile={userConProfile}
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

EditUserConProfileForm.propTypes = {
  data: PropTypes.shape({
    userConProfile: PropTypes.shape({}).isRequired,
    convention: PropTypes.shape({}).isRequired,
  }).isRequired,
};

function EditUserConProfile() {
  const id = Number.parseInt(useParams().id, 10);
  const { data, loading, error } = useQuery(UserConProfileQuery, { variables: { id } });

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return <EditUserConProfileForm data={data} />;
}

export default EditUserConProfile;
