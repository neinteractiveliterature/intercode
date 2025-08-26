import { useLitformPopperWithAutoClosing } from '@neinteractiveliterature/litform';
import { useCallback, useMemo, useState } from 'react';

import { FiniteTimespan } from '../../Timespan';
import { useAppDateTimeFormat } from '../../TimeUtils';
import { ScheduleGridEventsQueryData } from '../ScheduleGrid/queries.generated';
import RunDetails from '../ScheduleGrid/RunDetails';
import RunDisplay from '../ScheduleGrid/RunDisplay';
import { ScheduleEvent } from '../ScheduleGrid/Schedule';
import SignupCountData from '../SignupCountData';

export type RunListEventRunProps = {
  event: ScheduleEvent;
  run: ScheduleGridEventsQueryData['convention']['events'][number]['runs'][number];
  timespan: FiniteTimespan;
  signupCountData: SignupCountData;
};

export default function RunListEventRun({
  event,
  run,
  timespan,
  signupCountData,
}: RunListEventRunProps): React.JSX.Element {
  const format = useAppDateTimeFormat();
  const [detailsVisible, setDetailsVisible] = useState(false);
  const toggle = useCallback(() => setDetailsVisible((prevVisible) => !prevVisible), []);
  const runForRunDetails = useMemo(() => ({ ...run, event_id: event.id }), [event, run]);

  const [runDisplayElement, setRunDisplayElement] = useState<HTMLDivElement | null>(null);
  const [runDetailsElement, setRunDetailsElement] = useState<HTMLDivElement | null>(null);
  const [arrow, setArrow] = useState<HTMLSpanElement | null>(null);

  const { styles, attributes, state } = useLitformPopperWithAutoClosing(
    runDetailsElement,
    runDisplayElement,
    arrow,
    setDetailsVisible,
  );

  return (
    <>
      <RunDisplay
        event={{
          ...event,
          displayTitle: `${event.title} - until ${format(
            timespan.finish,
            timespan.finish.day === timespan.start.day ? 'shortTime' : 'shortWeekdayTime',
          )}`,
        }}
        run={{ ...run, event_id: event.id }}
        toggle={toggle}
        layoutResult={{ laneCount: 1, runDimensions: [] }}
        runDimensions={{
          fullTimespan: timespan,
          timespan,
          laneIndex: 0,
          runId: run.id,
          timeAxisSizePercent: 100,
          timeAxisStartPercent: 0,
        }}
        signupCountData={signupCountData}
        showExtendedCounts={false}
        showSignedUp
        classifyEventsBy="category"
        showSignupStatusBadge
        ref={setRunDisplayElement}
      />

      {detailsVisible && (
        <RunDetails
          ref={setRunDetailsElement}
          placement={state?.placement}
          styles={styles}
          attributes={attributes}
          arrowRef={setArrow}
          toggle={toggle}
          event={event}
          run={runForRunDetails}
          timespan={timespan}
          signupCountData={signupCountData}
        />
      )}
    </>
  );
}
