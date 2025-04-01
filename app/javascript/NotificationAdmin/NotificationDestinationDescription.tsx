import { NotificationDestination, StaffPosition, UserConProfile } from 'graphqlTypes.generated';
import { Trans } from 'react-i18next';

export type NotificationDestinationDescriptionProps = {
  notificationDestination: Pick<NotificationDestination, 'dynamic_destination'> & {
    staff_position?: Pick<StaffPosition, 'name'> | null;
    user_con_profile?: Pick<UserConProfile, 'name_without_nickname'> | null;
  };
};

export default function NotificationDestinationDescription({
  notificationDestination,
}: NotificationDestinationDescriptionProps) {
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
}
