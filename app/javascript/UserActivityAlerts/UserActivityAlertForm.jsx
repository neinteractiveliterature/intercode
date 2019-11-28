import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import BootstrapFormCheckbox from '../BuiltInFormControls/BootstrapFormCheckbox';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import { useConfirm } from '../ModalDialogs/Confirm';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import UserConProfileSelect from '../BuiltInFormControls/UserConProfileSelect';
import UserSelect from '../BuiltInFormControls/UserSelect';
import useUniqueId from '../useUniqueId';

function UserActivityAlertForm({
  userActivityAlert, onChange, onAddAlertDestination, onRemoveAlertDestination,
  convention, disabled,
}) {
  const userSelectId = useUniqueId('user-');
  const confirm = useConfirm();
  const [addDestinationType, setAddDestinationType] = useState(null);
  const addStaffPositionDestination = (staffPosition) => {
    onAddAlertDestination({ staff_position: staffPosition });
    setAddDestinationType(null);
  };

  const addUserConProfileDestination = (userConProfile) => {
    onAddAlertDestination({ user_con_profile: userConProfile });
    setAddDestinationType(null);
  };

  const [
    setPartialName,
    setEmail,
    setUser,
    setTriggerOnUserConProfileCreate,
    setTriggerOnTicketCreate,
  ] = useMemo(
    () => [
      'partial_name',
      'email',
      'user',
      'trigger_on_user_con_profile_create',
      'trigger_on_ticket_create',
    ].map((field) => (value) => onChange({ ...userActivityAlert, [field]: value })),
    [onChange, userActivityAlert],
  );

  return (
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
            value={userActivityAlert.partial_name || ''}
            onTextChange={setPartialName}
            disabled={disabled}
          />

          <BootstrapFormInput
            name="email"
            type="email"
            label="Email"
            helpText="If the user's email address matches this string, the alert will match.  Case insensitive, ignores dots before the @ and any text following a + sign."
            value={userActivityAlert.email || ''}
            onTextChange={setEmail}
            disabled={disabled}
          />

          <div className="form-group mb-0">
            <label htmlFor={userSelectId}>User account</label>
            <UserSelect
              inputId={userSelectId}
              value={userActivityAlert.user}
              onChange={setUser}
              disabled={disabled}
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
            checked={userActivityAlert.trigger_on_user_con_profile_create}
            onCheckedChange={setTriggerOnUserConProfileCreate}
            disabled={disabled}
          />

          {
            convention.ticket_mode !== 'disabled' && (
              <BootstrapFormCheckbox
                name="trigger_on_ticket_create"
                label={`Trigger on ${convention.ticket_name} creation`}
                type="checkbox"
                checked={userActivityAlert.trigger_on_ticket_create}
                onCheckedChange={setTriggerOnTicketCreate}
                disabled={disabled}
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
          {userActivityAlert.alert_destinations.map((alertDestination) => (
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
                <button
                  className="btn btn-sm btn-danger"
                  type="button"
                  onClick={() => confirm({
                    action: () => onRemoveAlertDestination(alertDestination.id),
                    prompt: 'Are you sure you want to remove this alert destination?',
                  })}
                  disabled={disabled}
                >
                  <i className="fa fa-trash-o" />
                  <span className="sr-only">Remove destination</span>
                </button>
              </div>
            </li>
          ))}
          <li className="list-group-item">
            <MultipleChoiceInput
              caption="Add destination"
              name="addDestinationType"
              choices={[
                { label: 'Staff position', value: 'staff_position' },
                { label: 'User', value: 'user_con_profile' },
              ]}
              value={addDestinationType}
              onChange={setAddDestinationType}
              choiceClassName="form-check-inline"
              disabled={disabled}
            />

            {addDestinationType === 'staff_position' && (
              <Select
                options={convention.staff_positions}
                isClearable
                getOptionValue={(option) => option.id}
                getOptionLabel={(option) => option.name}
                value={null}
                onChange={addStaffPositionDestination}
                disabled={disabled}
              />
            )}

            {addDestinationType === 'user_con_profile' && (
              <UserConProfileSelect
                value={null}
                onChange={addUserConProfileDestination}
                disabled={disabled}
              />
            )}
          </li>
        </ul>
      </div>
    </>
  );
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
