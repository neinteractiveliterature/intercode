import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import buildEventUrl from '../buildEventUrl';

function ViewSignupsOptions({ event, run, currentAbility }) {
  if (currentAbility.can_read_event_signups) {
    return (
      <div className="card-footer text-center">
        <Link to={`${buildEventUrl(event)}/runs/${run.id}/admin_signups?filters.state=confirmed,waitlisted&sort.id=asc`}>
          View signups
        </Link>
        {
          currentAbility.can_signup_summary_event && !event.private_signup_list
            ? (
              <>
                <br />
                <Link to={`${buildEventUrl(event)}/runs/${run.id}/signup_summary`}>
                  Attendee-facing signup summary
                </Link>
              </>
            )
            : null
        }
      </div>
    );
  }

  if (currentAbility.can_signup_summary_event) {
    return (
      <div className="card-footer text-center">
        <Link to={`${buildEventUrl(event)}/runs/${run.id}/signup_summary`}>
          View signups
        </Link>
      </div>
    );
  }

  return null;
}

ViewSignupsOptions.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    private_signup_list: PropTypes.bool.isRequired,
  }).isRequired,
  run: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  currentAbility: PropTypes.shape({
    can_read_event_signups: PropTypes.bool.isRequired,
    can_signup_summary_event: PropTypes.bool.isRequired,
  }).isRequired,
};

export default ViewSignupsOptions;
