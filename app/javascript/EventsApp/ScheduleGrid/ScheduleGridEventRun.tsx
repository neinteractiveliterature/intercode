import React, { useContext, useMemo, useCallback, Ref, useState } from 'react';

import { ScheduleGridContext } from './ScheduleGridContext';
import SignupCountData from '../SignupCountData';
import RunDetails from './RunDetails';
import RunDisplay from './RunDisplay';
import { RunDimensions, ScheduleLayoutResult } from './ScheduleLayout/ScheduleLayoutBlock';
import { useIntercodePopper } from '../../UIComponents/PopperUtils';

export type ScheduleGridEventRunProps = {
  runDimensions: RunDimensions;
  layoutResult: ScheduleLayoutResult;
};

function ScheduleGridEventRun({ runDimensions, layoutResult }: ScheduleGridEventRunProps) {
  const { schedule, toggleRunDetailsVisibility, visibleRunDetailsIds } = useContext(
    ScheduleGridContext,
  );
  const detailsVisible = visibleRunDetailsIds.has(runDimensions.runId);

  const [runDisplayElement, setRunDisplayElement] = useState<HTMLDivElement | null>(null);
  const [runDetailsElement, setRunDetailsElement] = useState<HTMLDivElement | null>(null);
  const [arrow, setArrow] = useState<HTMLSpanElement | null>(null);

  const { styles, attributes, state, update } = useIntercodePopper(
    runDetailsElement,
    runDisplayElement,
    arrow,
  );

  const run = useMemo(() => schedule.getRun(runDimensions.runId), [schedule, runDimensions.runId]);
  const event = useMemo(() => schedule.getEventForRun(runDimensions.runId), [
    schedule,
    runDimensions.runId,
  ]);

  const signupCountData = useMemo(() => {
    if (!run) {
      return null;
    }

    return SignupCountData.fromRun(run);
  }, [run]);

  const toggleVisibility = useCallback(() => {
    const runId = run?.id;
    if (runId) {
      toggleRunDetailsVisibility(runId);
      if (update) {
        update();
      }
    }
  }, [run, toggleRunDetailsVisibility, update]);

  if (event == null || run == null) {
    return null;
  }

  const renderRunDisplay = (ref: Ref<HTMLDivElement>) => (
    <RunDisplay
      event={event}
      run={run}
      signupCountData={signupCountData!}
      ref={ref}
      toggle={toggleVisibility}
      runDimensions={runDimensions}
      layoutResult={layoutResult}
    />
  );

  if (run.disableDetailsPopup) {
    return renderRunDisplay(null);
  }

  return (
    <>
      {renderRunDisplay(setRunDisplayElement)}
      {detailsVisible && (
        <RunDetails
          ref={setRunDetailsElement}
          placement={state?.placement}
          styles={styles}
          attributes={attributes}
          arrowRef={setArrow}
          toggle={toggleVisibility}
          event={event}
          run={run}
          runDimensions={runDimensions}
          signupCountData={signupCountData!}
        />
      )}
    </>
  );
}

export default ScheduleGridEventRun;
