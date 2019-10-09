import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import PopperDropdown from '../UIComponents/PopperDropdown';
import useAutoClosingDropdownRef from './useAutoClosingDropdownRef';

function NavigationSection({ children, label, location }) {
  const dropdownRef = useAutoClosingDropdownRef(location);

  return (
    <PopperDropdown
      ref={dropdownRef}
      renderReference={({ ref, toggle }) => (
        <li className="nav-item dropdown" role="presentation" ref={ref}>
          <button className="btn btn-link nav-link dropdown-toggle" onClick={toggle} type="button">{label}</button>
        </li>
      )}
      style={{ zIndex: 1100 }}
    >
      {children}
    </PopperDropdown>
  );
}

NavigationSection.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  location: PropTypes.shape({}).isRequired,
};

export default withRouter(NavigationSection);
