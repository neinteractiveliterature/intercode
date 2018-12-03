import React from 'react';
import PropTypes from 'prop-types';

class CombinedReactTableConsumer extends React.PureComponent {
  static propTypes = {
    consumers: PropTypes.array.isRequired,
    children: PropTypes.func.isRequired,
  };

  render = () => {
    const rendererWithContexts = this.props.consumers.reduce(
      (renderer, Consumer, i) => existingProps => (
        <Consumer>
          {({ getReactTableProps }) => {
            const props = getReactTableProps();
            console.log(i, props);
            return renderer({ ...props, ...existingProps });
          }}
        </Consumer>
      ),
      this.props.children,
    );

    return rendererWithContexts({});
  }
}

export default CombinedReactTableConsumer;
