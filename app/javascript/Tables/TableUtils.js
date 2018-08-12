export function reactTableFiltersToTableResultsFilters(filters) {
  if (filters == null) {
    return [];
  }

  const tableResultsFilters = {};
  filters.forEach(({ id, value }) => {
    tableResultsFilters[id] = value;
  });
  return tableResultsFilters;
}

export function reactTableSortToTableResultsSort(sort) {
  if (sort == null) {
    return [];
  }

  return sort.map(({ id, desc }) => ({ field: id, desc }));
}
