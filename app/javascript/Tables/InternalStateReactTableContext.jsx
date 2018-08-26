import React from 'react';
import PropTypes from 'prop-types';

const InternalStateReactTableContext = React.createContext({
  getReactTableProps: () => ({}),
});

export const InternalStateReactTableConsumer = InternalStateReactTableContext.Consumer;

export class InternalStateReactTableProvider extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      filtered: [],
      sorted: [],
      pageSize: 20,
      page: 0,
    };
  }

  render = () => (
    <InternalStateReactTableContext.Provider
      value={{
        getReactTableProps: () => ({
          filtered: this.state.filtered,
          sorted: this.state.sorted,
          pageSize: this.state.pageSize,
          page: this.state.page,
          onFilteredChange: (filtered) => { this.setState({ filtered }); },
          onSortedChange: (sorted) => { this.setState({ sorted }); },
          onPageChange: (page) => { this.setState({ page }); },
          onPageSizeChange: (pageSize, page) => { this.setState({ pageSize, page }); },
        }),
      }}
    >
      {this.props.children}
    </InternalStateReactTableContext.Provider>
  )
}
