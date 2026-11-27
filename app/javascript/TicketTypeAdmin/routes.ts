import { index, layout, route } from '@react-router/dev/routes';

export default layout('TicketTypeAdmin/ticketRequiredGuard.ts', [
  route('/ticket_types', 'TicketTypeAdmin/authorizationGuard.ts', [
    route('new', 'TicketTypeAdmin/adminRoutes/newRoute.ts'),
    route(':id', 'TicketTypeAdmin/$id.ts', [route('edit', 'TicketTypeAdmin/adminRoutes/editRoute.ts')]),
    index('TicketTypeAdmin/adminRoutes/indexRoute.ts'),
  ]),
]);
