import { gql } from '@apollo/client';

export const RoomAdminRoomFields = gql`
  fragment RoomAdminRoomFields on Room {
    id
    name

    runs {
      id
    }
  }
`;

export const RoomsAdminQuery = gql`
  query RoomsAdminQuery {
    convention: conventionByRequestHost {
      id
      rooms {
        id
        ...RoomAdminRoomFields
      }
    }
  }

  ${RoomAdminRoomFields}
`;
