import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import ConventionDaySelect from '../BuiltInFormControls/ConventionDaySelect';
import TimeSelect from '../BuiltInFormControls/TimeSelect';
import Timespan from '../Timespan';
import { timespanFromConvention } from '../TimespanUtils';
import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';

const roomPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
});

function RunFormFields({
  run, event, convention, onChange,
}) {
  const startsAt = useMemo(
    () => (run && run.starts_at
      ? moment(run.starts_at).tz(convention.timezone_name)
      : null
    ),
    [convention.timezone_name, run],
  );
  const conventionTimespan = useMemo(
    () => timespanFromConvention(convention),
    [convention],
  );
  const [day, setDay] = useState(startsAt ? startsAt.clone().startOf('day') : null);
  const [hour, setHour] = useState(startsAt ? startsAt.hour() : null);
  const [minute, setMinute] = useState(startsAt ? startsAt.minute() : null);
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
        prevRun => ({ ...prevRun, starts_at: (startTime ? startTime.toISOString() : null) }),
      );
    },
    [onChange, startTime],
  );

  const timeInputChanged = ({ hour: newHour, minute: newMinute }) => {
    setHour(newHour);
    setMinute(newMinute);
  };

  const renderTimeSelect = () => {
    if (!day) {
      return null;
    }

    const timespan = new Timespan(
      day.clone(),
      day.clone().add(1, 'day'),
    ).intersection(conventionTimespan);

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

  return (
    <div>
      <ConventionDaySelect
        convention={convention}
        value={day}
        onChange={setDay}
      />
      {renderTimeSelect()}

      <BootstrapFormInput
        name="title_suffix"
        label="Title suffix"
        value={run.title_suffix || ''}
        onTextChange={titleSuffix => onChange(prevRun => ({
          ...prevRun, title_suffix: titleSuffix,
        }))}
      />
      <BootstrapFormInput
        name="schedule_note"
        label="Schedule note"
        value={run.schedule_note || ''}
        onTextChange={scheduleNote => onChange(prevRun => ({
          ...prevRun, schedule_note: scheduleNote,
        }))}
      />

      <SelectWithLabel
        label="Room(s)"
        name="room_ids"
        options={convention.rooms}
        getOptionValue={room => room.id}
        getOptionLabel={room => room.name}
        isMulti
        value={run.rooms}
        onChange={rooms => onChange(prevRun => ({ ...prevRun, rooms }))}
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
