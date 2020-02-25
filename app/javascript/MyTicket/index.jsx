import React from 'react';
import { Route, Switch } from 'react-router-dom';

import MyTicketDisplay from './MyTicketDisplay';
import TicketPurchaseForm from './TicketPurchaseForm';

function MyTicket() {
  return (
    <Switch>
      <Route path="/ticket/new"><TicketPurchaseForm /></Route>
      <Route path="/ticket"><MyTicketDisplay /></Route>
    </Switch>
  );
}

export default MyTicket;
