import React from 'react';
import { Link } from 'react-router-dom';
import buildEventUrl from '../buildEventUrl';
import { EventPageEventFieldsFragment, EventPageRunFieldsFragment } from './queries.generated';

export type ViewSignupOptionsProps = {
  event: EventPageEventFieldsFragment,
  run: EventPageRunFieldsFragment,
  currentAbility: {
    can_read_event_signups: boolean,
  },
};

function ViewSignupsOptions({ event, run, currentAbility }: ViewSignupOptionsProps) {
  const eventPath = buildEventUrl(event);

  if (currentAbility.can_read_event_signups) {
    return (
      <div className="card-footer text-center">
        <Link to={`${eventPath}/runs/${run.id}/admin_signups?filters.state=confirmed,waitlisted&sort.id=asc`}>
          View signups
        </Link>
        {
          run.current_ability_can_signup_summary_run && !event.private_signup_list
            ? (
              <>
                <br />
                <Link to={`${eventPath}/runs/${run.id}/signup_summary`}>
                  Attendee-facing signup summary
                </Link>
              </>
            )
            : null
        }
      </div>
    );
  }

  if (run.current_ability_can_signup_summary_run) {
    return (
      <div className="card-footer text-center">
        <Link to={`${eventPath}/runs/${run.id}/signup_summary`}>
          View signups
        </Link>
      </div>
    );
  }

  return null;
}

export default ViewSignupsOptions;
