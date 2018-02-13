import gql from 'graphql-tag';

const fragments = {};

fragments.staffPosition = gql`
fragment StaffPositionFields on StaffPosition {
  id
  name
  email
  user_con_profiles {
    id
    name_without_nickname
  }
}
`;

export const staffPositionQuery = gql`
query($staffPositionId: Int!) {
  staffPosition(id: $staffPositionId) {
    ...StaffPositionFields
  }
}

${fragments.staffPosition}
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
