import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';

import Form from '../Models/Form';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import UserConProfileForm from './UserConProfileForm';
import UserSelect from '../BuiltInFormControls/UserSelect';

export const usersQuery = gql`
query($name: String) {
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
query {
  convention {
    privilege_names
    mail_privilege_names

    user_con_profile_form {
      form_api_json
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

  cancel = () => { this.props.history.replace('/'); }

  submit = () => {

  }

  userSelected = (user) => {
    this.setState({
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
            userConProfile={this.state.userConProfile}
            regularPrivilegeNames={data.convention.privilege_names
              .filter(priv => priv !== 'site_admin' && !data.convention.mail_privilege_names.includes(priv))}
            mailPrivilegeNames={data.convention.mail_privilege_names}
            onChange={this.userConProfileChanged}
            form={Form.fromApiResponse(JSON.parse(data.convention.user_con_profile_form.form_api_json))}
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

        <UserSelect onChange={this.userSelected} usersQuery={usersQuery} />

        {
          this.state.userId
            ? this.renderForm()
            : null
        }
      </div>
      <div className="modal-footer">
        <button
          className="btn btn-secondary"
          type="button"
          onClick={this.cancel}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={this.submit}
          disabled={this.state.userId == null}
        >
          Add
        </button>
      </div>
    </Modal>
  )
}

export default AddAttendeeModal;
