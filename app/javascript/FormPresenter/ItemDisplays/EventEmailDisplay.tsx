import { useMemo } from 'react';
import { Convention } from '../../graphqlTypes.generated';
import { FormItemDisplayMode } from './FormItemDisplayMode';
import { EventEmailValue } from '../../FormAdmin/FormItemUtils';

export type EventEmailDisplayProps = {
  convention: Pick<Convention, 'event_mailing_list_domain'>;
  value: EventEmailValue;
  displayMode: FormItemDisplayMode;
};

function EventEmailDisplay({ convention, value, displayMode }: EventEmailDisplayProps): React.JSX.Element {
  const address = useMemo(() => {
    if (convention.event_mailing_list_domain && value.team_mailing_list_name) {
      return `${value.team_mailing_list_name}@${convention.event_mailing_list_domain}`;
    }

    return value.email;
  }, [convention.event_mailing_list_domain, value.email, value.team_mailing_list_name]);

  if (displayMode === 'public') {
    return <a href={`mailto:${address}`}>{address}</a>;
  }

  if (convention.event_mailing_list_domain && value.team_mailing_list_name) {
    return (
      <ul className="list-unstyled m-0">
        <li>
          <strong>Auto-managed mailing list:</strong> {address}
        </li>
      </ul>
    );
  }

  if (value.con_mail_destination === 'gms') {
    return (
      <ul className="list-unstyled m-0">
        <li>
          <strong>Attendee contact email:</strong> {address}
        </li>
        <li>
          <strong>Convention will email team members individually</strong>
        </li>
      </ul>
    );
  }

  return (
    <ul className="list-unstyled m-0">
      <li>{address}</li>
    </ul>
  );
}

export default EventEmailDisplay;
