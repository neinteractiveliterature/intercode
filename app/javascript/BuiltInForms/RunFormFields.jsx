import React, {
  useMemo, useState, useEffect, useContext,
} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { useQuery } from '@apollo/react-hooks';
import { DateTime } from 'luxon';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import ConventionDaySelect from '../BuiltInFormControls/ConventionDaySelect';
import { EventAdminEventsQuery } from '../EventAdmin/queries.gql';
import TimeSelect from '../BuiltInFormControls/TimeSelect';
import { timespanFromConvention, getConventionDayTimespans } from '../TimespanUtils';
import ErrorDisplay from '../ErrorDisplay';
import ProspectiveRunSchedule from '../EventAdmin/ProspectiveRunSchedule';
import LoadingIndicator from '../LoadingIndicator';
import FormGroupWithLabel from '../BuiltInFormControls/FormGroupWithLabel';
import RoomSelect from '../BuiltInFormControls/RoomSelect';
import AppRootContext from '../AppRootContext';

const roomPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
});

function RunFormFields({ run, event, onChange }) {
  const { timezoneName } = useContext(AppRootContext);
  const { data, loading, error } = useQuery(EventAdminEventsQuery);

  const startsAt = useMemo(
    () => (!error && !loading && run && run.starts_at
      ? moment(run.starts_at).tz(timezoneName)
      : null
    ),
    [timezoneName, error, loading, run],
  );
  const conventionTimespan = useMemo(
    () => (error || loading ? null : timespanFromConvention(data.convention)),
    [error, loading, data],
  );
  const conventionDayTimespans = useMemo(
    () => (conventionTimespan
      ? getConventionDayTimespans(conventionTimespan, timezoneName)
      : null),
    [conventionTimespan, timezoneName],
  );
  const [day, setDay] = useState(startsAt
    ? conventionDayTimespans.find((timespan) => timespan.includesTime(startsAt)).start
    : null);
  const [hour, setHour] = useState(startsAt && day
    ? startsAt.diff(day.startOf('day'), 'hours').hours
    : null);
  const [minute, setMinute] = useState(startsAt && (hour != null)
    ? startsAt.diff(day.startOf('day').plus({ hours: hour }), 'minutes').minutes
    : null);
  const startTime = useMemo(
    () => {
      if (day == null || hour == null || minute == null) {
        return null;
      }

      return day.set({
        hour,
        minute,
      });
    },
    [day, hour, minute],
  );

  useEffect(
    () => {
      onChange(
        (prevRun) => ({ ...prevRun, starts_at: (startTime ? startTime.toISO() : null) }),
      );
    },
    [onChange, startTime],
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const timeInputChanged = ({ hour: newHour, minute: newMinute }) => {
    setHour(newHour);
    setMinute(newMinute);
  };

  const renderTimeSelect = () => {
    if (!day) {
      return null;
    }

    const timespan = conventionDayTimespans.find((cdt) => cdt.includesTime(day));

    return (
      <fieldset className="form-group">
        <legend className="col-form-label">Time</legend>
        <TimeSelect
          value={{ hour, minute }}
          onChange={timeInputChanged}
          timespan={timespan}
        >
          {
            startTime
            && `- ${startTime.plus({ seconds: event.length_seconds }).toFormat('H:mm')}`
          }
        </TimeSelect>
      </fieldset>
    );
  };

  return (
    <div>
      <ConventionDaySelect
        convention={data.convention}
        value={day}
        onChange={(newValue) => setDay(DateTime.fromISO(newValue).setZone(timezoneName))}
      />
      {renderTimeSelect()}

      <FormGroupWithLabel label="Room(s)">
        {(id) => (
          <RoomSelect
            id={id}
            label="Room(s)"
            name="room_ids"
            rooms={data.convention.rooms}
            isMulti
            value={run.rooms}
            onChange={(rooms) => onChange((prevRun) => ({ ...prevRun, rooms }))}
          />
        )}
      </FormGroupWithLabel>

      <ProspectiveRunSchedule
        day={day}
        runs={[run]}
        event={{
          ...event,
          id: (event.id || -1),
          runs: (event.runs || []),
        }}
      />

      <BootstrapFormInput
        name="title_suffix"
        label="Title suffix"
        value={run.title_suffix || ''}
        onTextChange={(titleSuffix) => onChange((prevRun) => ({
          ...prevRun, title_suffix: titleSuffix,
        }))}
      />
      <BootstrapFormInput
        name="schedule_note"
        label="Schedule note"
        value={run.schedule_note || ''}
        onTextChange={(scheduleNote) => onChange((prevRun) => ({
          ...prevRun, schedule_note: scheduleNote,
        }))}
      />
    </div>
  );
}

RunFormFields.propTypes = {
  run: PropTypes.shape({
    starts_at: PropTypes.string,
    title_suffix: PropTypes.string,
    schedule_note: PropTypes.string,
    rooms: PropTypes.arrayOf(roomPropType).isRequired,
  }).isRequired,
  event: PropTypes.shape({
    id: PropTypes.number,
    length_seconds: PropTypes.number.isRequired,
    runs: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  convention: PropTypes.shape({
    starts_at: PropTypes.string.isRequired,
    ends_at: PropTypes.string.isRequired,
    rooms: PropTypes.arrayOf(roomPropType).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RunFormFields;
