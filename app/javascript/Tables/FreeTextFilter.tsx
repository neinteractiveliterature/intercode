import { type RowData } from '@tanstack/react-table';
import { type AppColumn } from './tableFeatures';
import CommitableInput from '../BuiltInFormControls/CommitableInput';

function FreeTextFilter<TData extends RowData, TValue>({
  column,
}: {
  column: AppColumn<TData, TValue>;
}): React.JSX.Element {
  return (
    <CommitableInput
      value={column.getFilterValue() as string | undefined}
      onChange={(value) => column.setFilterValue(value)}
    />
  );
}

export default FreeTextFilter;
