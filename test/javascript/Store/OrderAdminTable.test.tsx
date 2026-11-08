import { MockLink } from '@apollo/client/testing';
import { useLocation } from 'react-router';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor, within } from '../testUtils';
import OrderAdmin from '../../../app/javascript/Store/OrderAdmin';
import {
  AdminOrdersQueryData,
  AdminOrdersQueryDocument,
} from '../../../app/javascript/Store/OrderAdmin/queries.generated';
import { OrderStatus } from '../../../app/javascript/graphqlTypes.generated';
import { buildAdminOrder, buildAdminOrderEntry } from '../fixtures/orderAdmin';
import { buildMoney } from '../fixtures/store';
import { cellTexts, columnHeaders, filterCell, rowFor, sortButton } from '../Tables/tableTestHelpers';

type Entry = AdminOrdersQueryData['convention']['orders_paginated']['entries'][number];

function LocationProbe() {
  return <output data-testid="search">{decodeURIComponent(useLocation().search)}</output>;
}

describe('OrderAdmin (the orders table)', () => {
  const queried = vi.fn();
  let entries: Entry[];
  let events: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    window.localStorage.clear();
    queried.mockReset();
    events = userEvent.setup();
    entries = [
      buildAdminOrder({ id: '5' }),
      buildAdminOrder({
        id: '6',
        status: OrderStatus.Paid,
        payment_amount: buildMoney(3500),
        user_con_profile: {
          __typename: 'UserConProfile',
          id: '8',
          name_without_nickname: 'Bob Brown',
          email: 'bob@example.com',
        },
        order_entries: [
          buildAdminOrderEntry({ id: '12', describe_products: 'T-shirt' }),
          buildAdminOrderEntry({ id: '13', describe_products: 'Poster' }),
        ],
      }),
    ];
  });

  const renderTable = async ({ search = '', canCreate = true, canUpdate = true } = {}) => {
    const apolloMocks: MockLink.MockedResponse[] = [
      {
        request: {
          query: AdminOrdersQueryDocument,
          variables: (variables: unknown) => {
            queried(variables);
            return true;
          },
        },
        result: () => ({
          data: {
            __typename: 'Query',
            currentAbility: { __typename: 'Ability', can_create_orders: canCreate, can_update_orders: canUpdate },
            convention: {
              __typename: 'Convention',
              id: '1',
              timezone_name: 'UTC',
              orders_paginated: {
                __typename: 'OrdersPagination',
                current_page: 1,
                per_page: 20,
                total_pages: 1,
                entries,
              },
            },
          } satisfies AdminOrdersQueryData,
        }),
        maxUsageCount: 50,
      },
    ];

    const r = await renderRoute(
      [
        {
          path: '/admin_store/orders',
          Component: () => (
            <>
              <OrderAdmin />
              <LocationProbe />
            </>
          ),
          children: [{ path: ':id', Component: () => <h1>Viewing an order</h1> }],
        },
      ],
      { apolloMocks, initialEntries: [`/admin_store/orders${search}`], appRootContextValue: { timezoneName: 'UTC' } },
    );
    await r.findByText('Alice Attendee');
    return r;
  };

  type Rendered = Awaited<ReturnType<typeof renderTable>>;
  const lastVariables = () => queried.mock.calls[queried.mock.calls.length - 1][0];
  const search = (r: Rendered) => r.getByTestId('search').textContent;

  it('shows each order with who ordered, its status, what was ordered and what was paid', async () => {
    const r = await renderTable();

    expect(columnHeaders(r)).toEqual(['ID', 'User', 'Status', 'Submitted', 'Products', 'Payment amount']);
    const unpaid = cellTexts(rowFor(r, 'Alice Attendee'));
    expect([unpaid[0], unpaid[1], unpaid[2], unpaid[4], unpaid[5]]).toEqual([
      '5',
      'Alice Attendee',
      'unpaid',
      'T-shirt',
      '',
    ]);
    const paid = cellTexts(rowFor(r, 'Bob Brown'));
    expect([paid[0], paid[1], paid[2], paid[4], paid[5]]).toEqual([
      '6',
      'Bob Brown',
      'paid',
      'T-shirt and Poster',
      '$35.00',
    ]);
  });

  it('asks for the first page, unfiltered and unsorted', async () => {
    await renderTable();

    expect(lastVariables()).toMatchObject({ page: 1, perPage: 20, filters: {}, sort: [] });
  });

  describe('filtering', () => {
    it('filters by id and by user name', async () => {
      const r = await renderTable();
      const id = within(filterCell(r, 'ID')).getByRole('textbox');
      await events.click(id);
      await events.type(id, '6{Enter}');
      await waitFor(() => expect(lastVariables().filters).toEqual({ id: '6' }));

      const user = within(filterCell(r, 'User')).getByRole('textbox');
      await events.click(user);
      await events.type(user, 'Bob{Enter}');
      await waitFor(() => expect(lastVariables().filters).toEqual({ id: '6', user_name: 'Bob' }));
    });

    it('offers each status, in order of name, and filters by those chosen', async () => {
      const r = await renderTable();
      await events.click(within(filterCell(r, 'Status')).getByRole('button', { name: 'Open' }));
      expect(
        within(filterCell(r, 'Status'))
          .getAllByRole('checkbox')
          .map((checkbox) => checkbox.closest('label')?.textContent?.trim()),
      ).toEqual(['Cancelled', 'Paid', 'Unpaid']);

      await events.click(within(filterCell(r, 'Status')).getByRole('checkbox', { name: 'Paid' }));
      await events.click(within(filterCell(r, 'Status')).getByRole('checkbox', { name: 'Unpaid' }));

      await waitFor(() => expect(lastVariables().filters).toEqual({ status: ['paid', 'unpaid'] }));
      expect(search(r)).toContain('filters.status=paid,unpaid');
    });

    it('takes the statuses from the URL, and shows them as chosen', async () => {
      const r = await renderTable({ search: '?filters.status=cancelled' });

      expect(lastVariables().filters).toEqual({ status: ['cancelled'] });
      expect(
        (within(filterCell(r, 'Status')).getByRole('checkbox', { name: 'Cancelled' }) as HTMLInputElement).checked,
      ).toBe(true);
    });
  });

  describe('sorting', () => {
    it('sorts by the columns that can be sorted, and not by products or payment', async () => {
      const r = await renderTable();
      expect(within(r.getAllByRole('row')[0]).queryByRole('button', { name: /^Products/ })).toBeNull();
      expect(within(r.getAllByRole('row')[0]).queryByRole('button', { name: /^Payment amount/ })).toBeNull();

      await events.click(sortButton(r, /^User/));

      await waitFor(() => expect(lastVariables().sort).toEqual([{ field: 'user_name', desc: false }]));
    });
  });

  describe('what a person is allowed to do', () => {
    it('opens an order when a row is clicked, for those who can update orders', async () => {
      const r = await renderTable();

      await events.click(r.getByText('Bob Brown'));

      expect(await r.findByRole('heading', { name: 'Viewing an order' })).toBeTruthy();
    });

    it('leaves rows alone, for those who cannot', async () => {
      const r = await renderTable({ canUpdate: false });

      await events.click(r.getByText('Bob Brown'));

      expect(r.queryByRole('heading', { name: 'Viewing an order' })).toBeNull();
    });

    it('offers to make a new order, to those who can create orders', async () => {
      const allowed = await renderTable();
      expect(allowed.getByRole('link', { name: /New order/ }).getAttribute('href')).toBe('/admin_store/orders/new');
      allowed.unmount();

      const notAllowed = await renderTable({ canCreate: false });
      expect(notAllowed.queryByRole('link', { name: /New order/ })).toBeNull();
    });
  });
});
