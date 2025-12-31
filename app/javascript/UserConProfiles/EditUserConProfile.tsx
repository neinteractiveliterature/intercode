import { useMemo, useState } from 'react';
import { redirect, useFetcher, useLoaderData } from 'react-router';

import { ErrorDisplay } from '@neinteractiveliterature/litform';

import buildFormStateFromData from './buildFormStateFromData';
import UserConProfileForm from './UserConProfileForm';
import usePageTitle from '../usePageTitle';
import { UserConProfileQueryData, UserConProfileQueryDocument } from './queries.generated';
import { apolloClientContext } from '../AppContexts';
import { UpdateUserConProfileDocument } from './mutations.generated';
import { UserConProfileInput } from '~/graphqlTypes.generated';
import { Route } from './+types/EditUserConProfile';

export const clientAction = async ({ context, request, params: { id } }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  try {
    const userConProfile = (await request.json()) as UserConProfileInput;
    await client.mutate({
      mutation: UpdateUserConProfileDocument,
      variables: { input: { id: id ?? '', user_con_profile: userConProfile } },
    });
    return redirect(`/user_con_profiles/${id}`);
  } catch (error) {
    return error;
  }
};

export const clientLoader = async ({ context, params: { id } }: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({
    query: UserConProfileQueryDocument,
    variables: { id: id ?? '' },
  });
  return data;
};

function EditUserConProfile() {
  const data = useLoaderData() as UserConProfileQueryData;
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
      <ErrorDisplay graphQLError={updateError} />
    </div>
  );
}

export default EditUserConProfile;
