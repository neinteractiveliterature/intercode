import { NavLink } from 'react-router';

export default function EventCatalogNavTabs() {
  return (
    <ul className="nav nav-tabs mb-3">
      <li className="nav-item">
        <NavLink to="/events" end className="nav-link">
          List view
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/events/table" className="nav-link">
          Table view
        </NavLink>
      </li>
    </ul>
  );
}
