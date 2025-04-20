import {
  EventCategory,
  NotificationCondition,
  NotificationConditionType,
  NotificationDestination,
  StaffPosition,
  UserConProfile,
} from 'graphqlTypes.generated';
import { TFunction } from 'i18next';
import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

export type NotificationDestinationDescriptionProps = {
  notificationDestination: Pick<NotificationDestination, 'dynamic_destination' | 'conditions'> & {
    staff_position?: Pick<StaffPosition, 'name'> | null;
    user_con_profile?: Pick<UserConProfile, 'name_without_nickname'> | null;
  };
  eventCategories: Pick<EventCategory, 'name' | 'id'>[];
};

export function describeCondition(
  condition: Pick<NotificationCondition, 'condition_type' | 'value'>,
  eventCategories: Pick<EventCategory, 'name' | 'id'>[],
  t: TFunction,
) {
  if (condition.condition_type === NotificationConditionType.EventCategory) {
    return t('admin.notifications.destinations.conditions.eventCategory.description', {
      eventCategoryName: eventCategories.find((ec) => ec.id === condition.value)?.name ?? condition.value,
    });
  } else {
    return t('admin.notifications.destinations.conditions.unknown.description');
  }
}

export default function NotificationDestinationDescription({
  notificationDestination,
  eventCategories,
}: NotificationDestinationDescriptionProps) {
  const { t } = useTranslation();
  const destinationDescription = useMemo(() => {
    if (notificationDestination.staff_position) {
      return (
        <Trans
          i18nKey="admin.notifications.destinations.staffPosition"
          values={{ staffPositionName: notificationDestination.staff_position.name }}
        />
      );
    } else if (notificationDestination.user_con_profile) {
      return (
        <Trans
          i18nKey="admin.notifications.destinations.userConProfile"
          values={{ name: notificationDestination.user_con_profile?.name_without_nickname }}
        />
      );
    } else if (notificationDestination.dynamic_destination) {
      return (
        <Trans i18nKey={`admin.notifications.destinations.dynamic.${notificationDestination.dynamic_destination}`} />
      );
    } else {
      return <Trans i18nKey="admin.notifications.destinations.unknown" />;
    }
  }, [
    notificationDestination.staff_position,
    notificationDestination.user_con_profile,
    notificationDestination.dynamic_destination,
  ]);

  const conditionDescriptions = useMemo(() => {
    if (notificationDestination.conditions) {
      return notificationDestination.conditions.map((condition) => describeCondition(condition, eventCategories, t));
    } else {
      return [];
    }
  }, [notificationDestination.conditions, eventCategories, t]);

  return (
    <>
      {destinationDescription}
      {conditionDescriptions.length > 0 && (
        <> {t('admin.notifications.destinations.conditions.conditionList', { conditions: conditionDescriptions })}</>
      )}
    </>
  );
}
