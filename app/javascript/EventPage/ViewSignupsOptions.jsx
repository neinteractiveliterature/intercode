import React from 'react';
import PropTypes from 'prop-types';
import { parameterize } from 'inflected';

function buildEventUrl(event) {
  return `/events/${event.id}-${parameterize(event.title)}`;
}

function ViewSignupsOptions({ event, run, currentAbility }) {
  if (currentAbility.can_read_event_signups) {
    return (
      <div className="card-footer text-center">
        <a href={`${buildEventUrl(event)}/runs/${run.id}/admin_signups?filters.state=confirmed,waitlisted&sort.id=asc`}>
          View signups
        </a>
        {
          currentAbility.can_signup_summary_event && !event.private_signup_list
            ? (
              <>
                <br />
                <a href={`${buildEventUrl(event)}/runs/${run.id}/signup_summary`}>
                  Attendee-facing signup summary
                </a>
              </>
            ) :
            null
        }
      </div>
    );
  }

  if (currentAbility.can_signup_summary_event) {
    return (
      <div className="card-footer text-center">
        <a href={`${buildEventUrl(event)}/runs/${run.id}/signup_summary`}>
          View signups
        </a>
      </div>
    );
  }

  return null;
}

export default ViewSignupsOptions;
