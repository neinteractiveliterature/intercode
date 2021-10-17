import { useCallback, useState } from 'react';
import { DateTime } from 'luxon';
import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import ConventionDaySelect from '../BuiltInFormControls/ConventionDaySelect';
import TimeSelect, { TimeValues } from '../BuiltInFormControls/TimeSelect';
import Timespan from '../Timespan';
import { useWhosFreeFormConventionQuery } from './queries.generated';

const dateTimeToTimeValues = (momentValue?: DateTime | null) => {
  if (momentValue == null) {
    return {
      hour: undefined,
      minute: undefined,
    };
  }

  return {
    hour: momentValue.hour,
    minute: momentValue.minute,
  };
};

function makeTimeOfDay(prevTime: DateTime | null | undefined, day: DateTime, newTime: TimeValues) {
  return (prevTime || day).set(newTime);
}

export type WhosFreeFormProps = {
  onSubmit: (options: { start: DateTime; finish: DateTime }) => void;
};

function WhosFreeForm({ onSubmit }: WhosFreeFormProps): JSX.Element {
  const { data, loading, error } = useWhosFreeFormConventionQuery();
  const [start, setStart] = useState<DateTime>();
  const [finish, setFinish] = useState<DateTime>();
  const [day, setDay] = useState<DateTime>();

  const renderTimeSelects = useCallback(() => {
    if (day == null) {
      return null;
    }

    const startTimespan = Timespan.finiteFromDateTimes(day, day.plus({ days: 1 }));
    const finishTimespan = Timespan.finiteFromDateTimes(start ?? day, startTimespan.finish);

    return (
      <div className="d-flex mb-4">
        <div className="me-4">
          from
          <TimeSelect
            timespan={startTimespan}
            value={dateTimeToTimeValues(start)}
            onChange={(newTime) => setStart(makeTimeOfDay(start, day, newTime))}
          />
        </div>
        <div>
          until
          <TimeSelect
            timespan={finishTimespan}
            value={dateTimeToTimeValues(finish)}
            onChange={(newTime) => setFinish(makeTimeOfDay(finish, day, newTime))}
          />
        </div>
      </div>
    );
  }, [day, start, finish]);

  const dayChanged = useCallback((newDay) => {
    setDay(newDay);
    setStart(undefined);
    setFinish(undefined);
  }, []);

  const search = useCallback(
    (event) => {
      event.preventDefault();
      if (start && finish) {
        onSubmit({ start, finish });
      }
    },
    [onSubmit, start, finish],
  );

  if (loading) {
    return <LoadingIndicator iconSet="bootstrap-icons" />;
  }

  if (error || !data) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { convention } = data;

  return (
    <div className="card bg-light mb-4">
      <div className="card-body">
        <h5>Timespan to search within</h5>

        <ConventionDaySelect convention={convention} value={day} onChange={dayChanged} />

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

export default WhosFreeForm;
