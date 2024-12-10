import { TicketMode } from 'graphqlTypes.generated';
import AppRootContextRouteGuard from './AppRouteContextRouteGuard';

export default function TicketPerEventPageGuard() {
  return <AppRootContextRouteGuard guard={({ ticketMode }) => ticketMode === TicketMode.TicketPerEvent} />;
}
