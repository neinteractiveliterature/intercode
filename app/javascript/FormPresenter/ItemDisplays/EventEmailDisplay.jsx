import React from 'react';
import PropTypes from 'prop-types';

class EventEmailDisplay extends React.PureComponent {
  static propTypes = {
    convention: PropTypes.shape({
      event_mailing_list_domain: PropTypes.string,
    }).isRequired,
    value: PropTypes.shape({
      con_mail_destination: PropTypes.oneOf(['event_email', 'gms']),
      email: PropTypes.string,
      team_mailing_list_name: PropTypes.string,
    }).isRequired,
  };

  render = () => {
    const { convention, value } = this.props;
    if (convention.event_mailing_list_domain && value.team_mailing_list_name) {
      return (
        <ul className="list-unstyled">
          <li>
            <strong>Auto-managed mailing list:</strong>
            {' '}
            {value.team_mailing_list_name}
            @
            {convention.event_mailing_list_domain}
          </li>
        </ul>
      );
    }

    if (value.con_mail_destination === 'gms') {
      return (
        <ul className="list-unstyled">
          <li>
            <strong>Attendee contact email:</strong>
            {' '}
            {value.email}
          </li>
          <li>
            <strong>Convention will email team members individually</strong>
          </li>
        </ul>
      );
    }

    return (
      <ul className="list-unstyled">
        <li>
          {value.email}
        </li>
      </ul>
    );
  }
}

export default EventEmailDisplay;
