export type BooleanCellProps = {
  value?: boolean | null;
};
function BooleanCell({ value }: BooleanCellProps): JSX.Element {
  return <>{value ? 'yes' : 'no'}</>;
}

export default BooleanCell;
