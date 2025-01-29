import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ColumnDef, TableState } from '@tanstack/react-table';
import { ChoiceSet, notEmpty } from '@neinteractiveliterature/litform';

import { DropdownMenu } from '../UIComponents/DropdownMenu';
import { useMemo } from 'react';

export type ColumnSelectorProps<TData> = {
  alwaysVisibleColumns: string[];
  possibleColumns: ColumnDef<TData>[];
  columnVisibility: TableState['columnVisibility'];
  setColumnVisibility: React.Dispatch<React.SetStateAction<TableState['columnVisibility']>>;
};

function ColumnSelector<TData>({
  alwaysVisibleColumns,
  possibleColumns,
  columnVisibility,
  setColumnVisibility,
}: ColumnSelectorProps<TData>): JSX.Element {
  const { t } = useTranslation();

  const selectableColumns = useMemo(
    () => possibleColumns.filter((column) => column.id != null && !alwaysVisibleColumns.includes(column.id)),
    [possibleColumns, alwaysVisibleColumns],
  );

  const renderHiddenColumnCount = () => {
    const count = Object.values(columnVisibility).filter((visible) => !visible).length;

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

  const visibleColumnIds = useMemo(() => {
    return Object.entries(columnVisibility).reduce((acc, [id, visible]) => {
      if (visible) {
        return [...acc, id];
      } else {
        return acc;
      }
    }, []);
  }, [columnVisibility]);

  const setVisibleColumnIds = (visibleColumnIds: string[]) => {
    const visibleColumnIdsSet = new Set(visibleColumnIds);
    setColumnVisibility(
      possibleColumns.reduce((acc, column) => {
        if (column.id) {
          return { ...acc, [column.id]: visibleColumnIdsSet.has(column.id) };
        } else {
          return acc;
        }
      }, {}),
    );
  };

  return (
    <DropdownMenu
      buttonClassName="btn btn-outline-primary dropdown-toggle"
      popperOptions={{ placement: 'bottom-end' }}
      buttonContent={
        <>
          {t('tables.columnSelectorButton')}
          {renderHiddenColumnCount()}
        </>
      }
      dropdownClassName="px-2"
      shouldAutoCloseOnNavigate={() => false}
    >
      <ChoiceSet
        name="columns"
        multiple
        choices={selectableColumns
          .map((column) => (column.id != null ? { label: <>{column.header}</>, value: column.id } : undefined))
          .filter(notEmpty)}
        value={visibleColumnIds}
        onChange={setVisibleColumnIds}
      />
    </DropdownMenu>
  );
}

export default ColumnSelector;
