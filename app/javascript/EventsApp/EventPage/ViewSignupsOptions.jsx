import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import buildEventUrl from '../buildEventUrl';

function ViewSignupsOptions({
  event, run, currentAbility,
}) {
  const { t } = useTranslation();
  const eventPath = buildEventUrl(event);

  if (currentAbility.can_read_event_signups) {
    return (
      <div className="card-footer text-center">
        <Link to={`${eventPath}/runs/${run.id}/admin_signups?filters.state=confirmed,waitlisted&sort.id=asc`}>
          {t('signups.viewSignupsLink', 'View signups')}
        </Link>
        {
          run.current_ability_can_signup_summary_run && !event.private_signup_list
            ? (
              <>
                <br />
                <Link to={`${eventPath}/runs/${run.id}/signup_summary`}>
                  {t('signups.signupSummaryLink', 'Attendee-facing signup summary')}
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
          {t('signups.viewSignupsLink', 'View signups')}
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
    current_ability_can_signup_summary_run: PropTypes.bool.isRequired,
  }).isRequired,
  currentAbility: PropTypes.shape({
    can_read_event_signups: PropTypes.bool.isRequired,
  }).isRequired,
};

export default ViewSignupsOptions;
