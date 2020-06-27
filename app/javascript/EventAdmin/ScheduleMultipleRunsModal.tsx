import React, {
  useState, useMemo, useCallback, useContext, ReactNode,
} from 'react';
import Modal from 'react-bootstrap4-modal';
import { DateTime, DateObjectUnits } from 'luxon';

import ConventionDaySelect from '../BuiltInFormControls/ConventionDaySelect';
import ErrorDisplay from '../ErrorDisplay';
import TimeSelect from '../BuiltInFormControls/TimeSelect';
import Timespan from '../Timespan';
import { timespanFromConvention, timespanFromRun, getConventionDayTimespans } from '../TimespanUtils';
import { EventAdminEventsQuery } from './queries';
import useAsyncFunction from '../useAsyncFunction';
import ProspectiveRunSchedule from './ProspectiveRunSchedule';
import FormGroupWithLabel from '../BuiltInFormControls/FormGroupWithLabel';
import RoomSelect from '../BuiltInFormControls/RoomSelect';
import AppRootContext from '../AppRootContext';
import {
  ConventionFieldsFragment,
  EventFieldsFragment,
  RoomFieldsFragment,
  EventAdminEventsQueryQuery,
} from './queries.generated';
import { useCreateMultipleRunsMutation } from './mutations.generated';
import { lowercaseMeridiem } from '../TimeUtils';

type ScheduleMultipleRunsModalProps = {
  convention: ConventionFieldsFragment,
  event: EventFieldsFragment,
  visible: boolean,
  onCancel: () => void,
  onFinish: () => void,
};

function ScheduleMultipleRunsModal({
  convention, event, visible, onCancel, onFinish,
}: ScheduleMultipleRunsModalProps) {
  const [createMutate] = useCreateMultipleRunsMutation();
  const [createMultipleRuns, createError, createInProgress] = useAsyncFunction(createMutate);
  const [day, setDay] = useState<DateTime | null>(null);
  const [start, setStart] = useState<DateObjectUnits>({});
  const [finish, setFinish] = useState<DateObjectUnits>({});
  const [rooms, setRooms] = useState<RoomFieldsFragment[]>([]);
  const { timezoneName } = useContext(AppRootContext);
  const conventionTimespan = useMemo(
    () => timespanFromConvention(convention),
    [convention],
  );
  const conventionDayTimespans = useMemo(
    () => getConventionDayTimespans(conventionTimespan, timezoneName),
    [timezoneName, conventionTimespan],
  );
  const conventionDayTimespan = useMemo(
    () => (day ? conventionDayTimespans.find((cdt) => cdt.includesTime(day)) : null),
    [conventionDayTimespans, day],
  );

  const timespan = useMemo(
    () => {
      const dataComplete = (
        start.hour != null && start.minute != null
        && finish.hour != null && finish.minute != null
      );

      if (day == null || !dataComplete) {
        return null;
      }

      return new Timespan(day.set(start), day.set(finish));
    },
    [day, start, finish],
  );

  const timespansWithinRange = useMemo(
    () => {
      if (!timespan) {
        return [];
      }

      return timespan.getTimespansWithin(
        timezoneName,
        { unit: 'second', duration: { seconds: event.length_seconds ?? undefined } },
      );
    },
    [timespan, timezoneName, event.length_seconds],
  );

  const existingRunTimespans = useMemo(
    () => {
      if (event.length_seconds == null) {
        return [];
      }

      return event.runs.map((run) => timespanFromRun(timezoneName, event, run));
    },
    [event, timezoneName],
  );

  const nonConflictingTimespansWithinRange = useMemo(
    () => timespansWithinRange.filter(
      (runTimespan) => !(
        existingRunTimespans
          .some((existingTimespan) => existingTimespan.overlapsTimespan(runTimespan))
      ),
    ),
    [timespansWithinRange, existingRunTimespans],
  );

  const scheduleRuns = useCallback(
    async () => {
      const runs = nonConflictingTimespansWithinRange.map((nonConflictingTimespan) => ({
        starts_at: nonConflictingTimespan.start.toISO(),
        room_ids: rooms.map((room) => room.id),
      }));

      await createMultipleRuns({
        variables: {
          input: { event_id: event.id, runs },
        },
        update: (store, { data }) => {
          const eventsData = store.readQuery<EventAdminEventsQueryQuery>({
            query: EventAdminEventsQuery,
          });
          if (eventsData == null) {
            return;
          }

          const eventData = eventsData.events.find((e) => e.id === event.id);
          if (eventData != null) {
            eventData.runs = [...eventData.runs, ...(data?.createMultipleRuns?.runs ?? [])];
          }
          store.writeQuery({ query: EventAdminEventsQuery, data: eventsData });
        },
      });
      onFinish();
    },
    [createMultipleRuns, event, rooms, nonConflictingTimespansWithinRange, onFinish],
  );

  const renderTimeSelects = () => {
    if (!day || !conventionDayTimespan) {
      return null;
    }

    const timespanForFinish = new Timespan(
      conventionDayTimespan.start,
      conventionDayTimespan.finish.plus({ hours: 1 }),
    );

    return (
      <div>
        <fieldset className="form-group">
          <legend className="col-form-label">From</legend>
          <TimeSelect value={start} onChange={setStart} timespan={conventionDayTimespan} />
        </fieldset>

        <fieldset className="form-group">
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
      let description: ReactNode = lowercaseMeridiem(runTimespan.start.toFormat('h:mma'));
      const runConflicts = (
        nonConflictingTimespans
          .find((nonConflictingTimespan) => nonConflictingTimespan.isSame(runTimespan)) == null
      );

      if (runConflicts) {
        description = <del title={`There is already a run scheduled at ${description}`}>{description}</del>;
      }

      return (
        <li key={runTimespan.start.toISO()} className="list-inline-item">
          {description}
        </li>
      );
    });

    return (
      <ul className="list-inline">
        <li><strong>Will schedule runs at:</strong></li>
        {runTimespanItems}
      </ul>
    );
  };

  return (
    <div>
      <Modal visible={visible} dialogClassName="modal-xl">
        <div className="modal-header">
          <h5 className="modal-title">
            Schedule runs of
            {' '}
            {event.title}
          </h5>
        </div>
        <div className="modal-body">
          <ConventionDaySelect
            convention={convention}
            value={day?.toISO()}
            onChange={setDay}
          />

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
            runs={nonConflictingTimespansWithinRange.map((t) => ({
              starts_at: t.start.toISO(),
              rooms,
            }))}
            event={{
              ...event,
              id: (event.id || -1),
              runs: (event.runs || []),
            }}
          />

          <ErrorDisplay graphQLError={createError} />
        </div>
        <div className="modal-footer">
          <div className="d-flex w-100">
            <div className="col text-right pr-0">
              <button
                type="button"
                className="btn btn-secondary mr-2"
                onClick={onCancel}
                disabled={createInProgress}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={scheduleRuns}
                disabled={
                  nonConflictingTimespansWithinRange.length < 1
                  || createInProgress
                }
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
