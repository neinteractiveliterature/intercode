import { MultipleChoiceInput, useGraphQLConfirm } from '@neinteractiveliterature/litform';
import { DefaultUserConProfilesQueryData } from 'BuiltInFormControls/selectDefaultQueries.generated';
import UserConProfileSelect from 'BuiltInFormControls/UserConProfileSelect';
import {
  NotificationConditionType,
  NotificationDestination,
  NotificationDynamicDestination,
  StaffPosition,
} from 'graphqlTypes.generated';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import NotificationDestinationDescription from './NotificationDestinationDescription';

type NotificationDestinationType = Pick<
  NotificationDestination,
  'id' | '__typename' | 'dynamic_destination' | 'conditions'
> & {
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
  allowedDynamicDestinations: NotificationDynamicDestination[];
  allowedConditionTypes: NotificationConditionType[];
};

type DestinationType = NotificationDynamicDestination | 'staff_position' | 'user_con_profile';

export default function NotificationDestinationsConfig<T extends NotificationDestinationType>({
  notificationDestinations,
  disabled,
  staffPositions,
  addDestination,
  removeDestination,
  allowedConditionTypes,
  allowedDynamicDestinations,
}: NotificationDestinationsConfigProps<T>) {
  const { t } = useTranslation();
  const confirm = useGraphQLConfirm();

  const [addDestinationType, setAddDestinationType] = useState<DestinationType>();
  const addStaffPositionDestination = (staffPosition: (typeof staffPositions)[number]) => {
    addDestination({
      __typename: 'NotificationDestination',
      staff_position: staffPosition,
    } as T);
    setAddDestinationType(undefined);
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
    setAddDestinationType(undefined);
  };

  return (
    <div className="card">
      <div className="card-header">{t('admin.notifications.destinations.header')}</div>

      <ul className="list-group list-group-flush">
        {notificationDestinations.map((notificationDestination) => (
          <li key={notificationDestination.id} className="list-group-item">
            <div className="d-flex">
              <div className="flex-grow-1">
                <NotificationDestinationDescription notificationDestination={notificationDestination} />
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
                value: 'staff_position' satisfies DestinationType,
              },
              {
                label: t('admin.notifications.destinations.addDestination.userConProfileType'),
                value: 'user_con_profile' satisfies DestinationType,
              },
              ...allowedDynamicDestinations.map((dynamicDestination) => ({
                label: t(`admin.notifications.destinations.dynamic.${dynamicDestination}`),
                value: dynamicDestination satisfies DestinationType,
              })),
            ]}
            value={addDestinationType}
            onChange={(destinationType) =>
              setAddDestinationType((destinationType ?? undefined) as DestinationType | undefined)
            }
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
