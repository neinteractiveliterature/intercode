import { useId } from 'react';
import * as React from 'react';
import { BootstrapFormInput, BootstrapFormCheckbox, usePropertySetters } from '@neinteractiveliterature/litform';

import UserSelect from '../BuiltInFormControls/UserSelect';
import { UserActivityAlertsAdminQueryData } from './queries.generated';
import { useTranslation } from 'react-i18next';
import NotificationDestinationsConfig from 'NotificationAdmin/NotificationDestinationsConfig';
import { NotificationEvent } from 'graphqlTypes.generated';

type AlertType = UserActivityAlertsAdminQueryData['convention']['user_activity_alerts'][number];

export type UserActivityAlertFormProps = {
  convention: Pick<
    UserActivityAlertsAdminQueryData['convention'],
    'ticket_name' | 'ticket_mode' | 'staff_positions' | 'event_categories'
  >;
  disabled?: boolean;
  userActivityAlert: AlertType;
  onChange: React.Dispatch<React.SetStateAction<AlertType>>;
  onAddNotificationDestination: React.Dispatch<Omit<AlertType['notification_destinations'][number], 'id'>>;
  onRemoveNotificationDestination: React.Dispatch<string>;
  userActivityAlertEvent: Pick<NotificationEvent, 'allowed_condition_types' | 'allowed_dynamic_destinations'>;
};

function UserActivityAlertForm({
  userActivityAlert,
  onChange,
  onAddNotificationDestination,
  onRemoveNotificationDestination,
  convention,
  disabled,
  userActivityAlertEvent,
}: UserActivityAlertFormProps): React.JSX.Element {
  const { t } = useTranslation();
  const userSelectId = useId();

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

      <div className="mt-4">
        <NotificationDestinationsConfig
          addDestination={onAddNotificationDestination}
          removeDestination={onRemoveNotificationDestination}
          notificationDestinations={userActivityAlert.notification_destinations}
          disabled={disabled}
          staffPositions={convention.staff_positions}
          eventCategories={convention.event_categories}
          allowedDynamicDestinations={userActivityAlertEvent.allowed_dynamic_destinations}
          allowedConditionTypes={userActivityAlertEvent.allowed_condition_types}
        />
      </div>
    </>
  );
}

export default UserActivityAlertForm;
