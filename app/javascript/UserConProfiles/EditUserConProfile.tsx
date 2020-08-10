import React, { useState, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ApolloError } from '@apollo/client';

import buildFormStateFromData from './buildFormStateFromData';
import ErrorDisplay from '../ErrorDisplay';
import UserConProfileForm from './UserConProfileForm';
import { UserConProfileAdminQuery } from './queries';
import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';
import {
  useUserConProfileQueryQuery,
  UserConProfileQueryQuery,
  UserConProfileAdminQueryQuery,
} from './queries.generated';
import { useUpdateUserConProfileMutation } from './mutations.generated';

function EditUserConProfileForm({ data }: { data: UserConProfileQueryQuery }) {
  const history = useHistory();
  const { userConProfile: initialUserConProfile, convention, form } = buildFormStateFromData(
    data.userConProfile,
    data.convention!,
  );

  const [userConProfile, setUserConProfile] = useState(initialUserConProfile);

  const [mutate] = useUpdateUserConProfileMutation({
    update: (cache, result) => {
      const variables = { id: initialUserConProfile.id };
      let query: UserConProfileAdminQueryQuery | null = null;
      try {
        query = cache.readQuery<UserConProfileAdminQueryQuery>({
          query: UserConProfileAdminQuery,
          variables,
        });
      } catch (error) {
        // Work around https://github.com/apollographql/apollo-client/issues/6094
        return;
      }
      cache.writeQuery({
        query: UserConProfileAdminQuery,
        variables,
        data: {
          ...query,
          userConProfile: {
            ...query?.userConProfile,
            ...result.data?.updateUserConProfile?.user_con_profile,
          },
        },
      });
    },
  });

  const [updateUserConProfile, updateError, updateInProgress] = useAsyncFunction(
    useCallback(async () => {
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
    }, [mutate, history, userConProfile]),
  );

  usePageTitle(`Editing “${initialUserConProfile.name}”`);

  return (
    <div>
      <h1 className="mb-4">Editing {userConProfile.name}</h1>
      <UserConProfileForm<typeof userConProfile>
        userConProfile={userConProfile}
        onChange={setUserConProfile}
        footerContent={
          <button
            className="btn btn-primary"
            type="button"
            onClick={updateUserConProfile}
            disabled={updateInProgress}
          >
            Save changes
          </button>
        }
        form={form}
        convention={convention}
      />
      <ErrorDisplay graphQLError={updateError as ApolloError} />
    </div>
  );
}

function EditUserConProfile() {
  const id = Number.parseInt(useParams<{ id: string }>().id, 10);
  const { data, loading, error } = useUserConProfileQueryQuery({ variables: { id } });

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return <EditUserConProfileForm data={data!} />;
}

export default EditUserConProfile;
