import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import EventCategoryIndex from './EventCategoryIndex';

function EventCategoryAdmin({ basename }) {
  return (
    <BrowserRouter basename={basename}>
      <Switch>
        <Route
          path="/"
          render={() => (
            <EventCategoryIndex />
          )}
        />
      </Switch>
    </BrowserRouter>
  );
}

EventCategoryAdmin.propTypes = {
  basename: PropTypes.string.isRequired,
};

export default EventCategoryAdmin;
