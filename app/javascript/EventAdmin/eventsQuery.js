import gql from 'graphql-tag';

const fragments = {};

fragments.ticketType = gql`
fragment TicketTypeFields on TicketType {
  id
  description
  maximum_event_provided_tickets
}
`;

fragments.maximumEventProvidedTicketsOverride = gql`
fragment MaximumEventProvidedTicketsOverrideFields on MaximumEventProvidedTicketsOverride {
  ticket_type {
    ...TicketTypeFields
  }

  id
  override_value
}

${fragments.ticketType}
`;

fragments.room = gql`
fragment RoomFields on Room {
  id
  name
}
`;

fragments.convention = gql`
fragment ConventionFields on Convention {
  starts_at
  ends_at
  timezone_name

  regular_event_form {
    form_api_json
  }

  volunteer_event_form {
    form_api_json
  }

  filler_event_form {
    form_api_json
  }

  rooms {
    ...RoomFields
  }

  ticket_types {
    ...TicketTypeFields
  }
  ticket_name
}

${fragments.room}
${fragments.ticketType}
`;

fragments.run = gql`
fragment RunFields on Run {
  id
  starts_at
  schedule_note
  title_suffix

  rooms {
    ...RoomFields
  }
}

${fragments.room}
`;

fragments.event = gql`
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
  category
  status
  description_html
  form_response_attrs_json

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
    prevent_no_preference_signups
  }

  runs {
    ...RunFields
  }

  maximum_event_provided_tickets_overrides {
    ...MaximumEventProvidedTicketsOverrideFields
  }
}

${fragments.run}
${fragments.maximumEventProvidedTicketsOverride}
`;

export { fragments };

export default gql`
query {
  myProfile {
    ability {
      can_override_maximum_event_provided_tickets
    }
  }

  convention {
    ...ConventionFields
  }

  events(includeDropped: true) {
    ...EventFields
  }
}

${fragments.convention}
${fragments.event}
`;
