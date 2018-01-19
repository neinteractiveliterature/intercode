import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { BrowserRouter, NavLink, Route, Switch, Redirect } from 'react-router-dom';
import EventAdminEditEvent from './components/EventAdminEditEvent';
import EventAdminRunsTable from './components/EventAdminRunsTable';
import FillerEventAdmin from './components/FillerEventAdmin';
import VolunteerEventAdmin from './components/VolunteerEventAdmin';
import buildApolloClient from '../buildApolloClient';
import buildReduxStore from '../buildReduxStore';
import rootReducer from './reducers';

class EventAdminApp extends React.Component {
  static propTypes = {
    authenticityToken: PropTypes.string.isRequired,
    basename: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.client = buildApolloClient(this.props.authenticityToken);

    this.store = buildReduxStore('EventAdmin', rootReducer);
  }

  render = () => (
    <ApolloProvider client={this.client}>
      <Provider store={this.store}>
        <BrowserRouter basename={this.props.basename}>
          <div>
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <NavLink className="nav-link" to="/runs">Regular events</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/volunteer_events">Volunteer events</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/filler_events">Filler events</NavLink>
              </li>
            </ul>

            <Switch>
              <Route path="/runs" component={EventAdminRunsTable} />
              <Route path="/volunteer_events" component={VolunteerEventAdmin} />
              <Route path="/filler_events" component={FillerEventAdmin} />
              <Route path="/:id/edit" component={EventAdminEditEvent} />
              <Redirect to="/runs" />
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    </ApolloProvider>
  );
}

export default EventAdminApp;
