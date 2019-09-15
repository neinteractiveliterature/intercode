import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';
import Select from 'react-select';

import BootstrapFormCheckbox from '../BuiltInFormControls/BootstrapFormCheckbox';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import Confirm from '../ModalDialogs/Confirm';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import { mutator, Transforms } from '../ComposableFormUtils';
import UserConProfileSelect from '../BuiltInFormControls/UserConProfileSelect';
import UserSelect from '../BuiltInFormControls/UserSelect';

class UserActivityAlertForm extends React.Component {
  constructor(props) {
    super(props);

    enableUniqueIds(this);

    this.state = {
      addDestinationType: null,
    };

    this.userActivityAlertMutator = mutator({
      getState: () => this.props.userActivityAlert,
      setState: this.props.onChange,
      transforms: {
        partial_name: Transforms.identity,
        email: Transforms.identity,
        user: Transforms.identity,
        trigger_on_user_con_profile_create: Transforms.identity,
        trigger_on_ticket_create: Transforms.identity,
      },
    });

    this.localStateMutator = mutator({
      component: this,
      transforms: {
        addDestinationType: Transforms.identity,
      },
    });
  }

  addStaffPositionDestination = (staffPosition) => {
    this.props.onAddAlertDestination({ staff_position: staffPosition });
    this.setState({ addDestinationType: null });
  }

  addUserConProfileDestination = (userConProfile) => {
    this.props.onAddAlertDestination({ user_con_profile: userConProfile });
    this.setState({ addDestinationType: null });
  }

  render = () => (
    <>
      <div className="card">
        <div className="card-header">
          Matching
        </div>

        <div className="card-body">
          <BootstrapFormInput
            name="partial_name"
            label="Partial name"
            helpText="If any part of the user's name matches this string, the alert will match.  Case insensitive."
            value={this.props.userActivityAlert.partial_name || ''}
            onTextChange={this.userActivityAlertMutator.partial_name}
            disabled={this.props.disabled}
          />

          <BootstrapFormInput
            name="email"
            type="email"
            label="Email"
            helpText="If the user's email address matches this string, the alert will match.  Case insensitive, ignores dots before the @ and any text following a + sign."
            value={this.props.userActivityAlert.email || ''}
            onTextChange={this.userActivityAlertMutator.email}
            disabled={this.props.disabled}
          />

          <div className="form-group mb-0">
            <label htmlFor={this.nextUniqueId()}>User account</label>
            <UserSelect
              inputId={this.lastUniqueId()}
              value={this.props.userActivityAlert.user}
              onChange={this.userActivityAlertMutator.user}
              disabled={this.props.disabled}
            />
            <small className="form-text text-muted">Matches across all conventions using this server.</small>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          Trigger events
        </div>

        <div className="card-body">
          <BootstrapFormCheckbox
            name="trigger_on_user_con_profile_create"
            label="Trigger on profile creation"
            type="checkbox"
            checked={this.props.userActivityAlert.trigger_on_user_con_profile_create}
            onCheckedChange={this.userActivityAlertMutator.trigger_on_user_con_profile_create}
            disabled={this.props.disabled}
          />

          {
            this.props.convention.ticket_mode !== 'disabled' && (
              <BootstrapFormCheckbox
                name="trigger_on_ticket_create"
                label={`Trigger on ${this.props.convention.ticket_name} creation`}
                type="checkbox"
                checked={this.props.userActivityAlert.trigger_on_ticket_create}
                onCheckedChange={this.userActivityAlertMutator.trigger_on_ticket_create}
                disabled={this.props.disabled}
              />
            )
          }
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          Alert destinations
        </div>

        <ul className="list-group list-group-flush">
          {this.props.userActivityAlert.alert_destinations.map((alertDestination) => (
            <li key={alertDestination.id} className="list-group-item">
              <div className="d-flex">
                <div className="flex-grow-1">
                  {
                  alertDestination.staff_position
                    ? (
                      <>
                        <strong>Staff position:</strong>
                        {' '}
                        {alertDestination.staff_position.name}
                      </>
                    )
                    : (
                      <>
                        <strong>User:</strong>
                        {' '}
                        {alertDestination.user_con_profile.name_without_nickname}
                      </>
                    )
                  }
                </div>
                <Confirm.Trigger>
                  {(confirm) => (
                    <button
                      className="btn btn-sm btn-danger"
                      type="button"
                      onClick={() => confirm({
                        action: () => this.props.onRemoveAlertDestination(alertDestination.id),
                        prompt: 'Are you sure you want to remove this alert destination?',
                      })}
                      disabled={this.props.disabled}
                    >
                      <i className="fa fa-trash-o" />
                      <span className="sr-only">Remove destination</span>
                    </button>
                  )}
                </Confirm.Trigger>
              </div>
            </li>
          ))}
          <li className="list-group-item">
            <MultipleChoiceInput
              caption="Add destination"
              name="addDestinationType"
              choices={[{ label: 'Staff position', value: 'staff_position' }, { label: 'User', value: 'user_con_profile' }]}
              value={this.state.addDestinationType}
              onChange={this.localStateMutator.addDestinationType}
              choiceClassName="form-check-inline"
              disabled={this.props.disabled}
            />

            {
              this.state.addDestinationType === 'staff_position'
                ? (
                  <>
                    <Select
                      options={this.props.convention.staff_positions}
                      isClearable
                      getOptionValue={(option) => option.id}
                      getOptionLabel={(option) => option.name}
                      value={null}
                      onChange={(value) => this.addStaffPositionDestination(value)}
                      disabled={this.props.disabled}
                    />
                    <button className="btn btn-primary mt-2" type="button" onClick={this.addDestination} disabled={this.props.disabled}>
                      Add destination
                    </button>
                  </>
                )
                : null
            }

            {
              this.state.addDestinationType === 'user_con_profile'
                ? (
                  <>
                    <UserConProfileSelect
                      value={null}
                      onChange={(value) => this.addUserConProfileDestination(value)}
                      disabled={this.props.disabled}
                    />
                    <button className="btn btn-primary mt-2" type="button" onClick={this.addDestination} disabled={this.props.disabled}>
                      Add destination
                    </button>
                  </>
                )
                : null
            }
          </li>
        </ul>
      </div>
    </>
  )
}

UserActivityAlertForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  onAddAlertDestination: PropTypes.func.isRequired,
  onRemoveAlertDestination: PropTypes.func.isRequired,
  userActivityAlert: PropTypes.shape({
    id: PropTypes.number.isRequired,
    partial_name: PropTypes.string,
    email: PropTypes.string,
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    trigger_on_ticket_create: PropTypes.bool,
    trigger_on_user_con_profile_create: PropTypes.bool,
    alert_destinations: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      staff_position: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
      user_con_profile: PropTypes.shape({
        name_without_nickname: PropTypes.string,
      }),
    })).isRequired,
  }).isRequired,
  convention: PropTypes.shape({
    staff_positions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    ticket_name: PropTypes.string.isRequired,
    ticket_mode: PropTypes.string.isRequired,
  }).isRequired,
  disabled: PropTypes.bool,
};

UserActivityAlertForm.defaultProps = {
  disabled: false,
};

export default UserActivityAlertForm;
