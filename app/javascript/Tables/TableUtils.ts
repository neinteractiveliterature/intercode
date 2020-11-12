import { Filters, SortingRule } from 'react-table';

export function reactTableFiltersToTableResultsFilters<D extends object>(
  filters: Filters<D> | null | undefined,
) {
  if (filters == null) {
    return [];
  }

  const tableResultsFilters: { [field: string]: any } = {};
  filters.forEach(({ id, value }) => {
    tableResultsFilters[id] = value;
  });
  return tableResultsFilters;
}

export function reactTableSortToTableResultsSort<D>(sort: SortingRule<D>[] | null | undefined) {
  if (sort == null) {
    return [];
  }

  return sort.map(({ id, desc }) => ({ field: id, desc: desc ?? false }));
}
