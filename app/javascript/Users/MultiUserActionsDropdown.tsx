import React from 'react';

import { DropdownMenu } from '../UIComponents/DropdownMenu';

export type MultiUserActionsDropdownProps = {
  selectedUserIds: Set<number>;
  onClickMerge: () => void;
};

function MultiUserActionsDropdown({
  selectedUserIds,
  onClickMerge,
}: MultiUserActionsDropdownProps) {
  return (
    <DropdownMenu buttonClassName="btn btn-outline-primary dropdown-toggle" buttonContent="Actions">
      <button
        type="button"
        className="dropdown-item"
        disabled={selectedUserIds.size < 2}
        onClick={onClickMerge}
      >
        Merge users
      </button>
    </DropdownMenu>
  );
}

export default MultiUserActionsDropdown;
