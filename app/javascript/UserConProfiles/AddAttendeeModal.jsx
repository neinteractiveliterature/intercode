import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';

import { AddAttendeeUsersQuery, AddAttendeeUserConProfileFormQuery } from './queries.gql';
import { CreateUserConProfile } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import LoadingIndicator from '../LoadingIndicator';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import UserConProfileForm from './UserConProfileForm';
import UserSelect from '../BuiltInFormControls/UserSelect';
import { deserializeForm } from '../FormPresenter/GraphQLFormDeserialization';
import PrivilegesForm from './PrivilegesForm';

class AddAttendeeModal extends React.Component {
  static propTypes = {
    conventionName: PropTypes.string.isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    visible: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      userId: null,
      userConProfile: null,
    };
  }

  cancel = () => {
    this.setState({ user: null, userId: null, userConProfile: null });
    this.props.history.replace('/');
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
        privileges: [],
      },
    });
  }

  userConProfileChanged = (userConProfile) => { this.setState({ userConProfile }); }

  renderForm = () => (
    <div className="mt-4">
      <p>Profile data will be copied from user&rsquo;s latest convention profile.</p>

      <QueryWithStateDisplay query={AddAttendeeUserConProfileFormQuery}>
        {({ data }) => (
          <PrivilegesForm
            userConProfile={this.state.userConProfile}
            regularPrivilegeNames={data.convention.privilege_names
              .filter(priv => priv !== 'site_admin' && !data.convention.mail_privilege_names.includes(priv))}
            mailPrivilegeNames={data.convention.mail_privilege_names}
            onChange={this.userConProfileChanged}
          />
        )}
      </QueryWithStateDisplay>
    </div>
  )

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

        {
          this.state.userId
            ? this.renderForm()
            : null
        }

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
          {mutate => (
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
                        privileges: this.state.userConProfile.privileges,
                      },
                    },
                  });
                  this.setState({
                    mutationInProgress: false,
                    user: null,
                    userId: null,
                    userConProfile: null,
                  });
                  this.props.history.replace('/');
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

export default withRouter(AddAttendeeModal);
