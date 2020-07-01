import EventRun from './PCSG/EventRun';
// eslint-disable-next-line import/no-cycle
import ScheduleBlock from './PCSG/ScheduleBlock';
import ScheduleGridLayout, { ScheduleBlockWithOptions } from './ScheduleGridLayout';
import {
  timespanFromConvention, ConventionForTimespanUtils,
} from '../../TimespanUtils';
import Timespan, { FiniteTimespan } from '../../Timespan';
import { ScheduleGridEventFragmentFragment } from './queries.generated';
import ScheduleGridConfig, { isCategoryMatchRule, isCatchAllMatchRule } from './ScheduleGridConfig';
import { SignupState, SignupRequestState } from '../../graphqlTypes.generated';

function expandTimespanToNearestHour(timespan: FiniteTimespan): FiniteTimespan {
  const start = timespan.start.set({ minute: 0, second: 0, millisecond: 0 });
  let { finish } = timespan;

  if (finish.minute > 0 || finish.second > 0 || finish.millisecond > 0) {
    finish = finish.plus({ hours: 1 });
  }
  finish.set({ minute: 0, second: 0, millisecond: 0 });

  return new Timespan(start, finish) as FiniteTimespan;
}

export interface SignupForSchedule {
  state: SignupState;
}

export interface SignupRequestForSchedule {
  state: SignupRequestState;
}

export interface RunForSchedule extends NonNullable<ScheduleGridEventFragmentFragment['runs'][0]> {
  rooms?: {
    name: string,
  }[];
  disableDetailsPopup?: boolean;
}

export interface EventForSchedule extends ScheduleGridEventFragmentFragment {
  fake?: boolean;
  displayTitle?: string;
}

interface RunForScheduleWithCachedEventId extends RunForSchedule {
  event_id: number;
}

type EventRunGroup = {
  id: string,
  eventRuns: EventRun[],
  rowHeader?: string,
};

export type ScheduleConstructorParams = {
  config: ScheduleGridConfig,
  convention: ConventionForTimespanUtils,
  events: EventForSchedule[],
  timezoneName: string,
  myRatingFilter?: number[],
  hideConflicts?: boolean,
};

export default class Schedule {
  config: ScheduleGridConfig;

  timezoneName: string;

  eventsById: Map<number, EventForSchedule>;

  runsById: Map<number, RunForScheduleWithCachedEventId>;

  conventionTimespan: Timespan;

  myRatingFilter?: number[];

  nextFakeEventRunId: number;

  eventRuns: EventRun[];

  runTimespansById: Map<number, FiniteTimespan>;

  hideConflicts: boolean;

  myConflictingRuns: RunForSchedule[];

  constructor({
    config, convention, events, myRatingFilter, hideConflicts, timezoneName,
  }: ScheduleConstructorParams) {
    this.config = config;

    this.timezoneName = timezoneName;

    this.eventsById = new Map<number, EventForSchedule>(
      events.map((event) => [event.id, event]),
    );
    this.runsById = new Map(
      events.map((event) => (
        event.runs.map((run) => {
          const pair: [number, RunForScheduleWithCachedEventId] = [
            run.id, { ...run, event_id: event.id },
          ];
          return pair;
        })
      ))
        .reduce((runEntries, entriesForEvent) => [...runEntries, ...entriesForEvent], []),
    );

    this.conventionTimespan = timespanFromConvention(convention);

    this.myRatingFilter = myRatingFilter;
    this.nextFakeEventRunId = -1;

    this.eventRuns = EventRun.buildEventRunsFromApi(events);
    this.runTimespansById = new Map(this.eventRuns
      .map((eventRun) => [eventRun.runId, eventRun.timespan]));

    this.hideConflicts = hideConflicts ?? false;
    this.myConflictingRuns = [];
    events.forEach((event) => {
      if (event.can_play_concurrently) {
        return;
      }

      event.runs.forEach((run) => {
        if (
          (run.my_signups || []).some((signup) => signup.state === 'confirmed' || signup.state === 'waitlisted')
          || (run.my_signup_requests || []).some((request) => request.state === 'pending')
        ) {
          this.myConflictingRuns.push(run);
        }
      });
    });
  }

  getRun = (runId: number) => this.runsById.get(runId);

  getEvent = (eventId: number) => this.eventsById.get(eventId);

  getEventRunsOverlapping = (timespan: Timespan) => this.eventRuns.filter((eventRun) => (
    timespan.overlapsTimespan(eventRun.timespan)
  ));

  getRunTimespan = (runId: number) => this.runTimespansById.get(runId);

  groupEventRunsByCategory = (eventRuns: EventRun[]) => {
    const matchRules = this.config.buildCategoryMatchRules();
    const groups: EventRunGroup[] = [];
    this.config.categoryGroups.forEach(({ match, ...otherProps }) => groups.push({
      eventRuns: [],
      ...otherProps,
    }));

    eventRuns.forEach((eventRun) => {
      const { runId } = eventRun;
      const run = this.runsById.get(runId);
      const event = this.eventsById.get(run!.event_id);
      const { event_category: eventCategory } = event!;

      const applicableRule = matchRules.find(({ matchRule }) => {
        if (isCategoryMatchRule(matchRule) && eventCategory.name === matchRule.categoryName) {
          return true;
        }

        return isCatchAllMatchRule(matchRule);
      });

      if (applicableRule) {
        groups[applicableRule.targetGroupIndex].eventRuns.push(eventRun);
      }
    });

    return groups;
  };

