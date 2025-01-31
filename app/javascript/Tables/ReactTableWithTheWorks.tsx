import React, { useState, useCallback, useEffect, useId } from 'react';
import classNames from 'classnames';
import { Column, Row, Table, flexRender } from '@tanstack/react-table';
import { parseIntOrNull } from '@neinteractiveliterature/litform';

import { UseReactTableWithTheWorksResult } from './useReactTableWithTheWorks';
import { GraphQLReactTableVariables } from './useGraphQLReactTable';
import { Trans, useTranslation } from 'react-i18next';
import max from 'lodash/max';
import styles from './tables.module.css';

function Resizer<TData, TValue>({
  table,
  column,
  resizeHandler,
}: {
  table: Table<TData>;
  column: Column<TData, TValue>;
  resizeHandler?: (e: React.SyntheticEvent) => void;
}) {
  const resizeHandlerWithStopPropagation = (e: React.SyntheticEvent) => {
    if (resizeHandler) {
      e.stopPropagation();
      resizeHandler(e);
    }
  };

  return (
    <div
      onDoubleClick={() => column.resetSize()}
      onMouseDown={resizeHandlerWithStopPropagation}
      onTouchStart={resizeHandlerWithStopPropagation}
      className={classNames(styles.resizer, table.options.columnResizeDirection === 'ltr' ? styles.ltr : styles.rtl, {
        [styles.isResizing]: column.getIsResizing(),
      })}
      style={{
        transform:
          table.options.columnResizeMode === 'onEnd' && column.getIsResizing()
            ? `translateX(${
                (table.options.columnResizeDirection === 'rtl' ? -1 : 1) *
                (table.getState().columnSizingInfo.deltaOffset ?? 0)
              }px)`
            : '',
      }}
    />
  );
}

export type FilterRenderer<TData> = <TValue>(props: { column: Column<TData, TValue> }) => React.ReactNode;

export type ReactTableWithTheWorksProps<
  QueryData,
  RowType extends Record<string, unknown>,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables,
> = Pick<UseReactTableWithTheWorksResult<QueryData, RowType, Variables>, 'table' | 'loading'> & {
  renderFilter?: FilterRenderer<RowType>;
  onClickRow?: React.Dispatch<Row<RowType>>;
};

function ReactTableWithTheWorks<
  QueryData,
  RowType extends Record<string, unknown>,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables,
>({
  table,
  loading,
  onClickRow,
  renderFilter,
}: ReactTableWithTheWorksProps<QueryData, RowType, Variables>): JSX.Element {
  const { previousPage, nextPage, setPageSize, setPageIndex } = table;
  const { pagination } = table.getState();

  const { t } = useTranslation();
  const [pageInputValue, setPageInputValue] = useState<string>(() => (pagination.pageIndex + 1).toString());
  const pageInputId = useId();

  const pageInputChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPageInputValue(event.target.value);
      const parsedPage = parseIntOrNull(event.target.value);
      if (parsedPage != null) {
        setPageIndex(parsedPage - 1);
      }
    },
    [setPageIndex],
  );

  useEffect(() => {
    setPageInputValue((pagination.pageIndex + 1).toString());
  }, [pagination.pageIndex]);

  const rowModel = table.getRowModel();

  return (
    <div className="mb-3 border">
      <table
        className={classNames('table react-table table-striped table-highlight table-borderless mb-0', {
          'table-hover': onClickRow != null,
        })}
      >
        <thead className="thead">
          {table.getHeaderGroups().map((headerGroup) => (
            <React.Fragment key={headerGroup.id}>
              <tr>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-bottom py-1 align-middle  position-relative"
                    style={{ width: header.getSize() }}
                  >
                    {header.column.getCanSort() ? (
                      <button
                        type="button"
                        className="btn btn-unstyled p-0 fw-bold w-100 text-start"
                        onClick={() => header.column.toggleSorting()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() && <>&nbsp;{header.column.getIsSorted() === 'desc' ? '▾' : '▴'}</>}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                    {header.index < headerGroup.headers.length - 1 && (
                      <Resizer column={header.column} table={table} resizeHandler={header.getResizeHandler()} />
                    )}
                  </th>
                ))}
              </tr>
              {renderFilter && headerGroup.headers.some((header) => header.column.getCanFilter()) && (
                <tr key={`filter-${headerGroup.id}`} className="glow-inset-medium-light">
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        className="py-1 border-bottom fw-normal align-middle position-relative overflow-visible"
                      >
                        {header.column.getCanFilter() && renderFilter({ column: header.column })}
                        {header.index < headerGroup.headers.length - 1 && (
                          <Resizer column={header.column} table={table} resizeHandler={header.getResizeHandler()} />
                        )}
                      </th>
                    );
                  })}
                </tr>
              )}
            </React.Fragment>
          ))}
        </thead>
        <tbody style={{ opacity: loading ? 0.3 : 1.0, transition: 'opacity 0.5s' }}>
          {loading && rowModel.rows.length === 0
            ? [...Array(pagination.pageSize)].map((value, index) => (
                <tr key={index} role="row" aria-hidden>
                  <td>&nbsp;</td>
                </tr>
              ))
            : rowModel.rows.map((row: Row<RowType>) => {
                return (
                  <tr
                    key={row.id}
                    style={{ minWidth: 'max-content', ...(onClickRow ? { cursor: 'pointer' } : {}) }}
                    onClick={onClickRow ? () => onClickRow(row) : undefined}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          key={cell.id}
                          style={{
                            position: 'relative',
                            overflow: 'hidden',
                            width: cell.column.getSize(),
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
        </tbody>
        <tfoot className="tfoot">
          <tr className="border-top p-1">
            <td colSpan={max(table.getHeaderGroups().map((headerGroup) => headerGroup.headers.length))}>
              <div className="d-flex justify-content-between align-items-center">
                <button
                  type="button"
                  onClick={() => previousPage()}
                  className="btn btn-outline-secondary col-3 me-2"
                  disabled={!table.getCanPreviousPage()}
                >
                  <i className="bi-chevron-left" /> {t('tables.pagination.previous')}
                </button>
                <div className="text-nowrap">
                  <Trans i18nKey="tables.pagination.pageSelector" values={{ totalPages: table.getPageCount() }}>
                    <label className="form-label" htmlFor={pageInputId}>
                      Page
                    </label>{' '}
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <input
                      className="form-control form-control-sm d-inline"
                      style={{ width: '5rem' }}
                      id={pageInputId}
                      type="number"
                      value={pageInputValue}
                      onChange={pageInputChanged}
                    />{' '}
                    of {{ totalPages: table.getPageCount() }}
                  </Trans>
                </div>
                <div>
                  <select
                    className="form-select"
                    value={pagination.pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                    }}
                  >
                    {[5, 10, 20, 25, 50, 100].map((count) => (
                      <option key={count} value={count}>
                        {t('tables.pagination.rowCount', { count })}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-secondary col-3 ms-2"
                  onClick={() => nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {t('tables.pagination.next')} <i className="bi-chevron-right" />
                </button>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default ReactTableWithTheWorks;
