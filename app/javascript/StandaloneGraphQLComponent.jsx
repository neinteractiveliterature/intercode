import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import Confirm from './ModalDialogs/Confirm';

import buildApolloClient from './buildApolloClient';

export default (WrappedComponent, authenticityTokenProp = 'authenticityToken') => {
  const wrapper = class Wrapper extends React.Component {
    static propTypes = {
      [authenticityTokenProp]: PropTypes.string.isRequired,
    };

    constructor(props) {
      super(props);
      this.client = buildApolloClient(this.props[authenticityTokenProp]);
    }


    render = () => (
      <ApolloProvider client={this.client}>
        <Confirm>
          <WrappedComponent {...this.props} />
        </Confirm>
      </ApolloProvider>
    )
  };

  const wrappedComponentDisplayName = (
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  );

  wrapper.displayName = `StandaloneGraphQLComponent(${wrappedComponentDisplayName})`;

  return wrapper;
};
