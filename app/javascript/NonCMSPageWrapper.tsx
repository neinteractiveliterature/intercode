import { Outlet } from 'react-router';

export default function NonCMSPageWrapper() {
  return (
    <div className="non-cms-page">
      <Outlet />
    </div>
  );
}
