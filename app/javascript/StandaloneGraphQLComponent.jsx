import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import buildApolloClient from './buildApolloClient';

export default WrappedComponent => class Wrapper extends React.Component {
  static propTypes = {
    authenticityToken: PropTypes.string.isRequired,
  };

  static get name() {
    return `StandaloneGraphQLComponent(${WrappedComponent.name})`;
  }

  constructor(props) {
    super(props);
    this.client = buildApolloClient(this.props.authenticityToken);
  }

  render = () => (
    <ApolloProvider client={this.client}>
      <WrappedComponent {...this.props} />
    </ApolloProvider>
  )
};
