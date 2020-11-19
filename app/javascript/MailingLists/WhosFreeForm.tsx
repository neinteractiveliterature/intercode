import { useCallback, useState } from 'react';
import { getHours, getMinutes, set } from 'date-fns';

import ConventionDaySelect from '../BuiltInFormControls/ConventionDaySelect';
import ErrorDisplay from '../ErrorDisplay';
import TimeSelect, { TimeValues } from '../BuiltInFormControls/TimeSelect';
import Timespan from '../Timespan';
import LoadingIndicator from '../LoadingIndicator';
import { useWhosFreeFormConventionQueryQuery } from './queries.generated';

function dateToTimeObject(date?: Date | null): TimeValues {
  if (date == null) {
    return {
      hour: undefined,
      minute: undefined,
    };
  }

  return {
    hour: getHours(date),
    minute: getMinutes(date),
  };
}

function makeTimeOfDay(prevTime: Date | null | undefined, day: Date, newTime: TimeValues) {
  return set(prevTime || day, { hours: newTime.hour, minutes: newTime.minute });
}

export type WhosFreeFormProps = {
  onSubmit: (options: { start: Date; finish: Date }) => void;
};

function WhosFreeForm({ onSubmit }: WhosFreeFormProps) {
  const { data, loading, error } = useWhosFreeFormConventionQueryQuery();
  const [start, setStart] = useState<Date>();
  const [finish, setFinish] = useState<Date>();
  const [day, setDay] = useState<Date>();

  const renderTimeSelects = useCallback(() => {
    if (day == null) {
      return null;
    }

    const startTimespan = Timespan.finiteFromMoments(day, day.clone().add(1, 'day'));
    const finishTimespan = Timespan.finiteFromMoments(start ?? day, startTimespan.finish);

    return (
      <div className="d-flex mb-4">
        <div className="mr-4">
          from
          <TimeSelect
            timespan={startTimespan}
            value={dateToTimeObject(start)}
            onChange={(newTime) => setStart(makeTimeOfDay(start, day, newTime))}
          />
        </div>
        <div>
          until
          <TimeSelect
            timespan={finishTimespan}
            value={dateToTimeObject(finish)}
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
    return <LoadingIndicator />;
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
