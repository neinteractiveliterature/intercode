export type PermissionCheckBoxProps = {
  hasPermission: boolean;
};

function PermissionCheckBox({ hasPermission }: PermissionCheckBoxProps): JSX.Element {
  if (hasPermission) {
    return (
      <i className="bi-check-square-o">
        <span className="visually-hidden">Permitted</span>
      </i>
    );
  }

  return (
    <i className="bi-square">
      <span className="visually-hidden">Not permitted</span>
    </i>
  );
}

export default PermissionCheckBox;
