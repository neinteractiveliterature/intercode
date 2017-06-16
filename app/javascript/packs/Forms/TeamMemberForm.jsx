import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';
import BootstrapFormCheckbox from '../FormControls/BootstrapFormCheckbox';
import BootstrapFormInput from '../FormControls/BootstrapFormInput';
import ResourceForm from './ResourceForm';
import UserConProfileSelect from '../FormControls/UserConProfileSelect';
import { performRequest } from '../HTTPUtils';

class TeamMemberForm extends React.Component {
  static propTypes = {
    baseUrl: PropTypes.string.isRequired,
    initialTeamMember: PropTypes.shape({
      id: PropTypes.number,
      user_con_profile_id: PropTypes.number,
      display: PropTypes.bool.isRequired,
      show_email: PropTypes.bool.isRequired,
      receive_con_email: PropTypes.bool.isRequired,
      receive_signup_email: PropTypes.bool.isRequired,
    }).isRequired,
    teamMemberName: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);

    this.state = {
      teamMember: { ...this.props.initialTeamMember }
    }
  }

  getSubmitText = () => (
    `${this.state.teamMember.id ? 'Update' : 'Add'} ${this.props.teamMemberName}`
  )

  getSubmitRequestBody = () => ({
    team_member: this.state.teamMember,
  })

  checkboxChanged = (event) => {
    this.setState({
      teamMember: { ...this.state.teamMember, [event.target.name]: event.target.checked },
    });
  }

  userConProfileIdChanged = (selection) => {
    this.setState({
      teamMember: { ...this.state.teamMember, user_con_profile_id: selection.value },
    });
  }

  deleteClicked = () => {
    if (!confirm(`Are you sure you want to delete this ${this.props.teamMemberName}?`)) {
      return;
    }

    performRequest(`${this.props.baseUrl}/${this.state.teamMember.id}`, {
      method: 'DELETE',
    }).then(() => {
      window.location.href = this.props.baseUrl;
    });
  }

  renderDeleteButtonItem = (submitDisabled) => {
    if (!this.state.teamMember.id) {
      return null;
    }

    return (
      <li className="list-inline-item">
        <button
          type="button"
          className="btn btn-danger"
          onClick={this.deleteClicked}
          disabled={submitDisabled}
        >
          {`Remove ${this.props.teamMemberName}`}
        </button>
      </li>
    );
  }

  renderSubmitSection = (onClick, submitDisabled) => (
    <ul className="list-inline">
      <li className="list-inline-item">
        <input
          type="submit"
          className="btn btn-primary"
          onClick={onClick}
          value={this.getSubmitText()}
          disabled={submitDisabled}
        />
      </li>
      {this.renderDeleteButtonItem(submitDisabled)}
    </ul>
  )

  renderUserConProfileSelect = () => {
    if (this.state.teamMember.id) {
      // can't change the user once the record is created
      return null;
    }

    const userConProfileSelectId = this.nextUniqueId();

    return (
      <div className="form-group">
        <label htmlFor={userConProfileSelectId}>
          {`${this.props.teamMemberName} name`}
        </label>
        <UserConProfileSelect
          id={userConProfileSelectId}
          value={this.state.teamMember.user_con_profile_id}
          onChange={this.userConProfileIdChanged}
        />
      </div>
    );
  }

  render = () => (
    <ResourceForm
      baseUrl={this.props.baseUrl}
      resourceId={this.state.teamMember.id}
      getSubmitRequestBody={this.getSubmitRequestBody}
      renderSubmitSection={this.renderSubmitSection}
    >
      {this.renderUserConProfileSelect()}

      <BootstrapFormCheckbox
        label={`Display as ${this.props.teamMemberName}`}
        name="display"
        checked={this.state.teamMember.display}
        onChange={this.checkboxChanged}
      />

      <BootstrapFormCheckbox
        label="Show email address"
        name="show_email"
        checked={this.state.teamMember.show_email}
        onChange={this.checkboxChanged}
      />

      <BootstrapFormCheckbox
        label="Receive email from convention"
        name="receive_con_email"
        checked={this.state.teamMember.receive_con_email}
        onChange={this.checkboxChanged}
      />

      <BootstrapFormCheckbox
        label="Receive email on signup and withdrawal"
        name="receive_signup_email"
        checked={this.state.teamMember.receive_signup_email}
        onChange={this.checkboxChanged}
      />
    </ResourceForm>
  )
}

export default TeamMemberForm;
