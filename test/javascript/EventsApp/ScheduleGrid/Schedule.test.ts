import { SignupRequestState, SignupState } from '../../../../app/javascript/graphqlTypes.generated';
import { findConflictingRuns } from '../../../../app/javascript/EventsApp/ScheduleGrid/Schedule';
import Timespan from '../../../../app/javascript/Timespan';
import {
  TIMEZONE_NAME,
  buildCategory,
  buildEvent,
  buildSchedule,
  categoryConfig,
  roomConfig,
} from './scheduleFixtures';

// 2026-01-02 in America/New_York is UTC-5, so 20:00Z is 3pm local
const THREE_PM = '2026-01-02T20:00:00Z';
const FOUR_PM = '2026-01-02T21:00:00Z';
const SIX_PM = '2026-01-02T23:00:00Z';
const NINE_PM = '2026-01-03T02:00:00Z';

describe('findConflictingRuns', () => {
  it('finds runs the user has a confirmed or waitlisted signup in, or a pending request for', () => {
    const events = [
      buildEvent({
        id: 'e1',
        title: 'Signed up',
        runs: [{ id: 'r1', startsAt: THREE_PM, mySignupState: SignupState.Confirmed }],
      }),
      buildEvent({
        id: 'e2',
        title: 'Waitlisted',
        runs: [{ id: 'r2', startsAt: THREE_PM, mySignupState: SignupState.Waitlisted }],
      }),
      buildEvent({
        id: 'e3',
        title: 'Requested',
        runs: [{ id: 'r3', startsAt: THREE_PM, myRequestState: SignupRequestState.Pending }],
      }),
    ];

    expect(findConflictingRuns(events).map((run) => run.id)).toEqual(['r1', 'r2', 'r3']);
  });

  it('ignores withdrawn signups and requests that are no longer pending', () => {
    const events = [
      buildEvent({
        id: 'e1',
        title: 'Withdrawn',
        runs: [{ id: 'r1', startsAt: THREE_PM, mySignupState: SignupState.Withdrawn }],
      }),
      buildEvent({
        id: 'e2',
        title: 'Rejected',
        runs: [{ id: 'r2', startsAt: THREE_PM, myRequestState: SignupRequestState.Rejected }],
      }),
      buildEvent({ id: 'e3', title: 'Nothing', runs: [{ id: 'r3', startsAt: THREE_PM }] }),
    ];

    expect(findConflictingRuns(events)).toEqual([]);
  });

  it('ignores events that can be played concurrently', () => {
    const events = [
      buildEvent({
        id: 'e1',
        title: 'Concurrent',
        canPlayConcurrently: true,
        runs: [{ id: 'r1', startsAt: THREE_PM, mySignupState: SignupState.Confirmed }],
      }),
    ];

    expect(findConflictingRuns(events)).toEqual([]);
  });

  it('records which event each conflicting run belongs to', () => {
    const events = [
      buildEvent({
        id: 'e1',
        title: 'Signed up',
        runs: [{ id: 'r1', startsAt: THREE_PM, mySignupState: SignupState.Confirmed }],
      }),
    ];

    expect(findConflictingRuns(events)[0]).toMatchObject({ id: 'r1', event_id: 'e1' });
  });
});

