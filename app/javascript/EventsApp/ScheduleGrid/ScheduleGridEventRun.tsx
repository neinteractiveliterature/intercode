import React, { useContext, useMemo, useCallback, Ref } from 'react';
import ReactDOM from 'react-dom';
import { Manager, Reference, Popper } from 'react-popper';

import { ScheduleGridContext } from './ScheduleGridContext';
import SignupCountData from '../SignupCountData';
import RunDetails from './RunDetails';
import RunDisplay from './RunDisplay';
import { RunDimensions, ScheduleLayoutResult } from './ScheduleLayout/ScheduleLayoutBlock';

export type ScheduleGridEventRunProps = {
  runDimensions: RunDimensions;
  layoutResult: ScheduleLayoutResult;
};

function ScheduleGridEventRun({ runDimensions, layoutResult }: ScheduleGridEventRunProps) {
  const { schedule, toggleRunDetailsVisibility, visibleRunDetailsIds } = useContext(
    ScheduleGridContext,
  );
  const detailsVisible = visibleRunDetailsIds.has(runDimensions.runId);

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
    }
  }, [run, toggleRunDetailsVisibility]);

  if (event == null || run == null) {
    return null;
  }

  const popoverParent = document.querySelectorAll('.non-cms-page')[0] || document.body;

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
    <Manager>
      <Reference>{({ ref }) => renderRunDisplay(ref)}</Reference>
      {ReactDOM.createPortal(
        <Popper
          placement={detailsVisible ? 'bottom' : 'auto'}
          modifiers={{
            preventOverflow: { boundariesElement: popoverParent },
          }}
        >
          {({ ref, placement, arrowProps, style: popperStyle }) => {
            if (!detailsVisible) {
              return <></>;
            }

            return (
              <RunDetails
                ref={ref}
                placement={placement}
                arrowProps={arrowProps}
                popperStyle={popperStyle}
                toggle={toggleVisibility}
                event={event}
                run={run}
                runDimensions={runDimensions}
                signupCountData={signupCountData!}
              />
            );
          }}
        </Popper>,
        popoverParent,
      )}
    </Manager>
  );
}

export default ScheduleGridEventRun;
