import gql from 'graphql-tag';

const fragments = {};

fragments.staffPosition = gql`
fragment StaffPositionFields on StaffPosition {
  id
  name
  email
  visible
  user_con_profiles {
    id
    name_without_nickname
  }
}
`;

export const staffPositionsQuery = gql`
query {
  convention {
    staff_positions {
      ...StaffPositionFields
    }
  }
}

${fragments.staffPosition}
`;

export { fragments };