describe('Schedule', () => {
  const larp = buildCategory('Larp');
  const panel = buildCategory('Panel');
  const workshop = buildCategory('Workshop');

  const larpEvent = buildEvent({
    id: 'larp-event',
    title: 'A Larp',
    category: larp,
    runs: [
      { id: 'larp-run-1', startsAt: THREE_PM, rooms: ['Ballroom'] },
      { id: 'larp-run-2', startsAt: NINE_PM, rooms: ['Ballroom', 'Cabaret'] },
    ],
  });
  const panelEvent = buildEvent({
    id: 'panel-event',
    title: 'A Panel',
    category: panel,
    lengthSeconds: 60 * 60,
    runs: [{ id: 'panel-run', startsAt: FOUR_PM, rooms: ['annex'] }],
  });
  const workshopEvent = buildEvent({
    id: 'workshop-event',
    title: 'A Workshop',
    category: workshop,
    runs: [{ id: 'workshop-run', startsAt: FOUR_PM }],
  });

  describe('lookups', () => {
    it('finds events and runs by ID, and the event for a run', () => {
      const schedule = buildSchedule([larpEvent, panelEvent]);

      expect(schedule.getEvent('larp-event')?.title).toBe('A Larp');
      expect(schedule.getRun('panel-run')).toMatchObject({ id: 'panel-run', event_id: 'panel-event' });
      expect(schedule.getEventForRun('larp-run-2')?.id).toBe('larp-event');
      expect(schedule.getEvent('nope')).toBeUndefined();
      expect(schedule.getRun('nope')).toBeUndefined();
      expect(schedule.getEventForRun('nope')).toBeUndefined();
    });

    it('computes each run timespan in the schedule time zone, from the start time and event length', () => {
      const schedule = buildSchedule([larpEvent, panelEvent]);

      const timespan = schedule.getRunTimespan('panel-run');
      expect(timespan?.start.zoneName).toBe(TIMEZONE_NAME);
      expect(timespan?.start.hour).toBe(16);
      expect(timespan?.getLength('hours').hours).toBe(1);
    });

    it('finds the runs overlapping a timespan', () => {
      const schedule = buildSchedule([larpEvent, panelEvent]);

      expect(schedule.getRunIdsOverlapping(Timespan.finiteFromStrings(FOUR_PM, '2026-01-02T22:00:00Z')).sort()).toEqual(
        ['larp-run-1', 'panel-run'],
      );
      expect(schedule.getRunIdsOverlapping(Timespan.finiteFromStrings(SIX_PM, NINE_PM))).toEqual([]);
    });
  });

  describe('groupRunIdsByCategory', () => {
    it('puts runs into the configured category groups in config order, with a catch-all for the rest', () => {
      const schedule = buildSchedule([larpEvent, panelEvent, workshopEvent]);

      const groups = schedule.groupRunIdsByCategory(['larp-run-1', 'panel-run', 'workshop-run', 'larp-run-2']);

      expect(groups.map((group) => group.id)).toEqual(['larps', 'panels', 'other']);
      expect(groups.map((group) => group.runIds)).toEqual([
        ['larp-run-1', 'larp-run-2'],
        ['panel-run'],
        ['workshop-run'],
      ]);
      expect(groups[2].flexGrow).toBe(true);
    });

    it('drops runs that are not in the schedule', () => {
      const schedule = buildSchedule([larpEvent]);

      const groups = schedule.groupRunIdsByCategory(['larp-run-1', 'not-a-run']);

      expect(groups.flatMap((group) => group.runIds)).toEqual(['larp-run-1']);
    });

    it('leaves a category out if no group matches it and there is no catch-all', () => {
      const schedule = buildSchedule([larpEvent, workshopEvent], {
        config: { ...categoryConfig, categoryGroups: [{ id: 'larps', match: [{ categoryName: 'Larp' }] }] },
      });

      const groups = schedule.groupRunIdsByCategory(['larp-run-1', 'workshop-run']);

      expect(groups.map((group) => group.runIds)).toEqual([['larp-run-1']]);
    });
  });

  describe('groupRunIdsByRoom', () => {
    it('groups runs by room, sorted by room name ignoring case, with a "-" group for runs with no room', () => {
      const schedule = buildSchedule([larpEvent, panelEvent, workshopEvent], { config: roomConfig });

      const groups = schedule.groupRunIdsByRoom(['larp-run-1', 'larp-run-2', 'panel-run', 'workshop-run']);

      // 'annex' comes before 'Ballroom' even though a lowercase letter sorts after an uppercase one in ASCII
      expect(groups.map((group) => group.rowHeader)).toEqual(['-', 'annex', 'Ballroom', 'Cabaret']);
      expect(Object.fromEntries(groups.map((group) => [group.id, group.runIds]))).toEqual({
        '-': ['workshop-run'],
        annex: ['panel-run'],
        Ballroom: ['larp-run-1', 'larp-run-2'],
        Cabaret: ['larp-run-2'],
      });
    });

    it('puts a run that is in several rooms in each of them', () => {
      const schedule = buildSchedule([larpEvent], { config: roomConfig });

      const groups = schedule.groupRunIdsByRoom(['larp-run-2']);

      expect(groups.map((group) => group.rowHeader)).toEqual(['Ballroom', 'Cabaret']);
      expect(groups.every((group) => group.runIds.includes('larp-run-2'))).toBe(true);
    });
  });

  describe('buildScheduleBlocksFromGroups', () => {
    const timespan = Timespan.finiteFromStrings('2026-01-02T19:00:00Z', '2026-01-03T04:00:00Z');

    it('builds a layout block for each group, passing the other group properties along', () => {
      const schedule = buildSchedule([larpEvent]);
      const groups = [
        { id: 'a', runIds: ['larp-run-1'], rowHeader: 'Group A' },
        { id: 'b', runIds: [] as string[], flexGrow: true },
      ];

      const blocks = schedule.buildScheduleBlocksFromGroups(groups, timespan);

      expect(blocks.map(([block]) => block.id)).toEqual(['a', 'b']);
      expect(blocks[0][1]).toEqual({ rowHeader: 'Group A' });
      expect(blocks[1][1]).toEqual({ flexGrow: true });
    });

    it('leaves out empty groups only when the config says to', () => {
      const groups = [
        { id: 'a', runIds: ['larp-run-1'] },
        { id: 'b', runIds: [] as string[] },
      ];

      expect(buildSchedule([larpEvent]).buildScheduleBlocksFromGroups(groups, timespan)).toHaveLength(2);
      expect(
        buildSchedule([larpEvent], { config: roomConfig }).buildScheduleBlocksFromGroups(groups, timespan),
      ).toHaveLength(1);
    });
  });

  describe('buildLayoutForTimespanRange', () => {
    it('grows the minimum timespan to fit the runs, with the start rounded down to the hour', () => {
      const schedule = buildSchedule([larpEvent]);

      const layout = schedule.buildLayoutForTimespanRange(
        Timespan.finiteFromStrings('2026-01-02T20:30:00Z', '2026-01-02T21:00:00Z'),
        Timespan.finiteFromStrings('2026-01-02T00:00:00Z', '2026-01-04T00:00:00Z'),
      );

      expect(layout.runIds).toEqual(['larp-run-1', 'larp-run-2']);
      expect(layout.timespan.start.toUTC().toISO()).toBe('2026-01-02T20:00:00.000Z');
      // the last run ends exactly on the hour, so there's no need to extend the end
      expect(layout.timespan.finish.toUTC().toISO()).toBe('2026-01-03T05:00:00.000Z');
    });

    it('rounds the end up to the next hour when the last run finishes partway through an hour', () => {
      const lateRun = buildEvent({
        id: 'late',
        title: 'Ends at half past',
        lengthSeconds: 2.5 * 60 * 60,
        runs: [{ id: 'late-run', startsAt: THREE_PM }],
      });
      const schedule = buildSchedule([lateRun]);

      const layout = schedule.buildLayoutForTimespanRange(
        Timespan.finiteFromStrings('2026-01-02T20:00:00Z', '2026-01-02T20:30:00Z'),
        Timespan.finiteFromStrings('2026-01-02T00:00:00Z', '2026-01-04T00:00:00Z'),
      );

      // 3pm + 2.5 hours = 5:30pm local, which should be shown through 6pm
      expect(layout.timespan.finish.toUTC().toISO()).toBe('2026-01-02T23:00:00.000Z');
    });

    it('never goes beyond the maximum timespan, and only includes runs overlapping it', () => {
      const schedule = buildSchedule([larpEvent]);

      const layout = schedule.buildLayoutForTimespanRange(
        Timespan.finiteFromStrings('2026-01-02T20:00:00Z', '2026-01-02T21:00:00Z'),
        Timespan.finiteFromStrings('2026-01-02T19:00:00Z', '2026-01-02T22:00:00Z'),
      );

      expect(layout.runIds).toEqual(['larp-run-1']);
      expect(layout.timespan.start.toUTC().toISO()).toBe('2026-01-02T20:00:00.000Z');
      expect(layout.timespan.finish.toUTC().toISO()).toBe('2026-01-02T22:00:00.000Z');
    });
  });

  describe('shouldUseRowHeaders', () => {
    it('is true only when grouping by room', () => {
      expect(buildSchedule([], { config: roomConfig }).shouldUseRowHeaders()).toBe(true);
      expect(buildSchedule([]).shouldUseRowHeaders()).toBe(false);
    });
  });

  describe('shouldShowRun', () => {
    it('does not show runs that are not in the schedule', () => {
      expect(buildSchedule([larpEvent]).shouldShowRun('nope')).toBe(false);
    });

    it('shows everything when there are no filters', () => {
      const schedule = buildSchedule([larpEvent, panelEvent]);

      expect(schedule.shouldShowRun('larp-run-1')).toBe(true);
      expect(schedule.shouldShowRun('panel-run')).toBe(true);
    });

    it('filters by the attendee’s rating, treating unrated events as 0', () => {
      const rated = buildEvent({
        id: 'rated',
        title: 'Loved',
        myRating: 1,
        runs: [{ id: 'rated-run', startsAt: THREE_PM }],
      });
      const unrated = buildEvent({
        id: 'unrated',
        title: 'Unrated',
        runs: [{ id: 'unrated-run', startsAt: THREE_PM }],
      });
      const disliked = buildEvent({
        id: 'disliked',
        title: 'Hated',
        myRating: -1,
        runs: [{ id: 'disliked-run', startsAt: THREE_PM }],
      });

      const likedOnly = buildSchedule([rated, unrated, disliked], { myRatingFilter: [1] });
      expect(['rated-run', 'unrated-run', 'disliked-run'].map((id) => likedOnly.shouldShowRun(id))).toEqual([
        true,
        false,
        false,
      ]);

      const unratedOrDisliked = buildSchedule([rated, unrated, disliked], { myRatingFilter: [0, -1] });
      expect(['rated-run', 'unrated-run', 'disliked-run'].map((id) => unratedOrDisliked.shouldShowRun(id))).toEqual([
        false,
        true,
        true,
      ]);

      expect(buildSchedule([rated, unrated], { myRatingFilter: [] }).shouldShowRun('unrated-run')).toBe(true);
    });

    describe('hiding conflicts', () => {
      const unlimited = [{ id: 'b', slotsLimited: false, totalSlots: null }];
      const signedUp = buildEvent({
        id: 'signed-up',
        title: 'Signed Up',
        buckets: unlimited,
        runs: [{ id: 'signed-up-run', startsAt: THREE_PM, mySignupState: SignupState.Confirmed }],
      });

      it('hides runs that overlap one the attendee is signed up for, if they could sign up for them', () => {
        const overlapping = buildEvent({
          id: 'overlapping',
          title: 'Overlapping',
          buckets: unlimited,
          runs: [{ id: 'overlapping-run', startsAt: FOUR_PM }],
        });
        const schedule = buildSchedule([signedUp, overlapping], { hideConflicts: true });

        expect(schedule.shouldShowRun('overlapping-run')).toBe(false);
      });

      it('still shows the run they are signed up for, and runs that do not overlap it', () => {
        const later = buildEvent({
          id: 'later',
          title: 'Later',
          buckets: unlimited,
          runs: [{ id: 'later-run', startsAt: NINE_PM }],
        });
        const schedule = buildSchedule([signedUp, later], { hideConflicts: true });

        expect(schedule.shouldShowRun('signed-up-run')).toBe(true);
        expect(schedule.shouldShowRun('later-run')).toBe(true);
      });

      it('shows overlapping runs that have no counted slots to sign up for', () => {
        const full = buildEvent({
          id: 'full',
          title: 'Full',
          buckets: [{ id: 'f', slotsLimited: true, totalSlots: 0 }],
          runs: [{ id: 'full-run', startsAt: FOUR_PM }],
        });
        const uncountedOnly = buildEvent({
          id: 'uncounted',
          title: 'Uncounted Only',
          buckets: [{ id: 'u', slotsLimited: false, totalSlots: null, notCounted: true }],
          runs: [{ id: 'uncounted-run', startsAt: FOUR_PM }],
        });
        const schedule = buildSchedule([signedUp, full, uncountedOnly], { hideConflicts: true });

        expect(schedule.shouldShowRun('full-run')).toBe(true);
        expect(schedule.shouldShowRun('uncounted-run')).toBe(true);
      });

      it('does not hide anything when the setting is off', () => {
        const overlapping = buildEvent({
          id: 'overlapping',
          title: 'Overlapping',
          buckets: unlimited,
          runs: [{ id: 'overlapping-run', startsAt: FOUR_PM }],
        });

        expect(buildSchedule([signedUp, overlapping]).shouldShowRun('overlapping-run')).toBe(true);
      });

      it('shows overlapping runs of events that can be played concurrently', () => {
        const concurrentSignedUp = buildEvent({
          id: 'concurrent',
          title: 'Concurrent',
          canPlayConcurrently: true,
          buckets: unlimited,
          runs: [{ id: 'concurrent-run', startsAt: THREE_PM, mySignupState: SignupState.Confirmed }],
        });
        const overlapping = buildEvent({
          id: 'overlapping',
          title: 'Overlapping',
          buckets: unlimited,
          runs: [{ id: 'overlapping-run', startsAt: FOUR_PM }],
        });
        const schedule = buildSchedule([concurrentSignedUp, overlapping], { hideConflicts: true });

        expect(schedule.shouldShowRun('overlapping-run')).toBe(true);
      });
    });
  });

  describe('addFakeRun', () => {
    it('adds a placeholder run and event covering the timespan, and returns the run ID', () => {
      const schedule = buildSchedule([larpEvent]);
      const timespan = Timespan.finiteFromStrings(THREE_PM, SIX_PM);

      const fakeRunId = schedule.addFakeRun(timespan, '+ 2 not shown');

      const run = schedule.getRun(fakeRunId);
      const event = schedule.getEventForRun(fakeRunId);
      expect(run).toMatchObject({ id: fakeRunId, disableDetailsPopup: true });
      expect(event).toMatchObject({ id: fakeRunId, title: '+ 2 not shown', fake: true, length_seconds: 3 * 60 * 60 });
      expect(event?.can_play_concurrently).toBe(false);
      expect(schedule.getRunTimespan(fakeRunId)).toBe(timespan);
    });

    it('gives each placeholder its own ID', () => {
      const schedule = buildSchedule([]);
      const timespan = Timespan.finiteFromStrings(THREE_PM, SIX_PM);

      expect(schedule.addFakeRun(timespan, 'one')).not.toEqual(schedule.addFakeRun(timespan, 'two'));
    });
  });
});
