import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import buildApolloClient from './buildApolloClient';

export default (WrappedComponent, authenticityTokenProp = 'authenticityToken') => class Wrapper extends React.Component {
  static propTypes = {
    [authenticityTokenProp]: PropTypes.string.isRequired,
  };

  static get name() {
    return `StandaloneGraphQLComponent(${WrappedComponent.name})`;
  }

  constructor(props) {
    super(props);
    this.client = buildApolloClient(this.props[authenticityTokenProp]);
  }

  render = () => (
    <ApolloProvider client={this.client}>
      <WrappedComponent {...this.props} />
    </ApolloProvider>
  )
};
