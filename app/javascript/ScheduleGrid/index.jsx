import React from 'react';
import PropTypes from 'prop-types';
import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo';
import ScheduleGrid from './ScheduleGrid';

class ScheduleGridApp extends React.Component {
  static propTypes = {
    authenticityToken: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.client = new ApolloClient({
      networkInterface: createNetworkInterface({
        uri: '/graphql',
        opts: {
          credentials: 'same-origin',
          headers: {
            'X-CSRF-Token': this.props.authenticityToken,
          },
        },
      }),
    });
  }

  render = () => (
    <ApolloProvider client={this.client}>
      <ScheduleGrid {...this.props} />
    </ApolloProvider>
  );
}

export default ScheduleGridApp;
