import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Route, Switch, Redirect } from 'react-router-dom';

import EditTicketType from './EditTicketType';
import NewTicketType from './NewTicketType';
import TicketTypesList from './TicketTypesList';
import { AdminTicketTypesQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import PageLoadingIndicator from '../PageLoadingIndicator';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';

function TicketTypeAdmin() {
  const { data, loading, error } = useQuery(AdminTicketTypesQuery);
  const authorizationWarning = useAuthorizationRequired('can_manage_ticket_types');

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (authorizationWarning) return authorizationWarning;

  return (
    <Switch>
      <Route path="/ticket_types/new">
        <NewTicketType
          timezoneName={data.convention.timezone_name}
          ticketName={data.convention.ticket_name}
        />
      </Route>
      <Route path="/ticket_types/:id/edit"><EditTicketType /></Route>
      <Route path="/ticket_types">
        <TicketTypesList
          ticketTypes={data.convention.ticket_types}
          ticketName={data.convention.ticket_name}
          timezoneName={data.convention.timezone_name}
        />
      </Route>
      <Redirect to="/ticket_types" />
    </Switch>
  );
}

export default TicketTypeAdmin;
