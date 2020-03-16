import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import ErrorDisplay from '../ErrorDisplay';
import EventProposers from './EventProposers';
import { MailingListsMenuQuery } from './queries.gql';
import TicketedAttendees from './TicketedAttendees';
import TeamMembers from './TeamMembers';
import UsersWithPendingBio from './UsersWithPendingBio';
import WaitlistMailingLists from './WaitlistMailingLists';
import WhosFree from './WhosFree';
import PageLoadingIndicator from '../PageLoadingIndicator';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';

function MailingListsMenu() {
  const authorizationWarning = useAuthorizationRequired('can_read_any_mailing_list');
  const { data, loading, error } = useQuery(MailingListsMenuQuery);

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (authorizationWarning) return authorizationWarning;

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
      <Route path="/mailing_lists/ticketed_attendees"><TicketedAttendees /></Route>
      <Route path="/mailing_lists/event_proposers"><EventProposers /></Route>
      <Route path="/mailing_lists/team_members"><TeamMembers /></Route>
      <Route path="/mailing_lists/users_with_pending_bio"><UsersWithPendingBio /></Route>
      <Route path="/mailing_lists/waitlists"><WaitlistMailingLists /></Route>
      <Route path="/mailing_lists/whos_free"><WhosFree /></Route>
      <Route path="/mailing_lists/"><MailingListsMenu /></Route>
    </Switch>
  );
}

export default MailingLists;
