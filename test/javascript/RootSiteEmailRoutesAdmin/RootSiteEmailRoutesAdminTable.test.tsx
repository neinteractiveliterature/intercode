import { MockLink } from '@apollo/client/testing';
import { useLocation } from 'react-router';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor, within } from '../testUtils';
import RootSiteEmailRoutesAdminTable from '../../../app/javascript/RootSiteEmailRoutesAdmin';
import {
  RootSiteEmailRoutesAdminTableQueryData,
  RootSiteEmailRoutesAdminTableQueryDocument,
} from '../../../app/javascript/RootSiteEmailRoutesAdmin/queries.generated';
import {
  AuthenticationManager,
  AuthenticationManagerContext,
} from '../../../app/javascript/Authentication/authenticationManager';
import { appRootContextDefaultValue, AppRootContextValue } from '../../../app/javascript/AppRootContext';
import { cellTexts, columnHeaders, filterCell, rowFor, sortButton } from '../Tables/tableTestHelpers';

type Entry = RootSiteEmailRoutesAdminTableQueryData['email_routes_paginated']['entries'][number];

const route = (id: string, receiver: string, forwards: string[] | null): Entry => ({
  __typename: 'EmailRoute',
  id,
  receiver_address: receiver,
  forward_addresses: forwards,
});

function LocationProbe() {
  return <output data-testid="search">{decodeURIComponent(useLocation().search)}</output>;
}

describe('RootSiteEmailRoutesAdminTable', () => {
  const queried = vi.fn();
  let events: ReturnType<typeof userEvent.setup>;
  const entries = [
    route('1', 'info@example.com', ['a@example.com', 'b@example.com']),
    route('2', 'help@example.com', null),
  ];

  beforeEach(() => {
    window.localStorage.clear();
    queried.mockReset();
    events = userEvent.setup();
  });

  const signedIn = { __typename: 'User', id: '1', name: 'Admin' } as AppRootContextValue['currentUser'];

  const renderTable = async ({ canManage = true, search = '' } = {}) => {
    const apolloMocks: MockLink.MockedResponse[] = [
      {
        request: {
          query: RootSiteEmailRoutesAdminTableQueryDocument,
          variables: (variables: unknown) => {
            queried(variables);
            return true;
          },
        },
        result: {
          data: {
            __typename: 'Query',
            email_routes_paginated: {
              __typename: 'EmailRoutesPagination',
              total_entries: 2,
              total_pages: 1,
              entries,
            },
          } satisfies RootSiteEmailRoutesAdminTableQueryData,
        },
        maxUsageCount: 50,
      },
    ];

    return renderRoute(
      [
        {
          path: '/email_routes',
          Component: () => (
            <AuthenticationManagerContext.Provider value={new AuthenticationManager('test-client')}>
              <RootSiteEmailRoutesAdminTable />
              <LocationProbe />
            </AuthenticationManagerContext.Provider>
          ),
        },
        { path: '/email_routes/:id', Component: () => <h1>Viewing an email route</h1> },
      ],
      {
        apolloMocks,
        initialEntries: [`/email_routes${search}`],
        appRootContextValue: {
          currentUser: signedIn,
          currentAbility: { ...appRootContextDefaultValue.currentAbility, can_manage_email_routes: canManage },
        },
      },
    );
  };

  const lastVariables = () => queried.mock.calls[queried.mock.calls.length - 1][0];

  it('shows each route with the addresses it forwards to', async () => {
    const r = await renderTable();
    await r.findByText('info@example.com');

    expect(columnHeaders(r)).toEqual(['Receiver address', 'Forward addresses']);
    expect(cellTexts(rowFor(r, 'info@example.com'))).toEqual(['info@example.com', 'a@example.com, b@example.com']);
    expect(cellTexts(rowFor(r, 'help@example.com'))).toEqual(['help@example.com', '']);
  });

  it('is not shown to people who cannot manage email routes', async () => {
    const r = await renderTable({ canManage: false });

    expect(await r.findByText(/not authorized|unauthorized|permission/i)).toBeTruthy();
    expect(r.queryByText('info@example.com')).toBeNull();
  });

  it('puts a text filter on both columns', async () => {
    const r = await renderTable();
    await r.findByText('info@example.com');

    expect(within(filterCell(r, 'Receiver address')).getByRole('textbox')).toBeTruthy();
    expect(within(filterCell(r, 'Forward addresses')).getByRole('textbox')).toBeTruthy();
  });

  it('filters by what is typed in either', async () => {
    const r = await renderTable();
    await r.findByText('info@example.com');
    const receiver = within(filterCell(r, 'Receiver address')).getByRole('textbox');

    await events.click(receiver);
    await events.type(receiver, 'info{Enter}');

    await waitFor(() => expect(lastVariables().filters).toEqual({ receiver_address: 'info' }));
    expect(r.getByTestId('search').textContent).toContain('filters.receiver_address=info');
  });

  it('sorts by a column that is clicked', async () => {
    const r = await renderTable();
    await r.findByText('info@example.com');

    await events.click(sortButton(r, /^Receiver address/));

    await waitFor(() => expect(lastVariables().sort).toEqual([{ field: 'receiver_address', desc: false }]));
  });

  it('goes to the route when a row is clicked, and offers to make a new one', async () => {
    const r = await renderTable();
    await r.findByText('info@example.com');
    expect(r.getByRole('link', { name: 'New email route' }).getAttribute('href')).toBe('/email_routes/new');

    await events.click(r.getByText('help@example.com'));

    expect(await r.findByRole('heading', { name: 'Viewing an email route' })).toBeTruthy();
  });
});
