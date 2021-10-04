import { gql } from '@apollo/client';
import { CommonFormFields } from '../Models/commonFormFragments';
import { AdminOrderFieldsFragment } from '../Store/orderFields';
import { AdminProductFields } from '../Store/adminProductFields';

export const UserConProfileFormData = gql`
  fragment UserConProfileFormData on Convention {
    id: transitionalId
    starts_at
    ends_at
    timezone_name
    timezone_mode

    user_con_profile_form {
      id: transitionalId
      ...CommonFormFields
    }
  }

  ${CommonFormFields}
`;

export const UserConProfileFields = gql`
  fragment UserConProfileFields on UserConProfile {
    id: transitionalId
    name
    form_response_attrs_json
    gravatar_enabled
    gravatar_url
  }
`;

export const UserConProfileAdminTicketFields = gql`
  fragment UserConProfileAdminTicketFields on Ticket {
    id: transitionalId
    created_at
    updated_at

    order_entry {
      id: transitionalId

      order {
        id: transitionalId
        ...AdminOrderFieldsFragment
      }

      price_per_item {
        fractional
        currency_code
      }
    }

    ticket_type {
      id: transitionalId
      description
      name
    }

    provided_by_event {
      id: transitionalId
      title
    }
  }

  ${AdminOrderFieldsFragment}
`;

export const UserConProfileQuery = gql`
  query UserConProfileQuery($id: Int!) {
    convention: conventionByRequestHost {
      ...UserConProfileFormData

      id: transitionalId

      user_con_profile(id: $id) {
        id: transitionalId
        current_user_form_item_viewer_role
        current_user_form_item_writer_role
        ...UserConProfileFields
      }
    }
  }

  ${UserConProfileFormData}
  ${UserConProfileFields}
`;

export const UserConProfileAdminQuery = gql`
  query UserConProfileAdminQuery($id: Int!) {
    convention: conventionByRequestHost {
      id: transitionalId
      name
      starts_at
      ends_at
      timezone_name
      timezone_mode
      ticket_name
      ticket_mode

      my_profile {
        id: transitionalId
        ability {
          can_read_signups
          can_update_user_con_profile(user_con_profile_id: $id)
          can_delete_user_con_profile(user_con_profile_id: $id)
          can_become_user_con_profile(user_con_profile_id: $id)
        }
      }

      user_con_profile(id: $id) {
        id: transitionalId
        email
        user_id
        name
        name_without_nickname
        form_response_attrs_json
        gravatar_enabled
        gravatar_url

        ticket {
          id: transitionalId
          ...UserConProfileAdminTicketFields
        }
      }

      user_con_profile_form {
        id: transitionalId
        ...CommonFormFields

        form_sections {
          id: transitionalId
          form_items {
            id: transitionalId
            admin_description
          }
        }
      }

      ticket_types {
        id: transitionalId
        description
        name
        maximum_event_provided_tickets

        providing_products {
          id: transitionalId
          ...AdminProductFields
        }
      }
    }
  }

  ${AdminProductFields}
  ${UserConProfileAdminTicketFields}
  ${CommonFormFields}
`;

export const UserConProfilesTableUserConProfilesQuery = gql`
  query UserConProfilesTableUserConProfilesQuery(
    $page: Int
    $perPage: Int
    $filters: UserConProfileFiltersInput
    $sort: [SortInput!]
  ) {
    convention: conventionByRequestHost {
      id: transitionalId
      name
      starts_at
      ends_at
      timezone_name
      timezone_mode
      ticket_name
      ticket_mode

      ticket_types {
        id: transitionalId
        name
      }

      user_con_profile_form {
        id: transitionalId
        ...CommonFormFields

        form_sections {
          id: transitionalId

          form_items {
            id: transitionalId
            admin_description
          }
        }
      }

      user_con_profiles_paginated(page: $page, per_page: $perPage, filters: $filters, sort: $sort) {
        total_entries
        total_pages
        current_page
        per_page

        entries {
          id: transitionalId
          name_inverted
          first_name
          last_name
          email
          site_admin
          form_response_attrs_json
          order_summary
          gravatar_enabled
          gravatar_url

          user_id

          team_members {
            id: transitionalId
          }

          ticket {
            id: transitionalId
            updated_at

            order_entry {
              id: transitionalId
              price_per_item {
                fractional
                currency_code
              }
            }

            ticket_type {
              id: transitionalId
              name
            }
          }
        }
      }
    }

    currentAbility {
      can_create_user_con_profiles
    }
  }

  ${CommonFormFields}
`;

export const ConvertToEventProvidedTicketQuery = gql`
  query ConvertToEventProvidedTicketQuery($eventId: ID!) {
    convention: conventionByRequestHost {
      id: transitionalId
      ticket_name

      event(transitionalId: $eventId) {
        id: transitionalId
        title

        event_category {
          id: transitionalId
          can_provide_tickets
        }

        provided_tickets {
          id: transitionalId
          ticket_type {
            id: transitionalId
            name
          }
        }
      }

      ticket_types {
        id: transitionalId
        maximum_event_provided_tickets(transitionalEventId: $eventId)
        description
        name
      }
    }
  }
`;

export const AddAttendeeUsersQuery = gql`
  query AddAttendeeUsersQuery($name: String) {
    users_paginated(filters: { name: $name }, per_page: 50) {
      entries {
        id: transitionalId
        name
        email
        first_name
        last_name
      }
    }
  }
`;

export const TicketAdminWithoutTicketAbilityQuery = gql`
  query TicketAdminWithoutTicketAbilityQuery {
    currentAbility {
      can_create_tickets
    }
  }
`;

export const TicketAdminWithTicketAbilityQuery = gql`
  query TicketAdminWithTicketAbilityQuery($ticketId: Int!) {
    currentAbility {
      can_create_tickets
      can_update_ticket(ticket_id: $ticketId)
      can_delete_ticket(ticket_id: $ticketId)
    }
  }
`;
