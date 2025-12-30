import { Outlet } from 'react-router';

export function Component() {
  return (
    <div className="non-cms-page">
      <Outlet />
    </div>
  );
}
