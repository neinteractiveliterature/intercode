import { index, route } from '@react-router/dev/routes';

export default route('/ticket', 'MyTicket/route.ts', [
  route('new', 'MyTicket/TicketPurchasePage.tsx'),
  index('MyTicket/MyTicketDisplay.tsx'),
]);
