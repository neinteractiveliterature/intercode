import { useId } from 'react';

export type PermissionCheckBoxProps = {
  hasPermission: boolean;
};

function PermissionCheckBox({ hasPermission }: PermissionCheckBoxProps): React.JSX.Element {
  const checkboxId = useId();

  return (
    <div className="form-check form-switch d-inline-block">
      <input
        className="form-check-input"
        type="checkbox"
        id={checkboxId}
        checked={hasPermission}
        aria-label="Permitted"
      />
    </div>
  );
}

export default PermissionCheckBox;
