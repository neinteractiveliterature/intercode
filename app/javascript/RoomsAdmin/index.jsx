import React, { useState } from 'react';
import { useMutation } from 'react-apollo-hooks';

import { CreateRoom, DeleteRoom, UpdateRoom } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import { RoomsAdminQuery } from './queries.gql';
import useQuerySuspended from '../useQuerySuspended';
import { useConfirm } from '../ModalDialogs/Confirm';
import useAsyncFunction from '../useAsyncFunction';
import { sortByLocaleString } from '../ValueUtils';
import pluralizeWithCount from '../pluralizeWithCount';
import usePageTitle from '../usePageTitle';

function RoomsAdmin() {
  const { data, error } = useQuerySuspended(RoomsAdminQuery);
  const [createMutate] = useMutation(CreateRoom);
  const [updateMutate] = useMutation(UpdateRoom);
  const [deleteMutate] = useMutation(DeleteRoom);
  const [createRoom, createError] = useAsyncFunction(createMutate);
  const [updateRoom, updateError] = useAsyncFunction(updateMutate);
  const [deleteRoomMutate, deleteError] = useAsyncFunction(deleteMutate);
  const confirm = useConfirm();

  const [creatingRoomName, setCreatingRoomName] = useState('');

  usePageTitle('Rooms');

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const roomNameDidChange = (id, name) => updateRoom({
    variables: { input: { id, room: { name } } },
  });

  const createRoomWasClicked = async (event) => {
    event.preventDefault();
    await createRoom({
      variables: { input: { room: { name: creatingRoomName } } },
      update: (store, { data: { createRoom: { room: newRoom } } }) => {
        const roomsData = store.readQuery({ query: RoomsAdminQuery });
        roomsData.convention.rooms.push(newRoom);
        store.writeQuery({ query: RoomsAdminQuery, data: roomsData });
      },
    });
    setCreatingRoomName('');
  };

  const keyDownInCreatingRoom = (event) => {
    if (event.key === 'Enter') {
      createRoomWasClicked(event);
    }
  };

  const deleteRoom = (roomId) => deleteRoomMutate({
    variables: { input: { id: roomId } },
    update: (store) => {
      const roomsData = store.readQuery({ query: RoomsAdminQuery });
      const roomIndex = roomsData.convention.rooms.findIndex((room) => room.id === roomId);
      roomsData.convention.rooms.splice(roomIndex, 1);
      store.writeQuery({ query: RoomsAdminQuery, data: roomsData });
    },
  });

  const sortedRooms = sortByLocaleString(data.convention.rooms, (room) => room.name);

  const roomRows = sortedRooms.map((room) => (
    <li className="list-group-item" key={room.id}>
      <div className="row align-items-baseline">
        <div className="ml-3">
          <InPlaceEditor
            value={room.name}
            onChange={(newName) => { roomNameDidChange(room.id, newName); }}
          />
        </div>
        <div className="col">
          {room.runs.length > 0 ? (
            <span className="text-muted">
              (
              {pluralizeWithCount('event run', room.runs.length)}
              )
            </span>
          ) : null}
        </div>
        <button
          className="btn btn-sm btn-outline-danger mr-3"
          title="Delete room"
          onClick={() => confirm({
            prompt: 'Are you sure you want to delete this room?',
            action: () => deleteRoom(room.id),
            renderError: (e) => <ErrorDisplay error={e} />,
          })}
          type="button"
        >
          <i className="fa fa-trash" />
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
            <div className="row align-items-baseline">
              <div className="col">
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
                className="btn btn-primary mr-2"
                disabled={creatingRoomName === ''}
                onClick={createRoomWasClicked}
                type="button"
              >
                Add room
              </button>
            </div>
          </li>
        </ul>

        <ErrorDisplay graphQLError={createError || updateError || deleteError} />
      </div>
    </>
  );
}

export default RoomsAdmin;
