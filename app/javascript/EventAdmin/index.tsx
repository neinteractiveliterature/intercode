import { useEffect, useMemo, useState } from 'react';
import { NavLink, Route, Switch, Redirect, useLocation } from 'react-router-dom';
import { humanize } from 'inflected';
import classNames from 'classnames';
import {
  ErrorDisplay,
  PageLoadingIndicator,
  useLitformPopperWithAutoClosing,
} from '@neinteractiveliterature/litform';

import DroppedEventAdmin from './DroppedEventAdmin';
import EventAdminEditEvent from './EventAdminEditEvent';
import EventAdminRunsTable from './EventAdminRunsTable';
import NewEvent from './NewEvent';
import RecurringEventAdmin from './RecurringEventAdmin';
import sortEventCategories from './sortEventCategories';
import buildEventCategoryUrl from './buildEventCategoryUrl';
import SingleRunEventAdminList from './SingleRunEventAdminList';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { useEventAdminEventsQuery } from './queries.generated';

const eventCategoryIdRegexp = '[0-9a-z\\-]+';

const adminComponentsBySchedulingUi = {
  regular: EventAdminRunsTable,
  recurring: RecurringEventAdmin,
  single_run: SingleRunEventAdminList,
};

function EventAdmin() {
  const authorizationWarning = useAuthorizationRequired('can_manage_runs');
  const { data, loading, error } = useEventAdminEventsQuery();
  const location = useLocation();

  const eventCategories = useMemo(
    () => (loading || error || !data ? [] : sortEventCategories(data.convention.event_categories)),
    [data, loading, error],
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [menu, setMenu] = useState<HTMLDivElement | null>(null);
  const [menuDropdown, setMenuDropdown] = useState<HTMLLIElement | null>(null);

  const { styles, attributes } = useLitformPopperWithAutoClosing(
    menu,
    menuDropdown,
    undefined,
    setMenuOpen,
    { placement: 'bottom-start', modifiers: [{ name: 'offset', options: { offset: [0, 2] } }] },
  );

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (authorizationWarning) return authorizationWarning;

  if (data!.convention.site_mode === 'single_event') {
    if (data!.events.length === 0) {
      return (
        <Switch>
          <Route path="/admin_events/new">
            <NewEvent />
          </Route>
          <Redirect to="/admin_events/new" />
        </Switch>
      );
    }

    return (
      <Switch>
        <Route path="/admin_events/:id/edit">
          <EventAdminEditEvent />
        </Route>
        <Redirect to={`/admin_events/${data!.events[0].id}/edit`} />
      </Switch>
    );
  }

  return (
    <>
      <h1 className="mb-4">Event scheduling</h1>
      <ul className="nav nav-tabs">
        <li className="nav-item dropdown" role="presentation" ref={setMenuDropdown}>
          <button
            className="btn btn-link nav-link dropdown-toggle"
            onClick={() => {
              setMenuOpen((prevValue) => !prevValue);
            }}
            type="button"
          >
            Event categories
          </button>
          <div
            className={classNames('dropdown-menu m-0', { show: menuOpen })}
            style={styles.popper}
            ref={setMenu}
            {...attributes.popper}
          >
            {eventCategories.map((eventCategory) => (
              <NavLink
                className="dropdown-item"
                key={eventCategory.id}
                to={buildEventCategoryUrl(eventCategory) ?? '/admin_events'}
              >
                {eventCategory.name}{' '}
                <small className="text-muted">({humanize(eventCategory.scheduling_ui)})</small>
              </NavLink>
            ))}
          </div>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin_events/dropped_events">
            Dropped events
          </NavLink>
        </li>
      </ul>

      <Switch>
        <Route path={`/admin_events/:eventCategoryId(${eventCategoryIdRegexp})/new`}>
          <NewEvent />
        </Route>
        {eventCategories.map((eventCategory) => {
          const AdminComponent = adminComponentsBySchedulingUi[eventCategory.scheduling_ui];

          return (
            <Route key={eventCategory.id} path={buildEventCategoryUrl(eventCategory)}>
              <AdminComponent eventCategoryId={eventCategory.id} />
            </Route>
          );
        })}
        <Route path="/admin_events/:id/edit">
          <EventAdminEditEvent />
        </Route>
        <Route path="/admin_events/dropped_events">
          <DroppedEventAdmin />
        </Route>
        <Redirect to={buildEventCategoryUrl(eventCategories[0]) ?? '/admin_events'} />
      </Switch>
    </>
  );
}

export default EventAdmin;
