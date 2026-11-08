import { type RowData } from '@tanstack/react-table';
import { type AppCellContext, type AppColumnHelper, type AppHeaderContext } from './tableFeatures';
import IndeterminateCheckbox from './IndeterminateCheckbox';
import { useTranslation } from 'react-i18next';

export function RowSelectHeader<TData extends RowData, TValue>({ table }: AppHeaderContext<TData, TValue>) {
  const { t } = useTranslation();

  const toggleAllSelected = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    table.toggleAllRowsSelected();
  };

  return (
    <div className="cursor-auto" onClick={toggleAllSelected}>
      <IndeterminateCheckbox
        aria-label={t('tables.rowSelection.selectAllRows')}
        className="cursor-pointer"
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={toggleAllSelected}
        onClick={(event) => {
          event.stopPropagation();
        }}
      />
    </div>
  );
}

export function RowSelectCell<TData extends RowData, TValue>({ row }: AppCellContext<TData, TValue>) {
  const { t } = useTranslation();

  const toggleSelected = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    row.toggleSelected();
  };

  return (
    <div className="cursor-auto" onClick={toggleSelected}>
      <IndeterminateCheckbox
        aria-label={t('tables.rowSelection.selectRow')}
        className="cursor-pointer"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        indeterminate={row.getIsSomeSelected()}
        onChange={toggleSelected}
        value={row.id}
        onClick={(event) => {
          event.stopPropagation();
        }}
      />
    </div>
  );
}

export function buildRowSelectColumn<TData extends RowData>(columnHelper: AppColumnHelper<TData>) {
  return columnHelper.display({
    id: '_rowSelect',
    size: 20,
    header: RowSelectHeader,
    cell: RowSelectCell,
  });
}
