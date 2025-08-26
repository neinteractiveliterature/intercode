import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { reactTableFiltersToTableResultsFilters, reactTableSortToTableResultsSort } from './TableUtils';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';

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

function getExportUrl(
  baseUrl: string,
  {
    filters,
    sortBy,
    columns,
  }: {
    filters?: null | ColumnFiltersState;
    sortBy: null | SortingState;
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

export type ReactTableExportButtonProps = {
  exportUrl: string;
  filters: ColumnFiltersState;
  sortBy: SortingState;
  columns?: string[];
};

function ReactTableExportButton({
  exportUrl,
  filters,
  sortBy,
  columns,
}: ReactTableExportButtonProps): React.JSX.Element {
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
