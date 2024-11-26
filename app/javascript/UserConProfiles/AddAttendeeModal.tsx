import { useContext, useState } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { ActionFunction, redirect, useFetcher, useNavigate } from 'react-router';
import { ApolloError } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import UserSelect from '../BuiltInFormControls/UserSelect';
import { AddAttendeeUsersQueryData, AddAttendeeUsersQueryDocument } from './queries.generated';
import { FormResponse } from '../FormPresenter/useFormResponse';
import AppRootContext from 'AppRootContext';
import { CreateUserConProfileDocument, CreateUserConProfileMutationVariables } from './mutations.generated';
import { client } from 'useIntercodeApolloClient';

export const action: ActionFunction = async ({ request }) => {
  try {
    const variables = (await request.json()) as CreateUserConProfileMutationVariables;
    await client.mutate({ mutation: CreateUserConProfileDocument, variables });
    await client.resetStore();
    return redirect('..');
  } catch (error) {
    return error;
  }
};

type UserType = AddAttendeeUsersQueryData['users_paginated']['entries'][0];

function AddAttendeeModal(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { convention } = useContext(AppRootContext);
  const [user, setUser] = useState<UserType>();
  const [userConProfile, setUserConProfile] = useState<FormResponse>();
  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const inProgress = fetcher.state !== 'idle';

  const close = () => {
    setUser(undefined);
    setUserConProfile(undefined);
    navigate('/user_con_profiles', { replace: true });
  };

  const userSelected = (newUser: UserType) => {
    setUser(newUser);
    setUserConProfile({
      __typename: 'UserConProfile',
      id: 'not-created-yet',
      form_response_attrs: {
        first_name: newUser.first_name ?? null,
        last_name: newUser.last_name ?? null,
      },
    });
  };

  const createClicked = () => {
    if (!user || !userConProfile) {
      return;
    }

    fetcher.submit(
      {
        user_id: user.id,
        user_con_profile: {
          form_response_attrs_json: JSON.stringify(userConProfile.form_response_attrs),
        },
      } satisfies CreateUserConProfileMutationVariables,
      { method: 'POST', encType: 'application/json' },
    );
  };

  return (
    <Modal visible dialogClassName="modal-lg">
      <div className="modal-header">{t('admin.userConProfiles.addAttendee.header')}</div>
      <div className="modal-body">
        <p>
          {t(
            'admin.userConProfiles.addAttendee.text',
            `Choose a user to add as an attendee for {{ conventionName }}.
            This person must already be a user in the site database in order to be added.`,
            { conventionName: convention?.name },
          )}
        </p>

        <UserSelect value={user} onChange={userSelected} usersQuery={AddAttendeeUsersQueryDocument} />

        {user && (
          <div className="mt-4">
            <p>{t('admin.userConProfiles.addAttendee.dataCopyingNote')}</p>
          </div>
        )}

        <ErrorDisplay graphQLError={error as ApolloError} />
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" type="button" onClick={close} disabled={inProgress}>
          {t('buttons.cancel')}
        </button>
        <button className="btn btn-primary" type="button" onClick={createClicked} disabled={user == null || inProgress}>
          {inProgress ? (
            <LoadingIndicator iconSet="bootstrap-icons" />
          ) : (
            t('admin.userConProfiles.addAttendee.addButtonText')
          )}
        </button>
      </div>
    </Modal>
  );
}

export default AddAttendeeModal;
