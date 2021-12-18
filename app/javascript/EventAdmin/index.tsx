import { useEffect, useMemo, useState } from 'react';
import { NavLink, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { LoadQueryWrapper, useLitformPopperWithAutoClosing } from '@neinteractiveliterature/litform';

import DroppedEventAdmin from './DroppedEventAdmin';
import EventAdminEditEvent from './EventAdminEditEvent';
import EventAdminRunsTable from './EventAdminRunsTable';
import NewEvent from './NewEvent';
import RecurringEventAdmin from './RecurringEventAdmin';
import sortEventCategories from './sortEventCategories';
import buildEventCategoryUrl, { buildEventCategoryUrlPortion } from './buildEventCategoryUrl';
import SingleRunEventAdminList from './SingleRunEventAdminList';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { useEventAdminEventsQuery } from './queries.generated';
import humanize from '../humanize';

const adminComponentsBySchedulingUi = {
  regular: EventAdminRunsTable,
  recurring: RecurringEventAdmin,
  single_run: SingleRunEventAdminList,
};

export default LoadQueryWrapper(useEventAdminEventsQuery, function EventAdmin({ data }) {
  const authorizationWarning = useAuthorizationRequired('can_manage_runs');
  const location = useLocation();

  const eventCategories = useMemo(() => sortEventCategories(data.convention.event_categories), [data]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [menu, setMenu] = useState<HTMLDivElement | null>(null);
  const [menuDropdown, setMenuDropdown] = useState<HTMLLIElement | null>(null);

  const { styles, attributes } = useLitformPopperWithAutoClosing(menu, menuDropdown, undefined, setMenuOpen, {
    placement: 'bottom-start',
    modifiers: [{ name: 'offset', options: { offset: [0, 2] } }],
  });

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  if (authorizationWarning) return authorizationWarning;

  if (data.convention.site_mode === 'single_event') {
    if (data.convention.events.length === 0) {
      return (
        <Routes>
          <Route path="new" element={<NewEvent />} />
          <Route path="" element={<Navigate to="./new" replace />} />
        </Routes>
      );
    }

    return (
      <Routes>
        <Route path=":id/edit" element={<EventAdminEditEvent />} />
        <Route path="" element={<Navigate to={`./${data.convention.events[0].id}/edit`} replace />} />
      </Routes>
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
                {eventCategory.name} <small className="text-muted">({humanize(eventCategory.scheduling_ui)})</small>
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

      <Routes>
        <Route path={`:eventCategoryId/new`} element={<NewEvent />} />
        {eventCategories.map((eventCategory) => {
          const AdminComponent = adminComponentsBySchedulingUi[eventCategory.scheduling_ui];

          return (
            <Route
              key={eventCategory.id}
              path={`${buildEventCategoryUrlPortion(eventCategory)}/*`}
              element={<AdminComponent eventCategoryId={eventCategory.id} />}
            />
          );
        })}
        <Route path=":id/edit" element={<EventAdminEditEvent />} />
        <Route path="dropped_events" element={<DroppedEventAdmin />} />
        {eventCategories.length > 0 && (
          <Route path="" element={<Navigate to={buildEventCategoryUrl(eventCategories[0])} replace />} />
        )}
      </Routes>
    </>
  );
});
