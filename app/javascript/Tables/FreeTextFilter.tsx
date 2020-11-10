import { FilterProps } from 'react-table';

import CommitableInput from '../BuiltInFormControls/CommitableInput';

function FreeTextFilter<RowType extends object>({
  column: { filterValue, setFilter },
}: FilterProps<RowType>) {
  return <CommitableInput value={filterValue} onChange={setFilter} />;
}

export default FreeTextFilter;
