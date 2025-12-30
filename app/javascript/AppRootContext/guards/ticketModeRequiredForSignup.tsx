import { useContext } from 'react';
import { Outlet } from 'react-router';
import AppRootContext from '~/AppRootContext';
import FourOhFourPage from '~/FourOhFourPage';
import { TicketMode } from '~/graphqlTypes.generated';

export function Component() {
  const { ticketMode } = useContext(AppRootContext);

  if (ticketMode === TicketMode.RequiredForSignup) {
    return <Outlet />;
  }

  return <FourOhFourPage />;
}
