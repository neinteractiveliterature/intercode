import { useState } from 'react';
import * as React from 'react';
import { ApolloError } from '@apollo/client';
import {
  LoadQueryWrapper,
  ErrorDisplay,
  useGraphQLConfirm,
  sortByLocaleString,
} from '@neinteractiveliterature/litform';

import { CreateRoom, DeleteRoom } from './mutations';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import { RoomsAdminQuery } from './queries';
import useAsyncFunction from '../useAsyncFunction';
import pluralizeWithCount from '../pluralizeWithCount';
import usePageTitle from '../usePageTitle';
import { useCreateMutation, useDeleteMutation } from '../MutationUtils';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { RoomsAdminQueryData, RoomsAdminQueryVariables, useRoomsAdminQuery } from './queries.generated';
import {
  CreateRoomMutationData,
  CreateRoomMutationVariables,
  DeleteRoomMutationData,
  DeleteRoomMutationVariables,
  useUpdateRoomMutation,
} from './mutations.generated';

export default LoadQueryWrapper(useRoomsAdminQuery, function RoomsAdmin({ data }) {
  const authorizationWarning = useAuthorizationRequired('can_manage_rooms');
  const [updateMutate] = useUpdateRoomMutation();
  const [createRoom, createError] = useAsyncFunction(
    useCreateMutation<
      RoomsAdminQueryData,
      RoomsAdminQueryVariables,
      CreateRoomMutationVariables,
      CreateRoomMutationData
    >(CreateRoom, {
      query: RoomsAdminQuery,
      arrayPath: ['convention', 'rooms'],
      newObjectPath: ['createRoom', 'room'],
    }),
  );
  const [updateRoom, updateError] = useAsyncFunction(updateMutate);
  const [deleteRoom, deleteError] = useAsyncFunction(
    useDeleteMutation<DeleteRoomMutationVariables, DeleteRoomMutationData>(DeleteRoom, {
      query: RoomsAdminQuery,
      arrayPath: ['convention', 'rooms'],
      idVariablePath: ['input', 'id'],
    }),
  );
  const confirm = useGraphQLConfirm();

  const [creatingRoomName, setCreatingRoomName] = useState('');

  usePageTitle('Rooms');

  if (authorizationWarning) return authorizationWarning;

  const roomNameDidChange = (id: string, name: string) =>
    updateRoom({
      variables: { input: { transitionalId: id, room: { name } } },
    });

  const createRoomWasClicked = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    await createRoom({
      variables: { input: { room: { name: creatingRoomName } } },
    });
    setCreatingRoomName('');
  };

  const keyDownInCreatingRoom = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      createRoomWasClicked(event);
    }
  };

  const deleteRoomConfirmed = (roomId: string) =>
    deleteRoom({
      variables: { input: { transitionalId: roomId } },
    });

  const sortedRooms = sortByLocaleString(data.convention.rooms, (room) => room.name ?? '');

  const roomRows = sortedRooms.map((room) => (
    <li className="list-group-item" key={room.id}>
      <div className="d-flex align-items-baseline">
        <div className="me-2">
          <InPlaceEditor
            value={room.name}
            onChange={(newName) => {
              roomNameDidChange(room.id, newName ?? '');
            }}
          />
        </div>
        <div className="flex-grow-1">
          {room.runs.length > 0 ? (
            <span className="text-muted">({pluralizeWithCount('event run', room.runs.length)})</span>
          ) : null}
        </div>
        <button
          className="btn btn-sm btn-outline-danger ms-2"
          title="Delete room"
          onClick={() =>
            confirm({
              prompt: 'Are you sure you want to delete this room?',
              action: () => deleteRoomConfirmed(room.id),
            })
          }
          type="button"
        >
          <i className="bi-trash-fill" />
        </button>
      </div>
    </li>
  ));

  return (
    <>
      <h1 className="mb-4">Rooms</h1>
      <div className="mb-4">
        <ul className="list-group mb-4">
          {roomRows}
          <li className="list-group-item">
            <div className="d-flex align-items-baseline">
              <div className="flex-grow-1">
                <input
                  type="text"
                  placeholder="Room name"
                  className="form-control"
                  value={creatingRoomName}
                  onChange={(event) => setCreatingRoomName(event.target.value)}
                  onKeyDown={keyDownInCreatingRoom}
                  aria-label="Room name"
                />
              </div>
              <button
                className="btn btn-primary ms-2"
                disabled={creatingRoomName === ''}
                onClick={createRoomWasClicked}
                type="button"
              >
                Add room
              </button>
            </div>
          </li>
        </ul>

        <ErrorDisplay graphQLError={(createError || updateError || deleteError) as ApolloError | undefined} />
      </div>
    </>
  );
});
