import { Route, Routes, UNSAFE_RouteContext, useLocation, useResolvedPath } from 'react-router-dom';

import EditTicketType from './EditTicketType';
import NewTicketType from './NewTicketType';
import TicketTypesList from './TicketTypesList';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { useEventIdFromRoute } from './useTicketTypesQueryFromRoute';
import FourOhFourPage from '../FourOhFourPage';
import { useContext } from 'react';

export default function TicketTypeAdmin() {
  console.log(useContext(UNSAFE_RouteContext).matches);
  const eventId = useEventIdFromRoute();
  const rootPath = eventId ? `/events/${eventId}/ticket_types` : '/ticket_types';

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
