import { gql } from '@apollo/client';
import { RoomAdminRoomFields } from './queries';

export const CreateRoom = gql`
  mutation CreateRoom($input: CreateRoomInput!) {
    createRoom(input: $input) {
      room {
        id: transitionalId
        ...RoomAdminRoomFields
      }
    }
  }

  ${RoomAdminRoomFields}
`;

export const UpdateRoom = gql`
  mutation UpdateRoom($input: UpdateRoomInput!) {
    updateRoom(input: $input) {
      room {
        id: transitionalId
        ...RoomAdminRoomFields
      }
    }
  }

  ${RoomAdminRoomFields}
`;

export const DeleteRoom = gql`
  mutation DeleteRoom($input: DeleteRoomInput!) {
    deleteRoom(input: $input) {
      room {
        id: transitionalId
      }
    }
  }
`;
