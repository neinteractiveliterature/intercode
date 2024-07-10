import { useState } from 'react';
import * as React from 'react';
import { ApolloError } from '@apollo/client';
import {
  LoadQueryWrapper,
  ErrorDisplay,
  useGraphQLConfirm,
  sortByLocaleString,
  useDeleteMutationWithReferenceArrayUpdater,
  useCreateMutationWithReferenceArrayUpdater,
} from '@neinteractiveliterature/litform';

import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { RoomAdminRoomFieldsFragmentDoc, useRoomsAdminQuery } from './queries.generated';
import { useCreateRoomMutation, useDeleteRoomMutation, useUpdateRoomMutation } from './mutations.generated';
import { useTranslation } from 'react-i18next';

export default LoadQueryWrapper(useRoomsAdminQuery, function RoomsAdmin({ data }) {
  const authorizationWarning = useAuthorizationRequired('can_manage_rooms');
  const [updateMutate] = useUpdateRoomMutation();
  const [createRoom, { error: createError }] = useCreateMutationWithReferenceArrayUpdater(
    useCreateRoomMutation,
    data.convention,
    'rooms',
    (data) => data.createRoom.room,
    RoomAdminRoomFieldsFragmentDoc,
  );
  const [updateRoom, updateError] = useAsyncFunction(updateMutate);
  const [deleteRoom, , { error: deleteError }] = useDeleteMutationWithReferenceArrayUpdater(
    useDeleteRoomMutation,
    data.convention,
    'rooms',
    (room) => ({ input: { id: room.id } }),
  );
  const confirm = useGraphQLConfirm();
  const { t } = useTranslation();

  const [creatingRoomName, setCreatingRoomName] = useState('');

  usePageTitle(t('navigation.admin.rooms'));

  if (authorizationWarning) return authorizationWarning;

  const roomNameDidChange = (id: string, name: string) =>
    updateRoom({
      variables: { input: { id: id, room: { name } } },
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
            <span className="text-muted">
              <>({t('admin.rooms.eventRunCount', { count: room.runs.length })})</>
            </span>
          ) : null}
        </div>
        <button
          className="btn btn-sm btn-outline-danger ms-2"
          aria-label={t('admin.rooms.deleteLabel')}
          title={t('admin.rooms.deleteLabel')}
          onClick={() =>
            confirm({
              prompt: t('admin.rooms.deleteConfirmation'),
              action: () => deleteRoom(room),
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
                  placeholder={t('admin.rooms.roomNameLabel')}
                  className="form-control"
                  value={creatingRoomName}
                  onChange={(event) => setCreatingRoomName(event.target.value)}
                  onKeyDown={keyDownInCreatingRoom}
                  aria-label={t('admin.rooms.roomNameLabel')}
                />
              </div>
              <button
                className="btn btn-primary ms-2"
                disabled={creatingRoomName === ''}
                onClick={createRoomWasClicked}
                type="button"
              >
                {t('admin.rooms.addRoomLabel')}
              </button>
            </div>
          </li>
        </ul>

        <ErrorDisplay graphQLError={(createError || updateError || deleteError) as ApolloError | undefined} />
      </div>
    </>
  );
});
