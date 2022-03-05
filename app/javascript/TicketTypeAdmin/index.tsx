import { Route, Routes } from 'react-router-dom';

import EditTicketType from './EditTicketType';
import NewTicketType from './NewTicketType';
import TicketTypesList from './TicketTypesList';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import FourOhFourPage from '../FourOhFourPage';

export default function TicketTypeAdmin() {
  const authorizationWarning = useAuthorizationRequired('can_manage_ticket_types');
  if (authorizationWarning) return authorizationWarning;

  return (
    <Routes>
      <Route path={`new`} element={<NewTicketType />} />
      <Route path={`:id/edit`} element={<EditTicketType />} />
      <Route index element={<TicketTypesList />} />
      <Route path="*" element={<FourOhFourPage />} />
    </Routes>
  );
}
