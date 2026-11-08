import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor, within } from '../testUtils';
import CouponAdminTable from '../../../app/javascript/Store/CouponAdmin/CouponAdminTable';
import {
  AdminCouponsQueryData,
  AdminCouponsQueryDocument,
} from '../../../app/javascript/Store/CouponAdmin/queries.generated';
import { cellTexts, columnHeaders, rowFor, sortButton } from '../Tables/tableTestHelpers';
import { AuthenticationManagerContext, buildSignedInManager, stubCsvDownload } from '../Tables/csvExportTestHelpers';

type Entry = AdminCouponsQueryData['convention']['coupons_paginated']['entries'][number];

const coupon = (id: string, code: string, overrides: Partial<Entry> = {}): Entry => ({
  __typename: 'Coupon',
  id,
  code,
  usage_limit: null,
  expires_at: null,
  percent_discount: null,
  fixed_amount: null,
  provides_product: null,
  ...overrides,
});

describe('CouponAdminTable', () => {
  const queried = vi.fn();
  let events: ReturnType<typeof userEvent.setup>;
  const entries = [
    coupon('1', 'TENOFF', { percent_discount: '10', usage_limit: 5 }),
    coupon('2', 'FIVEBUCKS', { fixed_amount: { __typename: 'Money', fractional: 500, currency_code: 'USD' } }),
    coupon('3', 'FREESHIRT', { provides_product: { __typename: 'Product', id: '9', name: 'T-shirt' } }),
  ];

  beforeEach(() => {
    window.localStorage.clear();
    queried.mockReset();
    events = userEvent.setup();
  });

  const renderTable = async () => {
    const apolloMocks: MockLink.MockedResponse[] = [
      {
        request: {
          query: AdminCouponsQueryDocument,
          variables: (variables: unknown) => {
            queried(variables);
            return true;
          },
        },
        result: {
          data: {
            __typename: 'Query',
            convention: {
              __typename: 'Convention',
              id: '1',
              coupons_paginated: { __typename: 'CouponsPagination', current_page: 1, total_pages: 1, entries },
            },
          } satisfies AdminCouponsQueryData,
        },
        maxUsageCount: 50,
      },
    ];

    const r = await renderRoute(
      [
        {
          path: '/coupons',
          Component: () => (
            <AuthenticationManagerContext.Provider value={buildSignedInManager()}>
              <CouponAdminTable />
            </AuthenticationManagerContext.Provider>
          ),
        },
        { path: '/coupons/:id', Component: () => <h1>Viewing a coupon</h1> },
      ],
      { apolloMocks, initialEntries: ['/coupons'] },
    );
    await r.findByText('TENOFF');
    return r;
  };

  const lastVariables = () => queried.mock.calls[queried.mock.calls.length - 1][0];

  it('shows each coupon with what it does and how often it can be used', async () => {
    const r = await renderTable();

    expect(columnHeaders(r)).toEqual(['Code', 'Effect', 'Usage limit', 'Expiration date']);
    expect(cellTexts(rowFor(r, 'TENOFF')).slice(0, 3)).toEqual(['TENOFF', '10% off order', '5 uses']);
    expect(cellTexts(rowFor(r, 'FIVEBUCKS')).slice(0, 3)).toEqual(['FIVEBUCKS', '$5.00 off order', 'Unlimited uses']);
    expect(cellTexts(rowFor(r, 'FREESHIRT')).slice(0, 3)).toEqual(['FREESHIRT', '1 free T-shirt', 'Unlimited uses']);
  });

  it('has no filters, since none of its columns are filterable', async () => {
    const r = await renderTable();

    expect(r.getAllByRole('row')[1].closest('thead')).toBeNull();
    expect(r.queryAllByRole('textbox')).toHaveLength(0);
  });

  it('asks for the first page, unfiltered and unsorted', async () => {
    await renderTable();

    expect(lastVariables()).toMatchObject({ page: 1, perPage: 20, filters: {}, sort: [] });
  });

  it('sorts by the columns that can be sorted, and not by effect', async () => {
    const r = await renderTable();
    expect(within(r.getAllByRole('row')[0]).queryByRole('button', { name: /^Effect/ })).toBeNull();

    await events.click(sortButton(r, /^Code/));

    await waitFor(() => expect(lastVariables().sort).toEqual([{ field: 'code', desc: false }]));
  });

  it('goes to the coupon when a row is clicked, and offers to make a new one', async () => {
    const r = await renderTable();
    expect(r.getByRole('link', { name: /New coupon/ }).getAttribute('href')).toBe('/coupons/new');

    await events.click(r.getByText('FIVEBUCKS'));

    expect(await r.findByRole('heading', { name: 'Viewing a coupon' })).toBeTruthy();
  });

  describe('exporting', () => {
    let csv: ReturnType<typeof stubCsvDownload>;

    beforeEach(() => {
      csv = stubCsvDownload({ filename: 'coupons.csv' });
    });

    afterEach(() => {
      csv.restore();
    });

    it('asks for the visible columns, with effect split into what it is made of', async () => {
      const r = await renderTable();

      await events.click(r.getByRole('button', { name: /Export CSV/ }));

      await waitFor(() => expect(csv.requestCount()).toBe(1));
      const { url } = csv.lastRequest();
      expect(url.pathname).toBe('/csv_exports/coupons');
      expect(url.searchParams.getAll('columns[]')).toEqual([
        'code',
        'fixed_amount',
        'percent_discount',
        'provides_product',
        'usage_limit',
        'expires_at',
      ]);
      await waitFor(() => expect(csv.downloads).toEqual(['coupons.csv']));
    });
  });
});
