import { Switch, Route } from 'react-router-dom';

import EditEventCategory from './EditEventCategory';
import EventCategoryIndex from './EventCategoryIndex';
import NewEventCategory from './NewEventCategory';
import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';

function EventCategoryAdmin(): JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_update_event_categories');

  if (authorizationWarning) return authorizationWarning;

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
          <BreadcrumbItem active to="/event_categories/new">
            New event category
          </BreadcrumbItem>
        </Route>

        <Route path="/event_categories/:id/edit">
          <BreadcrumbItem active to="/event_categories/:id/edit">
            Edit event category
          </BreadcrumbItem>
        </Route>
      </ol>

      <Switch>
        <Route path="/event_categories/new">
          <NewEventCategory />
        </Route>
        <Route path="/event_categories/:id/edit">
          <EditEventCategory />
        </Route>
        <Route path="/event_categories">
          <EventCategoryIndex />
        </Route>
      </Switch>
    </>
  );
}

export default EventCategoryAdmin;
