import { Outlet } from 'react-router';

export function NonCMSPageWrapper() {
  return (
    <div className="non-cms-page">
      <Outlet />
    </div>
  );
}
