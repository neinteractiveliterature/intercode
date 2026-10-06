import { DateTime } from 'luxon';
import { MockLink } from '@apollo/client/testing';
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useMemo } from 'react';

import { render, userEvent, waitFor, within } from '../../testUtils';
import ScheduleGrid from '../../../../app/javascript/EventsApp/ScheduleGrid/ScheduleGrid';
import {
  ScheduleGridContext,
  useScheduleGridProvider,
} from '../../../../app/javascript/EventsApp/ScheduleGrid/ScheduleGridContext';
import { ScheduleEvent } from '../../../../app/javascript/EventsApp/ScheduleGrid/Schedule';
import { RateEventDocument } from '../../../../app/javascript/EventRatings/mutations.generated';
import { ScheduleGridConfig } from '../../../../app/javascript/EventsApp/ScheduleGrid/ScheduleGridConfig';
import AppRootContext, { appRootContextDefaultValue } from '../../../../app/javascript/AppRootContext';
import {
  SignupRankedChoiceState,
  SignupRequestState,
  SignupState,
  TimezoneMode,
} from '../../../../app/javascript/graphqlTypes.generated';
import Timespan from '../../../../app/javascript/Timespan';
import { TIMEZONE_NAME, buildCategory, buildEvent, categoryConfig, roomConfig } from './scheduleFixtures';

// Friday 2026-01-02 in New York; the convention day runs from 6am to 6am
const DAY = Timespan.finiteFromDateTimes(
  DateTime.fromISO('2026-01-02T06:00:00', { zone: TIMEZONE_NAME }),
  DateTime.fromISO('2026-01-03T06:00:00', { zone: TIMEZONE_NAME }),
);
const THREE_PM = '2026-01-02T20:00:00Z';
const FOUR_PM = '2026-01-02T21:00:00Z';
const SIX_PM = '2026-01-02T23:00:00Z';

const larp = buildCategory('Larp');
const panel = buildCategory('Panel');
const convention = {
  starts_at: '2026-01-02T00:00:00-05:00',
  ends_at: '2026-01-04T00:00:00-05:00',
  timezone_name: TIMEZONE_NAME,
  timezone_mode: TimezoneMode.ConventionLocal,
  event_categories: [larp, panel],
};

