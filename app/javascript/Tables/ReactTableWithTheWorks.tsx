import React, { useState, useCallback, useEffect, HTMLAttributes } from 'react';
import classNames from 'classnames';
import { ColumnInstance, Row } from 'react-table';

import { UseReactTableWithTheWorksResult } from './useReactTableWithTheWorks';
import { GraphQLReactTableVariables } from './useGraphQLReactTable';
import useUniqueId from '../useUniqueId';
import { parseIntOrNull } from '../ValueUtils';

function mergeProps<T extends HTMLAttributes<any>>(...propSets: T[]) {
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

function Resizer<RowType extends object>({ column }: { column: ColumnInstance<RowType> }) {
  return (
    <div
      {...column.getResizerProps()}
      className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
    />
  );
}

export type ReactTableWithTheWorksProps<
  QueryData,
  RowType extends object,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables
> = Pick<
  UseReactTableWithTheWorksResult<QueryData, RowType, Variables>,
  'tableInstance' | 'loading'
> & {
  onClickRow?: React.Dispatch<Row<RowType>>;
};

function ReactTableWithTheWorks<
  QueryData,
  RowType extends object,
  Variables extends GraphQLReactTableVariables = GraphQLReactTableVariables
>({
  tableInstance,
  loading,
  onClickRow,
}: ReactTableWithTheWorksProps<QueryData, RowType, Variables>) {
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

  const [pageInputValue, setPageInputValue] = useState<string>(() => (pageIndex + 1).toString());
  const pageInputId = useUniqueId('page-');

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
          className: classNames(
            'table react-table table-striped table-highlight table-borderless mb-0',
            { 'table-hover': onClickRow != null },
          ),
        })}
      >
        <div className="thead">
          {headerGroups.map((headerGroup) => (
            <React.Fragment key={headerGroup.getHeaderGroupProps().key}>
              <div {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <div
                    {...mergeProps<HTMLAttributes<HTMLDivElement>>(column.getHeaderProps(), {
                      className: 'border-bottom py-1 align-middle',
                    })}
                  >
                    {column.canSort ? (
                      <button
                        type="button"
                        className="btn btn-unstyled p-0 font-weight-bold w-100 text-left"
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
                ))}
              </div>
              {headerGroup.headers.some((column) => column.canFilter && column.Filter) && (
                <div
                  {...mergeProps(headerGroup.getHeaderGroupProps(), {
                    key: `filter-${headerGroup.getHeaderGroupProps().key}`,
                    className: 'glow-inset-medium-light',
                  })}
                >
                  {headerGroup.headers.map((column) => (
                    <div
                      {...mergeProps<HTMLAttributes<HTMLDivElement>>(column.getHeaderProps(), {
                        className: 'py-1 border-bottom font-weight-normal align-middle',
                        style: { overflow: 'visible' },
                      })}
                    >
                      {column.canFilter && column.Filter && column.render('Filter')}
                      <Resizer column={column} />
                    </div>
                  ))}
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
                // eslint-disable-next-line react/no-array-index-key
                <div key={index} role="row">
                  <div>&nbsp;</div>
                </div>
              ))
            : rows.map((row) => {
                prepareRow(row);
                return (
                  <div
                    {...mergeProps<HTMLAttributes<HTMLDivElement>>(
                      row.getRowProps(),
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
                      return (
                        <div
                          {...mergeProps<HTMLAttributes<HTMLDivElement>>(
                            cell.getCellProps(),
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
              className="btn btn-outline-secondary col-3 mr-2"
              disabled={!canPreviousPage}
            >
              <i className="fa fa-chevron-left" /> Previous
            </button>
            <div>
              <label htmlFor={pageInputId}>Page&nbsp;</label>
              {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
              <input
                className="form-control form-control-sm d-inline"
                style={{ width: '5rem' }}
                id={pageInputId}
                type="number"
                value={pageInputValue}
                onChange={pageInputChanged}
              />
              &nbsp;of {pageOptions.length}
            </div>
            <div>
              <select
                className="custom-select"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[5, 10, 20, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size} rows
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="btn btn-outline-secondary col-3 ml-2"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              Next <i className="fa fa-chevron-right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReactTableWithTheWorks;
