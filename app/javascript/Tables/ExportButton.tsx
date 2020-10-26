import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, SortingRule } from 'react-table';

import {
  reactTableFiltersToTableResultsFilters,
  reactTableSortToTableResultsSort,
} from './TableUtils';

type Scalar = string | number | boolean;
type CompositeData = null | undefined | Scalar | CompositeData[] | { [key: string]: CompositeData };

function dataToKeyPathValuePairs(
  data: CompositeData,
  prependKeys: string[] = [],
): [string[], string][] {
  if (data == null) {
    return [];
  }

  if (typeof data === 'string' || typeof data === 'number') {
    return [[prependKeys, data.toString()]];
  }

  if (typeof data === 'boolean') {
    if (data) {
      return [[prependKeys, 'true']];
    }
    return [];
  }

  if (Array.isArray(data)) {
    return data
      .map((item) => dataToKeyPathValuePairs(item, [...prependKeys, '']))
      .reduce((acc, subValue) => acc.concat(subValue), []);
  }

  return Object.entries(data)
    .map(([key, value]) => {
      const keyPath = [...prependKeys, key];

      return dataToKeyPathValuePairs(value, keyPath);
    })
    .reduce((acc, value) => acc.concat(value), []);
}

function dataToParams(data: CompositeData) {
  const params = new URLSearchParams();
  const keyPathValuePairs = dataToKeyPathValuePairs(data);
  keyPathValuePairs.forEach(([keyPath, value]) => {
    const [first, ...rest] = keyPath;
    const key = `${first}${rest.map((part) => `[${part}]`).join('')}`;
    params.append(key, value); // we actually want some duplicate keys, for array params, so not .set
  });

  return params;
}

function getExportUrl(
  baseUrl: string,
  {
    filtered,
    sorted,
    columns,
  }: { filtered?: null | Filter[]; sorted: null | SortingRule[]; columns?: string[] | null },
) {
  const queryParams = {
    filters: reactTableFiltersToTableResultsFilters(filtered),
    sort: reactTableSortToTableResultsSort(sorted),
    ...(columns ? { columns } : {}),
  };

  const url = new URL(baseUrl, window.location.href);
  const search = new URLSearchParams(url.search);
  dataToParams(queryParams).forEach((value, key) => search.append(key, value));
  url.search = search.toString();

  return url.toString();
}

export type ReactTableExportButtonProps = {
  exportUrl: string;
  filtered: Filter[];
  sorted: SortingRule[];
  columns?: string[];
};

function ReactTableExportButton({
  exportUrl,
  filtered,
  sorted,
  columns,
}: ReactTableExportButtonProps) {
  const { t } = useTranslation();
  const href = useMemo(() => getExportUrl(exportUrl, { filtered, sorted, columns }), [
    columns,
    exportUrl,
    filtered,
    sorted,
  ]);

  return (
    <a className="btn btn-outline-primary" href={href}>
      <i className="fa fa-file-excel-o" /> {t('tables.exportCSV.buttonText', 'Export CSV')}
    </a>
  );
}

export default ReactTableExportButton;
