import { Link, Route, Routes } from 'react-router-dom';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform';

import EventProposers from './EventProposers';
import TicketedAttendees from './TicketedAttendees';
import TeamMembers from './TeamMembers';
import UsersWithPendingBio from './UsersWithPendingBio';
import WaitlistMailingLists from './WaitlistMailingLists';
import WhosFree from './WhosFree';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { useMailingListsMenuQuery } from './queries.generated';

const MailingListsMenuWrapper = LoadQueryWrapper(useMailingListsMenuQuery, function MailingListsMenu({ data }) {
  const authorizationWarning = useAuthorizationRequired('can_read_any_mailing_list');

  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <h1 className="mb-4">Mailing lists</h1>

      <ul>
        {data.convention.ticket_mode !== 'disabled' && (
          <li>
            <Link to="/mailing_lists/ticketed_attendees">All attendees with {data.convention.ticket_name}</Link>
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
});

function MailingLists(): JSX.Element {
  return (
    <Routes>
      <Route path="/mailing_lists/ticketed_attendees" element={<TicketedAttendees />} />
      <Route path="/mailing_lists/event_proposers" element={<EventProposers />} />
      <Route path="/mailing_lists/team_members" element={<TeamMembers />} />
      <Route path="/mailing_lists/users_with_pending_bio" element={<UsersWithPendingBio />} />
      <Route path="/mailing_lists/waitlists" element={<WaitlistMailingLists />} />
      <Route path="/mailing_lists/whos_free" element={<WhosFree />} />
      <Route path="/mailing_lists/" element={<MailingListsMenuWrapper />} />
    </Routes>
  );
}

export default MailingLists;
