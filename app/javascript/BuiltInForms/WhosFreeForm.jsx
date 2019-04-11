import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import queryString from 'query-string';

import ConventionDaySelect from '../BuiltInFormControls/ConventionDaySelect';
import ErrorDisplay from '../ErrorDisplay';
import TimeSelect from '../BuiltInFormControls/TimeSelect';
import Timespan from '../Timespan';
import useQuerySuspended from '../useQuerySuspended';
import { WhosFreeFormConventionQuery } from './whosFreeFormQueries.gql';

const momentToTimeObject = (momentValue) => {
  if (momentValue == null) {
    return {
      hour: null,
      minute: null,
    };
  }

  return {
    hour: momentValue.hour(),
    minute: momentValue.minute(),
  };
};

function parseTimeInZone(timeString, timezoneName) {
  if (timeString) {
    return moment.tz(timeString, timezoneName);
  }

  return null;
}

function makeTimeOfDay(prevTime, day, newTime) {
  return (prevTime || day).clone().set(newTime);
}

function WhosFreeForm({ initialStart, initialFinish, baseUrl }) {
  const { data: { convention }, error } = useQuerySuspended(WhosFreeFormConventionQuery);
  const [start, setStart] = useState(parseTimeInZone(initialStart, convention.timezone_name));
  const [finish, setFinish] = useState(parseTimeInZone(initialFinish, convention.timezone_name));
  const [day, setDay] = useState(initialStart ? parseTimeInZone(initialStart, convention.timezone_name).startOf('day') : null);

  const renderTimeSelects = useCallback(
    () => {
      if (day == null) {
        return null;
      }

      const startTimespan = new Timespan(day, day.clone().add(1, 'day'));
      const finishTimespan = new Timespan(start || day, startTimespan.finish);

      return (
        <div className="d-flex mb-4">
          <div className="mr-4">
            from
            <TimeSelect
              timespan={startTimespan}
              value={momentToTimeObject(start)}
              onChange={newTime => setStart(makeTimeOfDay(start, day, newTime))}
            />
          </div>
          <div>
            until
            <TimeSelect
              timespan={finishTimespan}
              value={momentToTimeObject(finish)}
              onChange={newTime => setFinish(makeTimeOfDay(finish, day, newTime))}
            />
          </div>
        </div>
      );
    },
    [day, start, finish],
  );

  const dayChanged = useCallback(
    (newDay) => {
      setDay(newDay);
      setStart(null);
      setFinish(null);
    },
    [],
  );

  const search = useCallback(
    (event) => {
      event.preventDefault();

      const params = {
        start: start.toISOString(),
        finish: finish.toISOString(),
      };
      window.location.href = `${baseUrl}?${queryString.stringify(params)}`;
    },
    [baseUrl, start, finish],
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <div className="card bg-light mb-4">
      <div className="card-body">
        <h5>Timespan to search within</h5>

        <ConventionDaySelect
          convention={convention}
          value={day}
          onChange={dayChanged}
        />

        {renderTimeSelects()}

        <p className="mb-0">
          <button
            type="button"
            className="btn btn-primary"
            disabled={!(start && finish)}
            onClick={search}
          >
            Search
          </button>
        </p>
      </div>
    </div>
  );
}

WhosFreeForm.propTypes = {
  initialStart: PropTypes.string,
  initialFinish: PropTypes.string,
  baseUrl: PropTypes.string.isRequired,
  convention: PropTypes.shape({
    starts_at: PropTypes.string.isRequired,
    ends_at: PropTypes.string.isRequired,
    timezone_name: PropTypes.string.isRequired,
  }).isRequired,
};

WhosFreeForm.defaultProps = {
  initialStart: null,
  initialFinish: null,
};

export default WhosFreeForm;
