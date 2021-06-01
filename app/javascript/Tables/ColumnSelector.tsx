import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Column } from 'react-table';
import { ChoiceSet } from '@neinteractiveliterature/litform';

import { DropdownMenu } from '../UIComponents/DropdownMenu';

export type ColumnSelectorProps<RowType extends object> = {
  alwaysVisibleColumns: string[];
  possibleColumns: Column<RowType>[];
  visibleColumnIds: string[];
  setVisibleColumnIds: React.Dispatch<string[]>;
};

function ColumnSelector<RowType extends object>({
  alwaysVisibleColumns,
  possibleColumns,
  visibleColumnIds,
  setVisibleColumnIds,
}: ColumnSelectorProps<RowType>) {
  const { t } = useTranslation();
  const renderHiddenColumnCount = () => {
    const count =
      possibleColumns.length -
      visibleColumnIds.filter((columnId) => !alwaysVisibleColumns.includes(columnId)).length -
      alwaysVisibleColumns.length;

    if (count <= 0) {
      return null;
    }

    return (
      <>
        {' '}
        <span className="badge bg-primary">{count}</span>
      </>
    );
  };

  return (
    <DropdownMenu
      buttonClassName="btn btn-outline-primary dropdown-toggle"
      popperOptions={{ placement: 'bottom-end' }}
      buttonContent={
        <>
          {t('tables.columnSelectorButton', 'Columns')}
          {renderHiddenColumnCount()}
        </>
      }
      dropdownClassName="px-2"
    >
      <ChoiceSet
        name="columns"
        multiple
        choices={possibleColumns
          .filter((column) => column.id != null && !alwaysVisibleColumns.includes(column.id))
          .map((column) => ({ label: column.Header, value: column.id! }))}
        value={visibleColumnIds}
        onChange={setVisibleColumnIds}
      />
    </DropdownMenu>
  );
}

export default ColumnSelector;
