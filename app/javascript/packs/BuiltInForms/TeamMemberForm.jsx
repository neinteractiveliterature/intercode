import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';
import { ConfirmModal } from 'react-bootstrap4-modal';
import BootstrapFormCheckbox from '../BuiltInFormControls/BootstrapFormCheckbox';
import ResourceForm from './ResourceForm';
import UserConProfileSelect from '../BuiltInFormControls/UserConProfileSelect';
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
      teamMember: { ...this.props.initialTeamMember },
      confirmingDelete: false,
    };
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
    this.setState({ confirmingDelete: true });
  }

  deleteConfirmed = () => {
    performRequest(`${this.props.baseUrl}/${this.state.teamMember.id}`, {
      method: 'DELETE',
    }).then(() => {
      window.location.href = this.props.baseUrl;
    }).catch(() => {
      this.deleteCanceled();
    });
  }

  deleteCanceled = () => {
    this.setState({ confirmingDelete: false });
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

  renderCheckboxes = () => {
    const checkboxes = [
      { name: 'display', label: `Display as ${this.props.teamMemberName}` },
      { name: 'show_email', label: 'Show email address' },
      { name: 'receive_con_email', label: 'Receive email from convention' },
      { name: 'receive_signup_email', label: 'Receive email on signup and withdrawal' },
    ];

    return checkboxes.map(checkbox => (
      <BootstrapFormCheckbox
        key={checkbox.name}
        label={checkbox.label}
        name={checkbox.name}
        checked={this.state.teamMember[checkbox.name]}
        onChange={this.checkboxChanged}
      />
    ));
  }

  render = () => (
    <ResourceForm
      baseUrl={this.props.baseUrl}
      resourceId={this.state.teamMember.id}
      getSubmitRequestBody={this.getSubmitRequestBody}
      renderSubmitSection={this.renderSubmitSection}
    >
      {this.renderUserConProfileSelect()}
      {this.renderCheckboxes()}

      <ConfirmModal
        title="Confirmation"
        onOK={this.deleteConfirmed}
        onCancel={this.deleteCanceled}
        visible={this.state.confirmingDelete}
      >
        {`Are you sure you want to remove this ${this.props.teamMemberName}?`}
      </ConfirmModal>
    </ResourceForm>
  )
}

export default TeamMemberForm;
