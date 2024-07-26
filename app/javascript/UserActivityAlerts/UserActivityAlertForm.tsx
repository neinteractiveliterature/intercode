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
import { Trans, useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
        <div className="card-header">{t('admin.userActivityAlerts.matchingHeader')}</div>

        <div className="card-body">
          <BootstrapFormInput
            name="partial_name"
            label={t('admin.userActivityAlerts.partialName.label')}
            helpText={t('admin.userActivityAlerts.partialName.helpText')}
            value={userActivityAlert.partial_name || ''}
            onTextChange={setPartialName}
            disabled={disabled}
          />

          <BootstrapFormInput
            name="email"
            type="email"
            label={t('admin.userActivityAlerts.email.label')}
            helpText={t('admin.userActivityAlerts.email.helpText')}
            value={userActivityAlert.email || ''}
            onTextChange={setEmail}
            disabled={disabled}
          />

          <div className="mb-3 mb-0">
            <label className="form-label" htmlFor={userSelectId}>
              {t('admin.userActivityAlerts.user.label')}
            </label>
            <UserSelect
              inputId={userSelectId}
              value={userActivityAlert.user}
              onChange={setUser}
              isDisabled={disabled}
            />
            <small className="form-text text-muted">{t('admin.userActivityAlerts.user.helpText')}</small>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">{t('admin.userActivityAlerts.triggerEventsHeader')}</div>

        <div className="card-body">
          <BootstrapFormCheckbox
            name="trigger_on_user_con_profile_create"
            label={t('admin.userActivityAlerts.triggerOnUserConProfileCreate')}
            type="checkbox"
            checked={userActivityAlert.trigger_on_user_con_profile_create}
            onCheckedChange={setTriggerOnUserConProfileCreate}
            disabled={disabled}
          />

          {convention.ticket_mode !== 'disabled' && (
            <BootstrapFormCheckbox
              name="trigger_on_ticket_create"
              label={t('admin.userActivityAlerts.triggerOnTicketCreate', { ticketName: convention.ticket_name })}
              type="checkbox"
              checked={userActivityAlert.trigger_on_ticket_create}
              onCheckedChange={setTriggerOnTicketCreate}
              disabled={disabled}
            />
          )}
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">{t('admin.userActivityAlerts.alertDestinations.header')}</div>

        <ul className="list-group list-group-flush">
          {userActivityAlert.notification_destinations.map((notificationDestination) => (
            <li key={notificationDestination.id} className="list-group-item">
              <div className="d-flex">
                <div className="flex-grow-1">
                  {notificationDestination.staff_position ? (
                    <Trans
                      i18nKey="admin.userActivityAlerts.alertDestinations.staffPosition"
                      values={{ staffPositionName: notificationDestination.staff_position.name }}
                    />
                  ) : (
                    <Trans
                      i18nKey="admin.userActivityAlerts.alertDestinations.userConProfile"
                      values={{ name: notificationDestination.user_con_profile?.name_without_nickname }}
                    />
                  )}
                </div>
                <button
                  className="btn btn-sm btn-danger"
                  type="button"
                  onClick={() =>
                    confirm({
                      action: () => onRemoveNotificationDestination(notificationDestination.id),
                      prompt: t('admin.userActivityAlerts.alertDestinations.removePrompt'),
                    })
                  }
                  disabled={disabled}
                >
                  <i className="bi-trash" />
                  <span className="visually-hidden">
                    {t('admin.userActivityAlerts.alertDestinations.removeButton')}
                  </span>
                </button>
              </div>
            </li>
          ))}
          <li className="list-group-item">
            <MultipleChoiceInput
              caption={t('admin.userActivityAlerts.alertDestinations.addDestination.caption')}
              name="addDestinationType"
              choices={[
                {
                  label: t('admin.userActivityAlerts.alertDestinations.addDestination.staffPositionType'),
                  value: 'staff_position',
                },
                {
                  label: t('admin.userActivityAlerts.alertDestinations.addDestination.userConProfileType'),
                  value: 'user_con_profile',
                },
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
