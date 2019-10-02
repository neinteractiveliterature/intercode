import React, { useContext, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Manager, Reference, Popper } from 'react-popper';

import AvailabilityBar from './AvailabilityBar';
import buildEventUrl from '../buildEventUrl';
import { ScheduleGridContext } from './ScheduleGridContext';
import { userSignupStatus, getRunClassName, getRunStyle } from './StylingUtils';
import SignupCountData from '../SignupCountData';
import pluralizeWithCount from '../../pluralizeWithCount';
import BucketAvailabilityDisplay from '../EventPage/BucketAvailabilityDisplay';

function calculateAvailability(event, signupCountData) {
  let totalSlots;
  let signupCount;
  if (event.registration_policy.total_slots > 0) {
    signupCount = signupCountData.getConfirmedLimitedSignupCount(event);
    totalSlots = event.registration_policy.total_slots;
  } else if (event.registration_policy.only_uncounted) {
    signupCount = signupCountData.getNotCountedConfirmedSignupCount();
    totalSlots = event.registration_policy.total_slots_including_not_counted;
  }

  return {
    totalSlots,
    signupCount,
    remainingCapacity: totalSlots - signupCount,
    availabilityFraction: 1.0 - (signupCount / totalSlots),
    unlimited: !event.registration_policy.slots_limited,
    waitlistCount: signupCountData.getWaitlistCount(),
  };
}

function describeAvailability(event, signupCountData) {
  if (signupCountData.runFull(event)) {
    return (
      <>
        <strong>Full</strong>
        <span className="text-muted">
          {' ('}
          {event.registration_policy.total_slots}
          {' slots)'}
        </span>
        {', '}
        <strong>Waitlist:</strong>
        {' '}
        {signupCountData.getWaitlistCount()}
      </>
    );
  }

  const {
    unlimited, totalSlots, remainingCapacity,
  } = calculateAvailability(event, signupCountData);

  if (unlimited) {
    return 'Unlimited slots';
  }

  if (totalSlots === 0) {
    return null;
  }

  return `${remainingCapacity} of ${pluralizeWithCount('slot', totalSlots)} left`;
}

function RunDisplay({
  // eslint-disable-next-line react/prop-types
  event, run, signupCountData, toggle, runDimensions, layoutResult,
}, ref) {
  const { config } = useContext(ScheduleGridContext);
  const signupStatus = userSignupStatus(run);

  const runStyle = getRunStyle({
    event,
    eventCategory: event.event_category,
    signupStatus,
    config,
    signupCountData,
    runDimensions,
    layoutResult,
  });

  const { availabilityFraction, unlimited } = calculateAvailability(event, signupCountData);

  const renderAvailabilityBar = () => {
    if (
      event.registration_policy.slots_limited
      && event.registration_policy.total_slots_including_not_counted === 0
    ) {
      return null;
    }

    return (
      <AvailabilityBar availabilityFraction={availabilityFraction} unlimited={unlimited} runStyle={runStyle} />
    );
  };

  const renderExtendedCounts = () => {
    if (!config.showExtendedCounts) {
      return null;
    }

    return (
      <div className="event-extended-counts p-1">
        <span className="text-success">
          {signupCountData.sumSignupCounts({ state: 'confirmed', counted: true })}
        </span>
        {'/'}
        <span className="text-info">
          {signupCountData.sumSignupCounts({ state: 'confirmed', counted: false })}
        </span>
        {'/'}
        <span className="text-danger">
          {signupCountData.getWaitlistCount()}
        </span>
      </div>
    );
  };

  const renderSignupStatusBadge = () => {
    if (!config.showSignupStatusBadge) {
      return null;
    }

    if (signupStatus === 'confirmed') {
      return <i className="fa fa-user-circle mr-1" title="Confirmed signup" />;
    }

    if (signupStatus === 'waitlisted') {
      return <i className="fa fa-hourglass-half mr-1" title="Waitlisted" />;
    }

    if (signupStatus === 'request_pending') {
      return <i className="fa fa-pause-circle mr-1" title="Signup request pending" />;
    }

    return null;
  };

  return (
    <div
      tabIndex={0}
      className={getRunClassName({
        event, signupStatus, config, signupCountData, unlimited,
      })}
      style={runStyle}
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
      {renderAvailabilityBar(signupCountData)}
      <div className="d-flex">
        {renderExtendedCounts(config, signupCountData)}
        <div className="p-1 pl-2" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {renderSignupStatusBadge(signupStatus, config)}
          {event.title}
        </div>
      </div>
    </div>
  );
}