describe('useScheduleGridProvider', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AppRootContext.Provider value={{ ...appRootContextDefaultValue, timezoneName: TIMEZONE_NAME }}>
      {children}
    </AppRootContext.Provider>
  );

  const events = () => [
    buildEvent({
      id: 'e1',
      title: 'First',
      category: larp,
      runs: [{ id: 'r1', startsAt: THREE_PM }],
    }),
    buildEvent({
      id: 'e2',
      title: 'Overlaps first',
      category: larp,
      runs: [{ id: 'r2', startsAt: FOUR_PM }],
    }),
    buildEvent({
      id: 'e3',
      title: 'Later',
      category: panel,
      runs: [{ id: 'r3', startsAt: '2026-01-03T01:00:00Z' }],
    }),
  ];

  // (null means leave that argument out, since undefined would just pick up the default)
  const renderProvider = ({
    config = categoryConfig,
    conv = convention,
    evts = events(),
    myRatingFilter,
    hideConflicts,
  }: {
    config?: ScheduleGridConfig | null;
    conv?: typeof convention | null;
    evts?: ScheduleEvent[] | null;
    myRatingFilter?: number[];
    hideConflicts?: boolean;
  } = {}) =>
    renderHook(
      () =>
        useScheduleGridProvider(
          config ?? undefined,
          conv ?? undefined,
          evts ?? undefined,
          myRatingFilter,
          hideConflicts,
        ),
      { wrapper },
    );

  const spec = (runId: string, scheduleBlockId = 'block1') => ({ runId, scheduleBlockId });

  it('builds a schedule of the events, with their categories merged in', () => {
    const { result } = renderProvider();

    expect(result.current.schedule.getRun('r1')).toBeTruthy();
    expect(result.current.schedule.getEventForRun('r3')?.event_category.name).toBe('Panel');
    expect(result.current.config).toBe(categoryConfig);
  });

  it.each([
    ['a config', { config: null }],
    ['a convention', { conv: null }],
    ['events', { evts: null }],
  ])('is an empty skeleton without %s', (_what, args) => {
    const { result } = renderProvider(args);

    expect(result.current.schedule.getRun('r1')).toBeUndefined();
  });

  it('falls back to the skeleton’s config and convention', () => {
    const { result } = renderProvider({ config: null, conv: null, evts: null });

    expect(result.current.config.key).toBe('skeleton');
    expect(result.current.convention.timezone_mode).toBe(TimezoneMode.UserLocal);
  });

  it('hands the rating filter and conflict setting to the schedule', () => {
    const { result } = renderProvider({ myRatingFilter: [1], hideConflicts: true });

    expect(result.current.schedule.myRatingFilter).toEqual([1]);
    expect(result.current.schedule.hideConflicts).toBe(true);
  });

  describe('run details visibility', () => {
    it('starts with nothing shown', () => {
      const { result } = renderProvider();

      expect(result.current.isRunDetailsVisible(spec('r1'))).toBe(false);
      expect(result.current.visibleRunDetails.size).toBe(0);
    });

    it('shows the details of a run, and hides them again when toggled again', () => {
      const { result } = renderProvider();

      act(() => {
        result.current.toggleRunDetailsVisibility(spec('r1'));
      });
      expect(result.current.isRunDetailsVisible(spec('r1'))).toBe(true);

      act(() => {
        result.current.toggleRunDetailsVisibility(spec('r1'));
      });
      expect(result.current.isRunDetailsVisible(spec('r1'))).toBe(false);
    });

    it('tracks the same run separately for each block it appears in', () => {
      const { result } = renderProvider();

      act(() => {
        result.current.toggleRunDetailsVisibility(spec('r1', 'blockA'));
      });

      expect(result.current.isRunDetailsVisible(spec('r1', 'blockA'))).toBe(true);
      expect(result.current.isRunDetailsVisible(spec('r1', 'blockB'))).toBe(false);
    });

    it('closes the details of runs that overlap the one being opened', () => {
      const { result } = renderProvider();
      act(() => {
        result.current.toggleRunDetailsVisibility(spec('r1'));
      });

      act(() => {
        result.current.toggleRunDetailsVisibility(spec('r2'));
      });

      expect(result.current.isRunDetailsVisible(spec('r2'))).toBe(true);
      expect(result.current.isRunDetailsVisible(spec('r1'))).toBe(false);
    });

    it('leaves open the details of runs that do not overlap', () => {
      const { result } = renderProvider();
      act(() => {
        result.current.toggleRunDetailsVisibility(spec('r1'));
      });

      act(() => {
        result.current.toggleRunDetailsVisibility(spec('r3'));
      });

      expect(result.current.isRunDetailsVisible(spec('r1'))).toBe(true);
      expect(result.current.isRunDetailsVisible(spec('r3'))).toBe(true);
    });
  });
});

