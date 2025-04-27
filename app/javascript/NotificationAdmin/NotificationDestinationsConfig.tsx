import { MultipleChoiceInput, useGraphQLConfirm } from '@neinteractiveliterature/litform';
import { DefaultUserConProfilesQueryData } from 'BuiltInFormControls/selectDefaultQueries.generated';
import UserConProfileSelect from 'BuiltInFormControls/UserConProfileSelect';
import {
  EventCategory,
  NotificationCondition,
  NotificationConditionType,
  NotificationDestination,
  NotificationDynamicDestination,
  StaffPosition,
} from 'graphqlTypes.generated';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import NotificationDestinationDescription, { describeCondition } from './NotificationDestinationDescription';
import sortBy from 'lodash/sortBy';
import assertNever from 'assert-never';

type NotificationDestinationType = Pick<
  NotificationDestination,
  'id' | '__typename' | 'dynamic_destination' | 'conditions'
> & {
  staff_position?: Pick<StaffPosition, 'id' | 'name' | '__typename'> | null;
  user_con_profile?:
    | NonNullable<DefaultUserConProfilesQueryData['convention']>['user_con_profiles_paginated']['entries'][number]
    | null;
};

type AddConditionFormProps = {
  addCondition: (condition: NotificationCondition) => void;
  addableConditionTypes: NotificationConditionType[];
  eventCategories: Pick<EventCategory, 'name' | 'id'>[];
};

function AddConditionForm({ addCondition, addableConditionTypes, eventCategories }: AddConditionFormProps) {
  const { t } = useTranslation();
  const [condition, setCondition] = useState<NotificationCondition>();

  const changeConditionType = (value: NotificationConditionType | undefined) => {
    if (value == null) {
      setCondition(undefined);
    } else {
      setCondition({ __typename: 'NotificationCondition', condition_type: value });
    }
  };

  const selectedEventCategory = useMemo(() => {
    if (condition?.condition_type === NotificationConditionType.EventCategory) {
      return eventCategories.find((category) => category.id === condition?.value);
    } else {
      return undefined;
    }
  }, [eventCategories, condition?.value, condition?.condition_type]);

  return (
    <div>
      <MultipleChoiceInput
        caption={t('admin.notifications.destinations.conditions.addConditionCaption')}
        name="addConditionType"
        choices={addableConditionTypes.map((conditionType) => {
          if (conditionType === NotificationConditionType.EventCategory) {
            return {
              label: t('admin.notifications.destinations.conditions.eventCategory.addLabel'),
              value: NotificationConditionType.EventCategory,
            };
          } else {
            assertNever(conditionType);
          }
        })}
        value={condition?.condition_type}
        onChange={(value) => changeConditionType((value as NotificationConditionType) ?? undefined)}
        choiceClassName="form-check-inline"
      />

      {condition?.condition_type === NotificationConditionType.EventCategory && (
        <Select
          options={eventCategories}
          isClearable
          getOptionValue={(option) => option.id.toString()}
          getOptionLabel={(option) => option.name}
          value={selectedEventCategory}
          onChange={(eventCategory) => {
            setCondition((prevCondition) => ({
              ...prevCondition,
              __typename: 'NotificationCondition',
              condition_type: NotificationConditionType.EventCategory,
              value: eventCategory?.id,
            }));
          }}
        />
      )}

      <button
        className="btn btn-outline-primary mt-2"
        type="button"
        onClick={() => {
          if (condition) {
            addCondition(condition);
            setCondition(undefined);
          }
        }}
      >
        {t('admin.notifications.destinations.conditions.addButton')}
      </button>
    </div>
  );
}

type AddDestinationFormProps<T extends NotificationDestinationType> = {
  addDestination: (destination: T) => void;
  allowedDynamicDestinations: NotificationDynamicDestination[];
  allowedConditionTypes: NotificationConditionType[];
  staffPositions: Pick<StaffPosition, '__typename' | 'id' | 'name'>[];
  eventCategories: Pick<EventCategory, 'name' | 'id'>[];
  disabled: boolean;
};

