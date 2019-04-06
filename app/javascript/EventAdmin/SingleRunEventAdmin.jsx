import React from 'react';
import { Switch, Route } from 'react-router-dom';

import NewSingleRunEvent from './NewSingleRunEvent';
import EditSingleRunEvent from './EditSingleRunEvent';
import SingleRunEventAdminList from './SingleRunEventAdminList';

function SingleRunEventAdmin() {
  return (
    <Switch>
      <Route path="/filler_events/new" component={NewSingleRunEvent} />
      <Route path="/filler_events/:id/edit" component={EditSingleRunEvent} />
      <Route component={SingleRunEventAdminList} />
    </Switch>
  );
}

export default SingleRunEventAdmin;
