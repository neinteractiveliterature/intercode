import { useState } from 'react';
import * as React from 'react';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay, useGraphQLConfirm, sortByLocaleString } from '@neinteractiveliterature/litform';

import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import usePageTitle from '../usePageTitle';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { RoomsAdminQueryData, RoomsAdminQueryDocument } from './queries.generated';
import { useTranslation } from 'react-i18next';
import { ActionFunction, LoaderFunction, useActionData, useLoaderData } from 'react-router';
import { client } from '../useIntercodeApolloClient';
import { useSubmit } from 'react-router';
import { CreateRoomDocument } from './mutations.generated';

export const action: ActionFunction = async ({ request }) => {
  try {
    if (request.method === 'POST') {
      const formData = await request.formData();
      const { data } = await client.mutate({
        mutation: CreateRoomDocument,
        variables: {
          input: { room: { name: formData.get('name')?.toString() } },
        },
        refetchQueries: [{ query: RoomsAdminQueryDocument }],
        awaitRefetchQueries: true,
      });
      return data;
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

export const loader: LoaderFunction = async () => {
  const { data } = await client.query<RoomsAdminQueryData>({ query: RoomsAdminQueryDocument });
  return data;
};

function RoomsAdmin() {
  const data = useLoaderData() as RoomsAdminQueryData;
  const authorizationWarning = useAuthorizationRequired('can_manage_rooms');
  const confirm = useGraphQLConfirm();
  const { t } = useTranslation();
  const submit = useSubmit();
  const actionData = useActionData();
  const error = actionData instanceof Error ? actionData : undefined;

  const [creatingRoomName, setCreatingRoomName] = useState('');

  usePageTitle(t('navigation.admin.rooms'));

  if (authorizationWarning) return authorizationWarning;

  const roomNameDidChange = (id: string, name: string) => {
    submit({ name }, { action: `./${id}`, method: 'PATCH' });
  };

  const createRoomWasClicked = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    submit({ name: creatingRoomName }, { method: 'POST' });
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
              action: () => submit(null, { action: `./${room.id}`, method: 'DELETE' }),
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
      <h1 className="mb-4">{t('navigation.admin.rooms')}</h1>
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

        <ErrorDisplay graphQLError={error as ApolloError | undefined} />
      </div>
    </>
  );
}

export const Component = RoomsAdmin;
