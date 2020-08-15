import { gql } from '@apollo/client';

export const CreateRoom = gql`
  mutation CreateRoom($input: CreateRoomInput!) {
    createRoom(input: $input) {
      room {
        id
        name

        runs {
          id
        }
      }
    }
  }
`;

export const UpdateRoom = gql`
  mutation UpdateRoom($input: UpdateRoomInput!) {
    updateRoom(input: $input) {
      room {
        id
        name

        runs {
          id
        }
      }
    }
  }
`;

export const DeleteRoom = gql`
  mutation DeleteRoom($input: DeleteRoomInput!) {
    deleteRoom(input: $input) {
      room {
        id
      }
    }
  }
`;
