import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';
import buildApolloClient from '../buildApolloClient';
import ScheduleGrid from './ScheduleGrid';

class ScheduleGridApp extends React.Component {
  static propTypes = {
    authenticityToken: PropTypes.string.isRequired,
    basename: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.client = buildApolloClient(this.props.authenticityToken);
  }

  render = () => (
    <ApolloProvider client={this.client}>
      <BrowserRouter basename={this.props.basename}>
        <ScheduleGrid {...this.props} />
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default ScheduleGridApp;
