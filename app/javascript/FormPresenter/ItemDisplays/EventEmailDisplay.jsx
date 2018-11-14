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
    displayMode: PropTypes.oneOf(['admin', 'public']),
  };

  static defaultProps = {
    displayMode: 'admin',
  }

  getAddress = () => {
    const { convention, value } = this.props;
    if (convention.event_mailing_list_domain && value.team_mailing_list_name) {
      return `${value.team_mailing_list_name}@${convention.event_mailing_list_domain}`;
    }

    return value.email;
  }

  render = () => {
    const { convention, value, displayMode } = this.props;
    if (displayMode === 'public') {
      return <a href={`mailto:${this.getAddress()}`}>{this.getAddress()}</a>;
    }

    if (convention.event_mailing_list_domain && value.team_mailing_list_name) {
      return (
        <ul className="list-unstyled m-0">
          <li>
            <strong>Auto-managed mailing list:</strong>
            {' '}
            {this.getAddress()}
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
            {this.getAddress()}
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
          {this.getAddress()}
        </li>
      </ul>
    );
  }
}

export default EventEmailDisplay;
