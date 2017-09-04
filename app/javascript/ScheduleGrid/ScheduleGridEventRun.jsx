// @flow

import React from 'react';

const ScheduleGridEventRun = ({ layoutResult, runDimensions, event, run, options = {} }) => {
  const style = {
    top: `${(runDimensions.laneIndex / layoutResult.laneCount) * 100.0}%`,
    height: `${100.0 / layoutResult.laneCount}%`,
    left: `${runDimensions.timePlacement}%`,
    width: `${runDimensions.timeSpan}%`,
    position: 'absolute',
    zIndex: runDimensions.laneIndex,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const categoryClass = `event-category-${event.category.replace(/_/g, '-')}`;

  let runBadge = null;
  if (run.my_signups.some(signup => signup.state === 'confirmed')) {
    runBadge = <i className="fa fa-check-square" title="Confirmed signup" />;
  } else if (run.my_signups.some(signup => signup.state === 'waitlisted')) {
    runBadge = <i className="fa fa-hourglass-half" title="Waitlisted" />;
  }

  return (
    <div key={run.id} style={style} className={`${options.className} schedule-grid-event ${categoryClass} small border border-light p-1`}>
      {runBadge}
      {runBadge ? ' ' : ''}
      {event.title}
    </div>
  );
};

export default ScheduleGridEventRun;
