import React from 'react';
import PropTypes from 'prop-types';

class InternalStateReactTableWrapper extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
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

  render = () => {
    const internalStateProps = {
      filtered: this.state.filtered,
      sorted: this.state.sorted,
      pageSize: this.state.pageSize,
      page: this.state.page,
      onFilteredChange: (filtered) => { this.setState({ filtered }); },
      onSortedChange: (sorted) => { this.setState({ sorted }); },
      onPageChange: (page) => { this.setState({ page }); },
      onPageSizeChange: (pageSize, page) => { this.setState({ pageSize, page }); },
    };

    return this.props.children(internalStateProps);
  }
}

export default InternalStateReactTableWrapper;
