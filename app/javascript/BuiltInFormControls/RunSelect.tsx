import { useContext } from 'react';
import Select from 'react-select';
import { sortByLocaleString } from '@neinteractiveliterature/litform';

import { timespanFromRun } from '../TimespanUtils';
import AppRootContext from '../AppRootContext';
import { useFormatRunTimespan } from '../EventsApp/runTimeFormatting';

type RoomForRunSelectProps = {
  name: string;
};

type RunForRunSelectProps = {
  id: number;
  rooms: RoomForRunSelectProps[];
  starts_at: string;
  title_suffix?: string;
};

type RunSelectProps = {
  event?: {
    length_seconds: number;
    runs: RunForRunSelectProps[];
  };
};

function RunSelect({ event, ...otherProps }: RunSelectProps): React.JSX.Element {
  const { timezoneName } = useContext(AppRootContext);
  const formatRunTimespan = useFormatRunTimespan();
  if (!event) {
    return <></>;
  }

  return (
    <Select
      options={event.runs}
      getOptionValue={(r: RunForRunSelectProps) => r.id.toString()}
      formatOptionLabel={(r: RunForRunSelectProps) => {
        const timespan = timespanFromRun(timezoneName, event, r);
        const timeDescription = formatRunTimespan(timespan, { formatType: 'short' });
        const roomsDescription = sortByLocaleString(r.rooms || [], (room: RoomForRunSelectProps) => room.name)
          .map((room) => room.name)
          .join(', ');

        if (r.title_suffix) {
          return (
            <>
              {r.title_suffix}{' '}
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
            {timeDescription} <small className="text-muted">{roomsDescription}</small>
          </>
        );
      }}
      {...otherProps}
    />
  );
}

export default RunSelect;
