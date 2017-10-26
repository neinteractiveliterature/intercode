import gql from 'graphql-tag';

const fragments = {};

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

  rooms {
    ...RoomFields
  }
}

${fragments.room}
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
  email
  length_seconds
  category
  status
  description_html

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
  }

  runs {
    ...RunFields
  }
}

${fragments.run}
`;

export { fragments };

export default gql`
query {
  convention {
    ...ConventionFields
  }

  events {
    ...EventFields
  }
}

${fragments.convention}
${fragments.event}
`;
