import { useState, useCallback } from 'react';
import { LoaderFunction, useLoaderData, useNavigate } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import buildFormStateFromData from './buildFormStateFromData';
import UserConProfileForm from './UserConProfileForm';
import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';
import {
  UserConProfileAdminQueryData,
  UserConProfileAdminQueryDocument,
  UserConProfileQueryData,
  UserConProfileQueryDocument,
} from './queries.generated';
import { useUpdateUserConProfileMutation } from './mutations.generated';
import { client } from '../useIntercodeApolloClient';

export const loader: LoaderFunction = async ({ params: { id } }) => {
  const { data } = await client.query<UserConProfileQueryData>({
    query: UserConProfileQueryDocument,
    variables: { id },
  });
  return data;
};

function EditUserConProfile() {
  const data = useLoaderData() as UserConProfileQueryData;
  const navigate = useNavigate();
  const {
    userConProfile: initialUserConProfile,
    convention,
    form,
  } = buildFormStateFromData(data.convention.user_con_profile, data.convention);

  const [userConProfile, setUserConProfile] = useState(initialUserConProfile);

  const [mutate] = useUpdateUserConProfileMutation({
    update: (cache, result) => {
      const variables = { id: initialUserConProfile.id };
      let query: UserConProfileAdminQueryData | null = null;
      query = cache.readQuery<UserConProfileAdminQueryData>({
        query: UserConProfileAdminQueryDocument,
        variables,
      });

      if (query) {
        cache.writeQuery<UserConProfileAdminQueryData>({
          query: UserConProfileAdminQueryDocument,
          variables,
          data: {
            ...query,
            convention: {
              ...query.convention,
              user_con_profile: {
                ...query.convention.user_con_profile,
                ...result.data?.updateUserConProfile?.user_con_profile,
              },
            },
          },
        });
      }
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

      navigate(`/user_con_profiles/${userConProfile.id}`);
    }, [mutate, navigate, userConProfile]),
  );

  usePageTitle(`Editing “${initialUserConProfile.name}”`);

  return (
    <div>
      <h1 className="mb-4">Editing {userConProfile.name}</h1>
      <UserConProfileForm<typeof userConProfile>
        userConProfile={userConProfile}
        onChange={setUserConProfile}
        footerContent={
          <button className="btn btn-primary" type="button" onClick={updateUserConProfile} disabled={updateInProgress}>
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

export const Component = EditUserConProfile;
