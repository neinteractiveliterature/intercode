import { Route, Routes } from 'react-router-dom';

import MyTicketDisplay from './MyTicketDisplay';
import TicketPurchasePage from './TicketPurchasePage';

function MyTicket(): JSX.Element {
  return (
    <Routes>
      <Route path="new" element={<TicketPurchasePage />} />
      <Route path="" element={<MyTicketDisplay />} />
    </Routes>
  );
}

export default MyTicket;
