import React from 'react';
import { Route, Switch } from 'react-router-dom';

import MyTicketDisplay from './MyTicketDisplay';
import TicketPurchaseForm from './TicketPurchaseForm';

function MyTicket() {
  return (
    <Switch>
      <Route path="/ticket/new" component={TicketPurchaseForm} />
      <Route path="/ticket" component={MyTicketDisplay} />
    </Switch>
  );
}

export default MyTicket;
