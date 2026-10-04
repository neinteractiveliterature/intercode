import { SignupState } from '../../../../app/javascript/graphqlTypes.generated';
import ScheduleLayoutBlock from '../../../../app/javascript/EventsApp/ScheduleGrid/ScheduleLayout/ScheduleLayoutBlock';
import Timespan from '../../../../app/javascript/Timespan';
import { buildEvent, buildSchedule } from './scheduleFixtures';

// 2026-01-02 in America/New_York is UTC-5. The block below covers 2pm to 10pm local time (8 hours).
const blockTimespan = Timespan.finiteFromStrings('2026-01-02T19:00:00Z', '2026-01-03T03:00:00Z');

const TWO_PM = '2026-01-02T19:00:00Z';
const THREE_PM = '2026-01-02T20:00:00Z';
const THREE_THIRTY_PM = '2026-01-02T20:30:00Z';
const FOUR_PM = '2026-01-02T21:00:00Z';
const FIVE_PM = '2026-01-02T22:00:00Z';
const SIX_PM = '2026-01-02T23:00:00Z';
const HOUR = 60 * 60;

function singleRunEvent(id: string, startsAt: string, lengthSeconds: number, title = id) {
  return buildEvent({ id, title, lengthSeconds, runs: [{ id: `${id}-run`, startsAt }] });
}

