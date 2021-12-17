import { Route, Routes } from 'react-router-dom';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform';

import EditTicketType from './EditTicketType';
import NewTicketType from './NewTicketType';
import TicketTypesList from './TicketTypesList';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { useAdminTicketTypesQuery } from './queries.generated';

export default LoadQueryWrapper(useAdminTicketTypesQuery, function TicketTypeAdmin({ data }) {
  const authorizationWarning = useAuthorizationRequired('can_manage_ticket_types');
  if (authorizationWarning) return authorizationWarning;

  return (
    <Routes>
      <Route
        path="/ticket_types/new"
        element={
          <NewTicketType ticketName={data.convention.ticket_name} ticketNamePlural={data.convention.ticketNamePlural} />
        }
      />
      <Route path="/ticket_types/:id/edit" element={<EditTicketType />} />
      <Route path="/ticket_types" element={<TicketTypesList />} />
    </Routes>
  );
});
