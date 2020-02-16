import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { CreateRoom, DeleteRoom, UpdateRoom } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import { RoomsAdminQuery } from './queries.gql';
import { useConfirm } from '../ModalDialogs/Confirm';
import useAsyncFunction from '../useAsyncFunction';
import { sortByLocaleString } from '../ValueUtils';
import pluralizeWithCount from '../pluralizeWithCount';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';
import { useCreateMutation, useDeleteMutation } from '../MutationUtils';

function RoomsAdmin() {
  const { data, loading, error } = useQuery(RoomsAdminQuery);
  const [updateMutate] = useMutation(UpdateRoom);
  const [createRoom, createError] = useAsyncFunction(useCreateMutation(CreateRoom, {
    query: RoomsAdminQuery,
    arrayPath: ['convention', 'rooms'],
    newObjectPath: ['createRoom', 'room'],
  }));
  const [updateRoom, updateError] = useAsyncFunction(updateMutate);
  const [deleteRoom, deleteError] = useAsyncFunction(useDeleteMutation(DeleteRoom, {
    query: RoomsAdminQuery,
    arrayPath: ['convention', 'rooms'],
    idVariablePath: ['input', 'id'],
  }));
  const confirm = useConfirm();

  const [creatingRoomName, setCreatingRoomName] = useState('');

  usePageTitle('Rooms');

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

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
    });
    setCreatingRoomName('');
  };

  const keyDownInCreatingRoom = (event) => {
    if (event.key === 'Enter') {
      createRoomWasClicked(event);
    }
  };

  const deleteRoomConfirmed = (roomId) => deleteRoom({
    variables: { input: { id: roomId } },
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
            action: () => deleteRoomConfirmed(room.id),
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
