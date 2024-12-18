import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, Outlet } from 'react-router';
import classNames from 'classnames';
import { useLitformPopperWithAutoClosing } from '@neinteractiveliterature/litform';

import sortEventCategories from './sortEventCategories';
import buildEventCategoryUrl from './buildEventCategoryUrl';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import humanize from '../humanize';
import { Route } from './+types/index';
import { EventAdminRootQueryDocument } from './queries.generated';

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.client.query({ query: EventAdminRootQueryDocument });
  return data;
}

function EventAdmin({ loaderData: data }: Route.ComponentProps) {
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

      <Outlet />
    </>
  );
}

export default EventAdmin;
