import { useState } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { useHistory } from 'react-router-dom';
import { ApolloError, useApolloClient } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import { AddAttendeeUsersQuery } from './queries';
import UserSelect from '../BuiltInFormControls/UserSelect';
import useAsyncFunction from '../useAsyncFunction';
import { useCreateUserConProfileMutation } from './mutations.generated';
import { AddAttendeeUsersQueryData } from './queries.generated';
import { FormResponse } from '../FormPresenter/useFormResponse';

export type AddAttendeeModalProps = {
  conventionName: string;
  visible: boolean;
};

type UserType = AddAttendeeUsersQueryData['users_paginated']['entries'][0];

function AddAttendeeModal({ conventionName, visible }: AddAttendeeModalProps): JSX.Element {
  const { t } = useTranslation();
  const history = useHistory();
  const apolloClient = useApolloClient();
  const [user, setUser] = useState<UserType>();
  const [userConProfile, setUserConProfile] = useState<FormResponse>();
  const [createUserConProfileMutate] = useCreateUserConProfileMutation();
  const [createUserConProfile, error, inProgress] = useAsyncFunction(createUserConProfileMutate);

  const close = () => {
    setUser(undefined);
    setUserConProfile(undefined);
    history.replace('/user_con_profiles');
  };

  const userSelected = (newUser: UserType) => {
    setUser(newUser);
    setUserConProfile({
      form_response_attrs: {
        first_name: newUser.first_name,
        last_name: newUser.last_name,
      },
    });
  };

  const createClicked = async () => {
    if (!user || !userConProfile) {
      return;
    }

    await createUserConProfile({
      variables: {
        user_id: user.id,
        user_con_profile: {
          form_response_attrs_json: JSON.stringify(userConProfile.form_response_attrs),
        },
      },
    });
    await apolloClient.resetStore();
    close();
  };

  return (
    <Modal visible={visible} dialogClassName="modal-lg">
      <div className="modal-header">
        {t('admin.userConProfiles.addAttendee.header', 'Add attendee')}
      </div>

      <div className="modal-body">
        <p>
          {t(
            'admin.userConProfiles.addAttendee.text',
            `Choose a user to add as an attendee for {{ conventionName }}.
            This person must already be a user in the site database in order to be added.`,
            { conventionName },
          )}
        </p>

        <UserSelect<AddAttendeeUsersQueryData>
          value={user}
          onChange={userSelected}
          usersQuery={AddAttendeeUsersQuery}
        />

        {user && (
          <div className="mt-4">
            <p>
              {t(
                'admin.userConProfiles.addAttendee.dataCopyingNote',
                'Profile data will be copied from user’s latest convention profile.',
              )}
            </p>
          </div>
        )}

        <ErrorDisplay graphQLError={error as ApolloError} />
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" type="button" onClick={close} disabled={inProgress}>
          {t('buttons.cancel', 'Cancel')}
        </button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={createClicked}
          disabled={user == null || inProgress}
        >
          {inProgress ? (
            <LoadingIndicator iconSet="bootstrap-icons" />
          ) : (
            t('admin.userConProfiles.addAttendee.addButtonText', 'Add')
          )}
        </button>
      </div>
    </Modal>
  );
}

export default AddAttendeeModal;
