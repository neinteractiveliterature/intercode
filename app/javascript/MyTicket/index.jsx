import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import MyTicketDisplay from './MyTicketDisplay';
import TicketPurchaseForm from './TicketPurchaseForm';

function MyTicket() {
  return (
    <BrowserRouter basename="/ticket">
      <Switch>
        <Route path="/new" component={TicketPurchaseForm} />
        <Route path="/" component={MyTicketDisplay} />
      </Switch>
    </BrowserRouter>
  );
}

export default MyTicket;
