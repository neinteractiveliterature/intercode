import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';

import ErrorDisplay from '../ErrorDisplay';
import EventProposers from './EventProposers';
import { MailingListsMenuQuery } from './queries.gql';
import TicketedAttendees from './TicketedAttendees';
import TeamMembers from './TeamMembers';
import UsersWithPendingBio from './UsersWithPendingBio';
import WaitlistMailingLists from './WaitlistMailingLists';
import WhosFree from './WhosFree';
import PageLoadingIndicator from '../PageLoadingIndicator';

function MailingListsMenu() {
  const { data, loading, error } = useQuery(MailingListsMenuQuery);

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <h1 className="mb-4">Mailing lists</h1>

      <ul>
        {data.convention.ticket_mode !== 'disabled' && (
          <li>
            <Link to="/mailing_lists/ticketed_attendees">
              All attendees with
              {' '}
              {data.convention.ticket_name}
            </Link>
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

function MailingLists() {
  return (
    <Switch>
      <Route path="/mailing_lists/ticketed_attendees" component={TicketedAttendees} />
      <Route path="/mailing_lists/event_proposers" component={EventProposers} />
      <Route path="/mailing_lists/team_members" component={TeamMembers} />
      <Route path="/mailing_lists/users_with_pending_bio" component={UsersWithPendingBio} />
      <Route path="/mailing_lists/waitlists" component={WaitlistMailingLists} />
      <Route path="/mailing_lists/whos_free" component={WhosFree} />
      <Route path="/mailing_lists/" component={MailingListsMenu} />
    </Switch>
  );
}

export default MailingLists;
