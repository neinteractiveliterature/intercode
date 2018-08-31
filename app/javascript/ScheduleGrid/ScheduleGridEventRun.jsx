import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ConfigPropType, { defaultConfigProp } from './ConfigPropType';
import PopperDropdown from '../UIComponents/PopperDropdown';

function userSignupStatus(run) {
  if (run.my_signups.some(signup => signup.state === 'confirmed')) {
    return 'confirmed';
  }

  if (run.my_signups.some(signup => signup.state === 'waitlisted')) {
    return 'waitlisted';
  }

  return null;
}

class ScheduleGridEventRun extends React.Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    run: PropTypes.object.isRequired,
    runDimensions: PropTypes.object.isRequired,
    convention: PropTypes.object.isRequired,
    layoutResult: PropTypes.object.isRequired,
    className: PropTypes.string,
    config: ConfigPropType,
  };

  static defaultProps = {
    className: null,
    config: defaultConfigProp,
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

  renderAvailabilityBar = () => {
    const { event, run } = this.props;

    let unavailableBarWidth = 100.0;
    if (event.registration_policy.total_slots > 0) {
      unavailableBarWidth = (
        (run.confirmed_limited_signup_count / event.registration_policy.total_slots) * 100.0
      );
    }

    return (
      <div className={classNames('availability-bar', { unlimited: !event.registration_policy.slots_limited })}>
        <div style={{ width: `${unavailableBarWidth}%` }} className="unavailable" />
      </div>
    );
  }

  renderExtendedCounts = () => {
    const { event, run, config } = this.props;

    if (!config.showExtendedCounts || !event.registration_policy.slots_limited) {
      return null;
    }

    return (
      <div className="event-extended-counts p-1">
        <span className="text-success">
          {run.confirmed_signup_count}
        </span>
        {'/'}
        <span className="text-info">
          {run.not_counted_signup_count}
        </span>
        {'/'}
        <span className="text-danger">
          {run.waitlisted_signup_count}
        </span>
      </div>
    );
  }

  renderSignupStatusBadge = (signupStatus) => {
    if (!this.props.config.showSignupStatusBadge) {
      return null;
    }

    if (signupStatus === 'confirmed') {
      return <i className="fa fa-check-square" title="Confirmed signup" />;
    }

    if (signupStatus === 'waitlisted') {
      return <i className="fa fa-hourglass-half" title="Waitlisted" />;
    }

    return null;
  }

  render = () => {
    const {
      layoutResult, runDimensions, event, run, className, convention,
    } = this.props;
    const { timespan } = runDimensions.eventRun;

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
    const eventFull = (
      event.registration_policy.slots_limited
      && run.confirmed_limited_signup_count === event.registration_policy.total_slots
    );
    const signupStatusBadge = this.renderSignupStatusBadge(signupStatus);

    const eventRunClasses = classNames(
      className,
      'schedule-grid-event',
      'small',
      {
        'signed-up': this.props.config.showSignedUp && signupStatus != null,
        full: eventFull && signupStatus == null,
      },
    );

    return (
      <PopperDropdown
        placement="bottom"
        renderReference={({ ref, toggle }) => (
          <div
            style={style}
            tabIndex={0}
            className={eventRunClasses}
            role="button"
            onClick={toggle}
            onKeyDown={(keyEvent) => {
              if (keyEvent.keyCode === 13 || keyEvent.keyCode === 32) {
                keyEvent.preventDefault();
                toggle();
              }
            }}
            ref={ref}
          >
            {this.renderAvailabilityBar()}
            <div className="d-flex">
              {this.renderExtendedCounts()}
              <div className="p-1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {signupStatusBadge}
                {signupStatusBadge ? ' ' : ''}
                {event.title}
              </div>
            </div>
          </div>
        )}
      >
        {({
          ref,
          placement,
          arrowProps,
          style: popperStyle,
          visible,
        }) => {
          if (!visible) {
            return <React.Fragment />;
          }

          return (
            <div className={`popover bs-popover-${placement} show`} ref={ref} style={popperStyle} role="tooltip">
              <span ref={arrowProps.ref} style={arrowProps.style} className="arrow" />
              <div className="popover-header">
                <div className="row align-items-center">
                  <div className="col">
                    <strong>
                      {event.title}
                    </strong>
                    {
                      run.title_suffix
                        ? [
                          <span key="mdash">
                            &mdash;
                          </span>,
                          <em key="title-suffix">
                            {run.title_suffix}
                          </em>,
                        ]
                        : []
                    }
                  </div>
                  <button type="button" className="btn btn-link btn-sm mr-2 text-dark" style={{ cursor: 'pointer' }} onClick={this.handleClickOutside}>
                    <i className="fa fa-close" title="Close" />
                  </button>
                </div>
              </div>
              <div className="popover-body">
                <ul className="list-unstyled mb-2">
                  <li>
                    {timespan.humanizeInTimezone(convention.timezone_name)}
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
          );
        }}
      </PopperDropdown>
    );
  }
}

export default ScheduleGridEventRun;
