import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import PopperDropdown from '../UIComponents/PopperDropdown';

function NavigationSection({ item, location, renderNavigationItems }) {
  const dropdownRef = useRef(null);

  useEffect(
    () => {
      if (dropdownRef.current) {
        dropdownRef.current.setVisible(false);
      }
    },
    [location],
  );

  if (!item.items || item.items.length === 0) {
    return null;
  }

  return (
    <PopperDropdown
      ref={dropdownRef}
      renderReference={({ ref, toggle }) => (
        <li className="nav-item dropdown" role="presentation" ref={ref}>
          <button className="btn btn-link nav-link dropdown-toggle" onClick={toggle} type="button">{item.label}</button>
        </li>
      )}
      style={{ zIndex: 1100 }}
    >
      {renderNavigationItems(item.items)}
    </PopperDropdown>
  );
}

NavigationSection.propTypes = {
  item: PropTypes.shape({
    label: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  location: PropTypes.shape({}).isRequired,
  renderNavigationItems: PropTypes.func.isRequired,
};

export default withRouter(NavigationSection);
