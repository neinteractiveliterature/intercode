import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import EditEventCategory from './EditEventCategory';
import { EventCategoryAdminQuery } from './queries.gql';
import EventCategoryIndex from './EventCategoryIndex';
import QueryWithStateDisplay from '../QueryWithStateDisplay';

function EventCategoryAdmin({ basename }) {
  return (
    <BrowserRouter basename={basename}>
      <Switch>
        <Route
          path="/:id/edit"
          render={({ match: { params } }) => (
            <QueryWithStateDisplay query={EventCategoryAdminQuery}>
              {({ data: { convention: { event_categories: eventCategories } } }) => {
                const eventCategory = eventCategories.find(c => c.id.toString() === params.id);

                return (
                  <EditEventCategory initialEventCategory={eventCategory} />
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
