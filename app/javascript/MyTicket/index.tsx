import { Route, Routes } from 'react-router-dom';

import MyTicketDisplay from './MyTicketDisplay';
import TicketPurchaseForm from './TicketPurchaseForm';

function MyTicket(): JSX.Element {
  return (
    <Routes>
      <Route path="/ticket/new" element={<TicketPurchaseForm />} />
      <Route path="/ticket" element={<MyTicketDisplay />} />
    </Routes>
  );
}

export default MyTicket;
