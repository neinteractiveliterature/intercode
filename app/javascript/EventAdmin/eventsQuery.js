import { gql } from 'react-apollo';

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
  length_seconds
  category
  description_html

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
