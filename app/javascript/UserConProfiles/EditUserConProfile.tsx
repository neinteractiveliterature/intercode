import { useMemo, useState } from 'react';
import { redirect, useFetcher } from 'react-router';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import buildFormStateFromData from './buildFormStateFromData';
import UserConProfileForm from './UserConProfileForm';
import usePageTitle from '../usePageTitle';
import { UserConProfileQueryDocument } from './queries.generated';
import { UpdateUserConProfileDocument } from './mutations.generated';
import { UserConProfileInput } from 'graphqlTypes.generated';
import { Route } from './+types/EditUserConProfile';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  try {
    const userConProfile = (await request.json()) as UserConProfileInput;
    await context.client.mutate({
      mutation: UpdateUserConProfileDocument,
      variables: { input: { id, user_con_profile: userConProfile } },
    });
    return redirect(`/user_con_profiles/${id}`);
  } catch (error) {
    return error;
  }
}

export async function loader({ params: { id }, context }: Route.LoaderArgs) {
  const { data } = await context.client.query({
    query: UserConProfileQueryDocument,
    variables: { id },
  });
  return data;
}

function EditUserConProfile({ loaderData: data }: Route.ComponentProps) {
  const {
    userConProfile: initialUserConProfile,
    convention,
    form,
  } = useMemo(() => buildFormStateFromData(data.convention.user_con_profile, data.convention), [data.convention]);

  const [userConProfile, setUserConProfile] = useState(initialUserConProfile);
  const fetcher = useFetcher();
  const updateError = fetcher.data instanceof Error ? fetcher.data : undefined;
  const updateInProgress = fetcher.state !== 'idle';

  const updateUserConProfile = () => {
    fetcher.submit(
      {
        form_response_attrs_json: JSON.stringify(userConProfile.form_response_attrs),
      } satisfies UserConProfileInput,
      { method: 'PATCH', encType: 'application/json' },
    );
  };

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

export default EditUserConProfile;
