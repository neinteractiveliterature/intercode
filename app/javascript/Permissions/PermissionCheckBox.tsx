export type PermissionCheckBoxProps = {
  hasPermission: boolean;
};

function PermissionCheckBox({ hasPermission }: PermissionCheckBoxProps) {
  if (hasPermission) {
    return (
      <i className="fa fa-check-square-o">
        <span className="visually-hidden">Permitted</span>
      </i>
    );
  }

  return (
    <i className="fa fa-square-o">
      <span className="visually-hidden">Not permitted</span>
    </i>
  );
}

export default PermissionCheckBox;
