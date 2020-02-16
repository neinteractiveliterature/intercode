import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { ScheduleGridContext } from './ScheduleGridContext';
import { describeAvailability, calculateAvailability, describeWaitlist } from './AvailabilityUtils';
import BucketAvailabilityDisplay from '../EventPage/BucketAvailabilityDisplay';
import buildEventUrl from '../buildEventUrl';
import AppRootContext from '../../AppRootContext';
import RateEventControl from '../../EventRatings/RateEventControl';
import useRateEvent from '../../EventRatings/useRateEvent';
import { useApolloClient } from '@apollo/react-hooks';

const RunDetails = React.forwardRef(({
  popperStyle, placement, arrowProps, event, run, runDimensions, toggle, signupCountData,
}, ref) => {
  const { myProfile } = useContext(AppRootContext);
  const { schedule } = useContext(ScheduleGridContext);
  const { timespan } = runDimensions.eventRun;
  const rateEvent = useRateEvent();
  const apolloClient = useApolloClient();

  const availabilityDescription = useMemo(
    () => describeAvailability(event, signupCountData),
    [event, signupCountData],
  );
  const waitlistDescription = useMemo(
    () => describeWaitlist(event, signupCountData),
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

  const ratingChanged = async (rating) => {
    await rateEvent(event.id, rating);
    await apolloClient.resetStore();
  };

  return (
    <div
      className={`popover schedule-grid-run-details-popover bs-popover-${placement} show`}
      ref={ref}
      style={popperStyle}
      role="tooltip"
    >
      <span ref={arrowProps.ref} style={arrowProps.style} className="arrow" />
      <div className="schedule-grid-run-details-content">
        <div className="popover-header">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 schedule-grid-run-details-title">
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
            <button type="button" className="btn btn-link btn-sm text-dark" style={{ cursor: 'pointer' }} onClick={toggle}>
              <i className="fa fa-close" title="Close" />
            </button>
          </div>
        </div>
        <div className="popover-body overflow-auto">
          {myProfile && (
            <div className="float-right">
              <RateEventControl
                value={event.my_rating}
                onChange={ratingChanged}
              />
            </div>
          )}
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
                      </td>
                    </tr>
                  )
                  : null
              }
              {
                waitlistDescription
                  ? (
                    <tr>
                      <td className="text-center pr-1 align-top"><i className="fa fa-hourglass-half" /></td>
                      <td>
                        {waitlistDescription}
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
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: event.short_blurb_html }}
          />
        </div>
      </div>
    </div>
  );
});

RunDetails.propTypes = {
  arrowProps: PropTypes.shape({
    style: PropTypes.shape({}).isRequired,
    ref: PropTypes.any.isRequired,
  }).isRequired,
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    short_blurb_html: PropTypes.string,
  }).isRequired,
  placement: PropTypes.string,
  popperStyle: PropTypes.shape({}).isRequired,
  run: PropTypes.shape({
    id: PropTypes.number.isRequired,
    room_names: PropTypes.arrayOf(PropTypes.string).isRequired,
    title_suffix: PropTypes.string,
  }).isRequired,
  runDimensions: PropTypes.shape({
    eventRun: PropTypes.shape({
      timespan: PropTypes.shape({
        humanizeInTimezone: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  signupCountData: PropTypes.shape({}).isRequired,
  toggle: PropTypes.func.isRequired,
};

RunDetails.defaultProps = {
  placement: null,
};

export default RunDetails;
