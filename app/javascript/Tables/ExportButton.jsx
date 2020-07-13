import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import QueryString from 'query-string';
import { useTranslation } from 'react-i18next';

import {
  reactTableFiltersToTableResultsFilters,
  reactTableSortToTableResultsSort,
} from './TableUtils';

function dataToKeyPathValuePairs(data, prependKeys = []) {
  if (data == null) {
    return [];
  }

  if (typeof data === 'string' || typeof data === 'number') {
    return [[prependKeys, data]];
  }

  if (typeof data === 'boolean' && data) {
    return [[prependKeys, 'true']];
  }

  if (Array.isArray(data)) {
    return data.map((item) => dataToKeyPathValuePairs(item, [...prependKeys, '']))
      .reduce((acc, subValue) => acc.concat(subValue), []);
  }

  return Object.entries(data).map(([key, value]) => {
    const keyPath = [...prependKeys, key];

    return dataToKeyPathValuePairs(value, keyPath);
  }).reduce((acc, value) => acc.concat(value), []);
}

function dataToQueryString(data) {
  const keyPathValuePairs = dataToKeyPathValuePairs(data);
  const queryStringItems = keyPathValuePairs.map(([keyPath, value]) => {
    const [first, ...rest] = keyPath;
    const key = `${first}${rest.map((part) => `[${part}]`).join('')}`;
    return QueryString.stringify({ [key]: value });
  });

  return queryStringItems.join('&');
}

function getExportUrl(baseUrl, { filtered, sorted, columns }) {
  const queryParams = {
    filters: reactTableFiltersToTableResultsFilters(filtered),
    sort: reactTableSortToTableResultsSort(sorted),
    ...(
      columns
        ? { columns }
        : {}
    ),
  };

  const url = new URL(baseUrl, window.location.href);
  const search = new URLSearchParams(url.search);
  new URLSearchParams(dataToQueryString(queryParams))
    .forEach((value, key) => search.append(key, value));
  url.search = search;

  return url.toString();
}

function ReactTableExportButton({
  exportUrl, filtered, sorted, columns,
}) {
  const { t } = useTranslation();
  const href = useMemo(
    () => getExportUrl(exportUrl, { filtered, sorted, columns }),
    [columns, exportUrl, filtered, sorted],
  );

  return (
    <a className="btn btn-outline-primary" href={href}>
      <i className="fa fa-file-excel-o" />
      {' '}
      {t('tables.exportCSV.buttonText', 'Export CSV')}
    </a>
  );
}

ReactTableExportButton.propTypes = {
  exportUrl: PropTypes.string.isRequired,
  filtered: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  sorted: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  columns: PropTypes.arrayOf(PropTypes.string),
};

ReactTableExportButton.defaultProps = {
  columns: null,
};

export default ReactTableExportButton;
