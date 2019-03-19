import React from 'react';
import PropTypes from 'prop-types';

const LocalStorageReactTableContext = React.createContext({
  getReactTableProps: () => ({}),
});

export const LocalStorageReactTableConsumer = LocalStorageReactTableContext.Consumer;

export function useLocalStorageReactTable(storageKeyPrefix) {
  const pageSizeKey = `tables:${storageKeyPrefix}:pageSize`;
  const pageSizeString = window.localStorage.getItem(pageSizeKey);
  const pageSize = pageSizeString ? Number.parseInt(pageSizeString, 10) : null;

  const setPageSize = (newPageSize) => {
    if (newPageSize == null) {
      window.localStorage.removeItem(pageSizeKey);
    } else {
      window.localStorage.setItem(pageSizeKey, newPageSize.toString());
    }
  };

  return {
    pageSize: pageSize || 20,
    onPageSizeChange: setPageSize,
  };
}

class LocalStorageReactTableProvider extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    storageKeyPrefix: PropTypes.string.isRequired,
  }

  getPageSizeKey = () => `tables:${this.props.storageKeyPrefix}:pageSize`;

  getPageSize = () => {
    const pageSizeString = window.localStorage.getItem(this.getPageSizeKey());
    const pageSize = pageSizeString ? Number.parseInt(pageSizeString, 10) : null;
    return pageSize;
  }

  setPageSize = (pageSize) => {
    if (pageSize == null) {
      window.localStorage.removeItem(this.getPageSizeKey());
    } else {
      window.localStorage.setItem(this.getPageSizeKey(), pageSize.toString());
    }
  }

  render = () => (
    <LocalStorageReactTableContext.Provider
      value={{
        getReactTableProps: () => ({
          pageSize: this.getPageSize() || 20,
          onPageSizeChange: this.setPageSize,
        }),
      }}
    >
      {this.props.children}
    </LocalStorageReactTableContext.Provider>
  )
}

export { LocalStorageReactTableProvider };
