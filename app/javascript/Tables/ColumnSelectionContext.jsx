import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { uniq } from 'lodash';

const ColumnSelectionContext = React.createContext({
  getPossibleColumns: () => [],
  getReactTableProps: () => ({}),
  getVisibleColumnIds: () => [],
  getVisibleColumns: () => [],
  setVisibleColumnIds: () => {},
});

export const ColumnSelectionConsumer = ColumnSelectionContext.Consumer;

export function useColumnSelection({
  alwaysVisibleColumns, defaultVisibleColumns, getPossibleColumns, history,
}) {
  const effectiveAlwaysVisibleColumns = alwaysVisibleColumns || [];

  const getVisibleColumnIds = () => {
    const params = new URLSearchParams(history.location.search);
    if (params.get('columns')) {
      return uniq([...effectiveAlwaysVisibleColumns, ...params.get('columns').split(',')]);
    }

    if (defaultVisibleColumns != null) {
      return uniq([...effectiveAlwaysVisibleColumns, ...this.props.defaultVisibleColumns]);
    }

    return getPossibleColumns().map(column => column.id);
  };

  const getVisibleColumns = () => {
    const visibleColumnIds = getVisibleColumnIds();
    return getPossibleColumns().filter(column => visibleColumnIds.includes(column.id));
  };

  const setVisibleColumnIds = (columnIds) => {
    const params = new URLSearchParams(history.location.search);
    params.set('columns', columnIds.join(','));
    history.replace(`${history.location.pathname}?${params.toString()}`);
  };

  return [
    { columns: getVisibleColumns() }, // reactTableProps
    {
      alwaysVisibleColumns: effectiveAlwaysVisibleColumns,
      getPossibleColumns,
      getVisibleColumnIds,
      getVisibleColumns,
      setVisibleColumnIds,
    },
  ];
}

@withRouter
class ColumnSelectionProvider extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    alwaysVisibleColumns: PropTypes.arrayOf(PropTypes.string),
    defaultVisibleColumns: PropTypes.arrayOf(PropTypes.string),
    getPossibleColumns: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
      location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
        search: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  static defaultProps = {
    alwaysVisibleColumns: null,
    defaultVisibleColumns: null,
  }

  getVisibleColumnIds = () => {
    const alwaysVisibleColumns = this.props.alwaysVisibleColumns || [];

    const params = new URLSearchParams(this.props.history.location.search);
    if (params.get('columns')) {
      return uniq([...alwaysVisibleColumns, ...params.get('columns').split(',')]);
    }

    if (this.props.defaultVisibleColumns != null) {
      return uniq([...alwaysVisibleColumns, ...this.props.defaultVisibleColumns]);
    }

    return this.props.getPossibleColumns().map(column => column.id);
  }

  getVisibleColumns = () => {
    const visibleColumnIds = this.getVisibleColumnIds();
    return this.props.getPossibleColumns()
      .filter(column => visibleColumnIds.includes(column.id));
  }

  getReactTableProps = () => ({
    columns: this.getVisibleColumns(),
  })

  setVisibleColumnIds = (columnIds) => {
    const params = new URLSearchParams(this.props.history.location.search);
    params.set('columns', columnIds.join(','));
    this.props.history.replace(`${this.props.history.location.pathname}?${params.toString()}`);
  }

  render = () => (
    <ColumnSelectionContext.Provider
      value={{
        alwaysVisibleColumns: this.props.alwaysVisibleColumns || [],
        getPossibleColumns: this.props.getPossibleColumns,
        getReactTableProps: this.getReactTableProps,
        getVisibleColumnIds: this.getVisibleColumnIds,
        getVisibleColumns: this.getVisibleColumns,
        setVisibleColumnIds: this.setVisibleColumnIds,
      }}
    >
      {this.props.children}
    </ColumnSelectionContext.Provider>
  )
}

export { ColumnSelectionProvider };
