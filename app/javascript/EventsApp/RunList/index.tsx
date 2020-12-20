import { sortBy } from 'lodash';
import flatMap from 'lodash/flatMap';
import { DateTime } from 'luxon';
import { useContext, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import AppRootContext from '../../AppRootContext';
import { LoadQueryWrapper } from '../../GraphqlLoadingWrappers';
import { FiniteTimespan } from '../../Timespan';
import { timespanFromRun } from '../../TimespanUtils';
import { useAppDateTimeFormat } from '../../TimeUtils';
import buildEventUrl from '../buildEventUrl';
import { PIXELS_PER_LANE } from '../ScheduleGrid/LayoutConstants';
import { useScheduleGridCombinedQueryQuery } from '../ScheduleGrid/queries.generated';
import RunDisplay from '../ScheduleGrid/RunDisplay';
import SignupCountData from '../SignupCountData';

function useLoadRunListData() {
  return useScheduleGridCombinedQueryQuery({ variables: { extendedCounts: false } });
}

export default LoadQueryWrapper(useLoadRunListData, function RunList({ data }) {
  const { timezoneName } = useContext(AppRootContext);
  const format = useAppDateTimeFormat();
  const history = useHistory();

  const eventsByRunId = useMemo(() => {
    const eventMap = new Map<number, typeof data['events'][number]>();
    data.events.forEach((event) => {
      event.runs.forEach((run) => {
        eventMap.set(run.id, event);
      });
    });
    return eventMap;
  }, [data.events]);

  const sortedRuns = useMemo(
    () =>
      sortBy(
        flatMap(data.events, (event) => event.runs),
        (run) => [
          DateTime.fromISO(run.starts_at).valueOf(),
          eventsByRunId.get(run.id)?.title?.toLocaleLowerCase(),
        ],
      ),
    [data.events, eventsByRunId],
  );

  const timespanByRunId = useMemo(() => {
    const timespanMap = new Map<number, FiniteTimespan>();
    data.events.forEach((event) => {
      event.runs.forEach((run) => {
        timespanMap.set(run.id, timespanFromRun(timezoneName, event, run));
      });
    });
    return timespanMap;
  }, [data.events, timezoneName]);

  const signupCountDataByRunId = useMemo(() => {
    const countMap = new Map<number, SignupCountData>();
    data.events.forEach((event) => {
      event.runs.forEach((run) => {
        countMap.set(run.id, SignupCountData.fromRun(run));
      });
    });
    return countMap;
  }, [data.events]);

  let previousStartTime: DateTime | undefined;

  return (
    <>
      <h1>Run list</h1>
      {sortedRuns.map((run) => {
        const startTime = DateTime.fromISO(run.starts_at, { zone: timezoneName });
        let dateTimeHeader: JSX.Element | undefined;
        if (!previousStartTime || !startTime.equals(previousStartTime)) {
          const timeHeader = format(startTime, 'shortTimeWithZone');
          const startDate = format(startTime, 'longWeekdayDate');
          const prevStartDate = previousStartTime
            ? format(previousStartTime, 'longWeekdayDate')
            : '';

          if (startDate !== prevStartDate) {
            dateTimeHeader = (
              <>
                <h2 className="mt-4">{startDate}</h2>
                {timeHeader}
              </>
            );
          } else {
            dateTimeHeader = <div className="mt-2">{timeHeader}</div>;
          }
        }

        const event = eventsByRunId.get(run.id)!;
        const timespan = timespanByRunId.get(run.id)!;

        previousStartTime = startTime;
        return (
          <div key={run.id}>
            {dateTimeHeader}
            <div className="pl-4">
              <div style={{ position: 'relative', width: '100%', height: `${PIXELS_PER_LANE}px` }}>
                <RunDisplay
                  event={{
                    ...event,
                    displayTitle: `${event.title} - until ${format(
                      timespan.finish,
                      timespan.finish.day === timespan.start.day ? 'shortTime' : 'shortWeekdayTime',
                    )}`,
                  }}
                  run={{ ...run, event_id: event.id }}
                  toggle={() => {
                    history.push(`${buildEventUrl(event)}#run-${run.id}`);
                  }}
                  layoutResult={{ laneCount: 1, runDimensions: [] }}
                  runDimensions={{
                    fullTimespan: timespan,
                    timespan,
                    laneIndex: 0,
                    runId: run.id,
                    timeAxisSizePercent: 100,
                    timeAxisStartPercent: 0,
                  }}
                  signupCountData={signupCountDataByRunId.get(run.id)!}
                />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
});
