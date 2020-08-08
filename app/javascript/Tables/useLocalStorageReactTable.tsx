import { useState } from 'react';

export type UseLocalStorageReactTableOptions = {
  onPageSizeChange?: (newPageSize: number) => void;
};

export default function useLocalStorageReactTable(
  storageKeyPrefix: string,
  { onPageSizeChange }: UseLocalStorageReactTableOptions = {},
) {
  const pageSizeKey = `tables:${storageKeyPrefix}:pageSize`;
  const pageSizeChangeCallback = onPageSizeChange || (() => {});

  const loadPageSize = () => {
    const pageSizeString = window.localStorage.getItem(pageSizeKey);
    return pageSizeString ? Number.parseInt(pageSizeString, 10) : null;
  };

  const [pageSize, setPageSize] = useState(loadPageSize());

  const setAndStorePageSize = (newPageSize: number) => {
    setPageSize(newPageSize);

    if (newPageSize == null) {
      window.localStorage.removeItem(pageSizeKey);
    } else {
      window.localStorage.setItem(pageSizeKey, newPageSize.toString());
    }

    pageSizeChangeCallback(newPageSize);
  };

  return {
    pageSize: pageSize || 20,
    onPageSizeChange: setAndStorePageSize,
  };
}
