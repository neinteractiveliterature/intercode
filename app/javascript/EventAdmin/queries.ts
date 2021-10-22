import { gql } from '@apollo/client';
import { CommonFormFields } from '../Models/commonFormFragments';

export const TicketTypeFields = gql`
  fragment TicketTypeFields on TicketType {
    id
    description
    maximum_event_provided_tickets
  }
`;

export const MaximumEventProvidedTicketsOverrideFields = gql`
  fragment MaximumEventProvidedTicketsOverrideFields on MaximumEventProvidedTicketsOverride {
    ticket_type {
      id
      ...TicketTypeFields
    }

    id
    override_value
  }

  ${TicketTypeFields}
`;

export const RoomFields = gql`
  fragment RoomFields on Room {
    id
    name
  }
`;

export const EventPageEventCategoryFields = gql`
  fragment EventPageEventCategoryFields on EventCategory {
    id
    name
    scheduling_ui
    default_color
    full_color
    signed_up_color

    event_form {
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
  }

  ${CommonFormFields}
`;

export const ConventionFields = gql`
  fragment ConventionFields on Convention {
    id
    name
    starts_at
    ends_at
    timezone_name
    timezone_mode
    event_mailing_list_domain
    site_mode

    event_categories {
      id
      ...EventPageEventCategoryFields
    }

    rooms {
      id
      ...RoomFields
    }

    ticket_types {
      id
      ...TicketTypeFields
    }
    ticket_name
    ticket_mode
  }

  ${EventPageEventCategoryFields}
  ${RoomFields}
  ${TicketTypeFields}
`;

export const RunFields = gql`
  fragment RunFields on Run {
    id
    starts_at
    schedule_note
    title_suffix
    room_names

    confirmed_signup_count
    not_counted_signup_count
    signup_count_by_state_and_bucket_key_and_counted

    rooms {
      id
      ...RoomFields
    }

    my_signups {
      id
      state
    }

    my_signup_requests {
      id
      state
    }
  }

  ${RoomFields}
`;

export const EventFields = gql`
  fragment EventFields on Event {
    id
    title
    author
    description
    organization
    url
    con_mail_destination
    can_play_concurrently
    short_blurb
    participant_communications
    age_restrictions
    content_warnings
    email
    length_seconds
    status
    description_html
    form_response_attrs_json
    current_user_form_item_viewer_role
    current_user_form_item_writer_role
    admin_notes

    event_category {
      id
      name
    }

    registration_policy {
      buckets {
        key
        name
        description
        minimum_slots
        preferred_slots
        total_slots
        slots_limited
        anything
        not_counted
      }
      slots_limited
      prevent_no_preference_signups
    }

    runs {
      id
      ...RunFields
    }

    maximum_event_provided_tickets_overrides {
      id
      ...MaximumEventProvidedTicketsOverrideFields
    }
  }

  ${RunFields}
  ${MaximumEventProvidedTicketsOverrideFields}
`;

export const EventAdminEventsQuery = gql`
  query EventAdminEventsQuery {
    currentAbility {
      can_override_maximum_event_provided_tickets
      can_manage_runs
    }

    convention: conventionByRequestHost {
      id
      ...ConventionFields

      events(includeDropped: true) {
        id
        ...EventFields
      }
    }
  }

  ${ConventionFields}
  ${EventFields}
`;
