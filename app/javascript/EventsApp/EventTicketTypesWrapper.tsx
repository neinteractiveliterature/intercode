import { useContext } from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform';

import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import LeafBreadcrumbItem from '../Breadcrumbs/LeafBreadcrumbItem';
import { useTicketTypesQueryFromRoute } from '../TicketTypeAdmin/useTicketTypesQueryFromRoute';
import AppRootContext from '../AppRootContext';
import capitalize from 'lodash/capitalize';
import buildEventUrl from './buildEventUrl';

export default LoadQueryWrapper(useTicketTypesQueryFromRoute, function EventTicketTypesWrapper({ data }): JSX.Element {
  const { ticketName } = useContext(AppRootContext);
  const specificTicketTypeMatch = useMatch('/events/:eventId/ticket_types/:id/edit');

  const event = 'event' in data.convention ? data.convention.event : undefined;
  if (!event) {
    return <Outlet />;
  }

  const eventPath = buildEventUrl(event);

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <BreadcrumbItem active={false} to={eventPath}>
            {event.title}
          </BreadcrumbItem>
          <RouteActivatedBreadcrumbItem pattern={{ path: `${eventPath}/ticket_types`, end: true }} to={``}>
            {capitalize(ticketName)} types
          </RouteActivatedBreadcrumbItem>
          <LeafBreadcrumbItem path={`${eventPath}/ticket_types/new`}>
            {'Add '}
            {ticketName}
            {' type'}
          </LeafBreadcrumbItem>
          <LeafBreadcrumbItem path={`${eventPath}/ticket_types/:id/edit`}>
            {event.ticket_types.find((ticketType) => ticketType.id === specificTicketTypeMatch?.params.id)?.name}
          </LeafBreadcrumbItem>
        </ol>
      </nav>

      <Outlet />
    </>
  );
});
