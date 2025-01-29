import { Column } from '@tanstack/react-table';
import CommitableInput from '../BuiltInFormControls/CommitableInput';

function FreeTextFilter<TData, TValue>({ column }: { column: Column<TData, TValue> }): JSX.Element {
  return <CommitableInput value={column.getFilterValue() as string | undefined} onChange={column.setFilterValue} />;
}

export default FreeTextFilter;
