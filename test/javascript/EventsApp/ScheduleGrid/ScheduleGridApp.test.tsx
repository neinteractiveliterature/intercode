import { DateTime } from 'luxon';
import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor } from '../../testUtils';
import ScheduleGridApp from '../../../../app/javascript/EventsApp/ScheduleGrid';
import {
  ScheduleGridConventionDataQueryData,
  ScheduleGridEventsQueryData,
  ScheduleGridEventsQueryDocument,
} from '../../../../app/javascript/EventsApp/ScheduleGrid/queries.generated';
import { CommonConventionDataQueryDocument } from '../../../../app/javascript/EventsApp/queries.generated';
import {
  SchedulingUi,
  SignupMode,
  SiteMode,
  SignupAutomationMode,
  TicketMode,
  TimezoneMode,
} from '../../../../app/javascript/graphqlTypes.generated';
import Timespan from '../../../../app/javascript/Timespan';
import { TIMEZONE_NAME } from './scheduleFixtures';

type Event = ScheduleGridEventsQueryData['convention']['events'][number];

const zone = { zone: TIMEZONE_NAME };
const CON = Timespan.finiteFromDateTimes(
  DateTime.fromISO('2026-01-02T00:00:00', zone),
  DateTime.fromISO('2026-01-04T00:00:00', zone),
);
const FRIDAY = Timespan.finiteFromDateTimes(
  DateTime.fromISO('2026-01-02T06:00:00', zone),
  DateTime.fromISO('2026-01-03T06:00:00', zone),
);

const category = (id: string, name: string) => ({
  __typename: 'EventCategory' as const,
  id,
  name,
  scheduling_ui: SchedulingUi.Regular,
  default_color: '#336699',
  full_color: '#999999',
  signed_up_color: '#cc9900',
  team_member_name: 'GM',
  teamMemberNamePlural: 'GMs',
  event_form: { __typename: 'Form' as const, id: `form-${id}`, form_sections: [] },
});

const convention = (overrides: Partial<ScheduleGridConventionDataQueryData['convention']> = {}) => ({
  __typename: 'Convention' as const,
  id: '1',
  name: 'Test Con',
  starts_at: '2026-01-02T00:00:00-05:00',
  ends_at: '2026-01-04T00:00:00-05:00',
  signup_mode: SignupMode.SelfService,
  signup_automation_mode: SignupAutomationMode.None,
  site_mode: SiteMode.Convention,
  timezone_name: TIMEZONE_NAME,
  timezone_mode: TimezoneMode.ConventionLocal,
  ticket_name: 'ticket',
  ticket_mode: TicketMode.Disabled,
  event_categories: [category('4', 'Larp'), category('5', 'Panel')],
  blockPartial: null,
  ...overrides,
});

const event = (id: string, title: string, startsAt: string, overrides: Partial<Event> = {}): Event => ({
  __typename: 'Event',
  id,
  title,
  length_seconds: 3600,
  short_blurb_html: null,
  my_rating: null,
  can_play_concurrently: false,
  form_response_attrs_json_with_rendered_markdown: null,
  event_category: { __typename: 'EventCategory', id: '4' },
  registration_policy: null,
  runs: [
    {
      __typename: 'Run',
      id: `r${id}`,
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
    },
  ],
  ...overrides,
});

