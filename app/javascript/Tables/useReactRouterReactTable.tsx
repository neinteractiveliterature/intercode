import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filters, SortingRule } from 'react-table';

import { FieldFilterCodecs } from './FilterUtils';

export type UseReactRouterReactTableOptions<RowType extends Record<string, unknown>> = Partial<FieldFilterCodecs> & {
  defaultState?: Partial<ReactRouterReactTableState<RowType>>;
};

export type ReactRouterReactTableState<RowType extends Record<string, unknown>> = {
  page: number;
  filters: Filters<RowType>;
  sortBy: SortingRule<RowType>[];
};

function identityCodec(field: string, value: string): string {
  return value;
}

export default function useReactRouterReactTable<RowType extends Record<string, unknown>>({
  defaultState,
  encodeFilterValue,
  decodeFilterValue,
}: UseReactRouterReactTableOptions<RowType>): {
  page: number;
  filters: Filters<RowType>;
  sortBy: SortingRule<RowType>[];
  updateSearch: (state: Partial<ReactRouterReactTableState<RowType>>) => void;
} {
  const [searchParams, setSearchParams] = useSearchParams();
  const encode = useMemo(() => encodeFilterValue ?? identityCodec, [encodeFilterValue]);
  const decode = useMemo(() => decodeFilterValue ?? identityCodec, [decodeFilterValue]);

  const decodeSearchParams = useCallback(
    (params: URLSearchParams) => {
      let page: number | undefined;
      const filters: Filters<RowType> = [];
      const sortBy: SortingRule<RowType>[] = [];

      Array.from(params.entries()).forEach(([key, value]) => {
        if (key === 'page') {
          page = Number.parseInt(value, 10) - 1;
          return;
        }

        const filterMatch = key.match(/^filters\.(.*)$/);
        if (filterMatch) {
          const filterValue = decode(filterMatch[1], value);
          if (filterValue != null) {
            filters.push({
              id: filterMatch[1],
              value: filterValue,
            });
          }
          return;
        }

        const sortMatch = key.match(/^sort\.(.*)$/);
        if (sortMatch) {
          sortBy.push({ id: sortMatch[1], desc: value === 'desc' });
        }
      });

      return {
        page: page ?? defaultState?.page ?? 0,
        filters: filters.length > 0 ? filters : defaultState?.filters ?? [],
        sortBy: sortBy.length > 0 ? sortBy : defaultState?.sortBy ?? [],
      };
    },
    [decode, defaultState],
  );

  const encodeSearchParams = useCallback(
    ({ page, filters, sortBy }: ReactRouterReactTableState<RowType>, existingParams: URLSearchParams) => {
      const params = new URLSearchParams(existingParams);

      if (page != null) {
        params.set('page', (page + 1).toString());
      }

      // remove existing filters and sorts rather than just adding on
      [...params.keys()].forEach((key) => {
        if (key.startsWith('filters.') || key.startsWith('sort.')) {
          params.delete(key);
        }
      });

      filters.forEach(({ id, value }) => {
        const encoded = encode(id, value);
        if (encoded != null) {
          params.set(`filters.${id}`, encoded);
        } else {
          params.delete(`filters.${id}`);
        }
      });

      sortBy.forEach(({ id, desc }) => {
        params.set(`sort.${id}`, desc ? 'desc' : 'asc');
      });

      return params;
    },
    [encode],
  );

  const updateSearch = useCallback(
    (newState: Partial<ReactRouterReactTableState<RowType>>) => {
      const oldState = decodeSearchParams(searchParams);
      const newSearch = encodeSearchParams({ ...oldState, ...newState }, searchParams);
      if (newSearch.toString() !== searchParams.toString()) {
        setSearchParams(newSearch, { replace: true });
      }
    },
    [decodeSearchParams, encodeSearchParams, searchParams, setSearchParams],
  );

  const tableState = useMemo(() => decodeSearchParams(searchParams), [decodeSearchParams, searchParams]);

  return useMemo(
    () => ({
      page: tableState.page,
      filters: tableState.filters,
      sortBy: tableState.sortBy,
      updateSearch,
    }),
    [tableState.filters, tableState.page, tableState.sortBy, updateSearch],
  );
}
