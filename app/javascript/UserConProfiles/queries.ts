import { gql } from '@apollo/client';
import { CommonFormFields } from '../Models/commonFormFragments';
import { AdminOrderFieldsFragment } from '../Store/orderFields';
import { AdminProductFields } from '../Store/adminProductFields';

export const UserConProfileFormData = gql`
  fragment UserConProfileFormData on Convention {
    id
    starts_at
    ends_at
    timezone_name
    timezone_mode

    user_con_profile_form {
      id
      ...CommonFormFields
    }
  }

  ${CommonFormFields}
`;

export const UserConProfileFields = gql`
  fragment UserConProfileFields on UserConProfile {
    id
    name
    form_response_attrs_json
    gravatar_enabled
    gravatar_url
  }
`;

export const UserConProfileAdminTicketFields = gql`
  fragment UserConProfileAdminTicketFields on Ticket {
    id
    created_at
    updated_at

    order_entry {
      id

      order {
        id
        ...AdminOrderFieldsFragment
      }

      price_per_item {
        fractional
        currency_code
      }
    }

    ticket_type {
      id
      description
      name
    }

    provided_by_event {
      id
      title
    }
  }

  ${AdminOrderFieldsFragment}
`;

export const UserConProfileQuery = gql`
  query UserConProfileQuery($id: Int!) {
    convention {
      ...UserConProfileFormData

      id
    }

    userConProfile(id: $id) {
      id
      current_user_form_item_role
      ...UserConProfileFields
    }
  }

  ${UserConProfileFormData}
  ${UserConProfileFields}
`;

export const UserConProfileAdminQuery = gql`
  query UserConProfileAdminQuery($id: Int!) {
    myProfile {
      id
      ability {
        can_read_signups
        can_update_user_con_profile(user_con_profile_id: $id)
        can_delete_user_con_profile(user_con_profile_id: $id)
        can_become_user_con_profile(user_con_profile_id: $id)
      }
    }

    convention: assertConvention {
      id
      name
      starts_at
      ends_at
      timezone_name
      timezone_mode
      ticket_name
      ticket_mode

      user_con_profile_form {
        id
        ...CommonFormFields

        form_sections {
          id
          form_items {
            id
            admin_description
          }
        }
      }

      ticket_types {
        id
        description
        name
        maximum_event_provided_tickets

        providing_products {
          id
          ...AdminProductFields
        }
      }
    }

    userConProfile(id: $id) {
      id
      email
      user_id
      name
      name_without_nickname
      form_response_attrs_json
      gravatar_enabled
      gravatar_url

      ticket {
        id
        ...UserConProfileAdminTicketFields
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
    convention {
      id
      name
      starts_at
      ends_at
      timezone_name
      timezone_mode
      ticket_name
      ticket_mode

      ticket_types {
        id
        name
      }

      user_con_profile_form {
        id
        ...CommonFormFields

        form_sections {
          id

          form_items {
            id
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
          id
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
            id
          }

          ticket {
            id
            updated_at

            order_entry {
              id
              price_per_item {
                fractional
                currency_code
              }
            }

            ticket_type {
              id
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
  query ConvertToEventProvidedTicketQuery($eventId: Int!) {
    convention {
      id
      ticket_name

      ticket_types {
        id
        maximum_event_provided_tickets(event_id: $eventId)
        description
        name
      }
    }

    event(id: $eventId) {
      id
      title

      event_category {
        id
        can_provide_tickets
      }

      provided_tickets {
        id
        ticket_type {
          id
          name
        }
      }
    }
  }
`;

export const AddAttendeeUsersQuery = gql`
  query AddAttendeeUsersQuery($name: String) {
    users_paginated(filters: { name: $name }, per_page: 50) {
      entries {
        id
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
