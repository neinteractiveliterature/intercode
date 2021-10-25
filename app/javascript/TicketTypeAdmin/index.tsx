import { Route, Switch, Redirect } from 'react-router-dom';
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
    <Switch>
      <Route path="/ticket_types/new">
        <NewTicketType ticketName={data.convention.ticket_name} ticketNamePlural={data.convention.ticketNamePlural} />
      </Route>
      <Route path="/ticket_types/:id/edit">
        <EditTicketType />
      </Route>
      <Route path="/ticket_types">
        <TicketTypesList />
      </Route>
      <Redirect to="/ticket_types" />
    </Switch>
  );
});
