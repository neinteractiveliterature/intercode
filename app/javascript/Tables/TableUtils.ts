import { Filters, SortingRule } from 'react-table';

export function reactTableFiltersToTableResultsFilters<D extends Record<string, undefined>>(
  filters: Filters<D> | null | undefined,
): { [field: string]: unknown } {
  if (filters == null) {
    return {};
  }

  const tableResultsFilters: { [field: string]: unknown } = {};
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
