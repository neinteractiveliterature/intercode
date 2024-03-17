import { useId, useState } from 'react';
import * as React from 'react';
import Select from 'react-select';
import {
  BootstrapFormInput,
  BootstrapFormCheckbox,
  useConfirm,
  MultipleChoiceInput,
  usePropertySetters,
} from '@neinteractiveliterature/litform';

import UserConProfileSelect from '../BuiltInFormControls/UserConProfileSelect';
import UserSelect from '../BuiltInFormControls/UserSelect';
import { DefaultUserConProfilesQueryData } from '../BuiltInFormControls/selectDefaultQueries.generated';
import { UserActivityAlertsAdminQueryData } from './queries.generated';

type AlertType = UserActivityAlertsAdminQueryData['convention']['user_activity_alerts'][number];

export type UserActivityAlertFormProps = {
  convention: Pick<UserActivityAlertsAdminQueryData['convention'], 'ticket_name' | 'ticket_mode' | 'staff_positions'>;
  disabled?: boolean;
  userActivityAlert: AlertType;
  onChange: React.Dispatch<React.SetStateAction<AlertType>>;
  onAddNotificationDestination: React.Dispatch<Omit<AlertType['notification_destinations'][number], 'id'>>;
  onRemoveNotificationDestination: React.Dispatch<string>;
};

function UserActivityAlertForm({
  userActivityAlert,
  onChange,
  onAddNotificationDestination,
  onRemoveNotificationDestination,
  convention,
  disabled,
}: UserActivityAlertFormProps): JSX.Element {
  const userSelectId = useId();
  const confirm = useConfirm();
  const [addDestinationType, setAddDestinationType] = useState<string | null>(null);
  const addStaffPositionDestination = (staffPosition: (typeof convention)['staff_positions'][0]) => {
    onAddNotificationDestination({
      __typename: 'NotificationDestination',
      staff_position: staffPosition,
    });
    setAddDestinationType(null);
  };

  const addUserConProfileDestination = (
    userConProfile: NonNullable<
      DefaultUserConProfilesQueryData['convention']
    >['user_con_profiles_paginated']['entries'][0],
  ) => {
    onAddNotificationDestination({
      __typename: 'NotificationDestination',
      user_con_profile: userConProfile,
    });
    setAddDestinationType(null);
  };

  const [setPartialName, setEmail, setUser, setTriggerOnUserConProfileCreate, setTriggerOnTicketCreate] =
    usePropertySetters(
      onChange,
      'partial_name',
      'email',
      'user',
      'trigger_on_user_con_profile_create',
      'trigger_on_ticket_create',
    );

  return (
    <>
      <div className="card">
        <div className="card-header">Matching</div>

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

          <div className="mb-3 mb-0">
            <label className="form-label" htmlFor={userSelectId}>
              User account
            </label>
            <UserSelect
              inputId={userSelectId}
              value={userActivityAlert.user}
              onChange={setUser}
              isDisabled={disabled}
            />
            <small className="form-text text-muted">Matches across all conventions using this server.</small>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">Trigger events</div>

        <div className="card-body">
          <BootstrapFormCheckbox
            name="trigger_on_user_con_profile_create"
            label="Trigger on profile creation"
            type="checkbox"
            checked={userActivityAlert.trigger_on_user_con_profile_create}
            onCheckedChange={setTriggerOnUserConProfileCreate}
            disabled={disabled}
          />

          {convention.ticket_mode !== 'disabled' && (
            <BootstrapFormCheckbox
              name="trigger_on_ticket_create"
              label={`Trigger on ${convention.ticket_name} creation`}
              type="checkbox"
              checked={userActivityAlert.trigger_on_ticket_create}
              onCheckedChange={setTriggerOnTicketCreate}
              disabled={disabled}
            />
          )}
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">Alert destinations</div>

        <ul className="list-group list-group-flush">
          {userActivityAlert.notification_destinations.map((notificationDestination) => (
            <li key={notificationDestination.id} className="list-group-item">
              <div className="d-flex">
                <div className="flex-grow-1">
                  {notificationDestination.staff_position ? (
                    <>
                      <strong>Staff position:</strong> {notificationDestination.staff_position.name}
                    </>
                  ) : (
                    <>
                      <strong>User:</strong> {notificationDestination.user_con_profile?.name_without_nickname}
                    </>
                  )}
                </div>
                <button
                  className="btn btn-sm btn-danger"
                  type="button"
                  onClick={() =>
                    confirm({
                      action: () => onRemoveNotificationDestination(notificationDestination.id),
                      prompt: 'Are you sure you want to remove this alert destination?',
                    })
                  }
                  disabled={disabled}
                >
                  <i className="bi-trash" />
                  <span className="visually-hidden">Remove destination</span>
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
                getOptionValue={(option) => option.id.toString()}
                getOptionLabel={(option) => option.name}
                value={null}
                onChange={addStaffPositionDestination}
                isDisabled={disabled}
              />
            )}

            {addDestinationType === 'user_con_profile' && (
              <UserConProfileSelect value={null} onChange={addUserConProfileDestination} isDisabled={disabled} />
            )}
          </li>
        </ul>
      </div>
    </>
  );
}

export default UserActivityAlertForm;
