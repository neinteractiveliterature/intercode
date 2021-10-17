import { useState, useMemo, useCallback } from 'react';

export type UseLocalStorageReactTableOptions = {
  onPageSizeChange?: (newPageSize: number) => void;
};

export default function useLocalStorageReactTable(storageKeyPrefix: string): {
  pageSize: number;
  setAndStorePageSize: (newPageSize: number) => void;
} {
  const pageSizeKey = useMemo(() => `tables:${storageKeyPrefix}:pageSize`, [storageKeyPrefix]);

  const loadPageSize = useCallback(() => {
    const pageSizeString = window.localStorage.getItem(pageSizeKey);
    return pageSizeString ? Number.parseInt(pageSizeString, 10) : null;
  }, [pageSizeKey]);

  const [pageSize, setPageSize] = useState(() => loadPageSize());

  const setAndStorePageSize = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize);

      if (newPageSize == null) {
        window.localStorage.removeItem(pageSizeKey);
      } else {
        window.localStorage.setItem(pageSizeKey, newPageSize.toString());
      }
    },
    [pageSizeKey],
  );

  return useMemo(
    () => ({
      pageSize: pageSize || 20,
      setAndStorePageSize,
    }),
    [pageSize, setAndStorePageSize],
  );
}