describe('the schedule grid', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  function GridHarness({ evts, config = categoryConfig }: { evts: ScheduleEvent[]; config?: ScheduleGridConfig }) {
    const value = useScheduleGridProvider(config, convention, evts);
    const stable = useMemo(() => value, [value]);
    return (
      <ScheduleGridContext.Provider value={stable}>
        <ScheduleGrid timespan={DAY} />
      </ScheduleGridContext.Provider>
    );
  }

  const renderGrid = (
    evts: ScheduleEvent[],
    {
      config,
      myProfile = false,
      apolloMocks,
    }: { config?: ScheduleGridConfig; myProfile?: boolean; apolloMocks?: MockLink.MockedResponse[] } = {},
  ) =>
    render(<GridHarness evts={evts} config={config} />, {
      apolloMocks,
      appRootContextValue: {
        timezoneName: TIMEZONE_NAME,
        conventionTimespan: Timespan.finiteFromDateTimes(
          DateTime.fromISO('2026-01-02T00:00:00', { zone: TIMEZONE_NAME }),
          DateTime.fromISO('2026-01-04T00:00:00', { zone: TIMEZONE_NAME }),
        ),
        ...(myProfile ? { myProfile: { __typename: 'UserConProfile', id: '2', name: 'Me' } as never } : {}),
      },
    });

  const simpleEvents = () => [
    buildEvent({
      id: 'e1',
      title: 'Boffer Larp',
      category: larp,
      runs: [{ id: 'r1', startsAt: THREE_PM, rooms: ['Ballroom'] }],
    }),
    buildEvent({
      id: 'e2',
      title: 'Big Panel',
      category: panel,
      runs: [{ id: 'r2', startsAt: SIX_PM, rooms: ['Salon'] }],
    }),
  ];

  it('shows each run, titled', async () => {
    const { findByText, getByText } = await renderGrid(simpleEvents());

    expect(await findByText('Boffer Larp')).toBeTruthy();
    expect(getByText('Big Panel')).toBeTruthy();
  });

  it('labels each hour along the top', async () => {
    const { container } = await renderGrid(simpleEvents());

    await waitFor(() => expect(container.querySelectorAll('.small.text-muted').length).toBeGreaterThan(5));
  });

  it('puts a header on each row when grouping by room', async () => {
    const { findByText } = await renderGrid(simpleEvents(), { config: roomConfig });

    expect(await findByText('Ballroom')).toBeTruthy();
    expect(await findByText('Salon')).toBeTruthy();
  });

  describe('run details', () => {
    const openDetails = async (r: Awaited<ReturnType<typeof renderGrid>>, title = 'Boffer Larp') => {
      await user.click(await r.findByRole('button', { name: new RegExp(title) }));
      return waitFor(() => {
        const popover = r.container.querySelector('.schedule-grid-run-details-popover');
        expect(popover).toBeTruthy();
        return popover as HTMLElement;
      });
    };

    it('opens on click, showing when and where, and a link to the event’s page for that run', async () => {
      const r = await renderGrid(simpleEvents());

      const details = await openDetails(r);

      expect(details.textContent).toContain('Boffer Larp');
      expect(details.textContent).toContain('3:00pm');
      expect(details.textContent).toContain('Ballroom');
      const link = Array.from(details.querySelectorAll('a')).find((a) => a.textContent?.includes('Go to event'));
      expect(link?.getAttribute('href')).toBe('/events/e1-boffer-larp#run-r1');
    });

    it('opens with the keyboard', async () => {
      const r = await renderGrid(simpleEvents());
      const run = await r.findByRole('button', { name: /Boffer Larp/ });

      run.focus();
      await user.keyboard('{Enter}');

      await waitFor(() => expect(r.container.querySelector('.schedule-grid-run-details-popover')).toBeTruthy());
    });

    it('closes with its close button, or by clicking the run again', async () => {
      const r = await renderGrid(simpleEvents());
      const details = await openDetails(r);

      await user.click(within(details).getByRole('button', { name: 'Close' }));
      await waitFor(() => expect(r.container.querySelector('.schedule-grid-run-details-popover')).toBeNull());

      await openDetails(r);
      await user.click(r.getByRole('button', { name: /Boffer Larp/ }));
      await waitFor(() => expect(r.container.querySelector('.schedule-grid-run-details-popover')).toBeNull());
    });

    it('shows the title suffix next to the title', async () => {
      const evts = simpleEvents();
      evts[0].runs[0].title_suffix = 'Late Night';
      const r = await renderGrid(evts);

      const details = await openDetails(r);

      expect(details.textContent).toContain('Late Night');
    });

    it('only offers rating the event to someone with a profile', async () => {
      const visitor = await renderGrid(simpleEvents());
      const visitorDetails = await openDetails(visitor);
      expect(visitorDetails.querySelectorAll('.float-end')).toHaveLength(0);
      visitor.unmount();

      const member = await renderGrid(simpleEvents(), { myProfile: true });
      const memberDetails = await openDetails(member);
      expect(memberDetails.querySelectorAll('.float-end').length).toBeGreaterThan(0);
    });

    it('sends the rating chosen for the event', async () => {
      const sent = vi.fn();
      const r = await renderGrid(simpleEvents(), {
        myProfile: true,
        apolloMocks: [
          {
            request: {
              query: RateEventDocument,
              variables: (variables: unknown) => {
                sent(variables);
                return true;
              },
            },
            result: {
              data: {
                rateEvent: { __typename: 'RateEventPayload', event: { __typename: 'Event', id: 'e1', my_rating: 1 } },
              },
            },
          },
        ],
      });
      const details = await openDetails(r);

      await user.click(
        within(details)
          .getAllByRole('button')
          .filter((b) => b.getAttribute('aria-label') !== 'Close')[0],
      );

      await waitFor(() => expect(sent).toHaveBeenCalled());
      expect(sent.mock.calls[0][0]).toMatchObject({ eventId: 'e1' });
    });
  });

  describe('signup status', () => {
    const withStatus = (apply: (event: ScheduleEvent) => void) => {
      const evts = simpleEvents();
      apply(evts[0]);
      return evts;
    };
    const statusConfig: ScheduleGridConfig = { ...categoryConfig, showSignedUp: true, showSignupStatusBadge: true };

    it('marks a run the user is confirmed in', async () => {
      const r = await renderGrid(
        withStatus((e) => {
          e.runs[0].my_signups = [{ __typename: 'Signup', id: 's1', state: SignupState.Confirmed }];
        }),
        { config: statusConfig, myProfile: true },
      );

      expect(await r.findByTitle('Confirmed')).toBeTruthy();
    });

    it('marks a run the user is waitlisted for', async () => {
      const r = await renderGrid(
        withStatus((e) => {
          e.runs[0].my_signups = [{ __typename: 'Signup', id: 's1', state: SignupState.Waitlisted }];
        }),
        { config: statusConfig, myProfile: true },
      );

      expect(await r.findByTitle('Waitlisted')).toBeTruthy();
    });

    it('marks a run the user has a pending request for', async () => {
      const r = await renderGrid(
        withStatus((e) => {
          e.runs[0].my_signup_requests = [{ __typename: 'SignupRequest', id: 'q1', state: SignupRequestState.Pending }];
        }),
        { config: statusConfig, myProfile: true },
      );

      expect(await r.findByTitle(/request pending/i)).toBeTruthy();
    });

    it('shows ranked choice priorities for a run in the queue, in priority order', async () => {
      const r = await renderGrid(
        withStatus((e) => {
          e.runs[0].my_signup_ranked_choices = [
            { __typename: 'SignupRankedChoice', id: 'c2', state: SignupRankedChoiceState.Pending, priority: 2 },
            { __typename: 'SignupRankedChoice', id: 'c1', state: SignupRankedChoiceState.Pending, priority: 1 },
            { __typename: 'SignupRankedChoice', id: 'c3', state: SignupRankedChoiceState.SignedUp, priority: 3 },
          ];
        }),
        { config: statusConfig, myProfile: true },
      );

      const run = await r.findByRole('button', { name: /Boffer Larp/ });
      expect(run.textContent?.replace(/[^0-9]/g, '')).toBe('12');
    });

    it('shows the rating of a run the user has no signup in', async () => {
      const r = await renderGrid(
        withStatus((e) => {
          e.my_rating = 1;
        }),
        { config: statusConfig, myProfile: true },
      );

      const run = await r.findByRole('button', { name: /Boffer Larp/ });
      expect(run.querySelector('.me-1')).toBeTruthy();
    });

    it('shows no badge when the config does not ask for them', async () => {
      const r = await renderGrid(
        withStatus((e) => {
          e.runs[0].my_signups = [{ __typename: 'Signup', id: 's1', state: SignupState.Confirmed }];
        }),
        { myProfile: true },
      );

      await r.findByText('Boffer Larp');
      expect(r.queryByTitle('Confirmed')).toBeNull();
    });
  });

  describe('extended counts', () => {
    it('shows confirmed, not-counted and waitlisted counts on each run', async () => {
      const evts = simpleEvents();
      evts[0].runs[0].grouped_signup_counts = [
        {
          __typename: 'GroupedSignupCount',
          count: 4,
          counted: true,
          state: SignupState.Confirmed,
          team_member: false,
          bucket: null,
        },
        {
          __typename: 'GroupedSignupCount',
          count: 2,
          counted: false,
          state: SignupState.Confirmed,
          team_member: true,
          bucket: null,
        },
        {
          __typename: 'GroupedSignupCount',
          count: 3,
          counted: true,
          state: SignupState.Waitlisted,
          team_member: false,
          bucket: null,
        },
      ];
      const r = await renderGrid(evts, { config: { ...categoryConfig, showExtendedCounts: true } });

      const run = await r.findByRole('button', { name: /Boffer Larp/ });
      expect(run.querySelector('.event-extended-counts')?.textContent).toBe('4/2/3');
    });
  });
});
