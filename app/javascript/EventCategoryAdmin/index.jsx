import React from 'react';
import { Switch, Route } from 'react-router-dom';

import EditEventCategory from './EditEventCategory';
import EventCategoryIndex from './EventCategoryIndex';
import NewEventCategory from './NewEventCategory';
import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';

function EventCategoryAdmin() {
  return (
    <>
      <ol className="breadcrumb">
        <RouteActivatedBreadcrumbItem
          matchProps={{ path: '/event_categories', exact: true }}
          to="/event_categories"
        >
          Event categories
        </RouteActivatedBreadcrumbItem>

        <Route path="/event_categories/new">
          <BreadcrumbItem active>New event category</BreadcrumbItem>
        </Route>

        <Route path="/event_categories/:id/edit">
          <BreadcrumbItem active>Edit event category</BreadcrumbItem>
        </Route>
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
