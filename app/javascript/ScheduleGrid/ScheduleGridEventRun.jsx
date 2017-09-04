// @flow

import React from 'react';
import { Manager, Target, Popper, Arrow } from 'react-popper';

class ScheduleGridEventRun extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popoverVisible: false,
    };
  }

  showPopover = () => {
    this.setState({ popoverVisible: true });
  }

  hidePopover = () => {
    this.setState({ popoverVisible: false });
  }

  renderPopover = () => {
    if (!this.state.popoverVisible) {
      return null;
    }

    const { event, run, runDimensions, convention } = this.props;
    const timespan = runDimensions.eventRun.timespan;
    const start = timespan.start.tz(convention.timezone_name);
    const finish = timespan.finish.tz(convention.timezone_name);

    let finishTimeFormat = 'h:mma';
    if (finish.date() !== start.date()) {
      finishTimeFormat = 'ddd h:mma';
    }

    return (
      <Popper placement="bottom">
        {({ popperProps, restProps }) => (
          <div className={`popover bs-popover-${popperProps['data-placement']} show`} role="tooltip" {...popperProps}>
            <Arrow className="arrow" />
            <div className="popover-header">
              <div className="row align-items-center">
                <div className="col">
                  <strong>{event.title}</strong>
                  {
                    run.title_suffix ? [<span key="mdash">&mdash;</span>, <em key="title-suffix">{run.title_suffix}</em>] : []
                  }
                </div>
                <button className="btn btn-link btn-sm mr-2 text-dark" style={{ cursor: 'pointer' }} onClick={this.hidePopover}>
                  <i className="fa fa-close" title="Close" />
                </button>
              </div>
            </div>
            <div className="popover-body">
              <ul className="list-unstyled mb-2">
                <li>
                  {start.format('ddd h:mma')}
                  {' - '}
                  {finish.format(finishTimeFormat)}
                </li>
                <li>
                  {run.rooms.map(room => room.name).sort().join(', ')}
                </li>
              </ul>

              <div
                className="small"
                style={{ overflowY: 'auto', maxHeight: '200px' }}
                dangerouslySetInnerHTML={{ __html: event.short_blurb_html }}
              />
            </div>
          </div>
        )}
      </Popper>
    );
  }

  renderAvailabilityBar = () => {
    const { event, run } = this.props;

    if (!event.registration_policy.slots_limited) {
      return null;
    }

    return (
      <div className="availability-bar">
        <div
          style={{
            width: `${(run.confirmed_signup_count / event.registration_policy.total_slots) * 100.0}%`,
          }}
          className="unavailable"
        />
      </div>
    );
  }

  render = () => {
    const { layoutResult, runDimensions, event, run, className } = this.props;

    const style = {
      top: `${(runDimensions.laneIndex / layoutResult.laneCount) * 100.0}%`,
      height: `${100.0 / layoutResult.laneCount}%`,
      left: `${runDimensions.timePlacement}%`,
      width: `${runDimensions.timeSpan}%`,
      position: 'absolute',
      zIndex: runDimensions.laneIndex,
      cursor: 'pointer',
    };

    const categoryClass = `event-category-${event.category.replace(/_/g, '-')}`;

    let runBadge = null;
    if (run.my_signups.some(signup => signup.state === 'confirmed')) {
      runBadge = <i className="fa fa-check-square" title="Confirmed signup" />;
    } else if (run.my_signups.some(signup => signup.state === 'waitlisted')) {
      runBadge = <i className="fa fa-hourglass-half" title="Waitlisted" />;
    }

    return (
      <Manager>
        <Target style={style} className={`${className} schedule-grid-event ${categoryClass} small border border-light p-1`} role="button" onClick={this.showPopover}>
          {this.renderAvailabilityBar()}
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {runBadge}
            {runBadge ? ' ' : ''}
            {event.title}
          </div>
        </Target>
        {this.renderPopover()}
      </Manager>
    );
  }
};

export default ScheduleGridEventRun;
