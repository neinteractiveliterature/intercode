import { MultipleChoiceInput, useGraphQLConfirm } from '@neinteractiveliterature/litform';
import { DefaultUserConProfilesQueryData } from 'BuiltInFormControls/selectDefaultQueries.generated';
import UserConProfileSelect from 'BuiltInFormControls/UserConProfileSelect';
import { NotificationDestination, StaffPosition } from 'graphqlTypes.generated';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Select from 'react-select';

type NotificationDestinationType = Pick<NotificationDestination, 'id' | '__typename'> & {
  staff_position?: Pick<StaffPosition, 'id' | 'name' | '__typename'> | null;
  user_con_profile?:
    | NonNullable<DefaultUserConProfilesQueryData['convention']>['user_con_profiles_paginated']['entries'][number]
    | null;
};

export type NotificationDestinationsConfigProps<T extends NotificationDestinationType> = {
  disabled?: boolean;
  staffPositions: Pick<StaffPosition, 'id' | 'name'>[];
  notificationDestinations: T[];
  addDestination: (destination: T) => void;
  removeDestination: (id: string) => void;
};

export default function NotificationDestinationsConfig<T extends NotificationDestinationType>({
  notificationDestinations,
  disabled,
  staffPositions,
  addDestination,
  removeDestination,
}: NotificationDestinationsConfigProps<T>) {
  const { t } = useTranslation();
  const confirm = useGraphQLConfirm();

  const [addDestinationType, setAddDestinationType] = useState<string | null>(null);
  const addStaffPositionDestination = (staffPosition: (typeof staffPositions)[number]) => {
    addDestination({
      __typename: 'NotificationDestination',
      staff_position: staffPosition,
    } as T);
    setAddDestinationType(null);
  };

  const addUserConProfileDestination = (
    userConProfile: NonNullable<
      DefaultUserConProfilesQueryData['convention']
    >['user_con_profiles_paginated']['entries'][number],
  ) => {
    addDestination({
      __typename: 'NotificationDestination',
      user_con_profile: userConProfile,
    } as T);
    setAddDestinationType(null);
  };

  return (
    <div className="card">
      <div className="card-header">{t('admin.notifications.destinations.header')}</div>

      <ul className="list-group list-group-flush">
        {notificationDestinations.map((notificationDestination) => (
          <li key={notificationDestination.id} className="list-group-item">
            <div className="d-flex">
              <div className="flex-grow-1">
                {notificationDestination.staff_position ? (
                  <Trans
                    i18nKey="admin.notifications.destinations.staffPosition"
                    values={{ staffPositionName: notificationDestination.staff_position.name }}
                  />
                ) : (
                  <Trans
                    i18nKey="admin.notifications.destinations.userConProfile"
                    values={{ name: notificationDestination.user_con_profile?.name_without_nickname }}
                  />
                )}
              </div>
              <button
                className="btn btn-sm btn-danger"
                type="button"
                onClick={() =>
                  confirm({
                    action: () => removeDestination(notificationDestination.id),
                    prompt: t('admin.notifications.destinations.removePrompt'),
                  })
                }
                disabled={disabled}
              >
                <i className="bi-trash" />
                <span className="visually-hidden">{t('admin.notifications.destinations.removeButton')}</span>
              </button>
            </div>
          </li>
        ))}
        <li className="list-group-item">
          <MultipleChoiceInput
            caption={t('admin.notifications.destinations.addDestination.caption')}
            name="addDestinationType"
            choices={[
              {
                label: t('admin.notifications.destinations.addDestination.staffPositionType'),
                value: 'staff_position',
              },
              {
                label: t('admin.notifications.destinations.addDestination.userConProfileType'),
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
              options={staffPositions}
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
  );
}
