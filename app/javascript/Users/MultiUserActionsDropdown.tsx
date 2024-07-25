import { useTranslation } from 'react-i18next';
import { DropdownMenu } from '../UIComponents/DropdownMenu';

export type MultiUserActionsDropdownProps = {
  selectedUserIds: string[];
  onClickMerge: (userIds: string[]) => void;
};

function MultiUserActionsDropdown({ selectedUserIds, onClickMerge }: MultiUserActionsDropdownProps): JSX.Element {
  const { t } = useTranslation();
  return (
    <DropdownMenu buttonClassName="btn btn-outline-primary dropdown-toggle" buttonContent="Actions">
      <button
        type="button"
        className="dropdown-item"
        disabled={selectedUserIds.length < 2}
        onClick={() => onClickMerge(selectedUserIds)}
      >
        {t('admin.users.table.mergeUsersAction')}
      </button>
    </DropdownMenu>
  );
}

export default MultiUserActionsDropdown;
