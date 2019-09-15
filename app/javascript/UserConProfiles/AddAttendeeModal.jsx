import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';

import { AddAttendeeUsersQuery } from './queries.gql';
import { CreateUserConProfile } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import LoadingIndicator from '../LoadingIndicator';
import UserSelect from '../BuiltInFormControls/UserSelect';

class AddAttendeeModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: null,
      userConProfile: null,
    };
  }

  cancel = () => {
    this.setState({ user: null, userId: null, userConProfile: null });
    this.props.history.replace('/user_con_profiles');
  }

  userSelected = (user) => {
    this.setState({
      user,
      userId: user.id,
      userConProfile: {
        form_response_attrs: {
          first_name: user.first_name,
          last_name: user.last_name,
        },
      },
    });
  }

  userConProfileChanged = (userConProfile) => { this.setState({ userConProfile }); }

  render = () => (
    <Modal visible={this.props.visible} dialogClassName="modal-lg">
      <div className="modal-header">
        Add attendee
      </div>
      <div className="modal-body">
        <p>
          Choose a user to add as an attendee for
          {' '}
          {this.props.conventionName}
          .  This person must
          already be a user in the site database in order to be added.
        </p>

        <UserSelect
          value={this.state.user}
          onChange={this.userSelected}
          usersQuery={AddAttendeeUsersQuery}
        />

        {this.state.userId && (
          <div className="mt-4">
            <p>Profile data will be copied from user&rsquo;s latest convention profile.</p>
          </div>
        )}

        <ErrorDisplay graphQLError={this.state.error} />
      </div>
      <div className="modal-footer">
        <button
          className="btn btn-secondary"
          type="button"
          onClick={this.cancel}
          disabled={this.state.mutationInProgress}
        >
          Cancel
        </button>
        <Mutation mutation={CreateUserConProfile}>
          {(mutate) => (
            <button
              className="btn btn-primary"
              type="button"
              onClick={async () => {
                this.setState({ mutationInProgress: true });
                try {
                  await mutate({
                    variables: {
                      user_id: this.state.userId,
                      user_con_profile: {
                        form_response_attrs_json: JSON.stringify(
                          this.state.userConProfile.form_response_attrs,
                        ),
                      },
                    },
                  });
                  this.setState({
                    mutationInProgress: false,
                    user: null,
                    userId: null,
                    userConProfile: null,
                  });
                  this.props.history.replace('/user_con_profiles');
                } catch (error) {
                  this.setState({ error, mutationInProgress: false });
                }
              }}
              disabled={this.state.userId == null || this.state.mutationInProgress}
            >
              { this.state.mutationInProgress ? <LoadingIndicator /> : 'Add' }
            </button>
          )}
        </Mutation>
      </div>
    </Modal>
  )
}

AddAttendeeModal.propTypes = {
  conventionName: PropTypes.string.isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
  visible: PropTypes.bool.isRequired,
};

export default withRouter(AddAttendeeModal);
