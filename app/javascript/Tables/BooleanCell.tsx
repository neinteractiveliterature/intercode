export type BooleanCellProps = {
  value?: boolean;
};
function BooleanCell({ value }: BooleanCellProps): JSX.Element {
  return <>{value ? 'yes' : 'no'}</>;
}

export default BooleanCell;
