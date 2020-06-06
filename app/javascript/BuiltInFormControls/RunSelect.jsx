import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { timespanFromRun } from '../TimespanUtils';
import { sortByLocaleString } from '../ValueUtils';
import AppRootContext from '../AppRootContext';

function RunSelect({ event, ...otherProps }) {
  const { timezoneName } = useContext(AppRootContext);
  return (
    <Select
      options={event ? event.runs : []}
      getOptionValue={(r) => r.id}
      formatOptionLabel={(r) => {
        const timespan = timespanFromRun({ timezone_name: timezoneName }, event, r);
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

RunSelect.propTypes = {
  event: PropTypes.shape({
    length_seconds: PropTypes.number.isRequired,
    runs: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      rooms: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
      })),
      starts_at: PropTypes.string.isRequired,
      title_suffix: PropTypes.string,
    })).isRequired,
  }),
};

RunSelect.defaultProps = {
  event: null,
};

export default RunSelect;
