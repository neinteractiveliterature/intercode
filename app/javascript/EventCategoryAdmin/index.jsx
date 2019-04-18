import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import BreadcrumbItemWithRoute from '../Breadcrumbs/BreadcrumbItemWithRoute';
import EditEventCategory from './EditEventCategory';
import { EventCategoryAdminQuery } from './queries.gql';
import EventCategoryIndex from './EventCategoryIndex';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import NewEventCategory from './NewEventCategory';

function EventCategoryAdmin({ basename }) {
  return (
    <BrowserRouter basename={basename}>
      <>
        <ol className="breadcrumb">
          <BreadcrumbItemWithRoute
            to="/"
            path="/"
            exact
            pageTitleIfActive="Event categories"
          >
            Event categories
          </BreadcrumbItemWithRoute>

          <BreadcrumbItemWithRoute
            path="/new"
            to="/new"
            hideUnlessMatch
            pageTitleIfActive="New event category"
          >
            New event category
          </BreadcrumbItemWithRoute>

          <BreadcrumbItemWithRoute
            path="/:id/edit"
            to={({ match: { params } }) => `/${params.id}/edit`}
            hideUnlessMatch
            pageTitleIfActive="Edit event category"
          >
            Edit event category
          </BreadcrumbItemWithRoute>
        </ol>

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
                      ticket_mode: ticketMode,
                    },
                  },
                }) => (
                  <NewEventCategory forms={forms} ticketName={ticketName} ticketMode={ticketMode} />
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
                      ticket_mode: ticketMode,
                    },
                  },
                }) => {
                  const eventCategory = eventCategories.find(c => c.id.toString() === params.id);

                  return (
                    <EditEventCategory
                      initialEventCategory={eventCategory}
                      forms={forms}
                      ticketName={ticketName}
                      ticketMode={ticketMode}
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
      </>
    </BrowserRouter>
  );
}

EventCategoryAdmin.propTypes = {
  basename: PropTypes.string.isRequired,
};

export default EventCategoryAdmin;
