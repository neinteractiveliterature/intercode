import useLoginRequired from 'Authentication/useLoginRequired';
import { Outlet } from 'react-router';

export default function LoginRequiredRouteGuard() {
  const loginRequired = useLoginRequired();
  if (loginRequired) {
    return <></>;
  }

  return <Outlet />;
}
