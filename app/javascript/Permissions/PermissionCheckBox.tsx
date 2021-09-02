import { useUniqueId } from '@neinteractiveliterature/litform';

export type PermissionCheckBoxProps = {
  hasPermission: boolean;
};

function PermissionCheckBox({ hasPermission }: PermissionCheckBoxProps): JSX.Element {
  const checkboxId = useUniqueId('permitted-');

  return (
    <div className="form-check form-switch">
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
