import React from 'react';
import PropTypes from 'prop-types';
import QueryString from 'query-string';

import {
  reactTableFiltersToTableResultsFilters,
  reactTableSortToTableResultsSort,
} from './TableUtils';

function dataToKeyPathValuePairs(data, prependKeys = []) {
  if (typeof data === 'string' || typeof data === 'number') {
    return [[prependKeys, data]];
  }

  if (typeof data === 'boolean' && data) {
    return [[prependKeys, 'true']];
  }

  if (Array.isArray(data)) {
    return data.map(item => dataToKeyPathValuePairs(item, [...prependKeys, '']))
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
    const key = `${first}${rest.map(part => `[${part}]`).join('')}`;
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

  const queryString = dataToQueryString(queryParams);

  return `${baseUrl}?${queryString}`;
}

class ReactTableExportButton extends React.PureComponent {
  static propTypes = {
    exportUrl: PropTypes.string.isRequired,
    filtered: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    sorted: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    columns: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    columns: null,
  };

  render = () => (
    <div className="mb-2">
      <a
        className="btn btn-outline-primary"
        href={
          getExportUrl(
            this.props.exportUrl,
            {
              filtered: this.props.filtered,
              sorted: this.props.sorted,
              columns: this.props.columns,
            },
          )
        }
      >
        <i className="fa fa-file-excel-o" />
        {' '}
        Export CSV
      </a>
    </div>
  )
}

export default ReactTableExportButton;
