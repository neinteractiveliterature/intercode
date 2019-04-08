import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter, Route, Switch, Redirect,
} from 'react-router-dom';

import EditTicketType from './EditTicketType';
import NewTicketType from './NewTicketType';
import TicketTypesList from './TicketTypesList';
import { AdminTicketTypesQuery } from './queries.gql';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';

function TicketTypeAdmin({ basename }) {
  const { data, error } = useQuerySuspended(AdminTicketTypesQuery);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <BrowserRouter basename={basename}>
      <Switch>
        <Route
          path="/new"
          render={() => (
            <NewTicketType
              timezoneName={data.convention.timezone_name}
              ticketName={data.convention.ticket_name}
            />
          )}
        />
        <Route
          path="/:id/edit"
          render={({ match: { params: { id } } }) => {
            const ticketType = data.convention.ticket_types
              .find(tt => tt.id.toString(10) === id);

            return (
              <EditTicketType
                initialTicketType={ticketType}
                timezoneName={data.convention.timezone_name}
                ticketName={data.convention.ticket_name}
              />
            );
          }}
        />
        <Route
          path="/"
          render={() => (
            <TicketTypesList
              ticketTypes={data.convention.ticket_types}
              ticketName={data.convention.ticket_name}
              timezoneName={data.convention.timezone_name}
            />
          )}
        />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
}

TicketTypeAdmin.propTypes = {
  basename: PropTypes.string.isRequired,
};

export default TicketTypeAdmin;
