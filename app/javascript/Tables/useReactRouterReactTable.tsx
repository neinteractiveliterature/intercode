import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Filter, SortingRule } from 'react-table';
import { FieldFilterCodecs } from './FilterUtils';

export type UseReactRouterReactTableOptions = FieldFilterCodecs & {
  onPageChange?: (newPage: number) => void;
  onFilteredChange?: (newFiltered: Filter[]) => void;
  onSortedChange?: (newSorted: SortingRule[]) => void;
};

export type ReactRouterReactTableState = {
  page: number;
  filtered: Filter[];
  sorted: SortingRule[];
};

export default function useReactRouterReactTable({
  encodeFilterValue,
  decodeFilterValue,
  onPageChange,
  onFilteredChange,
  onSortedChange,
}: UseReactRouterReactTableOptions) {
  const history = useHistory();
  const encode = encodeFilterValue || ((field, value) => value);
  const decode = decodeFilterValue || ((field, value) => value);

  const decodeSearchParams = useCallback(
    (search: string) => {
      const state: ReactRouterReactTableState = {
        page: 0,
        filtered: [],
        sorted: [],
      };

      const params = new URLSearchParams(search);

      Array.from(params.entries()).forEach(([key, value]) => {
        if (key === 'page') {
          state.page = Number.parseInt(value, 10) - 1;
          return;
        }

        const filterMatch = key.match(/^filters\.(.*)$/);
        if (filterMatch) {
          const filterValue = decode(filterMatch[1], value);
          if (filterValue != null) {
            state.filtered.push({
              id: filterMatch[1],
              value: filterValue,
            });
          }
          return;
        }

        const sortMatch = key.match(/^sort\.(.*)$/);
        if (sortMatch) {
          state.sorted.push({ id: sortMatch[1], desc: value === 'desc' });
        }
      });

      return state;
    },
    [decode],
  );

  const encodeSearchParams = useCallback(
    ({ page, filtered, sorted }: ReactRouterReactTableState, existingQuery: string) => {
      const params = new URLSearchParams(existingQuery);

      if (page != null) {
        params.set('page', (page + 1).toString());
      }

      // remove existing filters and sorts rather than just adding on
      [...params.keys()].forEach((key) => {
        if (key.startsWith('filters.') || key.startsWith('sort.')) {
          params.delete(key);
        }
      });

      filtered.forEach(({ id, value }) => {
        const encoded = encode(id, value);
        if (encoded != null) {
          params.set(`filters.${id}`, encoded);
        } else {
          params.delete(`filters.${id}`);
        }
      });

      sorted.forEach(({ id, desc }) => {
        params.set(`sort.${id}`, desc ? 'desc' : 'asc');
      });

      return params.toString();
    },
    [encode],
  );

  const updateSearch = useCallback(
    (newState: Partial<ReactRouterReactTableState>) => {
      const oldState = decodeSearchParams(history.location.search);
      const newSearch = encodeSearchParams({ ...oldState, ...newState }, history.location.search);
      history.replace(`${history.location.pathname}?${newSearch}`);
    },
    [decodeSearchParams, encodeSearchParams, history],
  );

  const tableState = useMemo(() => decodeSearchParams(history.location.search), [
    decodeSearchParams,
    history.location.search,
  ]);

  const wrappedOnPageChange = useCallback(
    (pageOrUpdateFunc: React.SetStateAction<number>) => {
      const pageChangeCallback = onPageChange || (() => {});
      let page = pageOrUpdateFunc;
      if (typeof page === 'function') {
        page = (pageOrUpdateFunc as (newPage: number) => number)(tableState.page);
      }
      updateSearch({ page });
      pageChangeCallback(page);
    },
    [onPageChange, tableState.page, updateSearch],
  );

  const wrappedOnFilteredChange = useCallback(
    (filteredOrUpdateFunc: React.SetStateAction<Filter[]>) => {
      const filteredChangeCallback = onFilteredChange || (() => {});
      let filtered = filteredOrUpdateFunc;
      if (typeof filtered === 'function') {
        filtered = (filteredOrUpdateFunc as (newFiltered: Filter[]) => Filter[])(
          tableState.filtered,
        );
      }
      updateSearch({ filtered, page: 0 });
      filteredChangeCallback(filtered);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onFilteredChange, JSON.stringify(tableState.filtered), updateSearch],
  );

  const wrappedOnSortedChange = useCallback(
    (sortedOrUpdateFunc: React.SetStateAction<SortingRule[]>) => {
      const sortedChangeCallback = onSortedChange || (() => {});
      let sorted = sortedOrUpdateFunc;
      if (typeof sorted === 'function') {
        sorted = (sortedOrUpdateFunc as (newSorted: SortingRule[]) => SortingRule[])(
          tableState.sorted,
        );
      }
      updateSearch({ sorted, page: 0 });
      sortedChangeCallback(sorted);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onSortedChange, JSON.stringify(tableState.sorted), updateSearch],
  );

  return {
    page: tableState.page,
    filtered: tableState.filtered,
    sorted: tableState.sorted,
    onPageChange: wrappedOnPageChange,
    onFilteredChange: wrappedOnFilteredChange,
    onSortedChange: wrappedOnSortedChange,
  };
}
