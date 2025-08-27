import { ReactNode, useContext } from 'react';
import AppRootContext from '../AppRootContext';

export type AdminWarningProps = {
  children: ReactNode;
};

export default function AdminWarning({ children }: AdminWarningProps): React.JSX.Element {
  const { currentAbility } = useContext(AppRootContext);

  // only show warning to admins
  if (!currentAbility.can_manage_conventions && !currentAbility.can_update_convention) {
    return <></>;
  }

  return (
    <div className="alert alert-warning">
      <div className="d-flex align-items-center">
        <h1 className="me-4">
          <i className="bi-exclamation-triangle-fill" />
        </h1>
        <div className="flex-grow-1">{children}</div>
      </div>
    </div>
  );
}
