import { MockLink } from '@apollo/client/testing';
import { Suspense } from 'react';
import { createRef } from 'react';
import { vi } from 'vitest';

import { renderRoute, waitFor } from '../testUtils';
import RunList from '../../../app/javascript/EventsApp/RunList';
import {
  ScheduleGridEventsQueryData,
  ScheduleGridEventsQueryDocument,
} from '../../../app/javascript/EventsApp/ScheduleGrid/queries.generated';
import { SignupState } from '../../../app/javascript/graphqlTypes.generated';
import { buildCatalogCategory, buildCatalogConvention } from '../fixtures/eventCatalog';

type ScheduleEvent = ScheduleGridEventsQueryData['convention']['events'][number];
type ScheduleRun = ScheduleEvent['runs'][number];

const run = (id: string, startsAt: string, overrides: Partial<ScheduleRun> = {}): ScheduleRun => ({
  __typename: 'Run',
  id,
  starts_at: startsAt,
  schedule_note: null,
  title_suffix: null,
  confirmed_signup_count: 0,
  not_counted_signup_count: 0,
  room_names: ['Ballroom'],
  grouped_signup_counts: [],
  my_signups: [],
  my_signup_requests: [],
  my_signup_ranked_choices: [],
  ...overrides,
});

const event = (
  id: string,
  title: string,
  runs: ScheduleRun[],
  overrides: Partial<ScheduleEvent> = {},
): ScheduleEvent => ({
  __typename: 'Event',
  id,
  title,
  length_seconds: 2 * 3600,
  short_blurb_html: null,
  my_rating: null,
  can_play_concurrently: false,
  form_response_attrs_json_with_rendered_markdown: null,
  event_category: { __typename: 'EventCategory', id: '4' },
  registration_policy: null,
  runs,
  ...overrides,
});

