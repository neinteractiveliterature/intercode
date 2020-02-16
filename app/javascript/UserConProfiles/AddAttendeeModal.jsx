import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import { AddAttendeeUsersQuery } from './queries.gql';
import { CreateUserConProfile } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import LoadingIndicator from '../LoadingIndicator';
import UserSelect from '../BuiltInFormControls/UserSelect';
import useAsyncFunction from '../useAsyncFunction';

function AddAttendeeModal({ conventionName, visible }) {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [userConProfile, setUserConProfile] = useState(null);
  const [createUserConProfileMutate] = useMutation(CreateUserConProfile);
  const [createUserConProfile, error, inProgress] = useAsyncFunction(createUserConProfileMutate);

  const close = () => {
    setUser(null);
    setUserConProfile(null);
    history.replace('/user_con_profiles');
  };

  const userSelected = (newUser) => {
    setUser(newUser);
    setUserConProfile({
      form_response_attrs: {
        first_name: newUser.first_name,
        last_name: newUser.last_name,
      },
    });
  };

  const createClicked = async () => {
    await createUserConProfile({
      variables: {
        user_id: user.id,
        user_con_profile: {
          form_response_attrs_json: JSON.stringify(
            userConProfile.form_response_attrs,
          ),
        },
      },
    });
    close();
  };

  return (
    <Modal visible={visible} dialogClassName="modal-lg">
      <div className="modal-header">
        Add attendee
      </div>

      <div className="modal-body">
        <p>
          Choose a user to add as an attendee for
          {' '}
          {conventionName}
          .  This person must
          already be a user in the site database in order to be added.
        </p>

        <UserSelect
          value={user}
          onChange={userSelected}
          usersQuery={AddAttendeeUsersQuery}
        />

        {user && (
          <div className="mt-4">
            <p>Profile data will be copied from user&rsquo;s latest convention profile.</p>
          </div>
        )}

        <ErrorDisplay graphQLError={error} />
      </div>

      <div className="modal-footer">
        <button
          className="btn btn-secondary"
          type="button"
          onClick={close}
          disabled={inProgress}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={createClicked}
          disabled={user == null || inProgress}
        >
          {inProgress ? <LoadingIndicator /> : 'Add'}
        </button>
      </div>
    </Modal>
  );
}

AddAttendeeModal.propTypes = {
  conventionName: PropTypes.string.isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
  visible: PropTypes.bool.isRequired,
};

export default AddAttendeeModal;
