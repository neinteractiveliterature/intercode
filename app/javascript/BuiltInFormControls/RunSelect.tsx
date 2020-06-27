import React, { useContext } from 'react';
import Select from 'react-select';

import { timespanFromRun } from '../TimespanUtils';
import { sortByLocaleString } from '../ValueUtils';
import AppRootContext from '../AppRootContext';

type RoomForRunSelectProps = {
  name: string,
};

type RunForRunSelectProps = {
  id: number,
  rooms: RoomForRunSelectProps[],
  starts_at: string,
  title_suffix?: string,
};

type RunSelectProps = {
  event?: {
    length_seconds: number,
    runs: RunForRunSelectProps[],
  },
};

function RunSelect({ event, ...otherProps }: RunSelectProps) {
  const { timezoneName } = useContext(AppRootContext);
  if (!event) {
    return null;
  }

  return (
    <Select
      options={event.runs}
      getOptionValue={(r) => r.id.toString()}
      formatOptionLabel={(r) => {
        const timespan = timespanFromRun(timezoneName, event, r);
        const timeDescription = timespan.humanizeInTimezone(timezoneName);
        const roomsDescription = sortByLocaleString(r.rooms || [], (room) => room.name)
          .map((room) => room.name)
          .join(', ');

        if (r.title_suffix) {
          return (
            <>
              {r.title_suffix}
              {' '}
              <small className="text-muted">
                {timeDescription}
                {' - '}
                {roomsDescription}
              </small>
            </>
          );
        }

        return (
          <>
            {timeDescription}
            {' '}
            <small className="text-muted">
              {roomsDescription}
            </small>
          </>
        );
      }}
      {...otherProps}
    />
  );
}

export default RunSelect;
