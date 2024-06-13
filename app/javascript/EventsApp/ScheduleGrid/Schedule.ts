import { v4 as uuidv4 } from 'uuid';

import ScheduleLayoutBlock from './ScheduleLayout/ScheduleLayoutBlock';
import ScheduleGridLayout from './ScheduleGridLayout';
import Timespan, { FiniteTimespan } from '../../Timespan';
import {
  ScheduleGridConfig,
  isCategoryMatchRule,
  isCatchAllMatchRule,
  buildCategoryMatchRules,
} from './ScheduleGridConfig';
import { ScheduleGridConventionDataQueryData, ScheduleGridEventFragment } from './queries.generated';
import { timespanFromRun } from '../../TimespanUtils';
import { timeIsOnTheHour } from '../../TimeUtils';
import { SchedulingUi } from '../../graphqlTypes.generated';

function expandTimespanToNearestHour(timespan: FiniteTimespan) {
  const start = timespan.start.set({ minute: 0, second: 0, millisecond: 0 });
  const finish = timeIsOnTheHour(timespan.finish)
    ? timespan.finish.plus({ hours: 1 }).set({ minute: 0, second: 0, millisecond: 0 })
    : timespan.finish;

  return Timespan.fromDateTimes(start, finish) as FiniteTimespan;
}

type EventForConflictingRuns = Pick<ScheduleGridEventFragment, 'can_play_concurrently' | 'id'> & {
  runs: {
    my_signups: Pick<ScheduleGridEventFragment['runs'][number]['my_signups'][number], 'state'>[];
    my_signup_requests: Pick<ScheduleGridEventFragment['runs'][number]['my_signup_requests'][number], 'state'>[];
  }[];
};

export function findConflictingRuns<T extends EventForConflictingRuns>(events: T[]): T['runs'] {
  const conflictingRuns: (T['runs'][number] & { event_id: T['id'] })[] = [];

  events.forEach((event) => {
    if (event.can_play_concurrently) {
      return;
    }

    event.runs.forEach((run) => {
      if (
        (run.my_signups || []).some((signup) => signup.state === 'confirmed' || signup.state === 'waitlisted') ||
        (run.my_signup_requests || []).some((request) => request.state === 'pending')
      ) {
        conflictingRuns.push({ ...run, event_id: event.id });
      }
    });
  });

  return conflictingRuns;
}

export type ScheduleEvent = ScheduleGridEventFragment & {
  displayTitle?: string;
  fake?: boolean;
  event_category: ScheduleGridConventionDataQueryData['convention']['event_categories'][number];
};

export type ScheduleRun = ScheduleEvent['runs'][0] & {
  event_id: string;
  disableDetailsPopup?: boolean;
};

export type ScheduleGroup = {
  id: string;
  runIds: string[];
  flexGrow?: boolean;
  rowHeader?: string;
};

export default class Schedule {
  config: ScheduleGridConfig;

  timezoneName: string;

  eventsById: Map<string, ScheduleEvent>;

  runsById: Map<string, ScheduleRun>;

  myRatingFilter?: number[];

  runTimespansById: Map<string, FiniteTimespan>;

  hideConflicts: boolean;

  myConflictingRuns: ScheduleRun[];

  constructor({
    config,
    events,
    myRatingFilter,
    hideConflicts,
    timezoneName,
  }: {
    config: ScheduleGridConfig;
    events: ScheduleEvent[];
    myRatingFilter?: number[];
    hideConflicts: boolean;
    timezoneName: string;
  }) {
    this.config = config;

    this.timezoneName = timezoneName;

    this.eventsById = new Map(events.map((event) => [event.id, event]));
    this.runsById = new Map(
      events.flatMap((event) => event.runs.map((run) => [run.id, { ...run, event_id: event.id }])),
    );
    this.runTimespansById = new Map(
      events.flatMap((event) => event.runs.map((run) => [run.id, timespanFromRun(timezoneName, event, run)])),
    );

    this.myRatingFilter = myRatingFilter;

    this.hideConflicts = hideConflicts;
    this.myConflictingRuns = findConflictingRuns(events) as ScheduleRun[];

    events.forEach((event) => {
      if (event.can_play_concurrently) {
        return;
      }

      event.runs.forEach((run) => {
        if (
          (run.my_signups || []).some((signup) => signup.state === 'confirmed' || signup.state === 'waitlisted') ||
          (run.my_signup_requests || []).some((request) => request.state === 'pending')
        ) {
          this.myConflictingRuns.push({ ...run, event_id: event.id });
        }
      });
    });
  }

