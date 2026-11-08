import { MockLink } from '@apollo/client/testing';
import { useLocation } from 'react-router';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor, within } from '../testUtils';
import RootSiteConventionsAdminTable from '../../../app/javascript/RootSiteConventionsAdmin/RootSiteConventionsAdminTable';
import {
  RootSiteConventionsAdminTableQueryData,
  RootSiteConventionsAdminTableQueryDocument,
} from '../../../app/javascript/RootSiteConventionsAdmin/queries.generated';
import { TimezoneMode } from '../../../app/javascript/graphqlTypes.generated';
import { cellTexts, columnHeaders, filterCell, rowFor, sortButton } from '../Tables/tableTestHelpers';

type Entry = RootSiteConventionsAdminTableQueryData['conventions_paginated']['entries'][number];

const convention = (
  id: string,
  name: string,
  organization: string | null,
  startsAt: string,
  endsAt: string,
): Entry => ({
  __typename: 'Convention',
  id,
  name,
  starts_at: startsAt,
  ends_at: endsAt,
  timezone_name: 'UTC',
  timezone_mode: TimezoneMode.ConventionLocal,
  organization: organization ? { __typename: 'Organization', id: `org-${id}`, name: organization } : null,
});

function LocationProbe() {
  return <output data-testid="search">{decodeURIComponent(useLocation().search)}</output>;
}

describe('RootSiteConventionsAdminTable', () => {
  const queried = vi.fn();
  let events: ReturnType<typeof userEvent.setup>;
  const entries = [
    convention('1', 'Old Con', 'Old Org', '2020-06-05T12:00:00Z', '2020-06-07T12:00:00Z'),
    convention('2', 'Future Con', null, '2099-06-05T12:00:00Z', '2099-06-07T12:00:00Z'),
  ];

  beforeEach(() => {
    window.localStorage.clear();
    queried.mockReset();
    events = userEvent.setup();
  });

  const renderTable = async (search = '') => {
    const apolloMocks: MockLink.MockedResponse[] = [
      {
        request: {
          query: RootSiteConventionsAdminTableQueryDocument,
          variables: (variables: unknown) => {
            queried(variables);
            return true;
          },
        },
        result: {
          data: {
            __typename: 'Query',
            conventions_paginated: {
              __typename: 'ConventionsPagination',
              total_entries: 2,
              total_pages: 1,
              entries,
            },
          } satisfies RootSiteConventionsAdminTableQueryData,
        },
        maxUsageCount: 50,
      },
    ];

    const r = await renderRoute(
      [
        {
          path: '/conventions',
          Component: () => (
            <>
              <RootSiteConventionsAdminTable />
              <LocationProbe />
            </>
          ),
        },
        { path: '/conventions/:id', Component: () => <h1>Viewing a convention</h1> },
      ],
      { apolloMocks, initialEntries: [`/conventions${search}`] },
    );
    await r.findByText('Old Con');
    return r;
  };

  const lastVariables = () => queried.mock.calls[queried.mock.calls.length - 1][0];

  it('shows the name, organization and dates of each convention', async () => {
    const r = await renderTable();

    expect(columnHeaders(r)).toEqual(['Name', 'Organization name', 'Dates']);
    const oldCon = cellTexts(rowFor(r, 'Old Con'));
    expect(oldCon.slice(0, 2)).toEqual(['Old Con', 'Old Org']);
    expect(oldCon[2]).toMatch(/2020/);
    expect(cellTexts(rowFor(r, 'Future Con')).slice(0, 2)).toEqual(['Future Con', '']);
  });

  it('marks conventions that are past or still to come', async () => {
    const r = await renderTable();

    expect(within(rowFor(r, 'Old Con')).getByLabelText('Past convention')).toBeTruthy();
    expect(within(rowFor(r, 'Future Con')).getByLabelText('Future convention')).toBeTruthy();
  });

  it('asks for the first page, unfiltered and unsorted', async () => {
    await renderTable();

    expect(lastVariables()).toMatchObject({ page: 1, perPage: 20, filters: {}, sort: [] });
  });

  it('offers a text filter on name and organization name only', async () => {
    const r = await renderTable();

    expect(within(filterCell(r, 'Name')).getByRole('textbox')).toBeTruthy();
    expect(within(filterCell(r, 'Organization name')).getByRole('textbox')).toBeTruthy();
    expect(within(filterCell(r, 'Dates')).queryByRole('textbox')).toBeNull();
  });

  it('filters by name and by organization name', async () => {
    const r = await renderTable();
    const name = within(filterCell(r, 'Name')).getByRole('textbox');
    await events.click(name);
    await events.type(name, 'Old{Enter}');
    await waitFor(() => expect(lastVariables().filters).toEqual({ name: 'Old' }));

    const organization = within(filterCell(r, 'Organization name')).getByRole('textbox');
    await events.click(organization);
    await events.type(organization, 'Org{Enter}');
    await waitFor(() => expect(lastVariables().filters).toEqual({ name: 'Old', organization_name: 'Org' }));
    expect(r.getByTestId('search').textContent).toContain('filters.organization_name=Org');
  });

  it('sorts by one column at a time, with the dates sorted latest first to begin with', async () => {
    const r = await renderTable();

    await events.click(sortButton(r, /^Name/));
    await waitFor(() => expect(lastVariables().sort).toEqual([{ field: 'name', desc: false }]));

    await events.click(sortButton(r, /^Dates/));
    await waitFor(() => expect(lastVariables().sort).toEqual([{ field: 'starts_at', desc: true }]));
  });

  it('goes to the convention when a row is clicked', async () => {
    const r = await renderTable();

    await events.click(r.getByText('Future Con'));

    expect(await r.findByRole('heading', { name: 'Viewing a convention' })).toBeTruthy();
  });

  it('offers to make a new convention', async () => {
    const r = await renderTable();

    expect(r.getByRole('link', { name: 'New convention' }).getAttribute('href')).toBe('/conventions/new');
  });
});
