import React from 'react';
import PropTypes from 'prop-types';

class CombinedReactTableConsumer extends React.PureComponent {
  static propTypes = {
    consumers: PropTypes.array.isRequired,
    children: PropTypes.func.isRequired,
  };

  render = () => {
    const rendererWithContexts = this.props.consumers.reduce(
      (renderer, Consumer) => existingProps => (
        <Consumer>
          {({ getReactTableProps }) => renderer({ ...getReactTableProps(), ...existingProps })}
        </Consumer>
      ),
      this.props.children,
    );

    return rendererWithContexts({});
  }
}

export default CombinedReactTableConsumer;
