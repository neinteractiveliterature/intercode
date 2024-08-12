import { useContext, useMemo } from 'react';
import { Outlet, useLoaderData, useParams } from 'react-router-dom';

import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import LeafBreadcrumbItem from '../Breadcrumbs/LeafBreadcrumbItem';
import AppRootContext from '../AppRootContext';
import capitalize from 'lodash/capitalize';
import { EventTicketTypesQueryData } from '../TicketTypeAdmin/queries.generated';
import { TicketTypeLoaderResult } from '../TicketTypeAdmin/loaders';

function SpecificTicketTypeBreadcrumbItem({ event }: { event: EventTicketTypesQueryData['convention']['event'] }) {
  const params = useParams<'id'>();
  const ticketType = useMemo(
    () => event.ticket_types.find((ticketType) => ticketType.id === params.id),
    [event.ticket_types, params.id],
  );

  return <LeafBreadcrumbItem path="">{ticketType?.name}</LeafBreadcrumbItem>;
}

export default function EventTicketTypesWrapper(): JSX.Element {
  const { ticketName } = useContext(AppRootContext);
  const { parent } = useLoaderData() as TicketTypeLoaderResult;
  const { id } = useParams();

  const event = parent.__typename === 'Event' ? parent : undefined;
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
          {id && <SpecificTicketTypeBreadcrumbItem event={event} />}
        </ol>
      </nav>

      <Outlet />
    </>
  );
}
