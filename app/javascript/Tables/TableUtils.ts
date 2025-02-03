import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { URLParamSerializable } from './ExportButton';

export function reactTableFiltersToTableResultsFilters(filters: ColumnFiltersState | null | undefined): {
  [field: string]: URLParamSerializable;
} {
  if (filters == null) {
    return {};
  }

  const tableResultsFilters: { [field: string]: URLParamSerializable } = {};
  filters.forEach(({ id, value }) => {
    tableResultsFilters[id] = value as URLParamSerializable;
  });
  return tableResultsFilters;
}

export function reactTableSortToTableResultsSort(
  sort: SortingState | null | undefined,
): { field: string; desc: boolean }[] {
  if (sort == null) {
    return [];
  }

  return sort.map(({ id, desc }) => ({ field: id, desc: desc ?? false }));
}
