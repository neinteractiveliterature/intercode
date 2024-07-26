import React, { useState, useCallback, useEffect, HTMLAttributes, useId } from 'react';
import classNames from 'classnames';
import { ColumnInstance, Row, UseRowSelectRowProps } from 'react-table';
import { parseIntOrNull } from '@neinteractiveliterature/litform';

import { UseReactTableWithTheWorksResult } from './useReactTableWithTheWorks';
import { GraphQLReactTableVariables } from './useGraphQLReactTable';
import { Trans, useTranslation } from 'react-i18next';

function mergeProps<T extends HTMLAttributes<unknown>>(...propSets: T[]) {
  return propSets.reduce((acc, props) =>
    Object.entries(props).reduce((currentProps, [key, value]) => {
      if (key === 'className') {
        return { ...currentProps, [key]: classNames(currentProps[key], value) };
      }

      if (key === 'style') {
        return { ...currentProps, [key]: { ...currentProps[key], ...value } };
      }

      return { ...currentProps, [key]: value };
    }, acc),
  );
}

function Resizer<RowType extends Record<string, unknown>>({ column }: { column: ColumnInstance<RowType> }) {
  return <div {...column.getResizerProps()} className={`resizer ${column.isResizing ? 'isResizing' : ''}`} />;
}

export type ReactTableWithTheWorksProps<
  QueryData,
  RowType extends Record<string, unknown>,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables,
> = Pick<UseReactTableWithTheWorksResult<QueryData, RowType, Variables>, 'tableInstance' | 'loading'> & {
  onClickRow?: React.Dispatch<Row<RowType>>;
};

function ReactTableWithTheWorks<
  QueryData,
  RowType extends Record<string, unknown>,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables,
>({ tableInstance, loading, onClickRow }: ReactTableWithTheWorksProps<QueryData, RowType, Variables>): JSX.Element {
  const {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    rows,
    prepareRow,
    gotoPage,
    previousPage,
    canPreviousPage,
    nextPage,
    canNextPage,
    pageOptions,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  const { t } = useTranslation();
  const [pageInputValue, setPageInputValue] = useState<string>(() => (pageIndex + 1).toString());
  const pageInputId = useId();

  const pageInputChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPageInputValue(event.target.value);
      const parsedPage = parseIntOrNull(event.target.value);
      if (parsedPage != null) {
        gotoPage(parsedPage - 1);
      }
    },
    [gotoPage],
  );

  useEffect(() => {
    setPageInputValue((pageIndex + 1).toString());
  }, [pageIndex]);

  return (
    <div className="mb-3 border">
      <div
        {...mergeProps(getTableProps(), {
          className: classNames('table react-table table-striped table-highlight table-borderless mb-0', {
            'table-hover': onClickRow != null,
          }),
        })}
      >
        <div className="thead">
          {headerGroups.map((headerGroup) => (
            <React.Fragment key={headerGroup.getHeaderGroupProps().key}>
              <div {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  const headerProps = column.getHeaderProps();
                  return (
                    <div
                      key={headerProps.key}
                      {...mergeProps<HTMLAttributes<HTMLDivElement>>(headerProps, {
                        className: 'border-bottom py-1 align-middle',
                      })}
                    >
                      {column.canSort ? (
                        <button
                          type="button"
                          className="btn btn-unstyled p-0 fw-bold w-100 text-start"
                          onClick={() => column.toggleSortBy()}
                        >
                          {column.render('Header')}
                          {column.isSorted && <>&nbsp;{column.isSortedDesc ? '▾' : '▴'}</>}
                        </button>
                      ) : (
                        column.render('Header')
                      )}
                      <Resizer column={column} />
                    </div>
                  );
                })}
              </div>
              {headerGroup.headers.some((column) => column.canFilter && column.Filter) && (
                <div
                  {...mergeProps(headerGroup.getHeaderGroupProps(), {
                    key: `filter-${headerGroup.getHeaderGroupProps().key}`,
                    className: 'glow-inset-medium-light',
                  })}
                >
                  {headerGroup.headers.map((column) => {
                    const headerProps = column.getHeaderProps();
                    return (
                      <div
                        key={headerProps.key}
                        {...mergeProps<HTMLAttributes<HTMLDivElement>>(headerProps, {
                          className: 'py-1 border-bottom fw-normal align-middle',
                          style: { overflow: 'visible' },
                        })}
                      >
                        {column.canFilter && column.Filter && column.render('Filter')}
                        <Resizer column={column} />
                      </div>
                    );
                  })}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div
          {...mergeProps(getTableBodyProps(), {
            style: { opacity: loading ? 0.3 : 1.0, transition: 'opacity 0.5s' },
          })}
        >
          {loading && rows.length === 0
            ? [...Array(pageSize)].map((value, index) => (
                <div key={index} role="row" aria-hidden>
                  <div>&nbsp;</div>
                </div>
              ))
            : rows.map((row: Row<RowType> & UseRowSelectRowProps<RowType>) => {
                prepareRow(row);
                const rowProps = row.getRowProps();
                return (
                  <div
                    key={rowProps.key}
                    {...mergeProps<HTMLAttributes<HTMLDivElement>>(
                      rowProps,
                      { style: { minWidth: 'max-content' } },
                      onClickRow
                        ? {
                            style: { cursor: 'pointer' },
                            onClick: () => onClickRow(row),
                          }
                        : {},
                    )}
                  >
                    {row.cells.map((cell) => {
                      const cellProps = cell.getCellProps();
                      return (
                        <div
                          key={cellProps.key}
                          {...mergeProps<HTMLAttributes<HTMLDivElement>>(
                            cellProps,
                            {
                              style: { position: 'relative', overflow: 'hidden' },
                            },
                            cell.column.id === '_selected'
                              ? {
                                  onClick: (event) => {
                                    event.stopPropagation();
                                    row.toggleRowSelected(!row.isSelected);
                                  },
                                }
                              : {},
                          )}
                        >
                          {cell.render('Cell')}
                          <Resizer column={cell.column} />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
        </div>
      </div>
      <div className="tfoot">
        <div className="border-top p-1">
          <div className="d-flex justify-content-between align-items-center">
            <button
              type="button"
              onClick={() => previousPage()}
              className="btn btn-outline-secondary col-3 me-2"
              disabled={!canPreviousPage}
            >
              <i className="bi-chevron-left" /> {t('tables.pagination.previous')}
            </button>
            <div className="text-nowrap">
              <Trans i18nKey="tables.pagination.pageSelector" values={{ totalPages: pageOptions.length }}>
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
                of {{ totalPages: pageOptions.length }}
              </Trans>
            </div>
            <div>
              <select
                className="form-select"
                value={pageSize}
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
              disabled={!canNextPage}
            >
              {t('tables.pagination.next')} <i className="bi-chevron-right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReactTableWithTheWorks;
