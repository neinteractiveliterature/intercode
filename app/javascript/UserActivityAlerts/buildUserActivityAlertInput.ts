import { User, UserActivityAlert, UserActivityAlertInput } from '../graphqlTypes.generated';

function presence(string?: string | null) {
  if (string && string.match(/\S/)) {
    return string;
  }

  return null;
}

export default function buildUserActivityAlertInput(
  userActivityAlert: Pick<
    UserActivityAlert,
    'partial_name' | 'email' | 'trigger_on_ticket_create' | 'trigger_on_user_con_profile_create'
  > & {
    user?: Pick<User, 'id'> | null;
  },
): UserActivityAlertInput {
  return {
    user_id: userActivityAlert.user ? userActivityAlert.user.id : null,
    partial_name: presence(userActivityAlert.partial_name),
    email: presence(userActivityAlert.email),
    trigger_on_ticket_create: userActivityAlert.trigger_on_ticket_create,
    trigger_on_user_con_profile_create: userActivityAlert.trigger_on_user_con_profile_create,
  };
}