function AddDestinationForm<T extends NotificationDestinationType>({
  addDestination,
  allowedDynamicDestinations,
  allowedConditionTypes,
  disabled,
  staffPositions,
  eventCategories,
}: AddDestinationFormProps<T>) {
  const { t } = useTranslation();
  const [destination, setDestination] = useState<T>({
    __typename: 'NotificationDestination',
    id: '',
  } as T);
  const [destinationType, setDestinationType] = useState<DestinationType>();

  const sortedStaffPositions = useMemo(() => sortBy(staffPositions, (sp) => sp.name), [staffPositions]);

  const changeDestinationType = (value: DestinationType | undefined) => {
    setDestinationType(value);
    setDestination((prevDestination) => {
      const newDestination = { ...prevDestination };

      if (value !== 'staff_position') {
        newDestination.staff_position = undefined;
      }

      if (value !== 'user_con_profile') {
        newDestination.user_con_profile = undefined;
      }

      if (value !== 'staff_position' && value !== 'user_con_profile') {
        newDestination.dynamic_destination = value;
      } else {
        newDestination.dynamic_destination = undefined;
      }

      return newDestination;
    });
  };

  const addableConditionTypes = useMemo(() => {
    const existingConditionTypes = new Set(destination.conditions?.map((condition) => condition.condition_type) ?? []);
    return allowedConditionTypes.filter((conditionType) => !existingConditionTypes.has(conditionType));
  }, [allowedConditionTypes, destination.conditions]);

  return (
    <>
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
        value={destinationType}
        onChange={(value) => changeDestinationType((value as DestinationType) ?? undefined)}
        choiceClassName="form-check-inline"
        disabled={disabled}
      />

      {destinationType && (
        <>
          {destinationType === 'staff_position' && (
            <Select
              options={sortedStaffPositions}
              isClearable
              getOptionValue={(option) => option.id.toString()}
              getOptionLabel={(option) => option.name}
              value={destination.staff_position}
              onChange={(staffPosition) => {
                setDestination((prevDestination) => ({ ...prevDestination, staff_position: staffPosition }));
              }}
              isDisabled={disabled}
            />
          )}

          {destinationType === 'user_con_profile' && (
            <UserConProfileSelect
              value={destination.user_con_profile}
              onChange={(userConProfile) => {
                setDestination((prevDestination) => ({ ...prevDestination, user_con_profile: userConProfile }));
              }}
              isDisabled={disabled}
            />
          )}

          {(allowedConditionTypes || destination.conditions) && (
            <div className="card mt-2">
              <div className="card-header">{t('admin.notifications.destinations.conditions.header')}</div>
              <ul className="list-group list-group-flush">
                {destination.conditions &&
                  destination.conditions.map((condition, i) => (
                    <li key={i} className="list-group-item">
                      <div className="d-flex">
                        <div className="flex-grow-1">
                          {t('admin.notifications.destinations.conditions.addConditionDescription', {
                            condition: describeCondition(condition, eventCategories, t),
                          })}
                        </div>
                        <div>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            type="button"
                            aria-label={t('admin.notifications.destinations.conditions.removeButton')}
                            onClick={() =>
                              setDestination((prevDestination) => ({
                                ...prevDestination,
                                conditions: prevDestination.conditions?.filter((_, index) => index !== i),
                              }))
                            }
                          >
                            <i className="bi-trash" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                {addableConditionTypes.length > 0 && (
                  <li className="list-group-item">
                    <AddConditionForm
                      addableConditionTypes={addableConditionTypes}
                      eventCategories={eventCategories}
                      addCondition={(condition) =>
                        setDestination((prevDestination) => ({
                          ...prevDestination,
                          conditions: [...(prevDestination.conditions ?? []), condition],
                        }))
                      }
                    />
                  </li>
                )}
              </ul>
            </div>
          )}

          <button
            className="btn btn-primary mt-2"
            type="button"
            onClick={() => {
              addDestination(destination);
              setDestination({ __typename: 'NotificationDestination', id: '' } as T);
              setDestinationType(undefined);
            }}
            disabled={disabled}
          >
            {t('admin.notifications.destinations.addDestination.addButton')}
          </button>
        </>
      )}
    </>
  );
}

export type NotificationDestinationsConfigProps<T extends NotificationDestinationType> = {
  disabled?: boolean;
  staffPositions: Pick<StaffPosition, '__typename' | 'id' | 'name'>[];
  eventCategories: Pick<EventCategory, 'name' | 'id'>[];
  notificationDestinations: T[];
  addDestination: (destination: T) => void;
  removeDestination: (id: string) => void;
  allowedDynamicDestinations: NotificationDynamicDestination[];
  allowedConditionTypes: NotificationConditionType[];
};

type DestinationType = NotificationDynamicDestination | 'staff_position' | 'user_con_profile';

export default function NotificationDestinationsConfig<T extends NotificationDestinationType>({
  notificationDestinations,
  eventCategories,
  disabled,
  staffPositions,
  addDestination,
  removeDestination,
  allowedConditionTypes,
  allowedDynamicDestinations,
}: NotificationDestinationsConfigProps<T>) {
  const { t } = useTranslation();
  const confirm = useGraphQLConfirm();

  return (
    <div className="card">
      <div className="card-header">{t('admin.notifications.destinations.header')}</div>

      <ul className="list-group list-group-flush">
        {notificationDestinations.map((notificationDestination) => (
          <li key={notificationDestination.id} className="list-group-item">
            <div className="d-flex">
              <div className="flex-grow-1">
                <NotificationDestinationDescription
                  notificationDestination={notificationDestination}
                  eventCategories={eventCategories}
                />
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
          <AddDestinationForm
            allowedConditionTypes={allowedConditionTypes}
            disabled={disabled ?? false}
            allowedDynamicDestinations={allowedDynamicDestinations}
            staffPositions={staffPositions}
            addDestination={addDestination}
            eventCategories={eventCategories}
          />
        </li>
      </ul>
    </div>
  );
}
