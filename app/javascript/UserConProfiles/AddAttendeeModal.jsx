import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import ErrorDisplay from '../ErrorDisplay';
import Form from '../Models/Form';
import LoadingIndicator from '../LoadingIndicator';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import UserConProfileForm from './UserConProfileForm';
import UserSelect from '../BuiltInFormControls/UserSelect';

const usersQuery = gql`
query AddAttendeeUsersQuery($name: String) {
  users_paginated(filters: { name: $name }, per_page: 50) {
    entries {
      id
      name
      first_name
      last_name
    }
  }
}
`;

const userConProfileFormQuery = gql`
query AddAttendeeUserConProfileFormQuery {
  convention {
    id
    privilege_names
    mail_privilege_names

    user_con_profile_form {
      id
      form_api_json
    }
  }
}
`;

const createUserConProfileMutation = gql`
mutation CreateUserConProfile($user_id: Int!, $user_con_profile: UserConProfileInput!) {
  createUserConProfile(input: { user_id: $user_id, user_con_profile: $user_con_profile }) {
    user_con_profile {
      id
    }
  }
}
`;

@withRouter
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
      <QueryWithStateDisplay query={userConProfileFormQuery}>
        {({ data }) => (
          <UserConProfileForm
            canUpdatePrivileges
            userConProfile={this.state.userConProfile}
            regularPrivilegeNames={data.convention.privilege_names
              .filter(priv => priv !== 'site_admin' && !data.convention.mail_privilege_names.includes(priv))}
            mailPrivilegeNames={data.convention.mail_privilege_names}
            onChange={this.userConProfileChanged}
            form={
              Form.fromApiResponse(JSON.parse(data.convention.user_con_profile_form.form_api_json))
            }
            convention={data.convention}
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

        <UserSelect value={this.state.user} onChange={this.userSelected} usersQuery={usersQuery} />

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
        <Mutation mutation={createUserConProfileMutation}>
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

export default AddAttendeeModal;
