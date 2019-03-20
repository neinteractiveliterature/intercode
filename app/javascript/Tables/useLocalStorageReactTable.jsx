import { useState } from 'react';

export default function useLocalStorageReactTable(storageKeyPrefix) {
  const pageSizeKey = `tables:${storageKeyPrefix}:pageSize`;

  const loadPageSize = () => {
    const pageSizeString = window.localStorage.getItem(pageSizeKey);
    return (pageSizeString ? Number.parseInt(pageSizeString, 10) : null);
  };

  const [pageSize, setPageSize] = useState(loadPageSize());

  const setAndStorePageSize = (newPageSize) => {
    setPageSize(newPageSize);

    if (newPageSize == null) {
      window.localStorage.removeItem(pageSizeKey);
    } else {
      window.localStorage.setItem(pageSizeKey, newPageSize.toString());
    }
  };


  return {
    pageSize: pageSize || 20,
    onPageSizeChange: setAndStorePageSize,
  };
}
