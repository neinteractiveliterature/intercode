import { Link } from 'react-router-dom';

import { useContext } from 'react';
import AppRootContext from '../AppRootContext';
import { TicketMode } from '../graphqlTypes.generated';

function MailingListsMenu() {
  const { ticketMode, ticketName } = useContext(AppRootContext);

  return (
    <>
      <h1 className="mb-4">Mailing lists</h1>

      <ul>
        {ticketMode !== TicketMode.Disabled && (
          <li>
            <Link to="/mailing_lists/ticketed_attendees">All attendees with {ticketName}</Link>
          </li>
        )}
        <li>
          <Link to="/mailing_lists/event_proposers">Event proposers</Link>
        </li>
        <li>
          <Link to="/mailing_lists/team_members">Event team members</Link>
        </li>
        <li>
          <Link to="/mailing_lists/users_with_pending_bio">Users with pending bio</Link>
        </li>
        <li>
          <Link to="/mailing_lists/waitlists">Waitlists</Link>
        </li>
        <li>
          <Link to="/mailing_lists/whos_free">Who&rsquo;s free</Link>
        </li>
      </ul>
    </>
  );
}

export const Component = MailingListsMenu;