  getRun(runId: string): ScheduleRun | undefined {
    return this.runsById.get(runId);
  }

  getEvent(eventId: string): ScheduleEvent | undefined {
    return this.eventsById.get(eventId);
  }

  getEventForRun(runId: string): ScheduleEvent | undefined {
    const run = this.getRun(runId);
    if (run) {
      return this.getEvent(run.event_id);
    }
    return undefined;
  }

  getRunIdsOverlapping(timespan: Timespan): string[] {
    return [...this.runTimespansById.entries()]
      .filter(([, runTimespan]) => timespan.overlapsTimespan(runTimespan))
      .map(([runId]) => runId);
  }

  getRunTimespan(runId: string): FiniteTimespan | undefined {
    return this.runTimespansById.get(runId);
  }

  groupRunIdsByCategory(runIds: string[]): ScheduleGroup[] {
    const matchRules = buildCategoryMatchRules(this.config);
    const groups: ScheduleGroup[] = [];
    this.config.categoryGroups?.forEach(({ match, ...otherProps }) =>
      groups.push({
        runIds: [],
        ...otherProps,
      }),
    );

    runIds.forEach((runId) => {
      const run = this.runsById.get(runId);
      if (!run) {
        return;
      }
      const event = this.eventsById.get(run.event_id);
      if (!event) {
        return;
      }
      const { event_category: eventCategory } = event;

      const applicableRule = matchRules.find(({ matchRule }) => {
        if (isCategoryMatchRule(matchRule) && matchRule.categoryName && eventCategory.name === matchRule.categoryName) {
          return true;
        }

        return isCatchAllMatchRule(matchRule);
      });

      if (applicableRule) {
        groups[applicableRule.targetGroupIndex].runIds.push(runId);
      }
    });

    return groups;
  }

  groupRunIdsByRoom(runIds: string[]): ScheduleGroup[] {
    const runIdsByRoomMap = runIds.reduce((runIdsByRoom, runId) => {
      const run = this.runsById.get(runId);
      if (!run) {
        return runIdsByRoom;
      }
      let roomNames = run.room_names;
      if (roomNames.length === 0) {
        roomNames = ['-'];
      }

      roomNames.forEach((roomName) => {
        if (!runIdsByRoom.has(roomName)) {
          runIdsByRoom.set(roomName, []);
        }

        runIdsByRoom.set(roomName, [...(runIdsByRoom.get(roomName) ?? []), runId]);
      });

      return runIdsByRoom;
    }, new Map<string, string[]>());

    const roomNames = [...runIdsByRoomMap.keys()].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' }),
    );

