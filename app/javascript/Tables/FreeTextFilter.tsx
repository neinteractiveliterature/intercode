import { FilterProps } from 'react-table';

import CommitableInput from '../BuiltInFormControls/CommitableInput';

function FreeTextFilter<RowType extends Record<string, undefined>>({
  column: { filterValue, setFilter },
}: FilterProps<RowType>): JSX.Element {
  return <CommitableInput value={filterValue} onChange={setFilter} />;
}

export default FreeTextFilter;