describe('the schedule grid app', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const queried = vi.fn();
  let eventsResult: () => MockLink.MockedResponse['result'];

  beforeEach(() => {
    user = userEvent.setup();
    queried.mockReset();
    eventsResult = () => ({
      data: {
        __typename: 'Query',
        convention: { __typename: 'Convention', id: '1', events: [event('1', 'Boffer Larp', '2026-01-02T20:00:00Z')] },
      },
    });
  });

  const renderGrid = ({
    configKey = 'con_schedule',
    search = '',
    myProfile = false,
    conv = convention(),
    fetchFormItemIdentifiers = ['system'],
    filters,
  }: {
    configKey?: string;
    search?: string;
    myProfile?: boolean;
    conv?: ReturnType<typeof convention>;
    fetchFormItemIdentifiers?: string[];
    filters?: { text_search: string };
  } = {}) => {
    const apolloMocks: MockLink.MockedResponse[] = [
      {
        request: {
          query: ScheduleGridEventsQueryDocument,
          variables: (variables: unknown) => {
            queried(variables);
            return true;
          },
        },
        result: () => eventsResult() as never,
        maxUsageCount: 30,
      },
      {
        request: { query: CommonConventionDataQueryDocument },
        result: { data: { __typename: 'Query', convention: conv } },
        maxUsageCount: 5,
      },
    ];
    return renderRoute(
      [
        {
          path: '/events/schedule/:day',
          loader: () => ({
            matchingTimespan: FRIDAY,
            conventionDayTimespans: [FRIDAY],
            conventionDayTimespansByUrlPortion: {},
            urlPortionsByTimespanStart: {},
          }),
          Component: () => (
            <ScheduleGridApp
              configKey={configKey}
              fetchFormItemIdentifiers={fetchFormItemIdentifiers}
              convention={conv}
              filters={filters}
              currentAbilityCanCreateCmsPartials={false}
            />
          ),
        },
      ],
      {
        apolloMocks,
        initialEntries: [`/events/schedule/friday${search}`],
        appRootContextValue: {
          timezoneName: TIMEZONE_NAME,
          conventionTimespan: CON,
          siteMode: SiteMode.Convention,
          language: 'en',
          ...(myProfile ? { myProfile: { __typename: 'UserConProfile', id: '2', name: 'Me' } as never } : {}),
        },
      },
    );
  };

  const lastVariables = () => queried.mock.calls[queried.mock.calls.length - 1][0];

  it('says when the grid configuration does not exist', async () => {
    const r = await renderGrid({ configKey: 'nonsense' });

    expect(await r.findByText(/“nonsense” not found/)).toBeTruthy();
  });

  it('shows the day, and the timezone the times are in', async () => {
    const r = await renderGrid();

    expect(await r.findByRole('heading', { level: 3, name: /Friday/ })).toBeTruthy();
    expect(r.getByText(/All times displayed in Eastern Standard Time/)).toBeTruthy();
  });

  it('shows the day’s events', async () => {
    const r = await renderGrid();

    expect(await r.findByText('Boffer Larp')).toBeTruthy();
  });

  describe('what it asks for', () => {
    it('is the day’s events, with the filters and the form items to fetch', async () => {
      const r = await renderGrid({ filters: { text_search: 'dragon' } });
      await r.findByText('Boffer Larp');

      const variables = lastVariables();
      expect(DateTime.fromISO(variables.start).toMillis()).toBe(FRIDAY.start.toMillis());
      expect(DateTime.fromISO(variables.finish).toMillis()).toBe(FRIDAY.finish.toMillis());
      expect(variables).toMatchObject({
        fetchFormItemIdentifiers: ['system'],
        extendedCounts: false,
        filters: { text_search: 'dragon' },
      });
    });

    it('asks for extended counts only on the grid that shows them', async () => {
      const r = await renderGrid({ configKey: 'schedule_with_counts' });
      await r.findByText('Boffer Larp');

      expect(lastVariables().extendedCounts).toBe(true);
    });
  });

  it('shows the error if the events cannot be loaded', async () => {
    eventsResult = () => ({ errors: [{ message: 'Schedule is down' } as never] });
    const r = await renderGrid();

    expect(await r.findByText(/Schedule is down/)).toBeTruthy();
  });

  describe('the day tabs', () => {
    it('has one for each convention day, linking to it and keeping the filters', async () => {
      const r = await renderGrid({ search: '?filters.hide_conflicts=false' });
      await r.findByText('Boffer Larp');

      const tabs = r.getAllByRole('link', { name: /Friday|Saturday|Sunday/ });
      expect(tabs.map((tab) => tab.getAttribute('href'))).toEqual([
        '/events/schedule/friday?filters.hide_conflicts=false',
        '/events/schedule/saturday?filters.hide_conflicts=false',
      ]);
    });

    it('fetches a day ahead of time when it is hovered over', async () => {
      const r = await renderGrid();
      await r.findByText('Boffer Larp');
      const callsBefore = queried.mock.calls.length;

      await user.hover(r.getAllByRole('link', { name: /Saturday/ })[0]);

      await waitFor(() => expect(queried.mock.calls.length).toBeGreaterThan(callsBefore));
      expect(DateTime.fromISO(lastVariables().start).toMillis()).toBe(FRIDAY.finish.toMillis());
    });

    it('can be refreshed, asking the server again', async () => {
      const r = await renderGrid();
      await r.findByText('Boffer Larp');
      const callsBefore = queried.mock.calls.length;

      await user.click(r.getByRole('button', { name: 'Refresh' }));

      await waitFor(() => expect(queried.mock.calls.length).toBeGreaterThan(callsBefore));
    });
  });

  describe('the legends', () => {
    it('shows the categories legend, and the note about rooms, on the by-room grid', async () => {
      const r = await renderGrid({ configKey: 'con_schedule_by_room' });

      expect(await r.findByText(/Events that use multiple rooms will appear multiple times/)).toBeTruthy();
      expect(await r.findByText('Event categories')).toBeTruthy();
    });

    it('shows the fullness legend on the grid with counts', async () => {
      const r = await renderGrid({ configKey: 'schedule_with_counts' });

      expect(await r.findByText('Event fullness colors')).toBeTruthy();
      expect(r.getByText('Attendee counts')).toBeTruthy();
    });

    it('lists each category in the categories legend', async () => {
      const r = await renderGrid();

      await r.findByText('Event categories');
      expect(await r.findByText('Panel')).toBeTruthy();
    });
  });

  describe('for someone with a profile', () => {
    it('hides disliked events by default', async () => {
      eventsResult = () => ({
        data: {
          __typename: 'Query',
          convention: {
            __typename: 'Convention',
            id: '1',
            events: [
              event('1', 'Liked Larp', '2026-01-02T20:00:00Z', { my_rating: 1 }),
              event('2', 'Disliked Larp', '2026-01-02T22:00:00Z', { my_rating: -1 }),
            ],
          },
        },
      });
      const r = await renderGrid({ myProfile: true, search: '?filters.my_rating=1,0&filters.hide_conflicts=false' });

      expect(await r.findByText('Liked Larp')).toBeTruthy();
      expect(r.queryByText('Disliked Larp')).toBeNull();
    });
  });

  describe('the grid with counts', () => {
    it('shows counts for each hour', async () => {
      const r = await renderGrid({ configKey: 'schedule_with_counts' });

      await r.findByText('Boffer Larp');
      expect(document.querySelectorAll('.schedule-grid-hour-extended-counts').length).toBeGreaterThan(0);
    });
  });
});
