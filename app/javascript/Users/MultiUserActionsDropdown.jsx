import React from 'react';
import PropTypes from 'prop-types';

import { DropdownMenu } from '../UIComponents/DropdownMenu';

function MultiUserActionsDropdown({ selectedUserIds, onClickMerge }) {
  return (
    <DropdownMenu buttonClassName="btn btn-outline-primary dropdown-toggle" buttonContent="Actions">
      <button
        type="button"
        className="dropdown-item"
        disabled={selectedUserIds.length < 2}
        onClick={onClickMerge}
      >
        Merge users
      </button>
    </DropdownMenu>
  );
}

MultiUserActionsDropdown.propTypes = {
  onClickMerge: PropTypes.func.isRequired,
  selectedUserIds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default MultiUserActionsDropdown;