const RefForwardingRunDisplay = React.memo(React.forwardRef(RunDisplay));

function RunDetails({
  // eslint-disable-next-line react/prop-types
  popperStyle, placement, arrowProps, event, run, runDimensions, toggle, signupCountData,
}, ref) {
  const { schedule } = useContext(ScheduleGridContext);
  const { timespan } = runDimensions.eventRun;

  const availabilityDescription = useMemo(
    () => describeAvailability(event, signupCountData),
    [event, signupCountData],
  );
  const availability = useMemo(
    () => calculateAvailability(event, signupCountData),
    [event, signupCountData],
  );
  const roomsDescription = useMemo(
    () => run.room_names.sort().join(', '),
    [run.room_names],
  );

  return (
    <div
      className={`popover bs-popover-${placement} show`}
      ref={ref}
      style={popperStyle}
      role="tooltip"
    >
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
          <button type="button" className="btn btn-link btn-sm mr-2 text-dark" style={{ cursor: 'pointer' }} onClick={toggle}>
            <i className="fa fa-close" title="Close" />
          </button>
        </div>
      </div>
      <div className="popover-body">
        <table className="mb-2">
          <tbody>
            <tr>
              <td className="text-center pr-1"><i className="fa fa-clock-o" /></td>
              <td>{timespan.humanizeInTimezone(schedule.timezoneName)}</td>
            </tr>
            {
              roomsDescription
                ? (
                  <tr>
                    <td className="text-center pr-1"><i className="fa fa-map-marker" /></td>
                    <td>{roomsDescription}</td>
                  </tr>
                )
                : null
            }
            {
              availabilityDescription
                ? (
                  <tr>
                    <td className="text-center pr-1 align-top"><i className="fa fa-users" /></td>
                    <td>
                      {availabilityDescription}
                      {availability.totalSlots > 0 && (
                        <BucketAvailabilityDisplay
                          compact
                          className="text-dark"
                          signupCount={availability.signupCount}
                          remainingCapacity={availability.remainingCapacity}
                        />
                      )}
                      {availability.waitlistCount > 0 && (
                        <BucketAvailabilityDisplay
                          compact
                          className="text-black-50"
                          signupCount={availability.waitlistCount}
                          remainingCapacity={0}
                        />
                      )}
                    </td>
                  </tr>
                )
                : null
            }
          </tbody>
        </table>

        <Link
          to={`${buildEventUrl(event)}#run-${run.id}`}
          className="btn btn-primary btn-sm mb-2"
        >
          Go to event &raquo;
        </Link>

        <div
          className="small"
          style={{ overflowY: 'auto', maxHeight: '200px' }}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: event.short_blurb_html }}
        />
      </div>
    </div>
  );
}

const RefForwardingRunDetails = React.forwardRef(RunDetails);

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
          <RefForwardingRunDisplay
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
      <Popper placement={detailsVisible ? 'bottom' : 'invalid'}>
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
            <RefForwardingRunDetails
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
    </Manager>
  );
}

ScheduleGridEventRun.propTypes = {
  runDimensions: PropTypes.shape({}).isRequired,
  layoutResult: PropTypes.shape({}).isRequired,
};

export default ScheduleGridEventRun;
