import { SyntheticEvent, useCallback, useContext, useState } from 'react';
import { DateTime } from 'luxon';

import ConventionDaySelect from '../BuiltInFormControls/ConventionDaySelect';
import TimeSelect, { TimeValues } from '../BuiltInFormControls/TimeSelect';
import Timespan from '../Timespan';
import AppRootContext from '../AppRootContext';

function makeTimeOfDay(day: DateTime, newTime: TimeValues) {
  return day.set(newTime);
}

export type WhosFreeFormProps = {
  onSubmit: (options: { start: DateTime; finish: DateTime }) => void;
};

function WhosFreeForm({ onSubmit }: WhosFreeFormProps): React.JSX.Element {
  const { convention } = useContext(AppRootContext);
  const [start, setStart] = useState<TimeValues>({
    hour: undefined,
    minute: undefined,
  });
  const [finish, setFinish] = useState<TimeValues>({
    hour: undefined,
    minute: undefined,
  });
  const [day, setDay] = useState<DateTime>();

  const renderTimeSelects = useCallback(() => {
    if (day == null) {
      return null;
    }

    const startTimespan = Timespan.finiteFromDateTimes(day, day.plus({ days: 1 }));
    const finishTimespan = Timespan.finiteFromDateTimes(makeTimeOfDay(day, start), startTimespan.finish);

    return (
      <div className="d-flex mb-4">
        <div className="me-4">
          from
          <TimeSelect timespan={startTimespan} value={start} onChange={(newTime) => setStart(newTime)} />
        </div>
        <div>
          until
          <TimeSelect timespan={finishTimespan} value={finish} onChange={(newTime) => setFinish(newTime)} />
        </div>
      </div>
    );
  }, [day, start, finish]);

  const dayChanged = useCallback((newDay: DateTime | undefined) => {
    setDay(newDay);
    setStart({
      hour: undefined,
      minute: undefined,
    });
    setFinish({
      hour: undefined,
      minute: undefined,
    });
  }, []);

  const search = useCallback(
    (event: SyntheticEvent) => {
      event.preventDefault();
      if (day && start && finish) {
        onSubmit({ start: makeTimeOfDay(day, start), finish: makeTimeOfDay(day, finish) });
      }
    },
    [onSubmit, day, start, finish],
  );

  if (convention == null) {
    return <></>;
  }

  return (
    <div className="card bg-light mb-4">
      <div className="card-body">
        <h5>Timespan to search within</h5>

        <ConventionDaySelect convention={convention} value={day} onChange={dayChanged} />

        {renderTimeSelects()}

        <p className="mb-0">
          <button type="button" className="btn btn-primary" disabled={!(start && finish)} onClick={search}>
            Search
          </button>
        </p>
      </div>
    </div>
  );
}

export default WhosFreeForm;
