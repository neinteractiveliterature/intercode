import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import EventAdmin from './components/EventAdmin';
import buildApolloClient from '../buildApolloClient';
import { getComposeEnhancers, defaultMiddleware } from '../buildReduxStore';
import buildReducer from './reducers';

class EventAdminApp extends React.Component {
  static propTypes = {
    authenticityToken: PropTypes.string.isRequired,
    basename: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.client = buildApolloClient(this.props.authenticityToken);

    const composeEnhancers = getComposeEnhancers('EventAdminApp');

    this.store = createStore(
      buildReducer(this.client),
      composeEnhancers(
        applyMiddleware(
          this.client.middleware(),
          ...defaultMiddleware,
        ),
      ),
    );
  }

  render = () => (
    <ApolloProvider store={this.store} client={this.client}>
      <BrowserRouter basename={this.props.basename}>
        <EventAdmin />
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default EventAdminApp;
