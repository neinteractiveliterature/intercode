import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { useQuery } from 'react-apollo-hooks';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import ConventionDaySelect from '../BuiltInFormControls/ConventionDaySelect';
import { EventAdminEventsQuery } from '../EventAdmin/queries.gql';
import TimeSelect from '../BuiltInFormControls/TimeSelect';
import { timespanFromConvention, getConventionDayTimespans } from '../TimespanUtils';
import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';
import ErrorDisplay from '../ErrorDisplay';
import ProspectiveRunSchedule from '../EventAdmin/ProspectiveRunSchedule';
import LoadingIndicator from '../LoadingIndicator';

const roomPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
});

function RunFormFields({ run, event, onChange }) {
  const { data, loading, error } = useQuery(EventAdminEventsQuery);

  const startsAt = useMemo(
    () => (!error && !loading && run && run.starts_at
      ? moment(run.starts_at).tz(data.convention.timezone_name)
      : null
    ),
    [data, error, loading, run],
  );
  const conventionTimespan = useMemo(
    () => (error || loading ? null : timespanFromConvention(data.convention)),
    [error, loading, data],
  );
  const conventionDayTimespans = useMemo(
    () => (error || loading
      ? null
      : getConventionDayTimespans(conventionTimespan, data.convention.timezone_name)),
    [conventionTimespan, data, error, loading],
  );
  const [day, setDay] = useState(startsAt
    ? conventionDayTimespans.find((timespan) => timespan.includesTime(startsAt)).start
    : null);
  const [hour, setHour] = useState(startsAt && day
    ? startsAt.diff(day.clone().startOf('day'), 'hours')
    : null);
  const [minute, setMinute] = useState(startsAt && (hour != null)
    ? startsAt.diff(day.clone().startOf('day').add(hour, 'hours'), 'minutes')
    : null);
  const startTime = useMemo(
    () => {
      if (day == null || hour == null || minute == null) {
        return null;
      }

      return day.clone().set({
        hour,
        minute,
      });
    },
    [day, hour, minute],
  );

  useEffect(
    () => {
      onChange(
        (prevRun) => ({ ...prevRun, starts_at: (startTime ? startTime.toISOString() : null) }),
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
            && `- ${startTime.clone().add(event.length_seconds, 'seconds').format('H:mm')}`
          }
        </TimeSelect>
      </fieldset>
    );
  };

  const eventForSchedule = {
    ...event,
    id: (event.id || -1),
    runs: (event.runs || []),
  };

  return (
    <div>
      <ConventionDaySelect
        convention={data.convention}
        value={day}
        onChange={setDay}
      />
      {renderTimeSelect()}

      <SelectWithLabel
        label="Room(s)"
        name="room_ids"
        options={data.convention.rooms}
        getOptionValue={(room) => room.id}
        getOptionLabel={(room) => room.name}
        isMulti
        styles={{
          menu: (provided) => ({ ...provided, zIndex: 25 }),
        }}
        value={run.rooms}
        onChange={(rooms) => onChange((prevRun) => ({ ...prevRun, rooms }))}
      />

      <ProspectiveRunSchedule
        day={day}
        startTime={startTime}
        run={run}
        event={eventForSchedule}
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
    length_seconds: PropTypes.number.isRequired,
  }).isRequired,
  convention: PropTypes.shape({
    starts_at: PropTypes.string.isRequired,
    ends_at: PropTypes.string.isRequired,
    timezone_name: PropTypes.string.isRequired,
    rooms: PropTypes.arrayOf(roomPropType).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RunFormFields;
