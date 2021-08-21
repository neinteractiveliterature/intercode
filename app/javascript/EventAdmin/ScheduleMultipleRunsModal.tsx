import { useState, useMemo, useCallback, useContext, ReactNode } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { ApolloError } from '@apollo/client';
import { DateTime } from 'luxon';
import { ErrorDisplay, FormGroupWithLabel } from '@neinteractiveliterature/litform';

import ConventionDaySelect from '../BuiltInFormControls/ConventionDaySelect';
import TimeSelect from '../BuiltInFormControls/TimeSelect';
import Timespan from '../Timespan';
import {
  timespanFromConvention,
  timespanFromRun,
  getConventionDayTimespans,
} from '../TimespanUtils';
import { EventAdminEventsQuery } from './queries';
import useAsyncFunction from '../useAsyncFunction';
import ProspectiveRunSchedule from './ProspectiveRunSchedule';
import RoomSelect from '../BuiltInFormControls/RoomSelect';
import AppRootContext from '../AppRootContext';
import { timezoneNameForConvention, useAppDateTimeFormat } from '../TimeUtils';
import { useCreateMultipleRunsMutation } from './mutations.generated';
import { FuzzyTime } from '../FormPresenter/TimeblockTypes';
import {
  ConventionFieldsFragment,
  EventAdminEventsQueryData,
  EventFieldsFragment,
  RoomFieldsFragment,
} from './queries.generated';

type FuzzyTimeWithoutSecond = Omit<FuzzyTime, 'second'>;
type CompleteFuzzyTimeWithoutSecond = {
  hour: number;
  minute: number;
};

function timeIsComplete(time: FuzzyTimeWithoutSecond): time is CompleteFuzzyTimeWithoutSecond {
  return time.hour != null && time.minute != null;
}

export type ScheduleMultipleRunsModalProps = {
  convention: ConventionFieldsFragment;
  event: EventFieldsFragment;
  visible: boolean;
  onCancel: () => void;
  onFinish: () => void;
};

