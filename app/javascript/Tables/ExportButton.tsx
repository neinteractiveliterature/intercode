import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Filters, SortingRule } from '@tanstack/react-table';

import { reactTableFiltersToTableResultsFilters, reactTableSortToTableResultsSort } from './TableUtils';

export type URLParamSerializableScalar = string | number | boolean;
export type URLParamSerializable =
  | null
  | undefined
  | URLParamSerializableScalar
  | URLParamSerializable[]
  | { [key: string]: URLParamSerializable };

function dataToKeyPathValuePairs(data: URLParamSerializable, prependKeys: string[] = []): [string[], string][] {
  if (data == null) {
    return [];
  }

  if (typeof data === 'string' || typeof data === 'number') {
    return [[prependKeys, data.toString()]];
  }

  if (typeof data === 'boolean') {
    if (data) {
      // eslint-disable-next-line i18next/no-literal-string
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

function dataToParams(data: URLParamSerializable) {
  const params = new URLSearchParams();
  const keyPathValuePairs = dataToKeyPathValuePairs(data);
  keyPathValuePairs.forEach(([keyPath, value]) => {
    const [first, ...rest] = keyPath;
    const key = `${first}${rest.map((part) => `[${part}]`).join('')}`;
    params.append(key, value); // we actually want some duplicate keys, for array params, so not .set
  });

  return params;
}

function getExportUrl<RowType extends Record<string, unknown>>(
  baseUrl: string,
  {
    filters,
    sortBy,
    columns,
  }: {
    filters?: null | Filters<RowType>;
    sortBy: null | SortingRule<RowType>[];
    columns?: string[] | null;
  },
) {
  const queryParams = {
    filters: reactTableFiltersToTableResultsFilters(filters),
    sort: reactTableSortToTableResultsSort(sortBy),
    ...(columns ? { columns } : {}),
  };

  const url = new URL(baseUrl, window.location.href);
  const search = new URLSearchParams(url.search);
  dataToParams(queryParams).forEach((value, key) => search.append(key, value));
  url.search = search.toString();

  return url.toString();
}

export type ReactTableExportButtonProps<RowType extends Record<string, unknown>> = {
  exportUrl: string;
  filters: Filters<RowType>;
  sortBy: SortingRule<RowType>[];
  columns?: string[];
};

function ReactTableExportButton<RowType extends Record<string, unknown>>({
  exportUrl,
  filters,
  sortBy,
  columns,
}: ReactTableExportButtonProps<RowType>): JSX.Element {
  const { t } = useTranslation();
  const href = useMemo(
    () => getExportUrl(exportUrl, { filters, sortBy, columns }),
    [columns, exportUrl, filters, sortBy],
  );

  return (
    <a className="btn btn-outline-primary" href={href}>
      <>
        <i className="bi-file-earmark-spreadsheet" /> {t('tables.exportCSV.buttonText')}
      </>
    </a>
  );
}

export default ReactTableExportButton;
