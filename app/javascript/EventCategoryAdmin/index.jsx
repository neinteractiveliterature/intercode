import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import EditEventCategory from './EditEventCategory';
import { EventCategoryAdminQuery } from './queries.gql';
import EventCategoryIndex from './EventCategoryIndex';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import NewEventCategory from './NewEventCategory';

function EventCategoryAdmin({ basename }) {
  return (
    <BrowserRouter basename={basename}>
      <Switch>
        <Route
          path="/new"
          render={() => (
            <QueryWithStateDisplay query={EventCategoryAdminQuery}>
              {({
                data: {
                  convention: {
                    forms,
                    ticket_name: ticketName,
                  },
                },
              }) => (
                <NewEventCategory forms={forms} ticketName={ticketName} />
              )}
            </QueryWithStateDisplay>
          )}
        />

        <Route
          path="/:id/edit"
          render={({ match: { params } }) => (
            <QueryWithStateDisplay query={EventCategoryAdminQuery}>
              {({
                data: {
                  convention: {
                    event_categories: eventCategories,
                    forms,
                    ticket_name: ticketName,
                  },
                },
              }) => {
                const eventCategory = eventCategories.find(c => c.id.toString() === params.id);

                return (
                  <EditEventCategory
                    initialEventCategory={eventCategory}
                    forms={forms}
                    ticketName={ticketName}
                  />
                );
              }}
            </QueryWithStateDisplay>
          )}
        />

        <Route
          path="/"
          render={() => (
            <EventCategoryIndex />
          )}
        />
      </Switch>
    </BrowserRouter>
  );
}

EventCategoryAdmin.propTypes = {
  basename: PropTypes.string.isRequired,
};

export default EventCategoryAdmin;
