import AppRootContext, { AppRootContextValue } from 'AppRootContext';
import FourOhFourPage from 'FourOhFourPage';
import { useContext } from 'react';
import { Outlet } from 'react-router';

export type AppRootContextRouteGuardProps = {
  guard: (context: AppRootContextValue) => boolean;
};

export default function AppRootContextRouteGuard({ guard }: AppRootContextRouteGuardProps) {
  const context = useContext(AppRootContext);

  if (guard(context)) {
    return <Outlet />;
  } else {
    return <FourOhFourPage />;
  }
}
