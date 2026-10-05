import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor } from '../testUtils';
import AuthenticityTokensManager, {
  AuthenticityTokensContext,
} from '../../../app/javascript/AuthenticityTokensContext';
import { Component as EditUser, loader } from '../../../app/javascript/Authentication/EditUser';
import {
  AccountFormContentQueryData,
  AccountFormContentQueryDocument,
  EditUserQueryData,
  EditUserQueryDocument,
} from '../../../app/javascript/Authentication/queries.generated';

const editUserData: EditUserQueryData = {
  __typename: 'Query',
  convention: null,
  currentUser: { __typename: 'User', id: '1', first_name: 'Alice', last_name: 'Attendee', email: 'alice@example.com' },
};

const accountFormContentData: AccountFormContentQueryData = {
  __typename: 'Query',
  currentAbility: { __typename: 'Ability', can_create_cms_partials: false },
  rootSite: { __typename: 'RootSite', id: '1', blockPartial: null },
};

const jsonResponse = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' }, ...init });

describe('EditUser', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    user = userEvent.setup();
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const apolloMocks: MockLink.MockedResponse[] = [
    { request: { query: EditUserQueryDocument }, result: { data: editUserData } },
    { request: { query: AccountFormContentQueryDocument }, result: { data: accountFormContentData } },
  ];

  const renderPage = () => {
    const manager = new AuthenticityTokensManager(fetch, { updateUser: 'update-token' }, new URL('http://localhost/'));
    return renderRoute(
      [
        {
          path: '/users/edit',
          loader,
          Component: () => (
            <AuthenticityTokensContext.Provider value={manager}>
              <EditUser />
            </AuthenticityTokensContext.Provider>
          ),
        },
      ],
      {
        apolloMocks,
        initialEntries: ['/users/edit'],
        appRootContextValue: { currentUser: { __typename: 'User', id: '1', name: 'Alice' } },
      },
    );
  };

  it('saves the changed account and says it was saved', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));
    const { findByLabelText, getByRole, getByLabelText, findByText } = await renderPage();

    const firstName = await findByLabelText('First name');
    expect(firstName).toHaveValue('Alice');
    await user.clear(firstName);
    await user.type(firstName, 'Alicia');
    await user.type(getByLabelText('Current password'), 'hunter2');
    await user.click(getByRole('button', { name: 'Update account' }));

    expect(await findByText(/Saved/)).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/users');
    const body = init?.body as FormData;
    expect(body.get('user[first_name]')).toBe('Alicia');
    expect(body.get('user[current_password]')).toBe('hunter2');
  });

  it('shows the error and does not say it was saved when the update fails', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ errors: { current_password: 'is invalid' } }, { status: 422 }));
    const { findByLabelText, getByRole, findByText, queryByText } = await renderPage();

    await findByLabelText('First name');
    await user.click(getByRole('button', { name: 'Update account' }));

    expect(await findByText(/Current password is invalid/)).toBeTruthy();
    expect(queryByText(/Saved/)).toBeNull();
    await waitFor(() => expect(getByRole('button', { name: 'Update account' })).toBeEnabled());
  });
});
