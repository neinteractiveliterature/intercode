import React from 'react';
import PropTypes from 'prop-types';
import { Manager, Target, Popper, Arrow } from 'react-popper';
import classNames from 'classnames';

function userSignupStatus(run) {
  if (run.my_signups.some(signup => signup.state === 'confirmed')) {
    return 'confirmed'
  } else if (run.my_signups.some(signup => signup.state === 'waitlisted')) {
    return 'waitlisted';
  }

  return null;
}

class ScheduleGridEventRun extends React.Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    run: PropTypes.object.isRequired,
    runDimensions: PropTypes.arrayOf(
      PropTypes.object.isRequired,
    ).isRequired,
    convention: PropTypes.object.isRequired,
    layoutResult: PropTypes.object.isRequired,
    className: PropTypes.string,
    showSignedUp: PropTypes.bool,
    showSignupStatusBadge: PropTypes.bool,
  };

  static defaultProps = {
    className: null,
    showSignedUp: false,
    showSignupStatusBadge: false,
  };

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
        {({ popperProps }) => (
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

              <a href={event.event_page_url} className="btn btn-primary btn-sm mb-2">
                Go to event &raquo;
              </a>

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

  renderSignupStatusBadge = (signupStatus) => {
    if (!this.props.showSignupStatusBadge) {
      return null;
    }

    if (signupStatus === 'confirmed') {
      return <i className="fa fa-check-square" title="Confirmed signup" />;
    } else if (signupStatus === 'waitlisted') {
      return <i className="fa fa-hourglass-half" title="Waitlisted" />;
    }

    return null;
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

    const signupStatus = userSignupStatus(run);
    const eventFull = (event.registration_policy.slots_limited && run.confirmed_signup_count === event.registration_policy.total_slots);
    const signupStatusBadge = this.renderSignupStatusBadge(signupStatus);

    const eventRunClasses = classNames(
      className,
      'schedule-grid-event',
      'small',
      'p-1',
      {
        'signed-up': this.props.showSignedUp && signupStatus != null,
        full: eventFull && signupStatus == null,
      },
    );

    return (
      <Manager>
        <Target style={style} className={eventRunClasses} role="button" onClick={this.showPopover}>
          {this.renderAvailabilityBar()}
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {signupStatusBadge}
            {signupStatusBadge ? ' ' : ''}
            {event.title}
          </div>
        </Target>
        {this.renderPopover()}
      </Manager>
    );
  }
};

export default ScheduleGridEventRun;
