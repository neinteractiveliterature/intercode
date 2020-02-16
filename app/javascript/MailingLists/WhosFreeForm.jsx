import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';

import ConventionDaySelect from '../BuiltInFormControls/ConventionDaySelect';
import ErrorDisplay from '../ErrorDisplay';
import TimeSelect from '../BuiltInFormControls/TimeSelect';
import Timespan from '../Timespan';
import { WhosFreeFormConventionQuery } from './queries.gql';
import LoadingIndicator from '../LoadingIndicator';

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

function makeTimeOfDay(prevTime, day, newTime) {
  return (prevTime || day).clone().set(newTime);
}

function WhosFreeForm({ onSubmit }) {
  const { data, loading, error } = useQuery(WhosFreeFormConventionQuery);
  const [start, setStart] = useState(null);
  const [finish, setFinish] = useState(null);
  const [day, setDay] = useState(null);

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
              onChange={(newTime) => setStart(makeTimeOfDay(start, day, newTime))}
            />
          </div>
          <div>
            until
            <TimeSelect
              timespan={finishTimespan}
              value={momentToTimeObject(finish)}
              onChange={(newTime) => setFinish(makeTimeOfDay(finish, day, newTime))}
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
      onSubmit({ start, finish });
    },
    [onSubmit, start, finish],
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { convention } = data;

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
  onSubmit: PropTypes.func.isRequired,
};

export default WhosFreeForm;
