import { gql } from '@apollo/client';

export const UserActivityAlertsAdminConventionFields = gql`
  fragment UserActivityAlertsAdminConventionFields on Convention {
    id: transitionalId
    ticket_name
    ticket_mode

    staff_positions {
      id: transitionalId
      name
    }
  }
`;

export const UserActivityAlertFields = gql`
  fragment UserActivityAlertFields on UserActivityAlert {
    id: transitionalId
    email
    partial_name
    trigger_on_user_con_profile_create
    trigger_on_ticket_create
    user {
      id: transitionalId
      name
    }

    notification_destinations {
      id: transitionalId

      staff_position {
        id: transitionalId
        name
      }

      user_con_profile {
        id: transitionalId
        name_without_nickname
      }
    }
  }
`;

export const ConventionTicketNameQuery = gql`
  query ConventionTicketNameQuery {
    convention: conventionByRequestHost {
      id: transitionalId
      ...UserActivityAlertsAdminConventionFields
    }
  }

  ${UserActivityAlertsAdminConventionFields}
`;

export const UserActivityAlertQuery = gql`
  query UserActivityAlertQuery($id: Int!) {
    convention: conventionByRequestHost {
      id: transitionalId
      ...UserActivityAlertsAdminConventionFields

      user_activity_alert(id: $id) {
        id: transitionalId
        ...UserActivityAlertFields
      }
    }
  }

  ${UserActivityAlertsAdminConventionFields}
  ${UserActivityAlertFields}
`;

export const UserActivityAlertsAdminQuery = gql`
  query UserActivityAlertsAdminQuery {
    convention: conventionByRequestHost {
      id: transitionalId
      ticket_name
      ticket_mode

      user_activity_alerts {
        id: transitionalId
        ...UserActivityAlertFields
      }
    }
  }

  ${UserActivityAlertFields}
`;
