import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { reactTableFiltersToTableResultsFilters, reactTableSortToTableResultsSort } from './TableUtils';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { AuthenticationManagerContext } from '../Authentication/authenticationManager';
import useAsyncFunction from '../useAsyncFunction';

export type URLParamSerializableScalar = string | number | boolean;
export type URLParamSerializable =
  null | undefined | URLParamSerializableScalar | URLParamSerializable[] | { [key: string]: URLParamSerializable };

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

function filenameFromContentDisposition(contentDisposition: string | null): string | null {
  const match = contentDisposition ? /filename="([^"]+)"/.exec(contentDisposition) : null;
  return match ? match[1] : null;
}

// The export routes are authenticated the same way GraphQL requests are (a bearer token
// from AuthenticationManager, since OIDC sign-in never establishes a cookie session Rails
// can see). A plain <a href> navigation can't attach that header, so we have to fetch the
// CSV ourselves and hand the browser a blob to download instead.
async function downloadExport(url: string, token: string | undefined) {
  const headers: Record<string, string> = {};
  if (token) {
    // eslint-disable-next-line i18next/no-literal-string
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { credentials: 'same-origin', headers });
  if (!response.ok) {
    throw new Error(`Export failed: HTTP ${response.status}`);
  }

  const blob = await response.blob();
  const filename =
    filenameFromContentDisposition(response.headers.get('Content-Disposition')) ??
    // eslint-disable-next-line i18next/no-literal-string
    'export.csv';
  const objectUrl = URL.createObjectURL(blob);

  try {
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function ReactTableExportButton({
  exportUrl,
  filters,
  sortBy,
  columns,
}: ReactTableExportButtonProps): React.JSX.Element {
  const { t } = useTranslation();
  const authenticationManager = useContext(AuthenticationManagerContext);
  const [exportAsync, error, inProgress] = useAsyncFunction(downloadExport, { suppressError: true });

  const onClick = async () => {
    const url = getExportUrl(exportUrl, { filters, sortBy, columns });
    const token = await authenticationManager.ensureFreshAccessToken();
    await exportAsync(url, token);
  };

  return (
    <>
      <button type="button" className="btn btn-outline-primary" onClick={onClick} disabled={inProgress}>
        <i className="bi-file-earmark-spreadsheet" /> {t('tables.exportCSV.buttonText')}
      </button>
      <ErrorDisplay stringError={error?.message} />
    </>
  );
}

export default ReactTableExportButton;
