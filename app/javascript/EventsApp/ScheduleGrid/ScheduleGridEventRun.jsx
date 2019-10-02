import React, { useContext, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Manager, Reference, Popper } from 'react-popper';

import { ScheduleGridContext } from './ScheduleGridContext';
import SignupCountData from '../SignupCountData';
import RunDetails from './RunDetails';
import RunDisplay from './RunDisplay';

function ScheduleGridEventRun({ runDimensions, layoutResult }) {
  const {
    schedule, toggleRunDetailsVisibility, visibleRunDetailsIds,
  } = useContext(ScheduleGridContext);
  const detailsVisible = visibleRunDetailsIds.has(runDimensions.eventRun.runId);

  const { eventRun } = runDimensions;
  const run = useMemo(
    () => schedule.getRun(eventRun.runId),
    [schedule, eventRun.runId],
  );
  const event = useMemo(
    () => {
      if (!run) {
        return null;
      }

      return schedule.getEvent(run.event_id);
    },
    [schedule, run],
  );

  const signupCountData = useMemo(
    () => {
      if (!run) {
        return null;
      }

      return SignupCountData.fromRun(run);
    },
    [run],
  );

  const toggleVisibility = useCallback(
    () => toggleRunDetailsVisibility((run || {}).id),
    [run, toggleRunDetailsVisibility],
  );

  if (event == null || run == null) {
    return null;
  }

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <RunDisplay
            event={event}
            run={run}
            signupCountData={signupCountData}
            ref={ref}
            toggle={toggleVisibility}
            runDimensions={runDimensions}
            layoutResult={layoutResult}
          />
        )}
      </Reference>
      {ReactDOM.createPortal((
        <Popper
          placement={detailsVisible ? 'bottom' : 'invalid'}
          modifiers={{
            preventOverflow: { boundariesElement: document.body },
          }}
        >
          {({
            ref,
            placement,
            arrowProps,
            style: popperStyle,
          }) => {
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
                signupCountData={signupCountData}
              />
            );
          }}
        </Popper>
      ), document.body)}
    </Manager>
  );
}

ScheduleGridEventRun.propTypes = {
  runDimensions: PropTypes.shape({
    eventRun: PropTypes.shape({
      runId: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  layoutResult: PropTypes.shape({}).isRequired,
};

export default ScheduleGridEventRun;