  groupEventRunsByRoom = (eventRuns: EventRun[]) => {
    const runsByRoomMap = eventRuns.reduce(
      (eventRunsByRoom, eventRun) => {
        const { runId } = eventRun;
        const run = this.runsById.get(runId)!;
        let roomNames = run.room_names || (run.rooms || []).map((room) => room.name);
        if (roomNames.length === 0) {
          roomNames = ['-'];
        }

        roomNames.forEach((roomName) => {
          if (!eventRunsByRoom.has(roomName)) {
            eventRunsByRoom.set(roomName, []);
          }

          eventRunsByRoom.set(roomName, [...(eventRunsByRoom.get(roomName) ?? []), eventRun]);
        });

        return eventRunsByRoom;
      },
      new Map<string, EventRun[]>(),
    );

    const roomNames = [...runsByRoomMap.keys()]
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

    return roomNames.map<EventRunGroup>((roomName) => ({
      id: roomName,
      rowHeader: roomName,
      eventRuns: runsByRoomMap.get(roomName) ?? [],
    }));
  };

  buildScheduleBlocksFromGroups = (groups: EventRunGroup[], actualTimespan: FiniteTimespan) => {
    const blocks = groups.map<ScheduleBlockWithOptions>(
      ({ eventRuns, id, ...props }) => [
        new ScheduleBlock(id, actualTimespan, eventRuns, this), props,
      ],
    );

    if (this.config.filterEmptyGroups) {
      return blocks.filter((scheduleBlock) => scheduleBlock[0].eventRuns.length > 0);
    }

    return blocks;
  };

  buildLayoutForTimespanRange = (minTimespan: FiniteTimespan, maxTimespan: FiniteTimespan) => {
    const eventRuns = this.getEventRunsOverlapping(maxTimespan);
    const actualTimespan = expandTimespanToNearestHour(eventRuns.reduce(
      (currentMaxTimespan, eventRun) => currentMaxTimespan.expandedToFit(eventRun.timespan),
      minTimespan,
    ));

    const groups = (
      this.config.groupEventsBy === 'room'
        ? this.groupEventRunsByRoom(eventRuns)
        : this.groupEventRunsByCategory(eventRuns)
    );

    return new ScheduleGridLayout(
      eventRuns,
      actualTimespan,
      this.buildScheduleBlocksFromGroups(groups, actualTimespan),
    );
  };

  buildLayoutForConventionDayTimespan = (conventionDayTimespan: FiniteTimespan) => {
    const minTimespan = conventionDayTimespan.clone();

    // start grid at 9am unless something is earlier
    minTimespan.start = minTimespan.start.plus({ hours: 3 });
    // end grid at midnight unless something is earlier
    minTimespan.finish = minTimespan.finish.minus({ hours: 6 });

    return this.buildLayoutForTimespanRange(minTimespan, conventionDayTimespan);
  };

  shouldUseRowHeaders = () => this.config.groupEventsBy === 'room';

  shouldShowRun = (runId: number) => {
    const run = this.runsById.get(runId);
    const event = run ? this.eventsById.get(run.event_id) : null;

    if (this.hideConflicts && event) {
      const runTimespan = this.getRunTimespan(runId);
      const hasConflict = this.myConflictingRuns.filter((r) => r.id !== runId)
        .some((r) => runTimespan && this.getRunTimespan(r.id)?.overlapsTimespan(runTimespan));

      const acceptsCountedSignups = event.registration_policy?.buckets?.some((bucket) => (
        (!bucket.slots_limited || (bucket.total_slots && bucket.total_slots > 0))
        && !bucket.not_counted
      ));

      if (hasConflict && acceptsCountedSignups) {
        return false;
      }
    }

    if (this.myRatingFilter == null || this.myRatingFilter.length === 0) {
      return true;
    }

    return event && this.myRatingFilter.includes(event.my_rating || 0);
  };

  addFakeEventRun = (timespan: FiniteTimespan, title: string, displayTitle?: string) => {
    const fakeEventRunId = this.nextFakeEventRunId;
    this.nextFakeEventRunId -= 1;

    const fakeEventRun = {
      runId: fakeEventRunId,
      timespan,
    };

    const fakeRun = {
      id: fakeEventRunId,
      disableDetailsPopup: true,
      event_id: fakeEventRunId,
      my_signups: [],
      my_signup_requests: [],
      room_names: [],
      signup_count_by_state_and_bucket_key_and_counted: JSON.stringify({
        confirmed: {},
        waitlisted: {},
        withdrawn: {},
      }),
      starts_at: timespan.start.toISO(),
    };

    const fakeEvent: EventForSchedule = {
      id: fakeEventRunId,
      title,
      displayTitle,
      fake: true,
      event_category: {
        id: fakeEventRunId,
        name: `fake${fakeEventRunId}`,
        default_color: 'rgba(0, 0, 0, 0.1)',
        signed_up_color: 'transparent',
      },
      registration_policy: {
        buckets: [],
        minimum_slots: 0,
        minimum_slots_including_not_counted: 0,
        preferred_slots: 0,
        preferred_slots_including_not_counted: 0,
        total_slots: 0,
        total_slots_including_not_counted: 0,
        slots_limited: true,
      },
      runs: [fakeRun],
      can_play_concurrently: true,
      length_seconds: timespan.getLength('seconds'),
    };

    this.eventsById.set(fakeEventRunId, fakeEvent);
    this.runsById.set(fakeEventRunId, fakeRun);
    this.runTimespansById.set(fakeEventRunId, timespan);
    this.eventRuns.push(fakeEventRun);

    return fakeEventRun;
  };
}
