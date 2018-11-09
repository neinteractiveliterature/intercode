import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ConfigPropType, { defaultConfigProp } from './ConfigPropType';
import getFullnessClass from './getFullnessClass';
import Timespan from '../PCSG/Timespan';
import ScheduleGridEventRun from './ScheduleGridEventRun';
import computeRunDimensionsWithoutSpanning from '../PCSG/computeRunDimensionsWithoutSpanning';

const PIXELS_PER_HOUR = 100;
const PIXELS_PER_LANE = 30;

function formatTime(time, timezoneName) {
  const timeInZone = time.tz(timezoneName);
  let phrasing;
  if (timeInZone.hour() === 0) {
    phrasing = 'Midnight';
  } else if (timeInZone.hour() === 12) {
    phrasing = 'Noon';
  } else {
    phrasing = timeInZone.format('h:mma');
  }

  return phrasing;
}

class ScheduleGrid extends React.Component {
  static propTypes = {
    config: ConfigPropType,
    schedule: PropTypes.shape({
      timezoneName: PropTypes.string.isRequired,
      buildLayoutForTimespanRange: PropTypes.func.isRequired,
      getRun: PropTypes.func.isRequired,
      getEvent: PropTypes.func.isRequired,
      shouldUseRowHeaders: PropTypes.func.isRequired,
    }).isRequired,
    timespan: PropTypes.shape({
      clone: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    config: defaultConfigProp,
  };

  getPixelWidth = timespan => timespan.getLength('hour') * PIXELS_PER_HOUR

  renderEvents = layoutResult => (
    layoutResult.runDimensions.map((runDimensions) => {
      const { eventRun } = runDimensions;
      const run = this.props.schedule.getRun(eventRun.runId);
      if (run == null) {
        return null;
      }

      const event = this.props.schedule.getEvent(run.event_id);
      if (event == null) {
        return null;
      }

      let className;

      if (this.props.config.classifyEventsBy === 'category') {
        className = `event-category-${event.category.replace(/_/g, '-')}`;
      } else if (this.props.config.classifyEventsBy === 'fullness') {
        className = getFullnessClass(event, run);
      }

      return (
        <ScheduleGridEventRun
          key={run.id}
          layoutResult={layoutResult}
          runDimensions={runDimensions}
          event={event}
          run={run}
          className={className}
        />
      );
    })
  )

  renderHours = (timespan, eventRuns) => {
    const now = timespan.start.clone();
    const hourDivs = [];
    while (timespan.includesTime(now)) {
      let extendedCounts = null;
      if (this.props.config.showExtendedCounts) {
        const hourTimespan = new Timespan(now, now.clone().add(1, 'hour'));
        const hourEventRuns = eventRuns.filter(eventRun => hourTimespan.overlapsTimespan(eventRun.timespan));

        const hourRunData = hourEventRuns.map((eventRun) => {
          const run = this.props.schedule.getRun(eventRun.runId);
          const event = this.props.schedule.getEvent(run.event_id);
          return { eventRun, run, event };
        });

        const minimumSlots = hourRunData.reduce(
          (sum, runData) => sum + runData.event.registration_policy.minimum_slots,
          0,
        );

        const preferredSlots = hourRunData.reduce(
          (sum, runData) => sum + runData.event.registration_policy.preferred_slots,
          0,
        );

        const totalSlots = hourRunData.reduce(
          (sum, runData) => sum + runData.event.registration_policy.total_slots,
          0,
        );

        const confirmedSignups = hourRunData.reduce(
          (sum, runData) => sum + runData.run.confirmed_signup_count,
          0,
        );

        const notCountedSignups = hourRunData.reduce(
          (sum, runData) => sum + runData.run.not_counted_signup_count,
          0,
        );

        const waitlistedSignups = hourRunData.reduce(
          (sum, runData) => sum + runData.run.waitlisted_signup_count,
          0,
        );

        const playerCount = confirmedSignups + notCountedSignups + waitlistedSignups;

        extendedCounts = (
          <div className="schedule-grid-hour-extended-counts">
            <div>
              {minimumSlots}
              /
              {preferredSlots}
              /
              {totalSlots}
            </div>
            <div>
              <span className="text-success">{confirmedSignups}</span>
              {'/'}
              <span className="text-info">{notCountedSignups}</span>
              {'/'}
              <span className="text-danger">{waitlistedSignups}</span>
            </div>
            <div>
              Players:
              {playerCount}
            </div>
          </div>
        );
      }

      hourDivs.push((
        <div key={now.toISOString()} style={{ width: `${PIXELS_PER_HOUR}px`, minWidth: `${PIXELS_PER_HOUR}px`, overflow: 'hidden' }}>
          <div className="small text-muted ml-1">
            {formatTime(now, this.props.schedule.timezoneName)}
            {extendedCounts}
          </div>
        </div>
      ));

      now.add(1, 'hour');
    }

    return hourDivs;
  }

  renderScheduleBlock(scheduleBlock, layoutResult, key, options = {}) {
    const runDivs = this.renderEvents(layoutResult, options);
    const blockContentStyle = {
      position: 'relative',
      width: `${this.getPixelWidth(scheduleBlock.timespan)}px`,
      height: `${layoutResult.laneCount * PIXELS_PER_LANE}px`,
    };

    return (
      <div className="schedule-grid-block" key={key}>
        <div style={blockContentStyle}>
          {runDivs}
        </div>
      </div>
    );
  }

  renderGridWithLayout = (layout, shouldUseRowHeaders) => {
    const { eventRuns, timespan, blocksWithOptions } = layout;

    const hourDivs = this.renderHours(timespan, eventRuns);
    const scheduleBlockDivs = blocksWithOptions.map(([scheduleBlock, options], i) => {
      const layoutResult = computeRunDimensionsWithoutSpanning(scheduleBlock);

      return (
        <div className={classNames('d-flex', { 'flex-grow-1': (options || {}).flexGrow })}>
          {
            shouldUseRowHeaders
              ? (
                <React.Fragment>
                  <div
                    className="schedule-grid-row-header"
                    style={{
                      width: `${PIXELS_PER_HOUR}px`,
                      minWidth: `${PIXELS_PER_HOUR}px`,
                      height: `${layoutResult.laneCount * PIXELS_PER_LANE + 5}px`,
                    }}
                  >
                    <small className="schedule-grid-row-header-label">{options.rowHeader}</small>
                  </div>
                </React.Fragment>
              )
              : null
          }
          {this.renderScheduleBlock(scheduleBlock, layoutResult, i, options)}
        </div>
      );
    });

    return (
      <div className="schedule-grid mb-4 bg-light" style={{ overflowX: 'auto' }}>
        <div className="schedule-grid-content" style={{ backgroundSize: `${PIXELS_PER_HOUR}px ${PIXELS_PER_LANE}px` }}>
          <div className="mt-1 d-flex">
            {
              shouldUseRowHeaders
                ? (<div style={{ width: `${PIXELS_PER_HOUR}px`, minWidth: `${PIXELS_PER_HOUR}px` }} />)
                : null
            }
            {hourDivs}
          </div>
          {scheduleBlockDivs}
        </div>
      </div>
    );
  }

  render = () => {
    const minTimespan = this.props.timespan.clone();
    minTimespan.start.add(3, 'hours'); // start grid at 9am unless something is earlier
    minTimespan.finish.subtract(6, 'hours'); // end grid at midnight unless something is earlier

    const layout = this.props.schedule.buildLayoutForTimespanRange(
      minTimespan,
      this.props.timespan,
    );

    return this.renderGridWithLayout(
      layout,
      this.props.schedule.shouldUseRowHeaders(),
    );
  }
}

export default ScheduleGrid;
