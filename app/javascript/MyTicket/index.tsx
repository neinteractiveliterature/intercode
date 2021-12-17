import { Route, Routes } from 'react-router-dom';

import MyTicketDisplay from './MyTicketDisplay';
import TicketPurchaseForm from './TicketPurchaseForm';

function MyTicket(): JSX.Element {
  return (
    <Routes>
      <Route path="/ticket/new">
        <TicketPurchaseForm />
      </Route>
      <Route path="/ticket">
        <MyTicketDisplay />
      </Route>
    </Routes>
  );
}

export default MyTicket;
