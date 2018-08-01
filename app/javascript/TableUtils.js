import QueryString from 'query-string';

function dataToKeyPathValuePairs(data, prependKeys = []) {
  return Object.entries(data).map(([key, value]) => {
    const keyPath = [...prependKeys, key];

    if (Array.isArray(value)) {
      return value.map(item => dataToKeyPathValuePairs(item, [...keyPath, '']))
        .reduce((acc, subValue) => acc.concat(subValue), []);
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return [[keyPath, value]];
    }

    if (typeof value === 'boolean' && value) {
      return [[keyPath, 'true']];
    }

    return dataToKeyPathValuePairs(value, keyPath);
  }).reduce((acc, value) => acc.concat(value), []);
}

function dataToQueryString(data) {
  const keyPathValuePairs = dataToKeyPathValuePairs(data);
  const queryStringItems = keyPathValuePairs.map(([keyPath, value]) => {
    const [first, ...rest] = keyPath;
    const key = `${first}${rest.map(part => `[${part}]`).join('')}`;
    return QueryString.stringify({ [key]: value });
  });

  return queryStringItems.join('&');
}

export function reactTableFiltersToTableResultsFilters(filters) {
  const tableResultsFilters = {};
  filters.forEach(({ id, value }) => {
    tableResultsFilters[id] = value;
  });
  return tableResultsFilters;
}

export function reactTableSortToTableResultsSort(sort) {
  return sort.map(({ id, desc }) => ({ field: id, desc }));
}

export function getExportUrl(baseUrl, { filtered, sorted }) {
  const queryParams = {
    filters: reactTableFiltersToTableResultsFilters(filtered),
    sort: reactTableSortToTableResultsSort(sorted),
  };

  const queryString = dataToQueryString(queryParams);

  return `${baseUrl}?${queryString}`;
}
