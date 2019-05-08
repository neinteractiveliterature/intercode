import React from 'react';
import {
  BrowserRouter, Link, Route, Switch,
} from 'react-router-dom';

import ErrorDisplay from '../ErrorDisplay';
import EventProposers from './EventProposers';
import { MailingListsMenuQuery } from './queries.gql';
import TicketedAttendees from './TicketedAttendees';
import TeamMembers from './TeamMembers';
import UsersWithPendingBio from './UsersWithPendingBio';
import useQuerySuspended from '../useQuerySuspended';
import WaitlistMailingLists from './WaitlistMailingLists';
import WhosFree from './WhosFree';

function MailingListsMenu() {
  const { data, error } = useQuerySuspended(MailingListsMenuQuery);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <h1 className="mb-4">Mailing lists</h1>

      <ul>
        {data.convention.ticket_mode !== 'disabled' && (
          <li>
            <Link to="/ticketed_attendees">
              All attendees with
              {' '}
              {data.convention.ticket_name}
            </Link>
          </li>
        )}
        <li>
          <Link to="/event_proposers">Event proposers</Link>
        </li>
        <li>
          <Link to="/team_members">Event team members</Link>
        </li>
        <li>
          <Link to="/users_with_pending_bio">Users with pending bio</Link>
        </li>
        <li>
          <Link to="/waitlists">Waitlists</Link>
        </li>
        <li>
          <Link to="/whos_free">Who&rsquo;s free</Link>
        </li>
      </ul>
    </>
  );
}

function MailingLists() {
  return (
    <BrowserRouter basename="/mailing_lists">
      <Switch>
        <Route path="/ticketed_attendees" component={TicketedAttendees} />
        <Route path="/event_proposers" component={EventProposers} />
        <Route path="/team_members" component={TeamMembers} />
        <Route path="/users_with_pending_bio" component={UsersWithPendingBio} />
        <Route path="/waitlists" component={WaitlistMailingLists} />
        <Route path="/whos_free" component={WhosFree} />
        <Route path="/" component={MailingListsMenu} />
      </Switch>
    </BrowserRouter>
  );
}

export default MailingLists;
