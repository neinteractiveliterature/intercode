import { DropdownMenu } from '../UIComponents/DropdownMenu';

export type MultiUserActionsDropdownProps = {
  selectedUserIds: number[];
  onClickMerge: (userIds: number[]) => void;
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
        disabled={selectedUserIds.length < 2}
        onClick={() => onClickMerge(selectedUserIds)}
      >
        Merge users
      </button>
    </DropdownMenu>
  );
}

export default MultiUserActionsDropdown;
