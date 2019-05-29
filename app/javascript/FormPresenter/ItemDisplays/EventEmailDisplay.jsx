import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

function EventEmailDisplay({ convention, value, displayMode }) {
  const address = useMemo(
    () => {
      if (convention.event_mailing_list_domain && value.team_mailing_list_name) {
        return `${value.team_mailing_list_name}@${convention.event_mailing_list_domain}`;
      }

      return value.email;
    },
    [convention.event_mailing_list_domain, value.email, value.team_mailing_list_name],
  );

  if (displayMode === 'public') {
    return <a href={`mailto:${address}`}>{address}</a>;
  }

  if (convention.event_mailing_list_domain && value.team_mailing_list_name) {
    return (
      <ul className="list-unstyled m-0">
        <li>
          <strong>Auto-managed mailing list:</strong>
          {' '}
          {address}
        </li>
      </ul>
    );
  }

  if (value.con_mail_destination === 'gms') {
    return (
      <ul className="list-unstyled m-0">
        <li>
          <strong>Attendee contact email:</strong>
          {' '}
          {address}
        </li>
        <li>
          <strong>Convention will email team members individually</strong>
        </li>
      </ul>
    );
  }

  return (
    <ul className="list-unstyled m-0">
      <li>
        {address}
      </li>
    </ul>
  );
}

EventEmailDisplay.propTypes = {
  convention: PropTypes.shape({
    event_mailing_list_domain: PropTypes.string,
  }).isRequired,
  value: PropTypes.shape({
    con_mail_destination: PropTypes.oneOf(['event_email', 'gms']),
    email: PropTypes.string,
    team_mailing_list_name: PropTypes.string,
  }).isRequired,
  displayMode: PropTypes.oneOf(['admin', 'public']),
};

EventEmailDisplay.defaultProps = {
  displayMode: 'admin',
};

export default EventEmailDisplay;
