import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';

import CombinedReactTableConsumer from './CombinedReactTableConsumer';

class ReactTableWithContexts extends React.PureComponent {
  static propTypes = {
    consumers: PropTypes.array.isRequired,
  }

  render = () => {
    const { consumers, ...props } = this.props;
    return (
      <CombinedReactTableConsumer consumers={consumers}>
        {reactTableProps => (
          <ReactTable {...reactTableProps} {...props} />
        )}
      </CombinedReactTableConsumer>
    );
  }
}

export default ReactTableWithContexts;
