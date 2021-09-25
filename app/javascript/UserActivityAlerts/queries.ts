import { gql } from '@apollo/client';

export const UserActivityAlertsAdminConventionFields = gql`
  fragment UserActivityAlertsAdminConventionFields on Convention {
    id
    ticket_name
    ticket_mode

    staff_positions {
      id
      name
    }
  }
`;

export const UserActivityAlertFields = gql`
  fragment UserActivityAlertFields on UserActivityAlert {
    id
    email
    partial_name
    trigger_on_user_con_profile_create
    trigger_on_ticket_create
    user {
      id
      name
    }

    notification_destinations {
      id

      staff_position {
        id
        name
      }

      user_con_profile {
        id
        name_without_nickname
      }
    }
  }
`;

export const ConventionTicketNameQuery = gql`
  query ConventionTicketNameQuery {
    convention: conventionByRequestHost {
      id
      ...UserActivityAlertsAdminConventionFields
    }
  }

  ${UserActivityAlertsAdminConventionFields}
`;

export const UserActivityAlertQuery = gql`
  query UserActivityAlertQuery($id: Int!) {
    convention: conventionByRequestHost {
      id
      ...UserActivityAlertsAdminConventionFields

      user_activity_alert(id: $id) {
        id
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
      id
      ticket_name
      ticket_mode

      user_activity_alerts {
        id
        ...UserActivityAlertFields
      }
    }
  }

  ${UserActivityAlertFields}
`;
