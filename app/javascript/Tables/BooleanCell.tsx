export type BooleanCellProps = {
  value?: boolean;
};
const BooleanCell = ({ value }: BooleanCellProps) => <>{value ? 'yes' : 'no'}</>;

export default BooleanCell;
