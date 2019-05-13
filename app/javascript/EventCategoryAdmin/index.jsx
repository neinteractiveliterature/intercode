import React from 'react';
import { Switch, Route } from 'react-router-dom';

import BreadcrumbItemWithRoute from '../Breadcrumbs/BreadcrumbItemWithRoute';
import EditEventCategory from './EditEventCategory';
import { EventCategoryAdminQuery } from './queries.gql';
import EventCategoryIndex from './EventCategoryIndex';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import NewEventCategory from './NewEventCategory';

function EventCategoryAdmin() {
  return (
    <>
      <ol className="breadcrumb">
        <BreadcrumbItemWithRoute
          to="/event_categories"
          path="/event_categories"
          exact
          pageTitleIfActive="Event categories"
        >
          Event categories
        </BreadcrumbItemWithRoute>

        <BreadcrumbItemWithRoute
          path="/event_categories/new"
          to="/event_categories/new"
          hideUnlessMatch
          pageTitleIfActive="New event category"
        >
          New event category
        </BreadcrumbItemWithRoute>

        <BreadcrumbItemWithRoute
          path="/event_categories/:id/edit"
          to={({ match: { params } }) => `/${params.id}/edit`}
          hideUnlessMatch
          pageTitleIfActive="Edit event category"
        >
          Edit event category
        </BreadcrumbItemWithRoute>
      </ol>

      <Switch>
        <Route
          path="/event_categories/new"
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
          path="/event_categories/:id/edit"
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
          path="/event_categories"
          render={() => (
            <EventCategoryIndex />
          )}
        />
      </Switch>
    </>
  );
}

export default EventCategoryAdmin;
