import gql from 'graphql-tag';

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
`;

export const RoomFields = gql`
fragment RoomFields on Room {
  id
  name
}
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
`;

export const RunFields = gql`
fragment RunFields on Run {
  id
  starts_at
  schedule_note
  title_suffix

  rooms {
    id
    ...RoomFields
  }
}
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
  admin_notes

  event_category {
    id
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
    form_api_json
  }
}
`;

export const EventAdminEventsQuery = gql`
query EventAdminEventsQuery {
  currentAbility {
    can_override_maximum_event_provided_tickets
    can_manage_runs
  }

  convention {
    id
    ...ConventionFields
  }

  events(includeDropped: true) {
    id
    ...EventFields
  }
}
`;
