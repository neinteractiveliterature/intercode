import { Outlet } from 'react-router';
import useLoginRequired from './useLoginRequired';

export function Component() {
  const loginRequired = useLoginRequired();
  if (loginRequired) {
    return <></>;
  }

  return <Outlet />;
}
