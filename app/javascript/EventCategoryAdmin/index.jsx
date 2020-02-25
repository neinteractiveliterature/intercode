import React from 'react';
import { Switch, Route, useParams } from 'react-router-dom';

import BreadcrumbItemWithRoute from '../Breadcrumbs/BreadcrumbItemWithRoute';
import EditEventCategory from './EditEventCategory';
import EventCategoryIndex from './EventCategoryIndex';
import NewEventCategory from './NewEventCategory';

function EventCategoryAdmin() {
  const params = useParams();

  return (
    <>
      <ol className="breadcrumb">
        <BreadcrumbItemWithRoute
          to="/event_categories"
          path="/event_categories"
          exact
        >
          Event categories
        </BreadcrumbItemWithRoute>

        <BreadcrumbItemWithRoute
          path="/event_categories/new"
          to="/event_categories/new"
          hideUnlessMatch
        >
          New event category
        </BreadcrumbItemWithRoute>

        <BreadcrumbItemWithRoute
          path="/event_categories/:id/edit"
          to={`/event_categories/${params.id}/edit`}
          hideUnlessMatch
        >
          Edit event category
        </BreadcrumbItemWithRoute>
      </ol>

      <Switch>
        <Route path="/event_categories/new" component={NewEventCategory} />
        <Route path="/event_categories/:id/edit" component={EditEventCategory} />
        <Route path="/event_categories" component={EventCategoryIndex} />
      </Switch>
    </>
  );
}

export default EventCategoryAdmin;