function ScheduleMultipleRunsModal({
  convention,
  event,
  visible,
  onCancel,
  onFinish,
}: ScheduleMultipleRunsModalProps) {
  const format = useAppDateTimeFormat();
  const [createMutate] = useCreateMultipleRunsMutation();
  const [createMultipleRuns, createError, createInProgress] = useAsyncFunction(createMutate);
  const [day, setDay] = useState<DateTime>();
  const [start, setStart] = useState<FuzzyTimeWithoutSecond>({});
  const [finish, setFinish] = useState<FuzzyTimeWithoutSecond>({});
  const [rooms, setRooms] = useState<RoomFieldsFragment[]>([]);
  const { timezoneName } = useContext(AppRootContext);
  const conventionTimespan = useMemo(() => timespanFromConvention(convention), [convention]);
  const conventionDayTimespans = useMemo(
    () =>
      conventionTimespan.isFinite()
        ? getConventionDayTimespans(conventionTimespan, timezoneName)
        : [],
    [timezoneName, conventionTimespan],
  );
  const conventionDayTimespan = useMemo(
    () => (day ? conventionDayTimespans.find((cdt) => cdt.includesTime(day)) : null),
    [conventionDayTimespans, day],
  );

  const timespan = useMemo(() => {
    if (!day || !start || !finish || !timeIsComplete(start) || !timeIsComplete(finish)) {
      return null;
    }

    return Timespan.finiteFromDateTimes(day.set(start), day.set(finish));
  }, [day, start, finish]);

  const timespansWithinRange = useMemo(() => {
    if (!timespan) {
      return [];
    }

    return timespan.getTimespansWithin(timezoneName, {
      unit: 'second',
      duration: event.length_seconds,
    });
  }, [timespan, timezoneName, event.length_seconds]);

  const existingRunTimespans = useMemo(
    () =>
      event.runs.map((run) => timespanFromRun(timezoneNameForConvention(convention), event, run)),
    [event, convention],
  );

  const nonConflictingTimespansWithinRange = useMemo(
    () =>
      timespansWithinRange.filter(
        (runTimespan) =>
          !existingRunTimespans.some((existingTimespan) =>
            existingTimespan.overlapsTimespan(runTimespan),
          ),
      ),
    [timespansWithinRange, existingRunTimespans],
  );

  const runsForProspectiveRunSchedule = useMemo(
    () =>
      nonConflictingTimespansWithinRange.map((t, index) => ({
        __typename: 'Run' as const,
        id: index * -1,
        starts_at: t.start.toISO(),
        rooms,
      })),
    [nonConflictingTimespansWithinRange, rooms],
  );

  const eventForProspectiveRunSchedule = useMemo(
    () => ({
      ...event,
      id: event.id || -1,
      runs: event.runs || [],
    }),
    [event],
  );

  const scheduleRuns = useCallback(async () => {
    const runs = nonConflictingTimespansWithinRange.map((nonConflictingTimespan) => ({
      starts_at: nonConflictingTimespan.start.toISO(),
      room_ids: rooms.map((room) => room.id),
    }));

    await createMultipleRuns({
      variables: {
        input: { event_id: event.id, runs },
      },
      update: (store, { data }) => {
        const eventsData = store.readQuery<EventAdminEventsQueryData>({
          query: EventAdminEventsQuery,
        });
        const newRuns = data?.createMultipleRuns?.runs;
        if (!eventsData || !newRuns) {
          return;
        }
        store.writeQuery({
          query: EventAdminEventsQuery,
          data: {
            ...eventsData,
            events: eventsData.events.map((e) => {
              if (e.id === event.id) {
                return {
                  ...e,
                  runs: [...e.runs, ...newRuns],
                };
              }

              return e;
            }),
          },
        });
      },
    });
    onFinish();
  }, [createMultipleRuns, event, rooms, nonConflictingTimespansWithinRange, onFinish]);

  const renderTimeSelects = () => {
    if (!day || !conventionDayTimespan) {
      return null;
    }

    const timespanForFinish = Timespan.finiteFromDateTimes(
      conventionDayTimespan.start,
      conventionDayTimespan.finish.plus({ hours: 1 }),
    );

    return (
      <div>
        <fieldset className="mb-3">
          <legend className="col-form-label">From</legend>
          <TimeSelect value={start} onChange={setStart} timespan={conventionDayTimespan} />
        </fieldset>

        <fieldset className="mb-3">
          <legend className="col-form-label">Until</legend>
          <TimeSelect value={finish} onChange={setFinish} timespan={timespanForFinish} />
        </fieldset>
      </div>
    );
  };

  const renderRunPreview = () => {
    const runTimespans = timespansWithinRange;
    if (runTimespans.length < 1) {
      return null;
    }

    const nonConflictingTimespans = nonConflictingTimespansWithinRange;

    const runTimespanItems = runTimespans.map((runTimespan) => {
      let description: ReactNode = format(runTimespan.start, 'shortTime');
      const runConflicts =
        nonConflictingTimespans.find((nonConflictingTimespan) =>
          nonConflictingTimespan.isSame(runTimespan),
        ) == null;

      if (runConflicts) {
        description = (
          <del title={`There is already a run scheduled at ${description}`}>{description}</del>
        );
      }

      return (
        <li key={runTimespan.start.toISO()} className="list-inline-item">
          {description}
        </li>
      );
    });

    return (
      <ul className="list-inline">
        <li>
          <strong>Will schedule runs at:</strong>
        </li>
        {runTimespanItems}
      </ul>
    );
  };

  return (
    <div>
      <Modal visible={visible} dialogClassName="modal-xl">
        <div className="modal-header">
          <h5 className="modal-title">Schedule runs of {event.title}</h5>
        </div>
        <div className="modal-body">
          <ConventionDaySelect convention={convention} value={day} onChange={setDay} />

          {renderTimeSelects()}
          {renderRunPreview()}

          <FormGroupWithLabel label="Room(s)">
            {(id) => (
              <RoomSelect
                id={id}
                label="Room(s)"
                name="room_ids"
                rooms={convention.rooms}
                isMulti
                value={rooms}
                onChange={setRooms}
              />
            )}
          </FormGroupWithLabel>

          <ProspectiveRunSchedule
            day={day}
            runs={runsForProspectiveRunSchedule}
            event={eventForProspectiveRunSchedule}
          />

          <ErrorDisplay graphQLError={createError as ApolloError} />
        </div>
        <div className="modal-footer">
          <div className="d-flex w-100">
            <div className="col text-end pe-0">
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={onCancel}
                disabled={createInProgress}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={scheduleRuns}
                disabled={nonConflictingTimespansWithinRange.length < 1 || createInProgress}
              >
                Schedule runs
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ScheduleMultipleRunsModal;
