import React, {
  useState, useMemo, useCallback, useContext,
} from 'react';
import PropTypes from 'prop-types';
import { propType } from 'graphql-anywhere';
import Modal from 'react-bootstrap4-modal';
import { useMutation } from '@apollo/react-hooks';

import ConventionDaySelect from '../BuiltInFormControls/ConventionDaySelect';
import ErrorDisplay from '../ErrorDisplay';
import TimeSelect from '../BuiltInFormControls/TimeSelect';
import Timespan from '../Timespan';
import { timespanFromConvention, timespanFromRun, getConventionDayTimespans } from '../TimespanUtils';
import { EventAdminEventsQuery, ConventionFields, EventFields } from './queries.gql';
import { CreateMultipleRuns } from './mutations.gql';
import useAsyncFunction from '../useAsyncFunction';
import ProspectiveRunSchedule from './ProspectiveRunSchedule';
import FormGroupWithLabel from '../BuiltInFormControls/FormGroupWithLabel';
import RoomSelect from '../BuiltInFormControls/RoomSelect';
import AppRootContext from '../AppRootContext';

function ScheduleMultipleRunsModal({
  convention, event, visible, onCancel, onFinish,
}) {
  const [createMutate] = useMutation(CreateMultipleRuns);
  const [createMultipleRuns, createError, createInProgress] = useAsyncFunction(createMutate);
  const [day, setDay] = useState(null);
  const [start, setStart] = useState({ hour: null, minute: null });
  const [finish, setFinish] = useState({ hour: null, minute: null });
  const [rooms, setRooms] = useState([]);
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

  const dataComplete = useMemo(
    () => (
      day
      && start.hour != null && start.minute != null
      && finish.hour != null && finish.minute != null
    ),
    [day, start, finish],
  );

  const timespan = useMemo(
    () => {
      if (!dataComplete) {
        return null;
      }

      return new Timespan(day.clone().set(start), day.clone().set(finish));
    },
    [dataComplete, day, start, finish],
  );

  const timespansWithinRange = useMemo(
    () => {
      if (!timespan) {
        return [];
      }

      return timespan.getTimespansWithin(
        timezoneName,
        { unit: 'second', duration: { seconds: event.length_seconds } },
      );
    },
    [timespan, timezoneName, event.length_seconds],
  );

  const existingRunTimespans = useMemo(
    () => event.runs.map((run) => timespanFromRun(convention, event, run)),
    [event, convention],
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
        starts_at: nonConflictingTimespan.start.toISOString(),
        room_ids: rooms.map((room) => room.id),
      }));

      await createMultipleRuns({
        variables: {
          input: { event_id: event.id, runs },
        },
        update: (store, { data: { createMultipleRuns: { runs: newRuns } } }) => {
          const eventsData = store.readQuery({ query: EventAdminEventsQuery });
          const eventData = eventsData.events.find((e) => e.id === event.id);
          eventData.runs = [...eventData.runs, ...newRuns];
          store.writeQuery({ query: EventAdminEventsQuery, data: eventsData });
        },
      });
      onFinish();
    },
    [createMultipleRuns, event, rooms, nonConflictingTimespansWithinRange, onFinish],
  );

  const renderTimeSelects = () => {
    if (!day) {
      return null;
    }

    const timespanForFinish = new Timespan(
      conventionDayTimespan.start,
      conventionDayTimespan.finish.clone().add(1, 'hour'),
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
      let description = runTimespan.start.format('h:mma');
      const runConflicts = (
        nonConflictingTimespans
          .find((nonConflictingTimespan) => nonConflictingTimespan.isSame(runTimespan)) == null
      );

      if (runConflicts) {
        description = <del title={`There is already a run scheduled at ${description}`}>{description}</del>;
      }

      return (
        <li key={runTimespan.start.toISOString()} className="list-inline-item">
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
            value={day}
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
              starts_at: t.start.toISOString(),
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

ScheduleMultipleRunsModal.propTypes = {
  convention: propType(ConventionFields).isRequired,
  event: propType(EventFields).isRequired,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
};

export default ScheduleMultipleRunsModal;
