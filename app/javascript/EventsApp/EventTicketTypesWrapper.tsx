import { useContext, useMemo } from 'react';
import { Outlet, Route, Routes, useParams } from 'react-router-dom';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform';

import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import LeafBreadcrumbItem from '../Breadcrumbs/LeafBreadcrumbItem';
import { useTicketTypesQueryFromRoute } from '../TicketTypeAdmin/useTicketTypesQueryFromRoute';
import AppRootContext from '../AppRootContext';
import capitalize from 'lodash/capitalize';
import { EventTicketTypesQueryData } from '../TicketTypeAdmin/queries.generated';

function SpecificTicketTypeBreadcrumbItem({ event }: { event: EventTicketTypesQueryData['convention']['event'] }) {
  const params = useParams<'id'>();
  const ticketType = useMemo(
    () => event.ticket_types.find((ticketType) => ticketType.id === params.id),
    [event.ticket_types, params.id],
  );

  return <LeafBreadcrumbItem path="">{ticketType?.name}</LeafBreadcrumbItem>;
}

export default LoadQueryWrapper(useTicketTypesQueryFromRoute, function EventTicketTypesWrapper({ data }): JSX.Element {
  const { ticketName } = useContext(AppRootContext);

  const event = 'event' in data.convention ? data.convention.event : undefined;
  if (!event) {
    return <Outlet />;
  }

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <BreadcrumbItem active={false} to="..">
            {event.title}
          </BreadcrumbItem>
          <RouteActivatedBreadcrumbItem to="" end>
            {capitalize(ticketName)} types
          </RouteActivatedBreadcrumbItem>
          <LeafBreadcrumbItem path="new">
            {'Add '}
            {ticketName}
            {' type'}
          </LeafBreadcrumbItem>
          <Routes>
            <Route path=":id/edit" element={<SpecificTicketTypeBreadcrumbItem event={event} />}></Route>
          </Routes>
        </ol>
      </nav>

      <Outlet />
    </>
  );
});
