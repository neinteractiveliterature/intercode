import React, { useMemo } from 'react';
import {
  NavLink, Route, Switch, Redirect,
} from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { humanize } from 'inflected';
import DroppedEventAdmin from './DroppedEventAdmin';
import EventAdminEditEvent from './EventAdminEditEvent';
import { EventAdminEventsQuery } from './queries.gql';
import EventAdminRunsTable from './EventAdminRunsTable';
import NewEvent from './NewEvent';
import RecurringEventAdmin from './RecurringEventAdmin';
import ErrorDisplay from '../ErrorDisplay';
import sortEventCategories from './sortEventCategories';
import PopperDropdown from '../UIComponents/PopperDropdown';
import buildEventCategoryUrl from './buildEventCategoryUrl';
import useAutoClosingDropdownRef from '../NavigationBar/useAutoClosingDropdownRef';
import SingleRunEventAdminList from './SingleRunEventAdminList';
import PageLoadingIndicator from '../PageLoadingIndicator';

const eventCategoryIdRegexp = '[0-9a-z\\-]+';

const adminComponentsBySchedulingUi = {
  regular: EventAdminRunsTable,
  recurring: RecurringEventAdmin,
  single_run: SingleRunEventAdminList,
};

function EventAdmin() {
  const { data, loading, error } = useQuery(EventAdminEventsQuery);

  const eventCategories = useMemo(
    () => ((loading || error) ? null : sortEventCategories(data.convention.event_categories)),
    [data, loading, error],
  );

  const dropdownRef = useAutoClosingDropdownRef();

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (!data.currentAbility.can_manage_runs) {
    return <Redirect to="/" />;
  }

  if (data.convention.site_mode === 'single_event') {
    if (data.events.length === 0) {
      return (
        <Switch>
          <Route path="/admin_events/new"><NewEvent /></Route>
          <Redirect to="/admin_events/new" />
        </Switch>
      );
    }

    return (
      <Switch>
        <Route path="/admin_events/:id/edit"><EventAdminEditEvent /></Route>
        <Redirect to={`/admin_events/${data.events[0].id}/edit`} />
      </Switch>
    );
  }

  return (
    <>
      <h1 className="mb-4">Event scheduling</h1>
      <ul className="nav nav-tabs">
        <PopperDropdown
          ref={dropdownRef}
          renderReference={({ ref, toggle }) => (
            <li className="nav-item dropdown" role="presentation" ref={ref}>
              <button className="btn btn-link nav-link dropdown-toggle" onClick={toggle} type="button">
                Event categories
              </button>
            </li>
          )}
        >
          {eventCategories.map((eventCategory) => (
            <NavLink className="dropdown-item" key={eventCategory.id} to={buildEventCategoryUrl(eventCategory)}>
              {eventCategory.name}
              {' '}
              <small className="text-muted">
                (
                {humanize(eventCategory.scheduling_ui)}
                )
              </small>
            </NavLink>
          ))}
        </PopperDropdown>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin_events/dropped_events">Dropped events</NavLink>
        </li>
      </ul>

      <Switch>
        <Route path={`/admin_events/:eventCategoryId(${eventCategoryIdRegexp})/new`}><NewEvent /></Route>
        {eventCategories.map((eventCategory) => {
          const AdminComponent = adminComponentsBySchedulingUi[eventCategory.scheduling_ui];

          return (
            <Route key={eventCategory.id} path={buildEventCategoryUrl(eventCategory)}>
              <AdminComponent eventCategoryId={eventCategory.id} />
            </Route>
          );
        })}
        <Route path="/admin_events/:id/edit"><EventAdminEditEvent /></Route>
        <Route path="/admin_events/dropped_events"><DroppedEventAdmin /></Route>
        <Redirect to={buildEventCategoryUrl(eventCategories[0])} />
      </Switch>
    </>
  );
}

export default EventAdmin;
