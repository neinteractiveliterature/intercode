import React from 'react';
import PropTypes from 'prop-types';

import PopperDropdown from '../UIComponents/PopperDropdown';

function MultiUserActionsDropdown({ selectedUserIds, onClickMerge }) {
  return (
    <PopperDropdown
      renderReference={({ ref, toggle }) => (
        <button type="button" className="btn btn-outline-primary dropdown-toggle" ref={ref} onClick={toggle}>
          Actions
        </button>
      )}
    >
      <button
        type="button"
        className="dropdown-item"
        disabled={selectedUserIds.length < 2}
        onClick={onClickMerge}
      >
        Merge users
      </button>
    </PopperDropdown>
  );
}

MultiUserActionsDropdown.propTypes = {
  onClickMerge: PropTypes.func.isRequired,
  selectedUserIds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default MultiUserActionsDropdown;
