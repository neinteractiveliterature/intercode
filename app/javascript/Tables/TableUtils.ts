import { Filters, SortingRule } from 'react-table';
import { URLParamSerializable } from './ExportButton';

export function reactTableFiltersToTableResultsFilters<D extends Record<string, unknown>>(
  filters: Filters<D> | null | undefined,
): { [field: string]: URLParamSerializable } {
  if (filters == null) {
    return {};
  }

  const tableResultsFilters: { [field: string]: URLParamSerializable } = {};
  filters.forEach(({ id, value }) => {
    tableResultsFilters[id] = value;
  });
  return tableResultsFilters;
}

export function reactTableSortToTableResultsSort<D>(
  sort: SortingRule<D>[] | null | undefined,
): { field: string; desc: boolean }[] {
  if (sort == null) {
    return [];
  }

  return sort.map(({ id, desc }) => ({ field: id, desc: desc ?? false }));
}