    return roomNames.map(
      (roomName) =>
        ({
          id: roomName,
          rowHeader: roomName,
          runIds: runIdsByRoomMap.get(roomName) ?? [],
        }) as ScheduleGroup,
    );
  }

  buildScheduleBlocksFromGroups(
    groups: ScheduleGroup[],
    actualTimespan: FiniteTimespan,
  ): [ScheduleLayoutBlock, Omit<ScheduleGroup, 'runIds' | 'id'>][] {
    const blocks = groups.map(
      ({ runIds, id, ...props }) =>
        [new ScheduleLayoutBlock(id, actualTimespan, runIds, this), props] as [
          ScheduleLayoutBlock,
          Omit<ScheduleGroup, 'runIds' | 'id'>,
        ],
    );

    if (this.config.filterEmptyGroups) {
      return blocks.filter((scheduleBlock) => scheduleBlock[0].runIds.length > 0);
    }

    return blocks;
  }

  buildLayoutForTimespanRange(minTimespan: FiniteTimespan, maxTimespan: FiniteTimespan): ScheduleGridLayout {
    const runIds = this.getRunIdsOverlapping(maxTimespan);
    const allRunsTimespan = expandTimespanToNearestHour(
      runIds.reduce((currentMaxTimespan, runId) => {
        const runTimespan = this.getRunTimespan(runId);
        if (!runTimespan) {
          throw new Error(`buildLayoutForTimespanRange: tried to find run ${runId} but it wasn't in the schedule`);
        }
        return currentMaxTimespan.expandedToFit(runTimespan);
      }, minTimespan),
    );
    const actualTimespan = allRunsTimespan.intersection(maxTimespan);

    const groups =
      this.config.groupEventsBy === 'room' ? this.groupRunIdsByRoom(runIds) : this.groupRunIdsByCategory(runIds);

    return new ScheduleGridLayout(runIds, actualTimespan, this.buildScheduleBlocksFromGroups(groups, actualTimespan));
  }

  shouldUseRowHeaders(): boolean {
    return this.config.groupEventsBy === 'room';
  }

  shouldShowRun(runId: string): boolean {
    const run = this.runsById.get(runId);
    if (!run) {
      return false;
    }
    const event = this.eventsById.get(run.event_id);
    if (!event) {
      return false;
    }

    if (this.hideConflicts) {
      const runTimespan = this.getRunTimespan(runId);
      if (!runTimespan) {
        Rollbar?.warn(`shouldShowRun: tried to find run ${runId} but it wasn't in the schedule`);
        return false;
      }
      const hasConflict = this.myConflictingRuns
        .filter((r) => r.id !== runId)
        .some((r) => this.getRunTimespan(r.id)?.overlapsTimespan(runTimespan));

      const acceptsCountedSignups = event.registration_policy?.buckets.some(
        (bucket) =>
          (!bucket.slots_limited || (bucket.total_slots != null && bucket.total_slots > 0)) && !bucket.not_counted,
      );

      if (hasConflict && acceptsCountedSignups) {
        return false;
      }
    }

    if (this.myRatingFilter == null || this.myRatingFilter.length === 0) {
      return true;
    }

    return this.myRatingFilter.includes(event.my_rating || 0);
  }

  addFakeRun(timespan: FiniteTimespan, title: string, displayTitle?: string): string {
    const fakeRunId = uuidv4();

    const fakeRun: ScheduleRun = {
      __typename: 'Run',
      id: fakeRunId,
      disableDetailsPopup: true,
      event_id: fakeRunId,
      my_signups: [],
      my_signup_requests: [],
      my_signup_ranked_choices: [],
      room_names: [],
      starts_at: timespan.start.toISO() ?? '',
      confirmed_signup_count: 0,
      not_counted_signup_count: 0,
      grouped_signup_counts: [],
    };

    const fakeEvent: ScheduleEvent = {
      __typename: 'Event',
      id: fakeRunId,
      title,
      displayTitle,
      length_seconds: timespan.getLength('seconds').seconds,
      can_play_concurrently: false,
      fake: true,
      event_category: {
        __typename: 'EventCategory',
        id: uuidv4(),
        name: 'Fake events',
        default_color: 'rgba(0, 0, 0, 0.1)',
        signed_up_color: 'transparent',
        scheduling_ui: SchedulingUi.Regular,
        event_form: {
          __typename: 'Form',
          form_sections: [],
          id: '',
        },
        team_member_name: 'team member',
        teamMemberNamePlural: 'team members',
      },
      registration_policy: {
        __typename: 'RegistrationPolicy',
        buckets: [],
        total_slots: 0,
        slots_limited: true,
      },
      runs: [fakeRun],
    };

    this.eventsById.set(fakeRunId, fakeEvent);
    this.runsById.set(fakeRunId, fakeRun);
    this.runTimespansById.set(fakeRunId, timespan);

    return fakeRunId;
  }
}
