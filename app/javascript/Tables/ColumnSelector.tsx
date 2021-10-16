import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Column } from 'react-table';
import { ChoiceSet } from '@neinteractiveliterature/litform';

import { DropdownMenu } from '../UIComponents/DropdownMenu';
import { notEmpty } from '@neinteractiveliterature/litform/lib/ValueUtils';

export type ColumnSelectorProps<RowType extends Record<string, unknown>> = {
  alwaysVisibleColumns: string[];
  possibleColumns: Column<RowType>[];
  visibleColumnIds: string[];
  setVisibleColumnIds: React.Dispatch<string[]>;
};

function ColumnSelector<RowType extends Record<string, unknown>>({
  alwaysVisibleColumns,
  possibleColumns,
  visibleColumnIds,
  setVisibleColumnIds,
}: ColumnSelectorProps<RowType>): JSX.Element {
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
          .map((column) =>
            column.id != null ? { label: column.Header, value: column.id } : undefined,
          )
          .filter(notEmpty)}
        value={visibleColumnIds}
        onChange={setVisibleColumnIds}
      />
    </DropdownMenu>
  );
}

export default ColumnSelector;
