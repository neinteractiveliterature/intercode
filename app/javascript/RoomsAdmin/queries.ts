import { gql } from '@apollo/client';

export const RoomAdminRoomFields = gql`
  fragment RoomAdminRoomFields on Room {
    id: transitionalId
    name

    runs {
      id: transitionalId
    }
  }
`;

export const RoomsAdminQuery = gql`
  query RoomsAdminQuery {
    convention: conventionByRequestHost {
      id: transitionalId
      rooms {
        id: transitionalId
        ...RoomAdminRoomFields
      }
    }
  }

  ${RoomAdminRoomFields}
`;