describe('RunList', () => {
  const queried = vi.fn();
  const convention = { ...buildCatalogConvention([buildCatalogCategory({ id: '4' })]), blockPartial: null };

  const renderList = async (
    events: ScheduleEvent[],
    {
      search = '',
      myProfile = false,
      filters,
    }: { search?: string; myProfile?: boolean; filters?: { text?: string } } = {},
  ) => {
    const apolloMocks: MockLink.MockedResponse[] = [
      {
        request: {
          query: ScheduleGridEventsQueryDocument,
          variables: (variables: unknown) => {
            queried(variables);
            return true;
          },
        },
        result: { data: { __typename: 'Query', convention: { __typename: 'Convention', id: '1', events } } },
        maxUsageCount: 10,
      },
    ];

    return renderRoute(
      [
        {
          path: '/events/schedule',
          Component: () => (
            <Suspense fallback={<div>Loading schedule</div>}>
              <RunList
                convention={convention}
                fetchFormItemIdentifiers={['system']}
                filters={filters ? { text_search: filters.text } : undefined}
                scheduleGridNavigationBarRef={createRef<HTMLDivElement>()}
              />
            </Suspense>
          ),
        },
      ],
      {
        apolloMocks,
        initialEntries: [`/events/schedule${search}`],
        appRootContextValue: {
          timezoneName: 'UTC',
          ...(myProfile ? { myProfile: { __typename: 'UserConProfile', id: '2', name: 'Me' } as never } : {}),
        },
      },
    );
  };

  beforeEach(() => queried.mockReset());

  it('asks for the events with the filters and the form item identifiers', async () => {
    const { findByText } = await renderList([event('1', 'Alpha', [run('r1', '2026-06-05T14:00:00Z')])], {
      filters: { text: 'dragon' },
    });

    await findByText(/Alpha/);
    expect(queried).toHaveBeenCalledWith(
      expect.objectContaining({ filters: { text_search: 'dragon' }, fetchFormItemIdentifiers: ['system'] }),
    );
  });

  it('groups runs under a heading for each day', async () => {
    const { findAllByRole } = await renderList([
      event('1', 'Alpha', [run('r1', '2026-06-05T14:00:00Z'), run('r3', '2026-06-06T14:00:00Z')]),
      event('2', 'Beta', [run('r2', '2026-06-05T18:00:00Z')]),
    ]);

    const headings = (await findAllByRole('heading', { level: 3 })).map((heading) => heading.textContent);
    expect(headings).toEqual([expect.stringMatching(/Friday/), expect.stringMatching(/Saturday/)]);
  });

  it('shows a time heading, once, for runs starting together, ordered by title', async () => {
    const { findByText, getAllByText, container } = await renderList([
      event('1', 'Zulu', [run('r1', '2026-06-05T14:00:00Z')]),
      event('2', 'alpha', [run('r2', '2026-06-05T14:00:00Z')]),
      event('3', 'Later', [run('r3', '2026-06-05T18:00:00Z')]),
    ]);

    await findByText(/alpha/);
    expect(getAllByText(/2:00pm/, { selector: 'div.mt-2' })).toHaveLength(1);
    expect(getAllByText(/6:00pm/, { selector: 'div.mt-2' })).toHaveLength(1);
    const text = container.textContent ?? '';
    expect(text.indexOf('alpha')).toBeLessThan(text.indexOf('Zulu'));
    expect(text.indexOf('Zulu')).toBeLessThan(text.indexOf('Later'));
  });

  it('shows each run’s title with when it ends', async () => {
    const { findByText } = await renderList([event('1', 'Alpha', [run('r1', '2026-06-05T14:00:00Z')])]);

    expect(await findByText(/Alpha - until 4:00pm/)).toBeTruthy();
  });

  it('shows nothing for no runs', async () => {
    const { queryAllByRole, queryByText } = await renderList([event('1', 'Unscheduled', [])]);

    await waitFor(() => expect(queryByText('Loading schedule')).toBeNull());
    expect(queryAllByRole('heading', { level: 3 })).toEqual([]);
  });

  describe('for someone with a profile', () => {
    const events = () => [
      event('1', 'Liked', [run('r1', '2026-06-05T14:00:00Z')], { my_rating: 1 }),
      event('2', 'Unrated', [run('r2', '2026-06-05T14:00:00Z')], { my_rating: null }),
      event('3', 'Disliked', [run('r3', '2026-06-05T14:00:00Z')], { my_rating: -1 }),
    ];

    it('hides disliked events by default, and says how many are hidden', async () => {
      const { findByText, queryByText } = await renderList(events(), {
        myProfile: true,
        search: '?filters.my_rating=1,0&filters.hide_conflicts=false',
      });

      expect(await findByText(/Liked - until/)).toBeTruthy();
      expect(queryByText(/Disliked - until/)).toBeNull();
      expect(await findByText('+1 hidden')).toBeTruthy();
    });

    it('follows the rating filter in the URL', async () => {
      const { findByText, queryByText } = await renderList(events(), {
        myProfile: true,
        search: '?filters.my_rating=-1&filters.hide_conflicts=false',
      });

      expect(await findByText(/Disliked - until/)).toBeTruthy();
      expect(queryByText(/Liked - until/)).toBeNull();
      expect(await findByText('+2 hidden')).toBeTruthy();
    });

    it('hides runs that overlap one the user is signed up for when asked to hide conflicts, but not the signed-up run', async () => {
      const { findByText, queryByText } = await renderList(
        [
          event(
            '1',
            'Signed Up',
            [
              run('r1', '2026-06-05T14:00:00Z', {
                my_signups: [{ __typename: 'Signup', id: 's1', state: SignupState.Confirmed }],
              }),
            ],
            { my_rating: 1 },
          ),
          event('2', 'Overlapping', [run('r2', '2026-06-05T15:00:00Z')], { my_rating: 1 }),
          event('3', 'Clear', [run('r3', '2026-06-05T20:00:00Z')], { my_rating: 1 }),
        ],
        { myProfile: true, search: '?filters.my_rating=1&filters.hide_conflicts=true' },
      );

      expect(await findByText(/Clear - until/)).toBeTruthy();
      expect(await findByText(/Signed Up - until/)).toBeTruthy();
      expect(queryByText(/Overlapping - until/)).toBeNull();
      expect(await findByText('+1 hidden')).toBeTruthy();
    });

    it('shows overlapping runs when not hiding conflicts', async () => {
      const { findByText } = await renderList(
        [
          event(
            '1',
            'Signed Up',
            [
              run('r1', '2026-06-05T14:00:00Z', {
                my_signups: [{ __typename: 'Signup', id: 's1', state: SignupState.Confirmed }],
              }),
            ],
            { my_rating: 1 },
          ),
          event('2', 'Overlapping', [run('r2', '2026-06-05T15:00:00Z')], { my_rating: 1 }),
        ],
        { myProfile: true, search: '?filters.my_rating=1&filters.hide_conflicts=false' },
      );

      expect(await findByText(/Overlapping - until/)).toBeTruthy();
    });
  });

  it('does not filter by rating for someone who is not signed in', async () => {
    const { findByText } = await renderList([
      event('1', 'Disliked', [run('r1', '2026-06-05T14:00:00Z')], { my_rating: -1 }),
    ]);

    expect(await findByText(/Disliked - until/)).toBeTruthy();
  });
});
