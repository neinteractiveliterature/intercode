import { TicketMode } from 'graphqlTypes.generated';
import AppRootContextRouteGuard from './AppRouteContextRouteGuard';

export default function TicketRequiredForSignupRouteGuard() {
  return <AppRootContextRouteGuard guard={({ ticketMode }) => ticketMode === TicketMode.RequiredForSignup} />;
}
