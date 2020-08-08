import { Filter, SortingRule } from 'react-table';

export function reactTableFiltersToTableResultsFilters(filters: Filter[] | null | undefined) {
  if (filters == null) {
    return [];
  }

  const tableResultsFilters: { [field: string]: any } = {};
  filters.forEach(({ id, value }) => {
    tableResultsFilters[id] = value;
  });
  return tableResultsFilters;
}

export function reactTableSortToTableResultsSort(sort: SortingRule[] | null | undefined) {
  if (sort == null) {
    return [];
  }

  return sort.map(({ id, desc }) => ({ field: id, desc }));
}
