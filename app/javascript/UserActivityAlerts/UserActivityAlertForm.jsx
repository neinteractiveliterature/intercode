import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';
import Select from 'react-select';

import BootstrapFormCheckbox from '../BuiltInFormControls/BootstrapFormCheckbox';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import Confirm from '../ModalDialogs/Confirm';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import {
  componentLocalStateUpdater,
  stateUpdater,
  combineStateChangeCalculators,
  Transforms,
} from '../ComposableFormUtils';
import UserConProfileSelect from '../BuiltInFormControls/UserConProfileSelect';
import UserSelect from '../BuiltInFormControls/UserSelect';

function addToChangeSet(changeSet, value) {
  return [
    ...changeSet,
    {
      changeType: 'add',
      generatedId: new Date().getTime(),
      value,
    },
  ];
}

function removeFromChangeSet(changeSet, id) {
  if (changeSet.some(change => change.generatedId === id)) {
    return changeSet.filter(change => change.generatedId !== id);
  }

  return [
    ...changeSet,
    { changeType: 'remove', id },
  ];
}

function applyChangeSet(array, changeSet) {
  return changeSet.reduce((currentValue, change) => {
    if (change.changeType === 'add') {
      return [...currentValue, { ...change.value, id: change.generatedId }];
    }

    if (change.changeType === 'remove') {
      return currentValue.filter(value => value.id !== change.id);
    }

    return currentValue;
  }, array);
}

const BLANK_ADD_DESTINATION = {
  type: null,
  userConProfile: null,
  staffPosition: null,
};

class UserActivityAlertForm extends React.Component {
  static propTypes = {
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
    }).isRequired,
    disabled: PropTypes.bool,
  }

  defaultProps = {
    disabled: false,
  }

  constructor(props) {
    super(props);

    enableUniqueIds(this);

    this.state = {
      addDestination: BLANK_ADD_DESTINATION,
    };

    this.stateUpdater = stateUpdater(
      () => this.props.userActivityAlert,
      this.props.onChange,
      combineStateChangeCalculators({
        partial_name: Transforms.textInputChange,
        email: Transforms.textInputChange,
        user: Transforms.identity,
        trigger_on_user_con_profile_create: Transforms.checkboxChange,
        trigger_on_ticket_create: Transforms.checkboxChange,
      }),
    );

    this.localStateUpdater = componentLocalStateUpdater(this, combineStateChangeCalculators({
      addDestination: {
        type: Transforms.identity,
        userConProfile: Transforms.identity,
        staffPosition: Transforms.identity,
      },
    }));
  }

  addDestination = () => {
    if (this.state.addDestination.type === 'staff_position') {
      this.props.onAddAlertDestination({ staff_position: this.state.addDestination.staffPosition });
      this.setState({ addDestination: BLANK_ADD_DESTINATION });
    } else if (this.state.addDestination.type === 'user_con_profile') {
      this.props.onAddAlertDestination({
        user_con_profile: this.state.addDestination.userConProfile,
      });
      this.setState({ addDestination: BLANK_ADD_DESTINATION });
    }
  }

  render = () => (
    <React.Fragment>
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
            onChange={this.stateUpdater.partial_name}
            disabled={this.props.disabled}
          />

          <BootstrapFormInput
            name="email"
            type="email"
            label="Email"
            helpText="If the user's email address matches this string, the alert will match.  Case insensitive, ignores dots before the @ and any text following a + sign."
            value={this.props.userActivityAlert.email || ''}
            onChange={this.stateUpdater.email}
            disabled={this.props.disabled}
          />

          <div className="form-group mb-0">
            <label htmlFor={this.nextUniqueId()}>User account</label>
            <UserSelect
              inputId={this.lastUniqueId()}
              value={this.props.userActivityAlert.user}
              onChange={this.stateUpdater.user}
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
            onChange={this.stateUpdater.trigger_on_user_con_profile_create}
            disabled={this.props.disabled}
          />

          <BootstrapFormCheckbox
            name="trigger_on_ticket_create"
            label={`Trigger on ${this.props.convention.ticket_name} creation`}
            type="checkbox"
            checked={this.props.userActivityAlert.trigger_on_ticket_create}
            onChange={this.stateUpdater.trigger_on_ticket_create}
            disabled={this.props.disabled}
          />
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          Alert destinations
        </div>

        <ul className="list-group list-group-flush">
          {this.props.userActivityAlert.alert_destinations.map(alertDestination => (
            <li key={alertDestination.id} className="list-group-item">
              <div className="d-flex">
                <div className="flex-grow-1">
                  {
                  alertDestination.staff_position
                    ? (
                      <React.Fragment>
                        <strong>Staff position:</strong>
                        {' '}
                        {alertDestination.staff_position.name}
                      </React.Fragment>
                    )
                    : (
                      <React.Fragment>
                        <strong>User:</strong>
                        {' '}
                        {alertDestination.user_con_profile.name_without_nickname}
                      </React.Fragment>
                    )
                  }
                </div>
                <Confirm.Trigger>
                  {confirm => (
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
              value={this.state.addDestination.type}
              onChange={this.localStateUpdater.addDestination.type}
              choiceClassName="form-check-inline"
              disabled={this.props.disabled}
            />

            {
              this.state.addDestination.type === 'staff_position'
                ? (
                  <React.Fragment>
                    <Select
                      options={this.props.convention.staff_positions}
                      getOptionValue={option => option.id}
                      getOptionLabel={option => option.name}
                      value={this.state.addDestination.staffPosition}
                      onChange={this.localStateUpdater.addDestination.staffPosition}
                      disabled={this.props.disabled}
                    />
                    <button className="btn btn-primary mt-2" type="button" onClick={this.addDestination} disabled={this.props.disabled}>
                      Add destination
                    </button>
                  </React.Fragment>
                )
                : null
            }

            {
              this.state.addDestination.type === 'user_con_profile'
                ? (
                  <React.Fragment>
                    <UserConProfileSelect
                      value={this.state.addDestination.userConProfile}
                      onChange={this.localStateUpdater.addDestination.userConProfile}
                      disabled={this.props.disabled}
                    />
                    <button className="btn btn-primary mt-2" type="button" onClick={this.addDestination} disabled={this.props.disabled}>
                      Add destination
                    </button>
                  </React.Fragment>
                )
                : null
            }
          </li>
        </ul>
      </div>
    </React.Fragment>
  )
}

export default UserActivityAlertForm;