describe('ScheduleLayoutBlock', () => {
  describe('computeLayout', () => {
    it('lays a single run out as a lane-0 bar positioned by its share of the block', () => {
      const schedule = buildSchedule([singleRunEvent('a', FOUR_PM, 2 * HOUR)]);
      const block = new ScheduleLayoutBlock('block', blockTimespan, ['a-run'], schedule);

      const { runDimensions, laneCount } = block.computeLayout();

      expect(laneCount).toBe(1);
      expect(runDimensions).toHaveLength(1);
      expect(runDimensions[0]).toMatchObject({ runId: 'a-run', laneIndex: 0 });
      // starts 2 hours into an 8 hour block, and lasts 2 hours
      expect(runDimensions[0].timeAxisStartPercent).toBeCloseTo(25);
      expect(runDimensions[0].timeAxisSizePercent).toBeCloseTo(25);
    });

    it('puts runs that do not overlap in the same lane', () => {
      const schedule = buildSchedule([
        singleRunEvent('a', TWO_PM, HOUR),
        singleRunEvent('b', FOUR_PM, HOUR),
        singleRunEvent('c', SIX_PM, HOUR),
      ]);
      const block = new ScheduleLayoutBlock('block', blockTimespan, ['a-run', 'b-run', 'c-run'], schedule);

      const { runDimensions, laneCount } = block.computeLayout();

      expect(runDimensions.map((dimensions) => dimensions.laneIndex)).toEqual([0, 0, 0]);
      expect(laneCount).toBe(1);
    });

    it('treats a run that starts exactly when another ends as not overlapping', () => {
      const schedule = buildSchedule([singleRunEvent('a', THREE_PM, HOUR), singleRunEvent('b', FOUR_PM, HOUR)]);
      const block = new ScheduleLayoutBlock('block', blockTimespan, ['a-run', 'b-run'], schedule);

      expect(block.computeLayout().laneCount).toBe(1);
    });

    it('puts overlapping runs in separate lanes, reusing lanes as they free up', () => {
      const schedule = buildSchedule([
        singleRunEvent('a', THREE_PM, 3 * HOUR),
        singleRunEvent('b', FOUR_PM, HOUR),
        singleRunEvent('c', FIVE_PM, HOUR),
      ]);
      const block = new ScheduleLayoutBlock('block', blockTimespan, ['a-run', 'b-run', 'c-run'], schedule);

      const { runDimensions, laneCount } = block.computeLayout();

      expect(Object.fromEntries(runDimensions.map((dimensions) => [dimensions.runId, dimensions.laneIndex]))).toEqual({
        'a-run': 0,
        'b-run': 1,
        // b has finished by 5pm, so its lane is free again
        'c-run': 1,
      });
      expect(laneCount).toBe(2);
    });

    it('displays short runs at a minimum of 30 minutes, but keeps their real timespan too', () => {
      const schedule = buildSchedule([singleRunEvent('short', THREE_PM, 10 * 60)]);
      const block = new ScheduleLayoutBlock('block', blockTimespan, ['short-run'], schedule);

      const [dimensions] = block.computeLayout().runDimensions;

      expect(dimensions.timespan.getLength('minutes').minutes).toBe(30);
      expect(dimensions.fullTimespan.getLength('minutes').minutes).toBe(10);
    });

    it('lets a short run’s minimum display length force the next run into another lane', () => {
      const schedule = buildSchedule([
        singleRunEvent('short', THREE_PM, 10 * 60),
        singleRunEvent('next', '2026-01-02T20:15:00Z', HOUR),
      ]);
      const block = new ScheduleLayoutBlock('block', blockTimespan, ['short-run', 'next-run'], schedule);

      expect(block.computeLayout().laneCount).toBe(2);
    });

    it('clips runs to the block timespan', () => {
      const schedule = buildSchedule([singleRunEvent('long', '2026-01-02T20:00:00Z', 12 * HOUR)]);
      const block = new ScheduleLayoutBlock('block', blockTimespan, ['long-run'], schedule);

      const [dimensions] = block.computeLayout().runDimensions;

      expect(dimensions.timespan.finish.toMillis()).toBe(blockTimespan.finish.toMillis());
      expect(dimensions.fullTimespan.getLength('hours').hours).toBe(12);
      expect(dimensions.timeAxisStartPercent + dimensions.timeAxisSizePercent).toBeCloseTo(100);
    });

    it('is empty for a block with no runs', () => {
      const block = new ScheduleLayoutBlock('block', blockTimespan, [], buildSchedule([]));

      expect(block.computeLayout()).toEqual({ runDimensions: [], laneCount: 0 });
    });

    it('ignores run IDs that are not in the schedule', () => {
      const schedule = buildSchedule([singleRunEvent('a', THREE_PM, HOUR)]);
      const block = new ScheduleLayoutBlock('block', blockTimespan, ['a-run', 'missing-run'], schedule);

      expect(block.runIds).toEqual(['a-run']);
    });
  });

  describe('getTimeSortedRunIds', () => {
    it('sorts runs by start time', () => {
      const schedule = buildSchedule([
        singleRunEvent('late', FIVE_PM, HOUR),
        singleRunEvent('early', THREE_PM, HOUR),
        singleRunEvent('middle', FOUR_PM, HOUR),
      ]);
      const block = new ScheduleLayoutBlock('block', blockTimespan, ['late-run', 'early-run', 'middle-run'], schedule);

      expect(block.getTimeSortedRunIds()).toEqual(['early-run', 'middle-run', 'late-run']);
    });

    it('sorts runs starting at the same time by title, ignoring leading articles and case', () => {
      const schedule = buildSchedule([
        singleRunEvent('z', THREE_PM, HOUR, 'Zebra'),
        singleRunEvent('b', THREE_PM, HOUR, 'the bear'),
        singleRunEvent('a', THREE_PM, HOUR, 'Aardvark'),
      ]);
      const block = new ScheduleLayoutBlock('block', blockTimespan, ['z-run', 'b-run', 'a-run'], schedule);

      expect(block.getTimeSortedRunIds()).toEqual(['a-run', 'b-run', 'z-run']);
    });

    it('puts the event with more runs around the same time first when runs start together', () => {
      const popular = buildEvent({
        id: 'popular',
        title: 'Zzz Popular',
        runs: [
          { id: 'popular-run-1', startsAt: THREE_PM },
          { id: 'popular-run-2', startsAt: FOUR_PM },
        ],
      });
      const solo = singleRunEvent('solo', THREE_PM, 3 * HOUR, 'Aaa Solo');
      const schedule = buildSchedule([popular, solo]);
      const block = new ScheduleLayoutBlock('block', blockTimespan, ['popular-run-1', 'solo-run'], schedule);

      expect(block.getTimeSortedRunIds()).toEqual(['popular-run-1', 'solo-run']);
    });

    it('puts longer-running events first when everything else is equal', () => {
      const schedule = buildSchedule([
        singleRunEvent('short', THREE_PM, HOUR, 'Same Title'),
        singleRunEvent('long', THREE_PM, 3 * HOUR, 'Same Title'),
      ]);
      const block = new ScheduleLayoutBlock('block', blockTimespan, ['short-run', 'long-run'], schedule);

      expect(block.getTimeSortedRunIds()).toEqual(['long-run', 'short-run']);
    });
  });

  describe('hiding runs that conflict with the attendee’s signups', () => {
    const unlimited = [{ id: 'bucket', slotsLimited: false, totalSlots: null }];
    const signedUp = buildEvent({
      id: 'signed-up',
      title: 'Signed Up',
      buckets: unlimited,
      lengthSeconds: 3 * HOUR,
      runs: [{ id: 'signed-up-run', startsAt: THREE_PM, mySignupState: SignupState.Confirmed }],
    });
    const conflicting = (id: string, startsAt: string, lengthSeconds = HOUR) =>
      buildEvent({ id, title: id, buckets: unlimited, lengthSeconds, runs: [{ id: `${id}-run`, startsAt }] });

    it('replaces hidden runs with a single placeholder saying how many were hidden', () => {
      const schedule = buildSchedule([signedUp, conflicting('c1', THREE_PM), conflicting('c2', THREE_THIRTY_PM)], {
        hideConflicts: true,
      });
      const block = new ScheduleLayoutBlock('block', blockTimespan, ['signed-up-run', 'c1-run', 'c2-run'], schedule);

      expect(block.hiddenEventRunIds).toEqual(['c1-run', 'c2-run']);
      expect(block.runIds).toHaveLength(2);
      const placeholderRunId = block.hiddenEventsFakeRunId;
      expect(block.runIds).toContain('signed-up-run');
      expect(block.runIds).toContain(placeholderRunId);
      expect(schedule.getEventForRun(placeholderRunId ?? '')?.title).toBe('+ 2 not shown');
    });

    it('stretches the placeholder to cover all the hidden runs it stands in for', () => {
      const schedule = buildSchedule(
        [signedUp, conflicting('c1', THREE_PM), conflicting('c2', THREE_THIRTY_PM, 2 * HOUR)],
        { hideConflicts: true },
      );
      const block = new ScheduleLayoutBlock('block', blockTimespan, ['signed-up-run', 'c1-run', 'c2-run'], schedule);

      // c1 runs 3pm-4pm and c2 runs 3:30pm-5:30pm
      const placeholder = schedule.getRunTimespan(block.hiddenEventsFakeRunId ?? '');
      expect(placeholder?.start.toUTC().toISO()).toBe('2026-01-02T20:00:00.000Z');
      expect(placeholder?.finish.toUTC().toISO()).toBe('2026-01-02T22:30:00.000Z');
    });

    it('gives hidden runs that only touch end to end their own placeholders', () => {
      const schedule = buildSchedule([signedUp, conflicting('c1', THREE_PM), conflicting('c2', FOUR_PM)], {
        hideConflicts: true,
      });
      const block = new ScheduleLayoutBlock('block', blockTimespan, ['signed-up-run', 'c1-run', 'c2-run'], schedule);

      expect(block.hiddenEventRunIds).toEqual(['c2-run']);
      expect(block.runIds).toHaveLength(3);
    });

    it('does not collapse hidden runs that do not overlap each other into the same placeholder', () => {
      const schedule = buildSchedule(
        [signedUp, conflicting('c1', THREE_PM, HOUR / 2), conflicting('c2', '2026-01-02T20:45:00Z', HOUR / 4)],
        { hideConflicts: true },
      );
      const block = new ScheduleLayoutBlock('block', blockTimespan, ['signed-up-run', 'c1-run', 'c2-run'], schedule);

      // the second hidden run starts a new placeholder, and the count starts over
      expect(block.hiddenEventRunIds).toEqual(['c2-run']);
      expect(schedule.getEventForRun(block.hiddenEventsFakeRunId ?? '')?.title).toBe('+ 1 not shown');
      expect(block.runIds).toHaveLength(3);
    });

    it('shows everything when conflicts are not being hidden', () => {
      const schedule = buildSchedule([signedUp, conflicting('c1', THREE_PM)]);
      const block = new ScheduleLayoutBlock('block', blockTimespan, ['signed-up-run', 'c1-run'], schedule);

      expect(block.runIds).toEqual(['signed-up-run', 'c1-run']);
      expect(block.hiddenEventRunIds).toEqual([]);
      expect(block.hiddenEventsFakeRunId).toBeUndefined();
    });
  });
});
